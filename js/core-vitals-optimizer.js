/**
 * Ignite Health Systems - Core Web Vitals Optimizer
 * Advanced optimizations for LCP, FID, and CLS
 */

(function() {
    'use strict';

    // Configuration for optimizations
    const config = {
        enableLazyLoading: true,
        enablePreloading: true,
        enableResourceHints: true,
        enableImageOptimization: true,
        enableLayoutStabilization: true,
        enableCriticalPath: true
    };

    // Metrics tracking
    const metrics = {
        lcp: null,
        fid: null,
        cls: null,
        optimizationsApplied: 0
    };

    /**
     * Initialize Core Web Vitals optimizations
     */
    function init() {
        optimizeLCP();
        optimizeFID();
        optimizeCLS();
        implementLazyLoading();
        stabilizeLayout();
        optimizeCriticalPath();
        monitorMetrics();
    }

    /**
     * Optimize Largest Contentful Paint (LCP)
     */
    function optimizeLCP() {
        if (!config.enablePreloading) return;

        // Preload critical resources
        const criticalResources = [
            'assets/images/Ignite Logo.png',
            'assets/images/NeuralNetwork.png',
            'assets/images/IgniteARevolution.png',
            'css/style.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            
            if (resource.endsWith('.css')) {
                link.as = 'style';
            } else if (resource.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
                link.as = 'image';
            }
            
            link.href = resource;
            document.head.appendChild(link);
        });

        // Optimize hero image loading
        const heroImage = document.querySelector('.hero img, .hero-image img');
        if (heroImage && !heroImage.complete) {
            heroImage.setAttribute('fetchpriority', 'high');
            heroImage.setAttribute('loading', 'eager');
        }

        metrics.optimizationsApplied++;
    }

    /**
     * Optimize First Input Delay (FID)
     */
    function optimizeFID() {
        // Break up long tasks using setTimeout
        function yieldToMain() {
            return new Promise(resolve => {
                setTimeout(resolve, 0);
            });
        }

        // Optimize heavy computations
        window.optimizeTask = async function(callback) {
            const start = performance.now();
            await callback();
            
            if (performance.now() - start > 50) {
                await yieldToMain();
            }
        };

        // Defer non-critical JavaScript
        const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
        nonCriticalScripts.forEach(script => {
            if (!script.defer && !script.async) {
                script.defer = true;
            }
        });

        // Use requestIdleCallback for non-urgent tasks
        if ('requestIdleCallback' in window) {
            window.scheduleTask = function(callback, options = {}) {
                requestIdleCallback(callback, {
                    timeout: options.timeout || 5000
                });
            };
        } else {
            // Fallback for browsers without requestIdleCallback
            window.scheduleTask = function(callback) {
                setTimeout(callback, 0);
            };
        }

        metrics.optimizationsApplied++;
    }

    /**
     * Optimize Cumulative Layout Shift (CLS)
     */
    function optimizeCLS() {
        if (!config.enableLayoutStabilization) return;

        // Reserve space for images
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            if (!img.style.aspectRatio && !img.style.width && !img.style.height) {
                // Set default aspect ratio to prevent layout shift
                img.style.aspectRatio = '16/9';
                img.style.width = '100%';
                img.style.height = 'auto';
            }
        });

        // Reserve space for dynamically loaded content
        const dynamicElements = document.querySelectorAll('[data-dynamic]');
        dynamicElements.forEach(element => {
            if (!element.style.minHeight) {
                element.style.minHeight = '200px';
                element.style.backgroundColor = '#f8f9fa';
                element.style.borderRadius = '8px';
                element.classList.add('loading-placeholder');
            }
        });

        // Predefine animation start states
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        });

        // Use transform instead of changing layout properties
        const style = document.createElement('style');
        style.textContent = `
            .layout-safe-animation {
                transition: transform 0.3s ease, opacity 0.3s ease !important;
            }
            
            .loading-placeholder {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 1.5s infinite;
            }
            
            @keyframes loading-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);

        metrics.optimizationsApplied++;
    }

    /**
     * Implement advanced lazy loading
     */
    function implementLazyLoading() {
        if (!config.enableLazyLoading || !('IntersectionObserver' in window)) return;

        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    img.classList.add('loaded');
                    lazyLoadObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        lazyImages.forEach(img => lazyLoadObserver.observe(img));

        // Lazy load background images
        const lazyBackgrounds = document.querySelectorAll('[data-bg]');
        lazyBackgrounds.forEach(element => {
            lazyLoadObserver.observe(element);
        });

        metrics.optimizationsApplied++;
    }

    /**
     * Stabilize layout during loading
     */
    function stabilizeLayout() {
        // Add skeleton loaders for content areas
        const contentAreas = document.querySelectorAll('.feature-card, .testimonial-card, .problem-card');
        contentAreas.forEach(card => {
            if (!card.querySelector('.skeleton-loader')) {
                const skeleton = document.createElement('div');
                skeleton.className = 'skeleton-loader';
                skeleton.innerHTML = `
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                    <div class="skeleton-line"></div>
                `;
                card.appendChild(skeleton);
                
                // Remove skeleton when content is loaded
                const img = card.querySelector('img');
                if (img) {
                    img.addEventListener('load', () => {
                        skeleton.remove();
                    });
                }
            }
        });

        // Add skeleton styles
        const skeletonStyles = document.createElement('style');
        skeletonStyles.textContent = `
            .skeleton-loader {
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 8px;
                margin: 1rem 0;
            }
            
            .skeleton-line {
                height: 12px;
                background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
                background-size: 200% 100%;
                animation: skeleton-shimmer 1.5s infinite;
                border-radius: 6px;
                margin: 8px 0;
            }
            
            .skeleton-line.short {
                width: 60%;
            }
            
            @keyframes skeleton-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(skeletonStyles);

        metrics.optimizationsApplied++;
    }

    /**
     * Optimize critical rendering path
     */
    function optimizeCriticalPath() {
        if (!config.enableCriticalPath) return;

        // Inline critical CSS for above-the-fold content
        const criticalCSS = `
            .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
            .navbar { position: fixed; top: 0; width: 100%; z-index: 1000; }
            .fire-text { color: #ff6b35; }
            .btn-primary { background: #ff6b35; color: white; padding: 12px 24px; border-radius: 6px; }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);

        // Preconnect to external domains
        const preconnectDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Resource hints for performance
        if (config.enableResourceHints) {
            const resourceHints = [
                { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
                { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
                { rel: 'prefetch', href: '/join.html' },
                { rel: 'prefetch', href: '/platform.html' }
            ];

            resourceHints.forEach(hint => {
                const link = document.createElement('link');
                link.rel = hint.rel;
                link.href = hint.href;
                document.head.appendChild(link);
            });
        }

        metrics.optimizationsApplied++;
    }

    /**
     * Monitor Core Web Vitals metrics
     */
    function monitorMetrics() {
        if (!window.PerformanceObserver) return;

        // Monitor LCP
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            metrics.lcp = lastEntry.startTime;
        });

        try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP monitoring not supported');
        }

        // Monitor FID
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                metrics.fid = entry.processingStart - entry.startTime;
            });
        });

        try {
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.log('FID monitoring not supported');
        }

        // Monitor CLS
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            metrics.cls = clsValue;
        });

        try {
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.log('CLS monitoring not supported');
        }
    }

    /**
     * Get current metrics
     */
    function getMetrics() {
        return {
            ...metrics,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Generate performance report
     */
    function generateReport() {
        const report = {
            metrics: getMetrics(),
            optimizations: metrics.optimizationsApplied,
            recommendations: []
        };

        // Add recommendations based on metrics
        if (metrics.lcp > 2500) {
            report.recommendations.push('Consider optimizing images and critical resources for better LCP');
        }

        if (metrics.fid > 100) {
            report.recommendations.push('Break up long JavaScript tasks to improve FID');
        }

        if (metrics.cls > 0.1) {
            report.recommendations.push('Add size attributes to images and reserve space for dynamic content');
        }

        return report;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.IgniteCoreVitals = {
        getMetrics,
        generateReport,
        config
    };

})();