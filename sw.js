const CACHE_VER = 'v1';

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VER).then(function(cache){
      return cache.addAll([
        './index.html',
        './assets/css/fonts/sjsq.woff2',
        './assets/video/oneloop.mp4'
      ]);
    })
  );

});


this.addEventListener('activate', function(event){

});

// this.addEventListener('fetch', function(event){
//   event.respondWith(
//     caches.open(CACHE_VER).then(function(cache){
//       return cache.match(event.request.url);
//     })
//   );
// });


  // 在 promise 成功完成之前，活跃的 worker 不会被视作已激活。

this.addEventListener("fetch", function (event) {
  console.log("Handling fetch event for", event.request.url);

  event.respondWith(
    // 打开 Cache 对象。
    caches.open(CACHE_VER).then(function (cache) {
      return cache
        .match(event.request)
        .then(function (response) {
          if (response) {
            console.log(" Found response in cache:", response);

            return response;
          }
        })
        .catch(function (error) {
          // 处理 match() 或 fetch() 引起的异常。
          console.error("  Error in fetch handler:", error);

          throw error;
        });
    }),
  );
});
