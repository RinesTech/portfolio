import { $, $$ } from './util.js';

export const PLAY = '<svg class="ic" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

const safeUrl = u => /^(https?:\/\/|assets\/|\.\/)/i.test(u);
const embed = (src, title) => {
  const f = document.createElement('iframe');
  f.src = src; f.title = title; f.allowFullscreen = true;
  f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
  return f;
};

// Turns one link into the right element: YouTube, Drive video, video file, image, or plain link
function mediaFor(u, alt) {
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
    const im = new Image(); im.src = u; im.alt = alt || 'Preview';
    return im;
  }
  const a = document.createElement('a');
  a.className = 'btn solid'; a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Open preview \u2197';
  return a;
}

// items are { src, title }. In gallery mode (a folder of images) they show as a grid with titles.
let items = [], idx = 0, grid = false, inGallery = false, emptyGallery = false;

function show() {
  const stage = $('#pv-stage');
  stage.replaceChildren();
  stage.classList.toggle('gallery', grid);
  stage.classList.toggle('tall', inGallery && !grid);
  $('#pv-back').hidden = !(inGallery && !grid && items.length > 1);
  $('#pv-nav').hidden = grid || items.length < 2;
  $('#pv-count').textContent = (idx + 1) + ' / ' + items.length;
  $('#pv-caption').textContent = '';
  if (!items.length) {
    const p = document.createElement('p');
    p.textContent = emptyGallery ? 'Designs coming soon.' : 'Preview coming soon.';
    stage.append(p);
  } else if (grid) {
    items.forEach((it, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'gthumb';
      b.setAttribute('aria-label', it.title || 'Open design ' + (i + 1));
      const im = new Image(); im.src = it.src; im.alt = it.title || 'Design ' + (i + 1); im.loading = 'lazy';
      b.append(im);
      if (it.title) { const c = document.createElement('span'); c.className = 'gcap'; c.textContent = it.title; b.append(c); }
      b.onclick = () => { idx = i; grid = false; show(); };
      stage.append(b);
    });
  } else {
    stage.append(mediaFor(items[idx].src, items[idx].title) || document.createTextNode(''));
    $('#pv-caption').textContent = items[idx].title || '';
  }
}

// list = links separated by spaces, gallery = [{src,title}] from an image folder (or null)
export function openPreview(title, list, gallery) {
  const g = Array.isArray(gallery) ? gallery : null;
  inGallery = !!(g && g.length);
  items = inGallery ? g : (list || '').split(/\s+/).filter(Boolean).map(src => ({ src, title: '' }));
  emptyGallery = !!g && !items.length;
  idx = 0; grid = inGallery && items.length > 1;
  $('#pv-title').textContent = title + ' preview';
  show();
  $('#preview').showModal();
}

export const galleryOf = el => el.dataset.gallery ? JSON.parse(el.dataset.gallery) : null;

export function initPreview() {
  const pv = $('#preview');
  if (!pv) return;
  $$('.pv').forEach(b => b.onclick = () => openPreview(b.dataset.title, b.dataset.preview, galleryOf(b)));
  $('#pv-prev').onclick = () => { idx = (idx - 1 + items.length) % items.length; show(); };
  $('#pv-next').onclick = () => { idx = (idx + 1) % items.length; show(); };
  $('#pv-back').onclick = () => { grid = true; show(); };
  $('.x', pv).onclick = () => pv.close();
  pv.addEventListener('click', e => { if (e.target === pv) pv.close(); });
  pv.addEventListener('close', () => $('#pv-stage').replaceChildren()); // stops any playing video
}
