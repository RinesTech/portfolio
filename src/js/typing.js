import { $, still } from './util.js';

// "Building ..." line in the hero that types and deletes words
export function initTyping() {
  const t = $('#typed');
  if (!t || still) return;
  const words = JSON.parse(t.dataset.words || '[]');
  if (!words.length) return;
  let i = 0, c = 0, del = false;
  (function tick() {
    const w = words[i];
    t.textContent = w.slice(0, c);
    if (!del && c === w.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c === 0) { del = false; i = (i + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 75);
  })();
}
