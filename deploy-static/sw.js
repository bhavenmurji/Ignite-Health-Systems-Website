/**
 * Ignite Health Systems - Service Worker
 * Progressive Web App offline functionality and caching
 */

const CACHE_NAME = 'ignite-health-v1.0.0';
const STATIC_CACHE = 'ignite-static-v1';
const DYNAMIC_CACHE = 'ignite-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/performance-enhancements.css',
    '/js/animations.js',
    '/js/intro.js',
    '/js/performance-monitor.js',
    '/js/mobile-optimizations.js',
    '/js/pwa-installer.js',
    '/assets/images/Ignite Logo.png',
    '/assets/images/NeuralNetwork.png',
    '/assets/images/IgniteARevolution.png'
];

// Routes to cache dynamically
const DYNAMIC_ROUTES = [
    '/join.html',
    '/platform.html',
    '/about.html',
    '/contact.html'
];

/**
 * Service Worker Install Event
 */
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
                    cache: 'reload'
                })));
            }),
            
            // Preload critical routes
            caches.open(DYNAMIC_CACHE).then((cache) => {
                console.log('Service Worker: Preloading dynamic routes');
                return Promise.all(
                    DYNAMIC_ROUTES.map(url => 
                        fetch(url, { cache: 'reload' })
                            .then(response => response.ok ? cache.put(url, response) : null)
                            .catch(() => console.log(`Failed to preload: ${url}`))
                    )
                );
            })
        ]).then(() => {
            console.log('Service Worker: Installation complete');
            return self.skipWaiting();
        })
    );
});

/**
 * Service Worker Activate Event
 */
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all open pages
            self.clients.claim()
        ]).then(() => {
            console.log('Service Worker: Activation complete');
        })
    );
});

/**
 * Service Worker Fetch Event - Cache Strategy
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) return;
    
    event.respondWith(handleFetch(request));
});

/**
 * Handle fetch requests with appropriate caching strategy
 */
async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache First for static assets
        if (isStaticAsset(url.pathname)) {
            return await cacheFirst(request);
        }
        
        // Strategy 2: Network First for HTML pages
        if (isHTMLPage(url.pathname)) {
            return await networkFirst(request);
        }
        
        // Strategy 3: Stale While Revalidate for API calls
        if (isAPICall(url.pathname)) {
            return await staleWhileRevalidate(request);
        }
        
        // Strategy 4: Network First for everything else
        return await networkFirst(request);
        
    } catch (error) {
        console.error('Service Worker: Fetch error', error);
        
        // Return fallback for navigation requests
        if (request.mode === 'navigate') {
            const cachedResponse = await caches.match('/index.html');
            return cachedResponse || new Response('Offline', { status: 503 });
        }
        
        return new Response('Network Error', { status: 503 });
    }
}

/**
 * Cache First Strategy - for static assets
 */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

/**
 * Network First Strategy - for HTML pages
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

/**
 * Stale While Revalidate Strategy - for API calls
 */
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(request, networkResponse.clone()));
        }
        return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
}

/**
 * Background Sync for form submissions
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(handleBackgroundSync());
    }
});

/**
 * Handle background sync
 */
async function handleBackgroundSync() {
    // Get pending requests from IndexedDB
    const pendingRequests = await getPendingRequests();
    
    for (const request of pendingRequests) {
        try {
            await fetch(request.url, {
                method: request.method,
                headers: request.headers,
                body: request.body
            });
            
            // Remove from pending requests
            await removePendingRequest(request.id);
        } catch (error) {
            console.log('Background sync failed for:', request.url);
        }
    }
}

/**
 * Push notification handler
 */
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body || 'New update available',
        icon: '/assets/images/Ignite Logo.png',
        badge: '/assets/images/Ignite Logo.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: data.actions || [],
        requireInteraction: data.requireInteraction || false
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Ignite Health', options)
    );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clients) => {
                // Check if there's already a window/tab open with the target URL
                for (const client of clients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // If not, open a new window/tab
                if (self.clients.openWindow) {
                    return self.clients.openWindow(urlToOpen);
                }
            })
    );
});

/**
 * Utility functions
 */
function isStaticAsset(pathname) {
    return /\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/i.test(pathname);
}

function isHTMLPage(pathname) {
    return pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.');
}

function isAPICall(pathname) {
    return pathname.startsWith('/api/') || pathname.startsWith('/graphql');
}

/**
 * IndexedDB helpers for background sync
 */
async function getPendingRequests() {
    // Simple implementation - in production, use IndexedDB
    return [];
}

async function removePendingRequest(id) {
    // Simple implementation - in production, use IndexedDB
    return Promise.resolve();
}

/**
 * Performance monitoring integration
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
        // Handle performance data from main thread
        console.log('Service Worker: Performance data received', event.data.metrics);
    }
});

console.log('Service Worker: Loaded successfully');