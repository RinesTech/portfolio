(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typing effect
  const t = $('#typed');
  if (t && !still) {
    const words = JSON.parse(t.dataset.words || '[]');
    let i = 0, c = 0, del = false;
    if (words.length) (function tick() {
      const w = words[i];
      t.textContent = w.slice(0, c);
      if (!del && c === w.length) { del = true; return setTimeout(tick, 1400); }
      if (del && c === 0) { del = false; i = (i + 1) % words.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    })();
  }

  // Scroll reveal + counters
  const count = el => {
    const n = +el.dataset.count;
    if (still || !n) { el.textContent = n; return; }
    let v = 0;
    const s = setInterval(() => { el.textContent = ++v; if (v >= n) clearInterval(s); }, 900 / n);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.dataset.count) count(e.target);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal, [data-count]').forEach(el => io.observe(el));

  // Scroll progress bar
  const bar = $('#progress');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Highlight the nav link of the section you're reading
  const links = $$('nav a[href^="#"]');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id === 'home' ? '' : e.target.id;
    const target = ['about', 'projects', 'stack', 'contact'].includes(id) ? id : null;
    links.forEach(a => a.classList.toggle('on', target && a.getAttribute('href') === '#' + target));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  // Preview popup: YouTube, Google Drive video, mp4/webm file, image, or a whole folder of designs
  const pv = $('#preview');
  const stage = $('#pv-stage');
  const PLAY = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  const safeUrl = u => /^(https?:\/\/|assets\/|\.\/)/i.test(u);
  const embed = (src, title) => {
    const f = document.createElement('iframe');
    f.src = src; f.title = title; f.allowFullscreen = true;
    f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    return f;
  };
  const mediaFor = u => {
    let m;
    if (!safeUrl(u)) return null;
    if ((m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/)))
      return embed(`https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`, 'Video preview');
    if ((m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/)))
      return embed(`https://drive.google.com/file/d/${m[1]}/preview`, 'Video preview');
    if (/\.(mp4|webm|mov|ogg)(\?|#|$)/i.test(u)) {
      const v = document.createElement('video');
      v.src = u; v.controls = true; v.autoplay = true; v.playsInline = true;
      return v;
    }
    if (/\.(jpe?g|png|webp|gif|avif|svg)(\?|#|$)/i.test(u)) {
      const im = new Image(); im.src = u; im.alt = 'Project preview';
      return im;
    }
    const a = document.createElement('a');
    a.className = 'btn solid'; a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open preview \u2197';
    return a;
  };

  // Finds folder/1.jpg, folder/2.jpg, ... (also .jpeg .png .webp) and stops at the first missing number
  const EXTS = ['jpg', 'jpeg', 'png', 'webp'];
  const exists = async u => {
    try {
      const r = await fetch(u, { method: 'HEAD' });
      return r.ok && (r.headers.get('content-type') || '').startsWith('image/');
    } catch { return false; }
  };
  const discover = async (folder, max = 100) => {
    const found = [];
    for (let start = 1; start <= max; start += 8) {
      const batch = await Promise.all(Array.from({ length: 8 }, async (_, k) => {
        const urls = EXTS.map(x => `${folder}/${start + k}.${x}`);
        const ok = await Promise.all(urls.map(exists));
        const i = ok.indexOf(true);
        return i < 0 ? null : urls[i];
      }));
      const gap = batch.indexOf(null);
      found.push(...(gap < 0 ? batch : batch.slice(0, gap)));
      if (gap >= 0) break;
    }
    return found;
  };
  const folderCache = {};

  let items = [], idx = 0, gallery = false, inFolder = false, token = 0;
  const show = () => {
    stage.replaceChildren();
    stage.classList.toggle('gallery', gallery);
    stage.classList.toggle('tall', inFolder && !gallery);
    $('#pv-back').hidden = !(inFolder && !gallery && items.length > 1);
    $('#pv-nav').hidden = gallery || items.length < 2;
    $('#pv-count').textContent = (idx + 1) + ' / ' + items.length;
    if (!items.length) {
      const p = document.createElement('p');
      p.textContent = inFolder ? 'Designs coming soon.' : 'Preview coming soon.';
      stage.append(p);
    } else if (gallery) {
      items.forEach((u, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'gthumb'; b.setAttribute('aria-label', 'Open design ' + (i + 1));
        const im = new Image(); im.src = u; im.alt = 'Design ' + (i + 1); im.loading = 'lazy';
        b.append(im);
        b.onclick = () => { idx = i; gallery = false; show(); };
        stage.append(b);
      });
    } else stage.append(mediaFor(items[idx]) || document.createTextNode(''));
  };
  const openPreview = async (title, list, folder) => {
    const mine = ++token;
    items = (list || '').split(/\s+/).filter(Boolean); idx = 0; gallery = false; inFolder = false;
    $('#pv-title').textContent = title + ' preview';
    if (!folder) { show(); pv.showModal(); return; }
    inFolder = true; items = [];
    stage.replaceChildren(); stage.classList.remove('gallery', 'tall');
    const p = document.createElement('p'); p.textContent = 'Loading designs...'; stage.append(p);
    $('#pv-nav').hidden = true; $('#pv-back').hidden = true;
    pv.showModal();
    if (!folderCache[folder]) folderCache[folder] = await discover(folder);
    if (mine !== token || !pv.open) return;   // closed or replaced while loading
    items = folderCache[folder]; gallery = items.length > 1;
    show();
  };
  if (pv) {
    $$('.pv').forEach(b => b.onclick = () => openPreview(b.dataset.title, b.dataset.preview, b.dataset.folder));
    $('#pv-prev').onclick = () => { idx = (idx - 1 + items.length) % items.length; show(); };
    $('#pv-next').onclick = () => { idx = (idx + 1) % items.length; show(); };
    $('#pv-back').onclick = () => { gallery = true; show(); };
    $('.x', pv).onclick = () => pv.close();
    pv.addEventListener('click', e => { if (e.target === pv) pv.close(); });
    pv.addEventListener('close', () => stage.replaceChildren());   // stops any playing video
  }

  // Project details modal (tap a project card)
  const m = $('#modal');
  const arrow = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const link = (href, label) => href
    ? `<a class="btn ghost" href="${encodeURI(href)}" target="_blank" rel="noopener">${label} ${arrow}</a>` : '';
  if (m) {
    $$('.card').forEach(c => c.onclick = () => {
      const d = c.dataset;
      $('#m-title').textContent = d.title;
      $('#m-cat').textContent = d.cat;
      $('#m-note').textContent = d.note;
      $('#m-stack').innerHTML = '';
      (d.stack ? d.stack.split(',') : []).forEach(s => {
        const chip = document.createElement('span');
        chip.textContent = s.trim();
        $('#m-stack').append(chip);
      });
      $('#m-img').innerHTML = '';
      if (d.img) {
        const im = new Image(); im.src = d.img; im.alt = d.title;
        im.onerror = () => { const s = document.createElement('span'); s.textContent = d.title[0]; im.replaceWith(s); };
        $('#m-img').append(im);
      } else { const s = document.createElement('span'); s.textContent = d.title[0]; $('#m-img').append(s); }
      $('#m-links').innerHTML = link(d.link, 'Live demo') + link(d.repo, 'Source code');
      const pb = document.createElement('button');
      pb.type = 'button'; pb.className = 'btn solid'; pb.innerHTML = PLAY + ' Preview';
      pb.onclick = () => { m.close(); openPreview(d.title, d.preview); };
      $('#m-links').prepend(pb);
      m.showModal();
    });
    $('.x', m).onclick = () => m.close();
    m.addEventListener('click', e => { if (e.target === m) m.close(); });
  }

  // Latest GitHub repositories (fetched live; the block stays hidden if it fails)
  const box = $('#repos');
  if (box) fetch('https://api.github.com/users/rinestech/repos?per_page=100&sort=updated')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(list => {
      const repos = list.filter(r => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 6);
      if (!repos.length) return;
      repos.forEach(r => {
        if (!String(r.html_url).startsWith('https://github.com/')) return;
        const a = document.createElement('a');
        a.className = 'repo'; a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
        const name = document.createElement('b'); name.className = 'mono'; name.textContent = r.name;
        const desc = document.createElement('p'); desc.textContent = r.description || 'No description yet.';
        const foot = document.createElement('footer'); foot.className = 'mono';
        const lang = document.createElement('span'); lang.textContent = r.language || 'Repository';
        const star = document.createElement('span'); star.textContent = '★ ' + r.stargazers_count;
        foot.append(lang, star); a.append(name, desc, foot); box.append(a);
      });
      if (box.children.length) $('#repos-wrap').hidden = false;
    }).catch(() => {});

  // Copy email
  const cp = $('#copy');
  if (cp) cp.onclick = async () => {
    const label = $('span', cp), old = label.textContent;
    try { await navigator.clipboard.writeText($('#mail').textContent); label.textContent = 'Copied'; }
    catch { label.textContent = 'Press Ctrl+C'; }
    setTimeout(() => label.textContent = old, 1600);
  };

  // Footer year
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  // Contact form (Formspree, no page reload)
  const f = $('#contact-form');
  if (f) f.addEventListener('submit', async e => {
    e.preventDefault();
    $('#ok').hidden = $('#bad').hidden = true;
    try {
      const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      if (r.ok) { f.reset(); $('#ok').hidden = false; } else $('#bad').hidden = false;
    } catch { $('#bad').hidden = false; }
  });
})();
