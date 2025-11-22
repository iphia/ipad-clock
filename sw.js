const CACHE_NAME = 'ipad-clock-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 설치 시 파일 저장
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// 실행 시 저장된 파일 불러오기
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
