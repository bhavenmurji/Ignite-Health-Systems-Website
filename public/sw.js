const CACHE_NAME = 'ignite-health-v1'
const STATIC_ASSETS = [
  '/',
  '/assets/images/IgniteARevolution.png',
  '/assets/images/BhavenMurjiNeedsACoFounder.png',
  '/assets/images/NeuralNetwork.png',
  '/assets/audio/backing-music-compressed.mp3'
]

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return

  // Skip chrome-extension and non-http requests
  if (!event.request.url.startsWith('http')) return

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(event.request).then(fetchResponse => {
        // Don't cache non-successful responses
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse
        }

        // Clone the response
        const responseToCache = fetchResponse.clone()

        // Add to cache for future requests
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache)
        })

        return fetchResponse
      })
    }).catch(() => {
      // Return offline fallback for navigation requests
      if (event.request.mode === 'navigate') {
        return caches.match('/')
      }
    })
  )
})