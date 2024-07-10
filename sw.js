const CACHE_VER = 'v2';

const cacheInit = async () => {
  caches.open(CACHE_VER).then(function (cache) {
    return cache.addAll([
      './assets/css/shared/sp/css/common.css',
      './assets/css/main.css',
      './assets/js/umami.js',
      './assets/js/ufunction.js',
      './assets/js/mikuplayer.min.js',
      './assets/js/miku.js'
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
  const requestUrl = request.url;
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    // console.log("Find Cache! Return! URL: "+requestUrl);
    return responseFromCache;
  }
  if (requestUrl.includes("assets/video/loop.mp4") && await caches.match(request)) {
    // console.log("Video URL!");
    await caches.open(CACHE_VER).then(function (cache) {
      return cache.addAll([
        './assets/video/loop.mp4'
      ]);
    });
  }
  const responseFromNet = await fetch(request);
  if (!requestUrl.includes('assets/video/loop.mp4') && !requestUrl.includes('api') && !requestUrl.includes('hitokoto')) {
    // console.log("Matched! URL: " + requestUrl);
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
