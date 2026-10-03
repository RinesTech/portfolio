import { $$, still } from './util.js';

const count = el => {
  const n = +el.dataset.count;
  if (still || !n) { el.textContent = n; return; }
  let v = 0;
  const s = setInterval(() => { el.textContent = ++v; if (v >= n) clearInterval(s); }, 900 / n);
};

// Fade-in on scroll + number counters
export function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.dataset.count) count(e.target);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.reveal, [data-count]').forEach(el => io.observe(el));
}
