let staticCacheName = 'restaurant-static-v1';


self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                    '/',
                    'index.html',
                    'restaurant.html',
                    '/css/styles.css',
                    '/js/dbhelper.js',
                    '/js/restaurant_info.js',
                    '/js/main.js',
                    'img/',

            ]);
        })
    );
});


self.addEventListener('fetch', function (event) {
    const CACHE_NAME = 'restaurants';
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            var fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(
                function (response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function (cache) {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                }
            );
        }).catch(function (error) {
            console.log(error);
        })
    );
});


self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['restaurant-static-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});