// Builds src/ into dist/ with no dependencies.
//   node build.js          -> build once (what Vercel runs)
//   node build.js --serve  -> local dev server at http://localhost:3000 (rebuilds when you refresh the page)
const fs = require('fs');
const path = require('path');
const http = require('http');
const { makeContext, esc } = require('./build/render.js');

const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'dist');

const loadData = name => {
  const p = path.join(SRC, 'data', name + '.js');
  try { delete require.cache[require.resolve(p)]; return require(p); }
  catch (e) { throw new Error(`Problem in src/data/${name}.js: ${e.message}`); }
};

// <!-- @include partials/hero.html -->  ->  contents of that file
function include(html, depth = 0) {
  if (depth > 10) throw new Error('Includes are nested too deeply');
  return html.replace(/<!--\s*@include\s+(\S+)\s*-->/g, (_, file) => {
    const p = path.join(SRC, file);
    if (!fs.existsSync(p)) throw new Error('Missing partial: ' + file);
    return include(fs.readFileSync(p, 'utf8'), depth + 1);
  });
}

// {{site.name}} -> escaped text      {{@featured}} -> raw html block
function fill(html, ctx) {
  return html.replace(/\{\{\s*(@?)([\w.]+)\s*\}\}/g, (_, raw, key) => {
    const v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), ctx);
    if (v == null) throw new Error(`Unknown placeholder {{${raw}${key}}}. Check the spelling in src/partials.`);
    return raw ? String(v) : esc(v);
  });
}

function build({ clean = false } = {}) {
  if (clean) fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const ctx = makeContext({ site: loadData('site'), projects: loadData('projects'), tools: loadData('tools') }, SRC);
  const page = fill(include(fs.readFileSync(path.join(SRC, 'index.html'), 'utf8')), ctx);
  fs.writeFileSync(path.join(OUT, 'index.html'), page);

  // All css files are joined in name order (01-, 02-, ...) into one style.css
  const cssDir = path.join(SRC, 'css');
  const css = fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).sort()
    .map(f => `/* ${f} */\n` + fs.readFileSync(path.join(cssDir, f), 'utf8')).join('\n');
  fs.writeFileSync(path.join(OUT, 'style.css'), css);

  for (const dir of ['js', 'assets']) {
    if (fs.existsSync(path.join(SRC, dir))) fs.cpSync(path.join(SRC, dir), path.join(OUT, dir), { recursive: true });
  }
}

if (process.argv.includes('--serve')) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif',
    '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json' };
  http.createServer((req, res) => {
    let url = decodeURIComponent(req.url.split('?')[0]);
    if (url.endsWith('/')) url += 'index.html';
    try { if (url === '/index.html') build(); } catch (e) { res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end(String(e.message)); }
    const file = path.join(OUT, path.normalize(url));
    if (!file.startsWith(OUT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  }).listen(3000, () => { try { build({ clean: true }); console.log('Dev server: http://localhost:3000'); } catch (e) { console.error(e.message); } });
} else {
  try { build({ clean: true }); console.log('Built to dist/'); }
  catch (e) { console.error('BUILD FAILED: ' + e.message); process.exit(1); }
}
