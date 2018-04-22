let staticCacheName = 'my-site-cache-v1';
let urlsToCache = [
                    '/',
                    'index.html',
                    'restaurant.html',
                    '/css/styles.css',
                    '/js/dbhelper.js',
                    '/js/restaurant_info.js',
                    '/js/main.js',
                    'img/'
                   ];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(staticCacheName).then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
    }));
});
self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => {
        // Cache hit - return response
        if (response) {
            return response;
        }
        var fetchRequest = event.request.clone();
        return fetch(fetchRequest).then(response=> {
            // Check if received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }
            var responseToCache = response.clone();
            caches.open(staticCacheName).then(cache => {
                cache.put(event.request, responseToCache);
            });
            return response;
        });
    }));
});
self.addEventListener('activate', event => {
    var cacheWhitelist = ['my-site-cache-v2'];
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
        }));
    }));
});