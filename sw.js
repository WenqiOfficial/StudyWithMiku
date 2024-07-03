const OFFLINE_CACHE = 'v1';
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(OFFLINE_CACHE).then(function(cache){
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

this.addEventListener('fetch', function(event){
  event.respondWith(
    caches.open(OFFLINE_CACHE).then(function(cache){
      return cache.match(event.request.url);
    })
  );
});