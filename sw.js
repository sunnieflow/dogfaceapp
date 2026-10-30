const CACHE = 'dogface-v3';
const FILES = [
  '/dogfaceapp/',
  '/dogfaceapp/index.html',
  '/dogfaceapp/manifest.json',
  '/dogfaceapp/icon-72.png',
  '/dogfaceapp/icon-96.png',
  '/dogfaceapp/icon-128.png',
  '/dogfaceapp/icon-144.png',
  '/dogfaceapp/icon-152.png',
  '/dogfaceapp/icon-192.png',
  '/dogfaceapp/icon-384.png',
  '/dogfaceapp/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.all(FILES.map(f => c.add(f).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('/dogfaceapp/index.html')))
  );
});
