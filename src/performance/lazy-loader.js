/**
 * Advanced Lazy Loading System - Ignite Health Systems
 * Intelligent resource loading with performance optimization
 */

class IgniteLazyLoader {
    constructor() {
        this.config = {
            imageQuality: 'auto', // auto, high, medium, low
            loadingStrategy: 'viewport', // viewport, hover, interaction
            preloadCritical: true,
            enableWebP: true,
            enableProgressiveLoading: true,
            intersectionMargin: '50px',
            batchSize: 3,
            priorityThreshold: 0.1
        };

        this.state = {
            loadedResources: new Set(),
            loadingQueue: [],
            preloadQueue: [],
            isProcessing: false,
            connectionSpeed: 'fast',
            dataMode: false
        };

        this.observers = {
            intersection: null,
            performance: null
        };

        this.initialize();
    }

    initialize() {
        this.detectConnection();
        this.setupIntersectionObserver();
        this.setupPerformanceObserver();
        this.preloadCriticalResources();
        this.setupEventListeners();
        this.createProgressiveImageLoader();
    }

    detectConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.state.connectionSpeed = connection.effectiveType;
            this.state.dataMode = connection.saveData;

            // Adjust quality based on connection
            if (this.state.dataMode || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.config.imageQuality = 'low';
                this.config.batchSize = 1;
            } else if (connection.effectiveType === '3g') {
                this.config.imageQuality = 'medium';
                this.config.batchSize = 2;
            }

            // Listen for connection changes
            connection.addEventListener('change', () => {
                this.detectConnection();
            });
        }
    }

    setupIntersectionObserver() {
        const options = {
            rootMargin: this.config.intersectionMargin,
            threshold: [0, this.config.priorityThreshold, 0.5, 1]
        };

        this.observers.intersection = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const priority = this.calculatePriority(entry);
                    this.queueResource(entry.target, priority);
                }
            });
        }, options);

        // Observe lazy loadable elements
        this.observeLazyElements();
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            this.observers.performance = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.entryType === 'resource') {
                        this.trackResourceTiming(entry);
                    }
                });
            });

            this.observers.performance.observe({ entryTypes: ['resource'] });
        }
    }

    observeLazyElements() {
        // Images
        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            this.observers.intersection.observe(img);
        });

        // Background images
        document.querySelectorAll('[data-bg]').forEach(el => {
            this.observers.intersection.observe(el);
        });

        // Iframes
        document.querySelectorAll('iframe[data-src]').forEach(iframe => {
            this.observers.intersection.observe(iframe);
        });

        // Scripts
        document.querySelectorAll('script[data-src]').forEach(script => {
            this.observers.intersection.observe(script);
        });

        // Stylesheets
        document.querySelectorAll('link[data-href]').forEach(link => {
            this.observers.intersection.observe(link);
        });
    }

    calculatePriority(entry) {
        const { intersectionRatio, target } = entry;
        
        // Base priority on visibility
        let priority = intersectionRatio;

        // Boost priority for critical elements
        if (target.classList.contains('critical') || target.dataset.priority === 'high') {
            priority += 0.5;
        }

        // Boost priority for above-the-fold content
        if (entry.boundingClientRect.top < window.innerHeight) {
            priority += 0.3;
        }

        // Reduce priority for decorative elements
        if (target.classList.contains('decorative') || target.dataset.priority === 'low') {
            priority -= 0.3;
        }

        return Math.min(1, Math.max(0, priority));
    }

    queueResource(element, priority = 0.5) {
        if (this.state.loadedResources.has(element)) return;

        const resource = {
            element,
            priority,
            type: this.getResourceType(element),
            timestamp: performance.now()
        };

        // Insert in priority order
        const insertIndex = this.state.loadingQueue.findIndex(r => r.priority < priority);
        if (insertIndex === -1) {
            this.state.loadingQueue.push(resource);
        } else {
            this.state.loadingQueue.splice(insertIndex, 0, resource);
        }

        this.processQueue();
    }

    async processQueue() {
        if (this.state.isProcessing || this.state.loadingQueue.length === 0) return;

        this.state.isProcessing = true;

        try {
            // Process resources in batches
            while (this.state.loadingQueue.length > 0) {
                const batch = this.state.loadingQueue.splice(0, this.config.batchSize);
                
                // Load batch in parallel
                await Promise.all(batch.map(resource => this.loadResource(resource)));

                // Small delay between batches to prevent overwhelming
                await this.delay(50);
            }
        } finally {
            this.state.isProcessing = false;
        }
    }

    async loadResource(resource) {
        const { element, type } = resource;

        try {
            switch (type) {
                case 'image':
                    await this.loadImage(element);
                    break;
                case 'background':
                    await this.loadBackgroundImage(element);
                    break;
                case 'iframe':
                    this.loadIframe(element);
                    break;
                case 'script':
                    await this.loadScript(element);
                    break;
                case 'stylesheet':
                    await this.loadStylesheet(element);
                    break;
            }

            this.state.loadedResources.add(element);
            this.markAsLoaded(element);
        } catch (error) {
            console.warn('Failed to load resource:', error);
            this.handleLoadError(element, error);
        }
    }

    async loadImage(img) {
        const src = img.dataset.src || img.src;
        if (!src) return;

        // Create progressive loading placeholder
        if (this.config.enableProgressiveLoading && !img.style.backgroundColor) {
            img.style.backgroundColor = '#f0f0f0';
            img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
            img.style.backgroundSize = '200% 100%';
            img.style.animation = 'loading-shimmer 1.5s infinite';
        }

        // Try WebP format if supported
        let finalSrc = src;
        if (this.config.enableWebP && this.supportsWebP()) {
            finalSrc = this.convertToWebP(src);
        }

        // Apply quality optimization
        finalSrc = this.optimizeImageQuality(finalSrc);

        return new Promise((resolve, reject) => {
            const tempImg = new Image();
            
            tempImg.onload = () => {
                img.src = finalSrc;
                img.removeAttribute('data-src');
                
                // Remove progressive loading styles
                img.style.backgroundColor = '';
                img.style.background = '';
                img.style.animation = '';
                
                // Add fade-in effect
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease-in-out';
                
                requestAnimationFrame(() => {
                    img.style.opacity = '1';
                });

                resolve();
            };

            tempImg.onerror = reject;
            tempImg.src = finalSrc;
        });
    }

    async loadBackgroundImage(element) {
        const src = element.dataset.bg;
        if (!src) return;

        let optimizedSrc = src;
        if (this.config.enableWebP && this.supportsWebP()) {
            optimizedSrc = this.convertToWebP(src);
        }
        optimizedSrc = this.optimizeImageQuality(optimizedSrc);

        return new Promise((resolve, reject) => {
            const tempImg = new Image();
            
            tempImg.onload = () => {
                element.style.backgroundImage = `url(${optimizedSrc})`;
                element.removeAttribute('data-bg');
                
                // Add fade-in effect
                element.style.opacity = '0';
                element.style.transition = 'opacity 0.4s ease-in-out';
                
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                });

                resolve();
            };

            tempImg.onerror = reject;
            tempImg.src = optimizedSrc;
        });
    }

    loadIframe(iframe) {
        const src = iframe.dataset.src;
        if (!src) return;

        iframe.src = src;
        iframe.removeAttribute('data-src');
    }

    async loadScript(script) {
        const src = script.dataset.src;
        if (!src) return;

        return new Promise((resolve, reject) => {
            const newScript = document.createElement('script');
            newScript.src = src;
            newScript.async = true;
            
            newScript.onload = resolve;
            newScript.onerror = reject;
            
            document.head.appendChild(newScript);
            script.remove();
        });
    }

    async loadStylesheet(link) {
        const href = link.dataset.href;
        if (!href) return;

        return new Promise((resolve, reject) => {
            const newLink = document.createElement('link');
            newLink.rel = 'stylesheet';
            newLink.href = href;
            
            newLink.onload = resolve;
            newLink.onerror = reject;
            
            document.head.appendChild(newLink);
            link.remove();
        });
    }

    preloadCriticalResources() {
        if (!this.config.preloadCritical) return;

        const criticalImages = [
            'assets/images/Ignite Logo.png',
            'assets/images/NeuralNetwork.png'
        ];

        criticalImages.forEach(src => {
            if (!this.state.loadedResources.has(src)) {
                this.preloadImage(src);
            }
        });
    }

    preloadImage(src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    }

    getResourceType(element) {
        if (element.tagName === 'IMG' || element.hasAttribute('data-src')) {
            return 'image';
        } else if (element.hasAttribute('data-bg')) {
            return 'background';
        } else if (element.tagName === 'IFRAME') {
            return 'iframe';
        } else if (element.tagName === 'SCRIPT') {
            return 'script';
        } else if (element.tagName === 'LINK') {
            return 'stylesheet';
        }
        return 'unknown';
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
    }

    convertToWebP(src) {
        // Simple conversion - in real implementation, this would be server-side
        if (src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png')) {
            return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }
        return src;
    }

    optimizeImageQuality(src) {
        const quality = this.config.imageQuality;
        
        if (quality === 'auto') return src;
        
        // Add quality parameters - this would typically be handled server-side
        const separator = src.includes('?') ? '&' : '?';
        
        switch (quality) {
            case 'low':
                return `${src}${separator}q=60&w=800`;
            case 'medium':
                return `${src}${separator}q=75&w=1200`;
            case 'high':
                return `${src}${separator}q=90&w=1920`;
            default:
                return src;
        }
    }

    createProgressiveImageLoader() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes loading-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .lazy-loading {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 1.5s infinite;
            }
            
            .lazy-loaded {
                animation: none;
                background: none;
            }
        `;
        document.head.appendChild(style);
    }

    markAsLoaded(element) {
        element.classList.remove('lazy-loading');
        element.classList.add('lazy-loaded');
        
        // Dispatch custom event
        element.dispatchEvent(new CustomEvent('lazyloaded', {
            detail: { timestamp: performance.now() }
        }));
    }

    handleLoadError(element, error) {
        element.classList.add('lazy-error');
        
        // Provide fallback for images
        if (element.tagName === 'IMG') {
            element.alt = element.alt || 'Image failed to load';
            element.style.backgroundColor = '#f5f5f5';
            element.style.color = '#999';
            element.style.display = 'flex';
            element.style.alignItems = 'center';
            element.style.justifyContent = 'center';
            element.style.fontSize = '14px';
        }
    }

    trackResourceTiming(entry) {
        const loadTime = entry.responseEnd - entry.requestStart;
        
        // Adjust loading strategy based on performance
        if (loadTime > 1000) {
            this.config.batchSize = Math.max(1, this.config.batchSize - 1);
        } else if (loadTime < 200) {
            this.config.batchSize = Math.min(5, this.config.batchSize + 1);
        }
    }

    setupEventListeners() {
        // Preload on hover for interactive loading strategy
        if (this.config.loadingStrategy === 'hover') {
            document.addEventListener('mouseover', (e) => {
                const lazyElement = e.target.closest('[data-src], [data-bg], [data-href]');
                if (lazyElement && !this.state.loadedResources.has(lazyElement)) {
                    this.queueResource(lazyElement, 0.8);
                }
            }, { passive: true });
        }

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause loading when tab is hidden
                this.state.loadingQueue = [];
                this.state.isProcessing = false;
            }
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Public API
    loadElement(element, priority = 0.5) {
        this.queueResource(element, priority);
    }

    preload(src) {
        this.preloadImage(src);
    }

    setQuality(quality) {
        this.config.imageQuality = quality;
    }

    setBatchSize(size) {
        this.config.batchSize = Math.max(1, Math.min(10, size));
    }

    getStats() {
        return {
            loadedResources: this.state.loadedResources.size,
            queueLength: this.state.loadingQueue.length,
            connectionSpeed: this.state.connectionSpeed,
            dataMode: this.state.dataMode,
            imageQuality: this.config.imageQuality,
            batchSize: this.config.batchSize
        };
    }
}

// Initialize lazy loader
const lazyLoader = new IgniteLazyLoader();

// Export for external use
window.IgniteLazyLoader = lazyLoader;

export default lazyLoader;