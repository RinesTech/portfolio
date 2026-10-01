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
