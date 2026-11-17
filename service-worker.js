const CACHE_NAME = "tnb-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

/* INSTALL AND CACHE UPDATED FILES */

self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await cache.addAll(
        FILES_TO_CACHE.map(
          url => new Request(url, { cache: "reload" })
        )
      );

      await self.skipWaiting();
    })()
  );
});

/* REMOVE OLD CACHES */

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter(
            name =>
              name.startsWith("tnb-") &&
              name !== CACHE_NAME
          )
          .map(name => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

/* SERVE CACHED FILES */

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});
