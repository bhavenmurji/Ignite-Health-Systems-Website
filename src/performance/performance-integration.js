/**
 * Ignite Health Systems - Performance Integration System
 * Integrates animation engine, lazy loader, and optimizes existing systems
 * Author: Performance Engineering Team
 */

class IgnitePerformanceIntegration {
    constructor() {
        this.config = {
            enableAnimationEngine: true,
            enableLazyLoading: true,
            enableCoreWebVitals: true,
            enableResourceOptimization: true,
            debugMode: false
        };
        
        this.systems = {
            animationEngine: null,
            lazyLoader: null,
            performanceMonitor: null
        };
        
        this.metrics = {
            initStart: performance.now(),
            systemsLoaded: 0,
            totalSystems: 3,
            errors: []
        };
        
        this.init();
    }
    
    async init() {
        try {
            console.log('[Ignite Performance] Initializing comprehensive performance system...');
            
            // Initialize systems in parallel for maximum efficiency
            await Promise.all([
                this.initAnimationEngine(),
                this.initLazyLoader(),
                this.initPerformanceMonitor()
            ]);
            
            // Optimize existing systems
            this.optimizeExistingSystems();
            
            // Setup performance observers
            this.setupPerformanceObservers();
            
            // Report initialization metrics
            this.reportInitMetrics();
            
            console.log('[Ignite Performance] All systems initialized successfully');
            
        } catch (error) {
            console.error('[Ignite Performance] Critical initialization error:', error);
            this.metrics.errors.push(error);
            this.fallbackMode();
        }
    }
    
    async initAnimationEngine() {
        try {
            if (this.config.enableAnimationEngine) {
                // Dynamically import animation engine
                const { IgniteAnimationEngine } = await import('./animation-engine.js');
                this.systems.animationEngine = new IgniteAnimationEngine();
                
                // Initialize with enhanced configuration
                await this.systems.animationEngine.init({
                    targetFPS: this.getOptimalFPS(),
                    adaptiveQuality: true,
                    hardwareAcceleration: true,
                    priorityQueue: true,
                    performanceMonitoring: true
                });
                
                // Replace existing animation calls
                this.replaceExistingAnimations();
                
                this.metrics.systemsLoaded++;
                console.log('[Performance] Animation Engine initialized');
            }
        } catch (error) {
            console.error('[Performance] Animation Engine failed to load:', error);
            this.metrics.errors.push(error);
        }
    }
    
    async initLazyLoader() {
        try {
            if (this.config.enableLazyLoading) {
                // Dynamically import lazy loader
                const { IgniteLazyLoader } = await import('./lazy-loader.js');
                this.systems.lazyLoader = new IgniteLazyLoader();
                
                // Initialize with connection-aware settings
                await this.systems.lazyLoader.init({
                    connectionAware: true,
                    progressiveLoading: true,
                    webpSupport: this.supportsWebP(),
                    batchSize: this.getOptimalBatchSize(),
                    intersectionThreshold: 0.1
                });
                
                // Apply to existing images
                this.applyLazyLoadingToExistingImages();
                
                this.metrics.systemsLoaded++;
                console.log('[Performance] Lazy Loader initialized');
            }
        } catch (error) {
            console.error('[Performance] Lazy Loader failed to load:', error);
            this.metrics.errors.push(error);
        }
    }
    
    async initPerformanceMonitor() {
        try {
            this.systems.performanceMonitor = {
                metrics: new Map(),
                observers: new Map(),
                thresholds: {
                    FCP: 1800, // First Contentful Paint
                    LCP: 2500, // Largest Contentful Paint
                    FID: 100,  // First Input Delay
                    CLS: 0.1   // Cumulative Layout Shift
                }
            };
            
            this.metrics.systemsLoaded++;
            console.log('[Performance] Performance Monitor initialized');
        } catch (error) {
            console.error('[Performance] Performance Monitor failed to load:', error);
            this.metrics.errors.push(error);
        }
    }
    
    optimizeExistingSystems() {
        try {
            // Optimize ROI Calculator
            this.optimizeROICalculator();
            
            // Optimize Mobile Menu
            this.optimizeMobileMenu();
            
            // Optimize Script Loading
            this.optimizeScriptLoading();
            
            // Optimize Image Loading
            this.optimizeImageLoading();
            
            console.log('[Performance] Existing systems optimized');
        } catch (error) {
            console.error('[Performance] System optimization failed:', error);
            this.metrics.errors.push(error);
        }
    }
    
    optimizeROICalculator() {
        // Enhanced caching and debouncing for ROI calculator
        if (window.updateCalculator) {
            const originalUpdate = window.updateCalculator;
            const cache = new Map();
            let debounceTimer;
            
            window.updateCalculator = function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    // Use animation engine for smooth updates if available
                    if (window.IgnitePerformance?.systems?.animationEngine) {
                        window.IgnitePerformance.systems.animationEngine.queueAnimation(() => {
                            originalUpdate();
                        }, { priority: 'medium' });
                    } else {
                        originalUpdate();
                    }
                }, 100);
            };
        }
    }
    
    optimizeMobileMenu() {
        // Apply hardware acceleration to mobile menu elements
        const menuElements = [
            '.mobile-menu-toggle',
            '.nav-menu',
            '.nav-menu-overlay'
        ];
        
        menuElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && this.systems.animationEngine) {
                this.systems.animationEngine.applyHardwareAcceleration(element);
            }
        });
    }
    
    optimizeScriptLoading() {
        // Implement intelligent script loading based on priority
        const scriptPriorities = {
            'high': [
                'js/performance-optimizer.js',
                'js/error-handler.js',
                'js/core-vitals-optimizer.js'
            ],
            'medium': [
                'js/animations.js',
                'js/intro.js',
                'js/mobile-optimizations.js'
            ],
            'low': [
                'js/web-audio-converter.js',
                'js/optimized-music-player.js',
                'js/form-optimizer.js'
            ]
        };
        
        // Load high priority scripts immediately
        this.loadScriptsByPriority(scriptPriorities.high, 0);
        
        // Load medium priority after DOM content loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadScriptsByPriority(scriptPriorities.medium, 100);
            });
        } else {
            this.loadScriptsByPriority(scriptPriorities.medium, 100);
        }
        
        // Load low priority after window load
        window.addEventListener('load', () => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    this.loadScriptsByPriority(scriptPriorities.low, 200);
                });
            } else {
                setTimeout(() => {
                    this.loadScriptsByPriority(scriptPriorities.low, 200);
                }, 1000);
            }
        });
    }
    
    loadScriptsByPriority(scripts, delay = 0) {
        setTimeout(() => {
            scripts.forEach((src, index) => {
                setTimeout(() => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = true;
                    script.onload = () => console.log(`[Performance] Loaded: ${src}`);
                    script.onerror = () => console.warn(`[Performance] Failed to load: ${src}`);
                    document.head.appendChild(script);
                }, index * 50); // Stagger loading
            });
        }, delay);
    }
    
    optimizeImageLoading() {
        // Apply lazy loading to all images that don't have it
        const images = document.querySelectorAll('img:not([data-lazy])');
        images.forEach(img => {
            if (this.systems.lazyLoader) {
                this.systems.lazyLoader.observe(img);
            }
        });
    }
    
    applyLazyLoadingToExistingImages() {
        // Find all images and apply lazy loading
        const images = document.querySelectorAll('img');
        const criticalImages = [
            'Ignite Logo.png',
            'NeuralNetwork.png'
        ];
        
        images.forEach(img => {
            const isCritical = criticalImages.some(critical => 
                img.src.includes(critical)
            );
            
            if (!isCritical && this.systems.lazyLoader) {
                this.systems.lazyLoader.observe(img);
            }
        });
    }
    
    replaceExistingAnimations() {
        // Replace existing animation calls with animation engine
        if (!this.systems.animationEngine) return;
        
        // Override requestAnimationFrame calls for managed animations
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = (callback) => {
            if (this.systems.animationEngine.isInitialized) {
                return this.systems.animationEngine.queueAnimation(callback, {
                    priority: 'medium'
                });
            }
            return originalRAF(callback);
        };
        
        // Apply hardware acceleration to animated elements
        const animatedSelectors = [
            '.intro-overlay',
            '.intro-content',
            '.intro-logo',
            '.intro-text',
            '.nav-menu',
            '.mobile-menu-toggle',
            '.card-enhanced',
            '.solution-card'
        ];
        
        animatedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.systems.animationEngine.applyHardwareAcceleration(element);
            });
        });
    }
    
    setupPerformanceObservers() {
        if (!this.systems.performanceMonitor) return;
        
        try {
            // Core Web Vitals observers
            this.observeLCP();
            this.observeFID();
            this.observeCLS();
            this.observeFCP();
            
            // Custom performance metrics
            this.observeAnimationPerformance();
            this.observeResourceLoading();
            
        } catch (error) {
            console.error('[Performance] Observer setup failed:', error);
        }
    }
    
    observeLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const lcp = entry.startTime;
                    this.systems.performanceMonitor.metrics.set('LCP', lcp);
                    
                    if (lcp > this.systems.performanceMonitor.thresholds.LCP) {
                        console.warn(`[Performance] LCP threshold exceeded: ${lcp}ms`);
                        this.optimizeLCP();
                    }
                }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
            this.systems.performanceMonitor.observers.set('LCP', observer);
        }
    }
    
    observeFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const fid = entry.processingStart - entry.startTime;
                    this.systems.performanceMonitor.metrics.set('FID', fid);
                    
                    if (fid > this.systems.performanceMonitor.thresholds.FID) {
                        console.warn(`[Performance] FID threshold exceeded: ${fid}ms`);
                        this.optimizeFID();
                    }
                }
            });
            
            observer.observe({ entryTypes: ['first-input'] });
            this.systems.performanceMonitor.observers.set('FID', observer);
        }
    }
    
    observeCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                this.systems.performanceMonitor.metrics.set('CLS', clsValue);
                
                if (clsValue > this.systems.performanceMonitor.thresholds.CLS) {
                    console.warn(`[Performance] CLS threshold exceeded: ${clsValue}`);
                    this.optimizeCLS();
                }
            });
            
            observer.observe({ entryTypes: ['layout-shift'] });
            this.systems.performanceMonitor.observers.set('CLS', observer);
        }
    }
    
    observeFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        const fcp = entry.startTime;
                        this.systems.performanceMonitor.metrics.set('FCP', fcp);
                        
                        if (fcp > this.systems.performanceMonitor.thresholds.FCP) {
                            console.warn(`[Performance] FCP threshold exceeded: ${fcp}ms`);
                            this.optimizeFCP();
                        }
                    }
                }
            });
            
            observer.observe({ entryTypes: ['paint'] });
            this.systems.performanceMonitor.observers.set('FCP', observer);
        }
    }
    
    observeAnimationPerformance() {
        // Monitor animation frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.systems.performanceMonitor.metrics.set('FPS', fps);
                
                if (fps < 50) {
                    console.warn(`[Performance] Low FPS detected: ${fps}`);
                    this.optimizeAnimationPerformance();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    observeResourceLoading() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 2000) {
                        console.warn(`[Performance] Slow resource loading: ${entry.name} (${entry.duration}ms)`);
                    }
                }
            });
            
            observer.observe({ entryTypes: ['resource'] });
            this.systems.performanceMonitor.observers.set('resource', observer);
        }
    }
    
    // Optimization methods
    optimizeLCP() {
        // Preload critical resources
        const criticalResources = [
            'assets/images/Ignite Logo.png',
            'css/style.css'
        ];
        
        criticalResources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = src.endsWith('.css') ? 'style' : 'image';
            document.head.appendChild(link);
        });
    }
    
    optimizeFID() {
        // Break up long tasks
        if (this.systems.animationEngine) {
            this.systems.animationEngine.enableTaskBreaking(true);
        }
    }
    
    optimizeCLS() {
        // Add size attributes to images without them
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            if (img.naturalWidth && img.naturalHeight) {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;
            }
        });
    }
    
    optimizeFCP() {
        // Inline critical CSS
        this.inlineCriticalCSS();
    }
    
    optimizeAnimationPerformance() {
        if (this.systems.animationEngine) {
            this.systems.animationEngine.reduceQuality();
        }
    }
    
    // Utility methods
    getOptimalFPS() {
        // Detect device capabilities
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const deviceMemory = navigator.deviceMemory || 4;
        
        if (connection && connection.effectiveType === '4g' && deviceMemory >= 4) {
            return 60;
        } else if (connection && connection.effectiveType === '3g') {
            return 30;
        }
        return 30; // Conservative default
    }
    
    getOptimalBatchSize() {
        const deviceMemory = navigator.deviceMemory || 4;
        return deviceMemory >= 4 ? 6 : 3;
    }
    
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').startsWith('data:image/webp');
    }
    
    inlineCriticalCSS() {
        // This would inline critical CSS for faster FCP
        // Implementation depends on build process
        console.log('[Performance] Critical CSS inlining would be implemented in build process');
    }
    
    fallbackMode() {
        console.warn('[Performance] Running in fallback mode due to initialization errors');
        
        // Minimal performance optimizations
        document.querySelectorAll('img').forEach(img => {
            img.loading = 'lazy';
        });
        
        // Basic hardware acceleration
        document.querySelectorAll('.intro-overlay, .nav-menu').forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.style.willChange = 'auto';
        });
    }
    
    reportInitMetrics() {
        const initTime = performance.now() - this.metrics.initStart;
        console.log(`[Performance] Initialization completed in ${initTime.toFixed(2)}ms`);
        console.log(`[Performance] Systems loaded: ${this.metrics.systemsLoaded}/${this.metrics.totalSystems}`);
        
        if (this.metrics.errors.length > 0) {
            console.warn(`[Performance] ${this.metrics.errors.length} errors during initialization`);
        }
        
        // Report to analytics if available
        if (window.gtag) {
            window.gtag('event', 'performance_init', {
                'custom_map': {
                    'init_time': initTime,
                    'systems_loaded': this.metrics.systemsLoaded,
                    'errors': this.metrics.errors.length
                }
            });
        }
    }
    
    // Public API
    getMetrics() {
        return {
            systems: this.systems,
            metrics: this.systems.performanceMonitor?.metrics || new Map(),
            errors: this.metrics.errors
        };
    }
    
    enableDebugMode(enabled = true) {
        this.config.debugMode = enabled;
        if (enabled) {
            console.log('[Performance] Debug mode enabled');
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.IgnitePerformance = new IgnitePerformanceIntegration();
    });
} else {
    window.IgnitePerformance = new IgnitePerformanceIntegration();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IgnitePerformanceIntegration;
}