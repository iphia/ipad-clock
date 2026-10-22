// Bump this version whenever an app asset changes.
const CACHE_PREFIX = 'ipad-clock-';
const CACHE_NAME = CACHE_PREFIX + 'v22';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './fonts/NanumGothic-Regular.ttf',
  './fonts/NanumGothic-Bold.ttf',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Keep the old worker active unless every required asset downloads.
    await cache.addAll(urlsToCache.map((url) => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' ||
      url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Query strings on the start URL must also work offline.
    const isStartPage = event.request.mode === 'navigate' &&
      (url.pathname === new URL('./', self.registration.scope).pathname ||
       url.pathname === new URL('index.html', self.registration.scope).pathname);
    const cached = await cache.match(isStartPage ? './index.html' : event.request);
    return cached || fetch(event.request);
  })());
});
