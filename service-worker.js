const CACHE_NAME = 'calculadora-notas-cache-v1';
const urlsToCache = [
  './',
  'index.html', // Seu arquivo HTML principal
  'manifest.json',
  'service-worker.js',
  'icon-192x192.png',
  'icon-512x512.png',
  'style.css',
  'script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto com sucesso!');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .catch(() => {
            // Se a requisição falhar e não estiver no cache, você pode retornar uma página offline
            // return caches.match('/offline.html'); // Exemplo
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
