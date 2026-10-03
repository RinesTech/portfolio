import { $ } from './util.js';

// Copy-email button, footer year, and the Formspree contact form (no page reload)
export function initContact() {
  const cp = $('#copy');
  if (cp) cp.onclick = async () => {
    const label = $('span', cp), old = label.textContent;
    try { await navigator.clipboard.writeText($('#mail').textContent); label.textContent = 'Copied'; }
    catch { label.textContent = 'Press Ctrl+C'; }
    setTimeout(() => label.textContent = old, 1600);
  };

  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  const f = $('#contact-form');
  if (f) f.addEventListener('submit', async e => {
    e.preventDefault();
    $('#ok').hidden = $('#bad').hidden = true;
    try {
      const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
      if (r.ok) { f.reset(); $('#ok').hidden = false; } else $('#bad').hidden = false;
    } catch { $('#bad').hidden = false; }
  });
}
