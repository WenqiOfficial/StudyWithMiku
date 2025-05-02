const CACHE_VER = 'v1015';

const cacheInit = async () => {
  caches.open(CACHE_VER).then(function (cache) {
    return cache.addAll([
      './assets/css/shared/sp/css/common.css',
      './assets/css/main.css',
      './assets/js/umami.js',
      './assets/js/ufunction.js',
      './assets/js/mikuplayer.min.js',
      './assets/js/miku.js',
      './assets/video/loop.mp4',
      './assets/video/loop_sekai.mp4'
    ]);
  });
};

const deleteCache = async (key) => {
  console.log("Delete Cache! URL: "+key);
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !CACHE_VER.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_VER);
  await cache.put(request, response);
};

const cacheMatch = async (request) => {
  const requestUrl = request.url;
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    // console.log("Find Cache! Return! URL: "+requestUrl);
    return responseFromCache;
  }
  if (requestUrl.includes("loop.mp4")) {
    const cachedResponse = await caches.match('./assets/video/loop.mp4');
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  const responseFromNet = await fetch(request);
  if (!requestUrl.includes('assets/video/loop.mp4') && !requestUrl.includes('api') && !requestUrl.includes('hitokoto')) {
    // console.log("Matched! URL: " + requestUrl);
    putInCache(request, responseFromNet.clone());
  }
  return responseFromNet;
};


this.addEventListener('install', function (event) {
  console.log('Service Worker: Install');
  event.waitUntil(cacheInit());
});
this.addEventListener('activate', function (event) {
  console.log('Service Worker: Activate');
  event.waitUntil(deleteOldCaches());
});
this.addEventListener('fetch', function (event) {
  console.log('Service Worker: Fetch');
  event.respondWith(cacheMatch(event.request));
});
