const CACHE_NAME = 'dbp-systems-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg'
  // Remove the double slashes below ONLY after you upload the PNG files
  // './icon-192.png',
  // './icon-512.png'
];

// Install Event: Cache Assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event: Network First, falling back to cache
self.addEventListener('fetch', (event) => {
  // Ignore Firebase API calls to prevent caching dynamic database data
  if (event.request.url.includes('firebaseio.com') || event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
