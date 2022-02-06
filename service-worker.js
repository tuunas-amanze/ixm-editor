self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
          'index.html',
          'public/main.js',
          'https://unpkg.com/dexie@latest/dist/dexie.js',
          'https://unpkg.com/pwacompat@latest/pwacompat.min.js',
          'public/4ce3958d77223022d74f.ttf',
          'public/66e7534161fcdd8f1727.ttf',
          'manifest/icon-192x192.png',
          'manifest/icon-256x256.png',
          'manifest/icon-384x384.png',
          'manifest/icon-512x512.png',
          'manifest/manifest.json',
          'manifest/manifest.webmanifest'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('main.js');
      });
    }
  }));
});
