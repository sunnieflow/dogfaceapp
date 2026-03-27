const CACHE = 'dogface-v2';
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
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
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
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/dogfaceapp/index.html')))
  );
});
