const CACHE_NAME = "serene-vibes-shell-v2";

// Only the public marketing site's own assets — never the admin SPA,
// API routes, or generated PDFs, all of which must always hit the network.
const SHELL_ASSETS = [
  "/",
  "/css/styles.css",
  "/js/main.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept the admin dashboard, API calls, or generated PDF output.
  // Those must always be live/network requests (auth tokens, dynamic data,
  // freshly built files) — never served from cache.
  if (
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/output/")
  ) {
    return; // let the browser handle it normally
  }

  if (request.method !== "GET") return;

  // Cache-first for the public site shell, falling back to network,
  // and updating the cache with fresh responses as they come in.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok && url.origin === self.location.origin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
