// Pre-renders the publication cards into static HTML so search engines and
// link previews can read them without running JavaScript.
//
// Run after editing publications.js:
//   npm install --no-save playwright && npx playwright install chromium
//   node scripts/prerender_publications.mjs
//
// It loads index.html and publications.html in headless Chromium, captures the
// cards the page's own JavaScript renders, and writes them between the
// <!-- prerender:... --> markers. It also refreshes the publication count and
// the ScholarlyArticle JSON-LD. The GitHub workflow runs this automatically
// whenever publications.js changes. Safe to run repeatedly.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://laeeqaslam.com/';

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

// Third-party scripts are replaced with no-op stubs so the output is
// deterministic and leaves <i data-lucide> placeholders for the live page.
const STUBS = {
  'lucide': 'window.lucide={createIcons(){}};',
  'aos': 'window.AOS={init(){},refresh(){}};',
  'chart': 'window.Chart=function(){};',
};

const browser = await chromium.launch();
async function open(page) {
  const p = await browser.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));
  await p.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(base)) return route.continue();
    const stub = Object.keys(STUBS).find(k => url.toLowerCase().includes(k));
    if (stub) return route.fulfill({ contentType: 'text/javascript', body: STUBS[stub] });
    return route.abort();
  });
  await p.goto(base + page, { waitUntil: 'load' });
  if (errors.length) throw new Error(`${page}: ${errors.join('; ')}`);
  return p;
}

function replaceBetween(src, name, content) {
  const re = new RegExp(`(<!-- prerender:${name}:start -->)[\\s\\S]*?(<!-- prerender:${name}:end -->)`);
  if (!re.test(src)) throw new Error(`marker prerender:${name} not found`);
  return src.replace(re, (_, a, b) => `${a}\n${content.trim()}\n${b}`);
}

// ---- publications.html ----
const pubsPage = await open('publications.html');
await pubsPage.waitForFunction(() => document.querySelectorAll('#pubs-grid > *').length > 0);
const pubsHtml = await pubsPage.$eval('#pubs-grid', el => el.innerHTML);
const pubs = await pubsPage.evaluate(() => allPubs);
const count = pubs.length;

const abs = u => (!u ? null : /^https?:/.test(u) ? u : SITE + u);
const graph = pubs.map(p => {
  const doi = (p.read_url || '').match(/10\.\d{4,}\/\S+/);
  return {
    '@type': 'ScholarlyArticle',
    headline: p.title,
    name: p.title,
    datePublished: String(p.year),
    author: (p.authors || '').replace(/,?\s+and\s+/g, ', ').split(',').map(s => s.trim())
      .filter(n => n && n !== 'others')
      .map(n => n === 'Laeeq Aslam' ? { '@type': 'Person', '@id': SITE + '#person', name: n } : { '@type': 'Person', name: n }),
    isPartOf: { '@type': 'Periodical', name: p.venue },
    ...(p.read_url ? { url: p.read_url } : p.pdf ? { url: abs(p.pdf) } : {}),
    ...(doi ? { identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: doi[0] } } : {}),
    ...(p.pdf ? { encoding: { '@type': 'MediaObject', contentUrl: abs(p.pdf), encodingFormat: 'application/pdf' } } : {}),
  };
});
const jsonld = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Publications — Laeeq Aslam',
  url: SITE + 'publications.html', about: { '@id': SITE + '#person' },
  mainEntity: { '@type': 'ItemList', numberOfItems: count,
    itemListElement: graph.map((item, i) => ({ '@type': 'ListItem', position: i + 1, item })) } };
const jsonldTag = `<script type="application/ld+json">\n${JSON.stringify(jsonld).replace(/</g, '\\u003c')}\n</script>`;

let src = fs.readFileSync(path.join(ROOT, 'publications.html'), 'utf8');
src = replaceBetween(src, 'pubs', pubsHtml);
src = replaceBetween(src, 'jsonld', jsonldTag);
src = src.replace(/\b\d+ papers in /g, `${count} papers in `).replace(/>\d+ total</, `>${count} total<`);
fs.writeFileSync(path.join(ROOT, 'publications.html'), src);

// ---- index.html (featured) ----
const home = await open('index.html');
await home.waitForFunction(() => document.querySelectorAll('#recent-publications > *').length > 0);
const featuredHtml = await home.$eval('#recent-publications', el => el.innerHTML);
let idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
idx = replaceBetween(idx, 'featured', featuredHtml.replace(/<!-- prerender:featured:(start|end) -->/g, ''));
idx = idx.replace(/View all \d+ publications/, `View all ${count} publications`);
fs.writeFileSync(path.join(ROOT, 'index.html'), idx);

await browser.close();
server.close();
console.log(`Pre-rendered ${count} publications (${graph.length} in JSON-LD).`);
