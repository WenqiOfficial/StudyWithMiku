var cacheStorageKey = 'minimal-pwa-1'

var cacheList = [
  '/',
  "index.html",
  "assets/css/main.css",
  "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js",
  "https://cdn.bootcdn.net/ajax/libs/aplayer/1.10.1/APlayer.min.js",
  "https://cdn.bootcdn.net/ajax/libs/meting/2.0.1/Meting.min.js",
  "https://cdn.bootcdn.net/ajax/libs/countup.js/1.9.3/countUp.min.js",
  "assets/css/shared/sp/css/common.css",
  "https://cdn.bootcdn.net/ajax/libs/aplayer/1.10.1/APlayer.min.css",
  "assets/js/miku.js",
  "assets/video/oneloop.mp4"
]

self.addEventListener('activate', function(e) {
    e.waitUntil(
      Promise.all(
        caches.keys().then(cacheNames => {
          return cacheNames.map(name => {
            if (name !== cacheStorageKey) {
              return caches.delete(name)
            }
          })
        })
      ).then(() => {
        return self.clients.claim()
      })
    )
  })