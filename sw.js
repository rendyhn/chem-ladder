/* Service worker template: build.py fills in the version and the file list and writes ../sw.js.
   Same-origin files: network first, cache as fallback (so a new build shows at once when online).
   MathJax and fonts from their CDNs: cache first, refreshed in the background. */
const PREFIX = 'chemladder-', CACHE = PREFIX + 'dd44f5187f', RUNTIME = PREFIX + 'runtime';
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"], WARM = ["https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=IBM+Plex+Mono:wght@400;500;600&display=swap", "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js", "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/input/tex/extensions/mhchem.js"];   // WARM: CDN files (MathJax, font styles) fetched ahead so formulas work offline after the first visit
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))
    .then(() => caches.open(RUNTIME)).then(c => Promise.all(WARM.map(u => c.match(u).then(hit => hit || c.add(u)).catch(() => { /* offline or blocked: fetched later */ }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE && k !== RUNTIME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? 'index.html' : req, copy)); }
      return res;
    }).catch(() => caches.match(req.mode === 'navigate' ? 'index.html' : req, { ignoreSearch: true })));
    return;
  }
  if (/(^|\.)(cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) {
    e.respondWith(caches.open(RUNTIME).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(res => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
});
