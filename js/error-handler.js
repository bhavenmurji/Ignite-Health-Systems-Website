/**
 * Ignite Health Systems - Global Error Handler
 * Comprehensive error handling and recovery system
 */

(function() {
    'use strict';

    // Error tracking configuration
    const config = {
        enableLogging: true,
        enableRecovery: true,
        enableFallbacks: true,
        maxRetries: 3,
        retryDelay: 1000
    };

    // Error statistics
    const errorStats = {
        scriptErrors: 0,
        resourceErrors: 0,
        networkErrors: 0,
        recoveryAttempts: 0,
        successfulRecoveries: 0
    };

    /**
     * Initialize global error handling
     */
    function init() {
        setupGlobalErrorHandlers();
        setupResourceErrorHandling();
        setupNetworkErrorHandling();
        setupPerformanceMonitoring();
        implementFallbackStrategies();
        startErrorReporting();
    }

    /**
     * Setup global JavaScript error handlers
     */
    function setupGlobalErrorHandlers() {
        // Global error handler for JavaScript errors
        window.addEventListener('error', function(event) {
            errorStats.scriptErrors++;
            
            const errorInfo = {
                type: 'script_error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            logError(errorInfo);
            attemptErrorRecovery(errorInfo);
        });

        // Global handler for unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            errorStats.networkErrors++;
            
            const errorInfo = {
                type: 'promise_rejection',
                reason: event.reason,
                timestamp: new Date().toISOString(),
                url: window.location.href
            };

            logError(errorInfo);
            
            // Prevent the default browser behavior
            event.preventDefault();
        });
    }

    /**
     * Setup resource loading error handling
     */
    function setupResourceErrorHandling() {
        window.addEventListener('error', function(event) {
            if (event.target !== window) {
                errorStats.resourceErrors++;
                
                const errorInfo = {
                    type: 'resource_error',
                    element: event.target.tagName,
                    source: event.target.src || event.target.href,
                    timestamp: new Date().toISOString()
                };

                logError(errorInfo);
                handleResourceError(event.target, errorInfo);
            }
        }, true);
    }

    /**
     * Setup network error handling
     */
    function setupNetworkErrorHandling() {
        // Override fetch to add error handling
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args)
                .catch(error => {
                    errorStats.networkErrors++;
                    
                    const errorInfo = {
                        type: 'network_error',
                        url: args[0],
                        error: error.message,
                        timestamp: new Date().toISOString()
                    };

                    logError(errorInfo);
                    throw error;
                });
        };
    }

    /**
     * Setup performance monitoring for error detection
     */
    function setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Monitor long tasks that might indicate problems
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        logError({
                            type: 'performance_issue',
                            name: entry.name,
                            duration: entry.duration,
                            startTime: entry.startTime,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            });

            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                console.log('Long task observer not supported');
            }
        }
    }

    /**
     * Handle resource loading errors with fallbacks
     */
    function handleResourceError(element, errorInfo) {
        errorStats.recoveryAttempts++;

        switch (element.tagName.toLowerCase()) {
            case 'img':
                handleImageError(element);
                break;
            case 'script':
                handleScriptError(element);
                break;
            case 'link':
                handleStylesheetError(element);
                break;
            default:
                console.warn('Unknown resource error:', errorInfo);
        }
    }

    /**
     * Handle image loading errors
     */
    function handleImageError(img) {
        if (!img.dataset.errorHandled) {
            img.dataset.errorHandled = 'true';
            
            // Try fallback images
            const fallbacks = [
                'assets/images/Ignite Logo.png',
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlPC90ZXh0Pjwvc3ZnPg=='
            ];

            let currentFallback = 0;
            
            function tryNextFallback() {
                if (currentFallback < fallbacks.length) {
                    img.src = fallbacks[currentFallback];
                    currentFallback++;
                    
                    img.onerror = tryNextFallback;
                    img.onload = function() {
                        errorStats.successfulRecoveries++;
                        img.onerror = null;
                        img.onload = null;
                    };
                } else {
                    // Hide the image if all fallbacks fail
                    img.style.display = 'none';
                    img.parentNode.classList.add('image-failed');
                }
            }

            tryNextFallback();
        }
    }

    /**
     * Handle script loading errors
     */
    function handleScriptError(script) {
        if (!script.dataset.errorHandled) {
            script.dataset.errorHandled = 'true';
            
            const src = script.src;
            console.warn(`Script failed to load: ${src}`);
            
            // Try to load from CDN or alternative source
            if (src.includes('local') && !src.includes('cdn')) {
                const newScript = document.createElement('script');
                newScript.src = src.replace('local', 'cdn');
                newScript.onerror = function() {
                    console.error(`Fallback script also failed: ${this.src}`);
                };
                newScript.onload = function() {
                    errorStats.successfulRecoveries++;
                };
                document.head.appendChild(newScript);
            }
        }
    }

    /**
     * Handle stylesheet loading errors
     */
    function handleStylesheetError(link) {
        if (!link.dataset.errorHandled && link.rel === 'stylesheet') {
            link.dataset.errorHandled = 'true';
            
            // Apply minimal inline styles as fallback
            const fallbackCSS = `
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .container { max-width: 1200px; margin: 0 auto; }
                .btn { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; }
                .hero { text-align: center; padding: 50px 0; }
            `;
            
            const style = document.createElement('style');
            style.textContent = fallbackCSS;
            document.head.appendChild(style);
            
            errorStats.successfulRecoveries++;
        }
    }

    /**
     * Attempt automatic error recovery
     */
    function attemptErrorRecovery(errorInfo) {
        if (!config.enableRecovery) return;

        errorStats.recoveryAttempts++;

        switch (errorInfo.type) {
            case 'script_error':
                // Attempt to reload critical scripts
                if (errorInfo.filename && errorInfo.filename.includes('critical')) {
                    setTimeout(() => {
                        const script = document.createElement('script');
                        script.src = errorInfo.filename;
                        script.onload = () => errorStats.successfulRecoveries++;
                        document.head.appendChild(script);
                    }, config.retryDelay);
                }
                break;
                
            case 'resource_error':
                // Already handled in handleResourceError
                break;
                
            default:
                console.log('No recovery strategy for:', errorInfo.type);
        }
    }

    /**
     * Implement fallback strategies for critical features
     */
    function implementFallbackStrategies() {
        // Fire theme fallback
        if (!document.querySelector('.fire-gradient')) {
            const style = document.createElement('style');
            style.textContent = `
                .fire-text { color: #ff6b35 !important; }
                .fire-gradient { background: linear-gradient(45deg, #ff6b35, #ff4757) !important; }
                .fire-particle { display: none !important; }
            `;
            document.head.appendChild(style);
        }

        // Animation fallback for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }

        // PWA fallback
        if (!('serviceWorker' in navigator)) {
            console.log('Service Worker not supported, implementing basic caching');
            implementBasicCaching();
        }
    }

    /**
     * Implement basic caching for browsers without service worker support
     */
    function implementBasicCaching() {
        // Use localStorage for basic caching
        const cache = {
            set: function(key, value, ttl = 3600000) { // 1 hour default
                const item = {
                    value: value,
                    expiry: new Date().getTime() + ttl
                };
                localStorage.setItem('ignite_cache_' + key, JSON.stringify(item));
            },
            
            get: function(key) {
                const itemStr = localStorage.getItem('ignite_cache_' + key);
                if (!itemStr) return null;
                
                const item = JSON.parse(itemStr);
                if (new Date().getTime() > item.expiry) {
                    localStorage.removeItem('ignite_cache_' + key);
                    return null;
                }
                return item.value;
            }
        };

        window.IgniteCache = cache;
    }

    /**
     * Start error reporting
     */
    function startErrorReporting() {
        if (!config.enableLogging) return;

        // Report errors every 30 seconds
        setInterval(() => {
            if (Object.values(errorStats).some(val => val > 0)) {
                console.group('🔥 Ignite Health Error Report');
                console.table(errorStats);
                console.log('Recovery Rate:', 
                    errorStats.recoveryAttempts > 0 
                        ? Math.round((errorStats.successfulRecoveries / errorStats.recoveryAttempts) * 100) + '%'
                        : 'N/A'
                );
                console.groupEnd();
                
                // Reset stats
                Object.keys(errorStats).forEach(key => errorStats[key] = 0);
            }
        }, 30000);
    }

    /**
     * Log error information
     */
    function logError(errorInfo) {
        if (!config.enableLogging) return;

        console.group('🚨 Error Detected');
        console.error('Type:', errorInfo.type);
        console.error('Details:', errorInfo);
        console.groupEnd();

        // Store in performance monitoring if available
        if (window.IgnitePerformance && window.IgnitePerformance.logError) {
            window.IgnitePerformance.logError(errorInfo);
        }
    }

    /**
     * Public API for manual error reporting
     */
    function reportError(message, context = {}) {
        const errorInfo = {
            type: 'manual_error',
            message: message,
            context: context,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        logError(errorInfo);
    }

    /**
     * Get error statistics
     */
    function getErrorStats() {
        return { ...errorStats };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.IgniteErrorHandler = {
        reportError,
        getErrorStats,
        config
    };

})();