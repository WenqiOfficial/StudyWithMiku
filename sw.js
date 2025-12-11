const CACHE_VER = '250511';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/css/shared/sp/css/common.css',
  './assets/css/main.css',
  './assets/js/umami.js',
  './assets/js/ufunction.js',
  './assets/js/miku.js',
  './assets/video/loop.mp4',
  './assets/video/loop_sekai.mp4',
];

self.addEventListener('install', async (event) => {
  console.log(`Service Worker Install: ${CACHE_VER}`);
  const cache = await caches.open(CACHE_VER);
  await cache.addAll(ASSETS_TO_CACHE);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log(`Service Worker Version: ${CACHE_VER}`);
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_VER) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  const shouldHandle =
    request.url.includes('assets') ||
    request.url.includes('loop');

  if (!shouldHandle || request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_VER);
        cache.put(request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        console.warn('Fetch failed:', error);
        return cachedResponse;
      }
    })()
  );
});