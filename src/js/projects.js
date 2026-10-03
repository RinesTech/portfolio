import { $, $$ } from './util.js';
import { PLAY, openPreview, galleryOf } from './preview.js';

const ARROW = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
const link = (href, label) => href
  ? `<a class="btn ghost" href="${encodeURI(href)}" target="_blank" rel="noopener">${label} ${ARROW}</a>` : '';

// Tap a card in "More projects" to open its details popup
export function initProjects() {
  const m = $('#modal');
  if (!m) return;
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
    const letter = () => { const s = document.createElement('span'); s.textContent = d.title[0]; return s; };
    if (d.img) {
      const im = new Image(); im.src = d.img; im.alt = d.title;
      im.onerror = () => im.replaceWith(letter());
      $('#m-img').append(im);
    } else $('#m-img').append(letter());
    $('#m-links').innerHTML = link(d.link, 'Live demo') + link(d.repo, 'Source code');
    const pb = document.createElement('button');
    pb.type = 'button'; pb.className = 'btn solid'; pb.innerHTML = PLAY + ' Preview';
    pb.onclick = () => { m.close(); openPreview(d.title, d.preview, galleryOf(c)); };
    $('#m-links').prepend(pb);
    m.showModal();
  });
  $('.x', m).onclick = () => m.close();
  m.addEventListener('click', e => { if (e.target === m) m.close(); });
}
