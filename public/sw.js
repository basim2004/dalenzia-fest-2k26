// DALENZIA FEST 2K26 - OFFICIAL SERVICE WORKER
const CACHE_NAME = 'dalenzia-fest-v2k26-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/apple-touch-icon.png',
  '/assets/dalenzia_fest_logo.png',
  '/assets/nueva_era_logo.png'
];

// Install: precache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Precache partial error:', err);
      });
    })
  );
  // Do not automatically skip waiting so existing sessions are not abruptly broken;
  // skipWaiting is called when user selects "Update"
});

// Activate: clean up older caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Clearing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Listen for message from app (e.g. user clicked Update button)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Helper to determine if request is sensitive Firebase or API
function isBypassedRequest(url) {
  const href = url.href.toLowerCase();
  return (
    href.includes('googleapis.com') ||
    href.includes('firebaseio.com') ||
    href.includes('firestore') ||
    href.includes('identitytoolkit') ||
    href.includes('securetoken') ||
    href.includes('chrome-extension') ||
    href.includes('/api/') ||
    url.protocol === 'chrome-extension:'
  );
}

// Fetch: Appropriate caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. NEVER cache Firebase Authentication, Firestore, or analytics requests
  if (isBypassedRequest(url)) {
    return;
  }

  // 2. Navigation requests (HTML pages): Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/index.html') || caches.match(request);
        })
    );
    return;
  }

  // 3. Static assets (JS, CSS, images, fonts): Stale-while-revalidate for local assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Network failed, nothing extra to do
        });

        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Other external GET requests (e.g., Google Fonts): Network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
