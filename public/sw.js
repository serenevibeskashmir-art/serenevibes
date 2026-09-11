/**
 * Service Worker for Serene Vibes Kashmir
 * Provides offline functionality and caching strategies
 * Handles installation, activation, and fetch events
 */

const CACHE_NAME = 'serene-vibes-v1';
const STATIC_CACHE = 'serene-vibes-static-v1';
const DYNAMIC_CACHE = 'serene-vibes-dynamic-v1';

// Critical assets to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/manifest.json',
  '/icons/favicon-32.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png'
];

/**
 * Install Event - Cache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(urlsToCache);
    }).catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );

  // Force new service worker to take over immediately
  self.skipWaiting();
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old cache versions
            return (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== CACHE_NAME
            );
          })
          .map((cacheName) => {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).catch((error) => {
      console.error('Service Worker: Activation failed', error);
    })
  );

  // Take control of all pages immediately
  self.clients.claim();
});

/**
 * Fetch Event - Network first with cache fallback
 * Strategy: Try network first, fall back to cache, fall back to offline page
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: API calls - Network first with timeout
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      Promise.race([
        // Timeout after 5 seconds
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        ),
        fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
      ]).catch(() => {
        // Fall back to cached version
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Return offline response
          return new Response(
            JSON.stringify({
              error: 'offline',
              message: 'You are offline. Please check your connection.'
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'application/json' })
            }
          );
        });
      })
    );
    return;
  }

  // Strategy 2: Static assets - Cache first, network fallback
  if (
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // Return offline placeholder
            if (url.pathname.endsWith('.png') ||
                url.pathname.endsWith('.jpg') ||
                url.pathname.endsWith('.jpeg')) {
              // Return transparent pixel for images
              return new Response(
                new Uint8Array([
                  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00,
                  0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01,
                  0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
                  0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
                  0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00,
                  0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
                  0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
                ]),
                {
                  status: 200,
                  headers: new Headers({ 'Content-Type': 'image/png' })
                }
              );
            }
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
    );
    return;
  }

  // Strategy 3: HTML pages - Network first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cached version
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Return cached home page as fallback
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
          return new Response('Offline - Page not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});

/**
 * Message Event - Handle messages from clients
 */
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);

  // Handle skip waiting message
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Handle cache clear message
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      ).then(() => {
        console.log('Service Worker: All caches cleared');
        event.ports[0].postMessage({ success: true });
      });
    });
  }
});

/**
 * Sync Event - Sync data when back online (optional)
 * Requires the browser to support Background Sync API
 */
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Sync event -', event.tag);

  if (event.tag === 'sync-leads') {
    event.waitUntil(
      // Retry failed lead submissions
      fetch('/api/leads/sync', { method: 'POST' })
        .then(() => {
          console.log('Service Worker: Leads synced successfully');
        })
        .catch((error) => {
          console.error('Service Worker: Sync failed', error);
          // Retry will be attempted by the browser
          throw error;
        })
    );
  }
});

/**
 * Push Event - Handle push notifications (optional)
 * Requires notification permissions from user
 */
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');

  if (event.data) {
    let notificationData;
    try {
      notificationData = event.data.json();
    } catch (e) {
      notificationData = {
        title: 'Serene Vibes Kashmir',
        body: event.data.text()
      };
    }

    event.waitUntil(
      self.registration.showNotification(notificationData.title || 'Serene Vibes Kashmir', {
        body: notificationData.body || 'New notification from Serene Vibes',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'serene-vibes-notification',
        ...notificationData
      })
    );
  }
});

/**
 * Notification Click Event - Handle user clicking on notifications
 */
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);

  event.notification.close();

  // Open app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If app is already open, focus it
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

console.log('Service Worker loaded and ready');
