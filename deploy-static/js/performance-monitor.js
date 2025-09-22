/**
 * Ignite Health Systems - Performance Monitor
 * Real-time performance tracking and Core Web Vitals optimization
 */

(function() {
    'use strict';

    // Performance configuration
    const config = {
        enableMetrics: true,
        enableOptimizations: true,
        enableDebugMode: false,
        maxMemoryUsage: 50 * 1024 * 1024, // 50MB
        imageQuality: 0.8,
        lazyLoadThreshold: 100
    };

    // Performance metrics storage
    const metrics = {
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
        loadTime: null,
        memoryUsage: null
    };

    // Initialize performance monitoring
    function init() {
        if (!config.enableMetrics) return;

        measureCoreWebVitals();
        optimizeImages();
        implementLazyLoading();
        monitorMemoryUsage();
        optimizeAssetLoading();
        handleConnectionSpeed();
        setupErrorHandling();
        
        if (config.enableDebugMode) {
            createPerformanceIndicator();
            logPerformanceMetrics();
        }
    }

    /**
     * Measure Core Web Vitals
     */
    function measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                metrics.lcp = lastEntry.startTime;
                
                if (config.enableDebugMode) {
                    console.log('LCP:', metrics.lcp);
                }
                
                // Optimize if LCP is too slow
                if (metrics.lcp > 2500) {
                    optimizeLCP();
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    metrics.fid = entry.processingStart - entry.startTime;
                    
                    if (config.enableDebugMode) {
                        console.log('FID:', metrics.fid);
                    }
                    
                    // Optimize if FID is too slow
                    if (metrics.fid > 100) {
                        optimizeFID();
                    }
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                metrics.cls = clsValue;
                
                if (config.enableDebugMode) {
                    console.log('CLS:', metrics.cls);
                }
                
                // Optimize if CLS is too high
                if (metrics.cls > 0.1) {
                    optimizeCLS();
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }

        // Time to First Byte (TTFB)
        window.addEventListener('load', () => {
            const navTiming = performance.getEntriesByType('navigation')[0];
            metrics.ttfb = navTiming.responseStart - navTiming.requestStart;
            metrics.loadTime = navTiming.loadEventEnd - navTiming.navigationStart;
            
            if (config.enableDebugMode) {
                console.log('TTFB:', metrics.ttfb);
                console.log('Load Time:', metrics.loadTime);
            }
        });
    }

    /**
     * Optimize images for performance
     */
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" for better performance
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add decoding="async" for better rendering
            img.setAttribute('decoding', 'async');
            
            // Optimize image sizes based on viewport
            if (!img.hasAttribute('sizes') && img.hasAttribute('srcset')) {
                img.setAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
            }
            
            // Add error handling
            img.addEventListener('error', function() {
                console.warn('Image failed to load:', this.src);
                // Fallback to a placeholder
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
            });
            
            // Track loading
            img.addEventListener('load', function() {
                this.setAttribute('data-loaded', 'true');
                this.classList.add('loaded');
            });
        });
    }

    /**
     * Implement lazy loading for better performance
     */
    function implementLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyElements = document.querySelectorAll('[data-lazy]');
            
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        
                        // Load images
                        if (element.dataset.src) {
                            element.src = element.dataset.src;
                            element.removeAttribute('data-src');
                        }
                        
                        // Load background images
                        if (element.dataset.bgSrc) {
                            element.style.backgroundImage = `url(${element.dataset.bgSrc})`;
                            element.removeAttribute('data-bg-src');
                        }
                        
                        // Load scripts
                        if (element.dataset.script) {
                            loadScript(element.dataset.script);
                            element.removeAttribute('data-script');
                        }
                        
                        element.classList.add('lazy-loaded');
                        lazyObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: `${config.lazyLoadThreshold}px`
            });
            
            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
        }
    }

    /**
     * Monitor memory usage
     */
    function monitorMemoryUsage() {
        if ('memory' in performance) {
            const checkMemory = () => {
                const memInfo = performance.memory;
                metrics.memoryUsage = memInfo.usedJSHeapSize;
                
                if (memInfo.usedJSHeapSize > config.maxMemoryUsage) {
                    console.warn('High memory usage detected:', memInfo.usedJSHeapSize);
                    optimizeMemoryUsage();
                }
                
                if (config.enableDebugMode) {
                    console.log('Memory usage:', memInfo.usedJSHeapSize);
                }
            };
            
            // Check every 30 seconds
            setInterval(checkMemory, 30000);
            checkMemory();
        }
    }

    /**
     * Optimize asset loading
     */
    function optimizeAssetLoading() {
        // Preload critical assets
        const criticalAssets = [
            '/css/style.css',
            '/assets/images/Ignite Logo.png'
        ];
        
        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset;
            link.as = asset.endsWith('.css') ? 'style' : 'image';
            document.head.appendChild(link);
        });
        
        // Load non-critical scripts after page load
        window.addEventListener('load', () => {
            requestIdleCallback(() => {
                const nonCriticalScripts = [
                    '/js/music-player.js',
                    '/js/form-optimizer.js'
                ];
                
                nonCriticalScripts.forEach(script => {
                    loadScript(script);
                });
            });
        });
    }

    /**
     * Handle different connection speeds
     */
    function handleConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Adjust quality based on connection speed
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                config.imageQuality = 0.5;
                disableHeavyAnimations();
            } else if (connection.effectiveType === '3g') {
                config.imageQuality = 0.7;
            }
            
            // Monitor connection changes
            connection.addEventListener('change', () => {
                console.log('Connection changed:', connection.effectiveType);
                handleConnectionSpeed();
            });
        }
    }

    /**
     * Setup error handling
     */
    function setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Script error:', event.error);
            
            // Handle specific errors
            if (event.filename && event.filename.includes('music-player.js')) {
                console.log('Music player failed, continuing without audio');
            }
            
            if (event.filename && event.filename.includes('intro.js')) {
                console.log('Intro failed, hiding overlay');
                const overlay = document.getElementById('intro-overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                    document.body.style.overflow = '';
                }
            }
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            event.preventDefault();
        });
    }

    /**
     * Optimization functions
     */
    function optimizeLCP() {
        console.log('Optimizing LCP...');
        
        // Remove non-critical CSS
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        nonCriticalCSS.forEach(link => {
            link.media = 'print';
            link.onload = function() { this.media = 'all'; };
        });
        
        // Optimize images in viewport
        const heroImages = document.querySelectorAll('.hero img, .intro-logo img');
        heroImages.forEach(img => {
            img.setAttribute('fetchpriority', 'high');
        });
    }

    function optimizeFID() {
        console.log('Optimizing FID...');
        
        // Debounce expensive operations
        const expensiveOperations = ['scroll', 'resize', 'mousemove'];
        expensiveOperations.forEach(event => {
            let timeout;
            document.addEventListener(event, () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    // Perform operation
                }, 16); // ~60fps
            });
        });
    }

    function optimizeCLS() {
        console.log('Optimizing CLS...');
        
        // Add size attributes to images without them
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            img.style.aspectRatio = '16 / 9'; // Default aspect ratio
        });
        
        // Reserve space for dynamic content
        const dynamicContent = document.querySelectorAll('[data-dynamic]');
        dynamicContent.forEach(element => {
            element.style.minHeight = '100px';
        });
    }

    function optimizeMemoryUsage() {
        console.log('Optimizing memory usage...');
        
        // Clear unused event listeners
        const elements = document.querySelectorAll('[data-temp-listener]');
        elements.forEach(element => {
            element.removeAttribute('data-temp-listener');
        });
        
        // Trigger garbage collection if available
        if (window.gc) {
            window.gc();
        }
    }

    function disableHeavyAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Utility functions
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function createPerformanceIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'perf-indicator';
        indicator.title = 'Performance Status';
        document.body.appendChild(indicator);
        
        // Update indicator based on metrics
        setInterval(() => {
            let status = 'good';
            
            if (metrics.lcp > 4000 || metrics.fid > 300 || metrics.cls > 0.25) {
                status = 'error';
            } else if (metrics.lcp > 2500 || metrics.fid > 100 || metrics.cls > 0.1) {
                status = 'warning';
            }
            
            indicator.className = `perf-indicator ${status}`;
        }, 1000);
    }

    function logPerformanceMetrics() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                console.table(metrics);
            }, 3000);
        });
    }

    // Initialize performance monitoring
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for external use
    window.IgnitePerformance = {
        metrics,
        config,
        optimizeLCP,
        optimizeFID,
        optimizeCLS
    };

})();