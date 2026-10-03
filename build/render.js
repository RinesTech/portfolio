const fs = require('fs');
const path = require('path');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const svg = (inner, attrs = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"') =>
  `<svg class="ic" viewBox="0 0 24 24" ${attrs} aria-hidden="true">${inner}</svg>`;
const ICON = {
  gh: svg('<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'),
  arrow: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
  down: svg('<path d="M12 5v14m-6-6 6 6 6-6"/>'),
  play: svg('<path d="M8 5v14l11-7z"/>', 'fill="currentColor"'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  copy: svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>'),
};

// ---- image folders: every image in src/assets/img/<folder>, in natural order (1, 2, 10), with optional titles ----
const IMG = /\.(jpe?g|png|webp|gif|avif)$/i;
function readGallery(srcDir, folder) {
  if (!folder) return null;
  const dir = path.join(srcDir, 'assets', 'img', folder);
  if (!fs.existsSync(dir)) return [];
  let titles = {};
  const tf = path.join(dir, 'titles.json');
  if (fs.existsSync(tf)) {
    try { titles = JSON.parse(fs.readFileSync(tf, 'utf8')); }
    catch (e) { throw new Error(`assets/img/${folder}/titles.json has a typo (${e.message}). Check commas and quotes.`); }
  }
  return fs.readdirSync(dir).filter(f => IMG.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(f => {
      const stem = f.replace(/\.[^.]+$/, '');
      const pretty = /^\d+$/.test(stem) ? '' : stem.replace(/[-_]+/g, ' ').trim().replace(/^./, c => c.toUpperCase());
      return { src: `assets/img/${folder}/${encodeURIComponent(f)}`, title: titles[stem] ?? titles[f] ?? pretty };
    });
}
const galleryAttr = g => g ? ` data-gallery="${esc(JSON.stringify(g))}"` : '';
const previewBtn = (title, preview, g, cls, label) =>
  `<button class="${cls} pv" type="button" data-title="${esc(title)}" data-preview="${esc(preview)}"${galleryAttr(g)}>${label}</button>`;
const li = xs => (xs || []).map(x => `<li>${esc(x)}</li>`).join('');

function featured(list, srcDir) {
  return list.map((p, i) => {
    const g = readGallery(srcDir, p.folder);
    const img = p.image || `assets/img/${p.id}.jpg`;
    const gh = p.repo ? `<a class="gh-ic" href="${esc(p.repo)}" target="_blank" rel="noopener" aria-label="GitHub">${ICON.gh}</a>` : '';
    const demo = p.demo ? `<a class="btn ghost" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo ${ICON.arrow}</a>` : '';
    return `<article class="proj reveal">
<div class="thumb"><img src="${esc(img)}" alt="${esc(p.title)} screenshot" loading="lazy" onerror="this.parentNode.remove()"></div>
<div class="proj-h"><span class="mono num">${String(i + 1).padStart(2, '0')}</span><span class="pill mono"><i></i>${esc(p.badge || p.category)}</span></div>
<h3>${esc(p.title)}</h3><p class="mono dim kind">${esc(p.kind)}</p><p class="muted desc">${esc(p.description)}</p>
<div class="sect"><h4 class="grp mono">Focus Areas</h4><ul class="list sq two">${li(p.focus)}</ul></div>
<div class="sect"><h4 class="grp mono">Key Features</h4><ul class="list dash">${li(p.features)}</ul></div>
<div class="sect"><h4 class="grp mono">Technologies</h4><div class="chips mono">${(p.tech || []).map(t => `<span>${esc(t)}</span>`).join('')}</div></div>
<div class="proj-f">${previewBtn(p.title, p.preview, g, 'btn ghost', ICON.play + ' Preview')}<div class="proj-f-r">${demo}${gh}</div></div></article>`;
  }).join('\n');
}

function more(list, srcDir) {
  return list.map(p => {
    const g = readGallery(srcDir, p.folder);
    const img = p.image || `assets/img/${p.id}.jpg`;
    const letter = esc(String(p.title[0]).replace(/[^\p{L}\p{N}]/gu, '#'));
    return `<button class="card reveal" type="button" data-cat="${esc(p.category)}" data-title="${esc(p.title)}" data-note="${esc(p.description)}" data-stack="${esc((p.tech || []).join(','))}" data-img="${esc(img)}" data-link="${esc(p.demo)}" data-repo="${esc(p.repo)}" data-preview="${esc(p.preview)}"${galleryAttr(g)}>
<span class="thumb"><img src="${esc(img)}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${letter}'}))"></span>
<span class="mono dim tag">${esc(p.category)}</span><strong>${esc(p.title)}</strong><span class="mono view">View details ${ICON.arrow}</span></button>`;
  }).join('\n');
}

function stack(groups, srcDir) {
  return groups.map(g => `<h3 class="grp mono">${esc(g.group)}</h3><div class="tiles">` + g.items.map(it => {
    if (typeof it === 'string') return `<div class="tile reveal"><small class="mono dim">${esc(g.kind)}</small><b class="mono">${esc(it)}</b></div>`;
    return `<button class="tile pv reveal" type="button" data-title="${esc(it.name)}" data-preview="${esc(it.preview)}"${galleryAttr(readGallery(srcDir, it.folder))}><small class="mono dim">${esc(g.kind)}</small><b class="mono">${esc(it.name)}</b><span class="mono tile-pv">${ICON.play} Preview</span></button>`;
  }).join('') + '</div>').join('');
}

function makeContext(data, srcDir) {
  const { site, projects, tools } = data;
  const all = [...projects.featured, ...projects.more];
  return {
    site: { ...site, typedFirst: site.typedWords[0], initial: String(site.name[0]).toUpperCase() },
    stat: { projects: all.length, years: site.yearsOnSamp, real: all.filter(p => p.category === 'Real users').length },
    count: { featured: projects.featured.length },
    icon: ICON,
    typedWords: esc(JSON.stringify(site.typedWords)),
    featured: featured(projects.featured, srcDir),
    more: more(projects.more, srcDir),
    stack: stack(tools, srcDir),
    domains: site.domains.map(([t, d]) => `<div class="cap reveal"><h3 class="mono">${esc(t)}</h3><p>${esc(d)}</p></div>`).join(''),
    aboutFacts: site.about.facts.map(([k, v]) => `<div><dt>${esc(k)}:</dt><dd>${esc(v)}</dd></div>`).join(''),
    aboutParagraphs: site.about.paragraphs.map(p => `<p>${esc(p)}</p>`).join('\n'),
  };
}

module.exports = { makeContext, esc };
