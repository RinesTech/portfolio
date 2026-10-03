import { $ } from './util.js';

// Latest public repos, fetched live. The block stays hidden if anything fails.
export function initGithub() {
  const box = $('#repos');
  if (!box || !box.dataset.user) return;
  fetch(`https://api.github.com/users/${box.dataset.user}/repos?per_page=100&sort=updated`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(list => {
      const repos = list.filter(r => !r.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0, 6);
      repos.forEach(r => {
        if (!String(r.html_url).startsWith('https://github.com/')) return;
        const a = document.createElement('a');
        a.className = 'repo'; a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
        const name = document.createElement('b'); name.className = 'mono'; name.textContent = r.name;
        const desc = document.createElement('p'); desc.textContent = r.description || 'No description yet.';
        const foot = document.createElement('footer'); foot.className = 'mono';
        const lang = document.createElement('span'); lang.textContent = r.language || 'Repository';
        const star = document.createElement('span'); star.textContent = '\u2605 ' + r.stargazers_count;
        foot.append(lang, star); a.append(name, desc, foot); box.append(a);
      });
      if (box.children.length) $('#repos-wrap').hidden = false;
    }).catch(() => {});
}
