// Chibi Creator — offline-capable service worker.
// network-first for code, cache-first for fonts/icons. Fully offline-capable.
const CACHE = 'chibi-creator-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/data.js',
  './js/anime-list.js',
  './js/store.js',
  './js/chibi.js',
  './js/controls.js',
  './js/anime.js',
  './js/gallery.js',
  './js/app.js',
  './js/pwa.js',
  './fonts/PlayfairDisplay-var-latin.woff2',
  './fonts/DMSans-var-latin.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

const CACHE_FIRST = /\.(?:woff2|png|ico|svg|jpg|jpeg)$/i;  // anime thumbnails cache on first view

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  if (CACHE_FIRST.test(url.pathname)) {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return res; })));
    return;
  }
  e.respondWith(
    fetch(e.request).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return res; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || (e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
