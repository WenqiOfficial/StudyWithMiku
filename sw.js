const CACHE_VER = 'v1';

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !CACHE_VER.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VER).then(function (cache) {
      return cache.addAll([
        './assets/css/fonts/sjsq.woff2'
      ]);
    })
  );

});


this.addEventListener('activate', function (event) {
  event.waitUntil(deleteOldCaches());
});

this.addEventListener('fetch', function (event) {
  event.respondWith(
    // 该方法查询请求然后返回 Service Worker 创建的任何缓存数据。
    caches.match(event.request)
      .then(function (response) {
        // 若有缓存，则返回
        if (response) {
          return response;
        }

        // 复制请求。请求是一个流且只能被使用一次。因为之前已经通过缓存使用过一次了，所以为了在浏览器中使用 fetch，需要复制下该请求。
        var fetchRequest = event.request.clone();

        // 没有找到缓存。所以我们需要执行 fetch 以发起请求并返回请求数据。
        return fetch(fetchRequest).then(
          function (response) {
            // 检测返回数据是否有效
            if (!response || response.status !== 200 || response.type !== 'basic' || response.type !== 'cors') {
              return response;
            }

            // 复制返回数据，因为它也是流。因为我们想要浏览器和缓存一样使用返回数据，所以必须复制它。这样就有两个流
            var responseToCache = response.clone();

            caches.open(CACHE_VER)
              .then(function (cache) {
                // 把请求添加到缓存中以备之后的查询用
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});
