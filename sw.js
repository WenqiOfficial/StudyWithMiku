const CACHE_VER = 'v1';

const cacheInit = async () => {
  caches.open(CACHE_VER).then(function (cache) {
    return cache.addAll([
      // './assets/css/fonts/sjsq.woff2'
    ]);
  });
};

const deleteCache = async (key) => {
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
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    // console.log("Find Cache! Return!");
    return responseFromCache;
  }
  const responseFromNet = await fetch(request);
  const requestUrl = request.url;
  // console.log("request: " + requestUrl);
  if (requestUrl.includes('loop.mp4') || !requestUrl.includes('api')) {
    // console.log("Matched! URL: "+ requestUrl);
    putInCache(request, responseFromNet.clone());
  }
  return responseFromNet;
};


this.addEventListener('install', function (event) {
  event.waitUntil(cacheInit());
});
this.addEventListener('activate', function (event) {
  event.waitUntil(deleteOldCaches());
});
this.addEventListener('fetch', function (event) {
  event.respondWith(cacheMatch(event.request));
});
