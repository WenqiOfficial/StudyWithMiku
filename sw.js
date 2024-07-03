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
    console.log("Find Cache! Return!");
    return responseFromCache;
  }
  const responseFromNet = await fetch(request);
  const requestUrl = request.url;
  // console.log("request: " + requestUrl);
  if (!requestUrl.includes('api') && !requestUrl.includes('hitokoto')) {
    console.log("Matched! URL: " + requestUrl);
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
  if (event.request.url.includes('loop.mp4')) {
    console.log("Matched Video! URL: " + requestUrl);
    var pos = Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
    caches.open(CACHE_VER)
      .then(function (cache) { return cache.match(event.request.url); })
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (ab) {
        return new Response(
          ab.slice(pos),
          {
            status: 206,
            statusText: "Partial Content",
            headers: [
              ['Content-Type', 'video/mp4'],
              ['Content-Range', 'bytes ' + pos + '-' + (ab.byteLength - 1) + '/' + ab.byteLength]]
          });
      });
  } else {
    event.respondWith(cacheMatch(event.request));
  }

});
