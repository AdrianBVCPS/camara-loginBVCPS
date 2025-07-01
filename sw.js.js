// sw.js

const CACHE_NAME = 'camara-login-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  // Si tuvieras un archivo de estilos separado, lo añadirías aquí:
  // './style.css',
  './icon.png' // Cacheamos también el icono
];

// Evento de instalación: se abre el caché y se guardan los archivos principales
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de activación: limpia cachés antiguos si los hubiera
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

// Evento fetch: decide si servir desde el caché o desde la red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la petición está en el caché, la sirve desde ahí
        if (response) {
          return response;
        }
        // Si no, la pide a la red
        return fetch(event.request);
      }
    )
  );
});