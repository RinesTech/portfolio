import { $, $$ } from './util.js';

// Top progress bar + highlight the nav link of the section being read
export function initScroll() {
  const bar = $('#progress');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight || 1) * 100) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = $$('nav a[href^="#"]');
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const id = ['about', 'projects', 'stack', 'contact'].includes(e.target.id) ? e.target.id : null;
    links.forEach(a => a.classList.toggle('on', !!id && a.getAttribute('href') === '#' + id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));
}
