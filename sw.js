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
                    'img/'
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })    
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // console.log(event.request);
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('Found ', event.request.url, ' in cache');
                return response;
            }
            console.log('Network request for ', event.request.url);
            return fetch(event.request).then(networkResponse => {
                if (networkResponse.status === 404) {
                    console.log(networkResponse.status);
                    return;
                }
                return caches.open(staticCacheName).then(cache => {
                    cache.put(event.request.url, networkResponse.clone());
                    console.log('Fetched and cached', event.request.url);
                    return networkResponse;
                })
            })
        }).catch(error => {
            console.log('Error:', error);
            return;
        })
    );
});