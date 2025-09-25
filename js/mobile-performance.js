/**
 * Ignite Health Systems - Mobile Performance Optimizer
 * Optimizes performance specifically for mobile devices
 */

class MobilePerformanceOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isLowEndDevice = this.detectLowEndDevice();
        this.connection = this.getConnectionInfo();
        this.performanceMetrics = {
            startTime: performance.now(),
            fcp: null,
            lcp: null,
            cls: null,
            fid: null,
            ttfb: null
        };
        
        this.observers = [];
        this.optimizationQueue = [];
        
        this.init();
    }
    
    init() {
        if (!this.isMobile) return;
        
        this.setupPerformanceMonitoring();
        this.optimizeForMobile();
        this.setupResourceHints();
        this.initializeIntersectionObservers();
        this.optimizeAnimations();
        this.setupNetworkOptimizations();
        this.initializeLazyLoading();
        
        // Run optimizations after page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.postLoadOptimizations());
            window.addEventListener('load', () => this.finalOptimizations());
        } else {
            this.postLoadOptimizations();
            this.finalOptimizations();
        }
    }
    
    detectMobile() {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTouchDevice = 'ontouchstart' in window;
        const hasSmallScreen = window.innerWidth <= 768;
        
        return isMobile || (isTouchDevice && hasSmallScreen);
    }
    
    detectLowEndDevice() {
        // Detect low-end devices based on various factors
        const factors = {
            cores: navigator.hardwareConcurrency || 1,
            memory: navigator.deviceMemory || 1,
            connection: this.getConnectionInfo().effectiveType,
            userAgent: navigator.userAgent
        };
        
        // Score device capability (0-100)
        let score = 50; // baseline
        
        // CPU cores
        if (factors.cores >= 8) score += 20;
        else if (factors.cores >= 4) score += 10;
        else if (factors.cores <= 2) score -= 20;
        
        // Memory
        if (factors.memory >= 8) score += 20;
        else if (factors.memory >= 4) score += 10;
        else if (factors.memory <= 2) score -= 20;
        
        // Connection
        if (factors.connection === '4g') score += 10;
        else if (factors.connection === '3g') score -= 10;
        else if (factors.connection === '2g') score -= 30;
        
        // Old devices
        if (/iPhone [5-7]|iPad [2-5]|Android [4-6]/i.test(factors.userAgent)) {
            score -= 30;
        }
        
        return score < 40;
    }
    
    getConnectionInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        return {
            effectiveType: connection?.effectiveType || '4g',
            downlink: connection?.downlink || 10,
            rtt: connection?.rtt || 100,
            saveData: connection?.saveData || false
        };
    }
    
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.observePerformanceMetrics();
        
        // Custom performance tracking
        this.trackCustomMetrics();
        
        // Report metrics
        this.scheduleMetricsReport();
    }
    
    observePerformanceMetrics() {
        // First Contentful Paint
        const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const fcp = entries[entries.length - 1];
            this.performanceMetrics.fcp = fcp.startTime;
        });
        
        try {
            fcpObserver.observe({ entryTypes: ['paint'] });
            this.observers.push(fcpObserver);
        } catch (e) {
            console.warn('FCP observer not supported');
        }
        
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lcp = entries[entries.length - 1];
                this.performanceMetrics.lcp = lcp.startTime;
            });
            
            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.push(lcpObserver);
            } catch (e) {
                console.warn('LCP observer not supported');
            }
        }
        
        // First Input Delay
        if ('PerformanceObserver' in window) {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.performanceMetrics.fid = entry.processingStart - entry.startTime;
                });
            });
            
            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.push(fidObserver);
            } catch (e) {
                console.warn('FID observer not supported');
            }
        }
        
        // Cumulative Layout Shift
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.performanceMetrics.cls = clsValue;
            });
            
            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.push(clsObserver);
            } catch (e) {
                console.warn('CLS observer not supported');
            }
        }
    }
    
    trackCustomMetrics() {
        // Time to First Byte
        const navTiming = performance.getEntriesByType('navigation')[0];
        if (navTiming) {
            this.performanceMetrics.ttfb = navTiming.responseStart - navTiming.requestStart;
        }
        
        // Mobile-specific metrics
        this.trackMobileMetrics();
    }
    
    trackMobileMetrics() {
        // Touch response time
        let touchStartTime = 0;
        document.addEventListener('touchstart', () => {
            touchStartTime = performance.now();
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            if (touchStartTime) {
                const touchResponseTime = performance.now() - touchStartTime;
                this.performanceMetrics.touchResponse = touchResponseTime;
            }
        }, { passive: true });
        
        // Scroll performance
        let scrollStartTime = 0;
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                scrollStartTime = performance.now();
                isScrolling = true;
            }
            
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                if (isScrolling) {
                    const scrollDuration = performance.now() - scrollStartTime;
                    this.performanceMetrics.scrollPerformance = scrollDuration;
                    isScrolling = false;
                }
            }, 150);
        }, { passive: true });
    }
    
    scheduleMetricsReport() {
        // Report metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.reportMetrics();
            }, 2000);
        });
        
        // Report on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.reportMetrics();
            }
        });
    }
    
    reportMetrics() {
        const metrics = {
            ...this.performanceMetrics,
            deviceInfo: {
                isMobile: this.isMobile,
                isLowEnd: this.isLowEndDevice,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                pixelRatio: window.devicePixelRatio,
                connection: this.connection
            },
            timestamp: Date.now(),
            url: window.location.href
        };
        
        // Send to analytics (replace with your analytics endpoint)
        this.sendAnalytics(metrics);
        
        // Store locally for debugging
        if (window.location.hostname === 'localhost') {
            console.log('Mobile Performance Metrics:', metrics);
            localStorage.setItem('ignite_mobile_metrics', JSON.stringify(metrics));
        }
    }
    
    sendAnalytics(metrics) {
        // Replace with your analytics service
        if (typeof gtag !== 'undefined') {
            gtag('event', 'mobile_performance', {
                fcp: metrics.fcp,
                lcp: metrics.lcp,
                cls: metrics.cls,
                fid: metrics.fid,
                custom_parameter: metrics.deviceInfo
            });
        }
        
        // Send to custom endpoint
        try {
            fetch('/api/performance-metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metrics),
                keepalive: true
            }).catch(() => {}); // Fail silently
        } catch (e) {
            // Fail silently
        }
    }
    
    optimizeForMobile() {
        // Apply mobile-specific optimizations
        this.optimizeViewport();
        this.optimizeTouch();
        this.optimizeImages();
        this.optimizeFonts();
        this.optimizeCSS();
    }
    
    optimizeViewport() {
        // Set optimal viewport meta tag if not present
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        
        viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no';
        
        // Handle iOS Safari viewport bug
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--mobile-vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH, { passive: true });
        window.addEventListener('orientationchange', () => setTimeout(setVH, 200), { passive: true });
    }
    
    optimizeTouch() {
        // Improve touch responsiveness
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                user-select: none;
            }
            
            input, textarea, [contenteditable] {
                -webkit-user-select: auto;
                user-select: auto;
            }
            
            a, button, [role="button"], [tabindex] {
                touch-action: manipulation;
            }
            
            .scrollable {
                -webkit-overflow-scrolling: touch;
                overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
        
        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (!input.style.fontSize) {
                input.style.fontSize = '16px';
            }
        });
    }
    
    optimizeImages() {
        // Lazy load images
        this.setupImageLazyLoading();
        
        // Optimize image quality based on connection
        if (this.connection.saveData || this.connection.effectiveType === '2g') {
            this.reduceImageQuality();
        }
        
        // Add loading placeholders
        this.addImagePlaceholders();
    }
    
    setupImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            // Observe all images with data-src
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
            
            this.observers.push(imageObserver);
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
        }
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        }
    }
    
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }
    
    reduceImageQuality() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add a filter to reduce perceived quality for faster loading
            img.style.filter = 'contrast(0.9) brightness(0.95)';
        });
    }
    
    addImagePlaceholders() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (!img.complete) {
                img.style.backgroundColor = '#2a2a2a';
                img.style.backgroundImage = 'linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)';
                img.style.backgroundSize = '200% 100%';
                img.style.animation = 'shimmer 1.5s infinite';
                
                img.addEventListener('load', () => {
                    img.style.backgroundColor = '';
                    img.style.backgroundImage = '';
                    img.style.animation = '';
                }, { once: true });
            }
        });
    }
    
    optimizeFonts() {
        // Preload critical fonts
        const fontPreloads = [
            'Inter-Regular.woff2',
            'Inter-Medium.woff2',
            'Inter-SemiBold.woff2'
        ];
        
        fontPreloads.forEach(font => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = `/fonts/${font}`;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        // Use font-display: swap for better performance
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Inter';
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }
    
    optimizeCSS() {
        // Remove unused CSS for mobile
        if (this.isLowEndDevice) {
            this.removeUnusedStyles();
        }
        
        // Optimize animations for mobile
        this.optimizeAnimationsForMobile();
    }
    
    removeUnusedStyles() {
        // Remove complex animations and effects on low-end devices
        const style = document.createElement('style');
        style.textContent = `
            .fire-particle,
            .floating-element,
            .complex-animation {
                display: none !important;
            }
            
            * {
                animation-duration: 0.2s !important;
                transition-duration: 0.2s !important;
            }
            
            .intro-overlay {
                animation: none !important;
                background: #0d0d0d !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    optimizeAnimationsForMobile() {
        // Reduce motion if preferred
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    }
    
    setupResourceHints() {
        // Add resource hints for better loading performance
        this.addDNSPrefetch();
        this.addPreconnect();
        this.addModulePreload();
    }
    
    addDNSPrefetch() {
        const domains = [
            'fonts.googleapis.com',
            'fonts.gstatic.com',
            'www.google-analytics.com'
        ];
        
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = `//${domain}`;
            document.head.appendChild(link);
        });
    }
    
    addPreconnect() {
        const origins = [
            'https://fonts.gstatic.com'
        ];
        
        origins.forEach(origin => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = origin;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }
    
    addModulePreload() {
        // Preload critical JavaScript modules
        const criticalModules = [
            '/js/mobile-navigation.js',
            '/js/animations.js'
        ];
        
        criticalModules.forEach(module => {
            const link = document.createElement('link');
            link.rel = 'modulepreload';
            link.href = module;
            document.head.appendChild(link);
        });
    }
    
    initializeIntersectionObservers() {
        // Optimize content loading based on visibility
        this.setupContentObserver();
        this.setupAnimationObserver();
    }
    
    setupContentObserver() {
        if ('IntersectionObserver' in window) {
            const contentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this.triggerContentLoad(entry.target);
                    }
                });
            }, {
                rootMargin: '100px'
            });
            
            // Observe sections for progressive loading
            const sections = document.querySelectorAll('section, .card, .feature');
            sections.forEach(section => {
                contentObserver.observe(section);
            });
            
            this.observers.push(contentObserver);
        }
    }
    
    setupAnimationObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    } else if (this.isLowEndDevice) {
                        // Remove animations when out of view on low-end devices
                        entry.target.classList.remove('animate');
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            const animatedElements = document.querySelectorAll('[data-animate]');
            animatedElements.forEach(element => {
                animationObserver.observe(element);
            });
            
            this.observers.push(animationObserver);
        }
    }
    
    triggerContentLoad(element) {
        // Load content that was deferred
        const deferredContent = element.querySelectorAll('[data-defer]');
        deferredContent.forEach(content => {
            const deferType = content.dataset.defer;
            switch (deferType) {
                case 'image':
                    this.loadDeferredImage(content);
                    break;
                case 'video':
                    this.loadDeferredVideo(content);
                    break;
                case 'iframe':
                    this.loadDeferredIframe(content);
                    break;
            }
        });
    }
    
    loadDeferredImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.removeAttribute('data-defer');
            img.removeAttribute('data-src');
        }
    }
    
    loadDeferredVideo(video) {
        const src = video.dataset.src;
        if (src) {
            video.src = src;
            video.load();
            video.removeAttribute('data-defer');
            video.removeAttribute('data-src');
        }
    }
    
    loadDeferredIframe(iframe) {
        const src = iframe.dataset.src;
        if (src) {
            iframe.src = src;
            iframe.removeAttribute('data-defer');
            iframe.removeAttribute('data-src');
        }
    }
    
    optimizeAnimations() {
        // Optimize animations for mobile performance
        if (this.isLowEndDevice) {
            this.disableHeavyAnimations();
        } else {
            this.enableOptimizedAnimations();
        }
    }
    
    disableHeavyAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .intro-overlay,
            .fire-particle,
            .floating-element {
                animation: none !important;
            }
            
            .hero {
                background-attachment: scroll !important;
            }
            
            * {
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    enableOptimizedAnimations() {
        // Use transform and opacity for better performance
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                opacity: 0;
                transform: translateY(20px) translateZ(0);
                transition: opacity 0.6s ease, transform 0.6s ease;
                will-change: transform, opacity;
            }
            
            .fade-in.visible {
                opacity: 1;
                transform: translateY(0) translateZ(0);
            }
            
            .slide-up {
                transform: translateY(30px) translateZ(0);
                transition: transform 0.6s ease;
                will-change: transform;
            }
            
            .slide-up.visible {
                transform: translateY(0) translateZ(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupNetworkOptimizations() {
        // Optimize based on network conditions
        if (this.connection.saveData) {
            this.enableDataSavingMode();
        }
        
        if (this.connection.effectiveType === '2g' || this.connection.effectiveType === 'slow-2g') {
            this.enableSlowConnectionMode();
        }
        
        // Listen for network changes
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.connection = this.getConnectionInfo();
                this.adjustForConnection();
            });
        }
    }
    
    enableDataSavingMode() {
        const style = document.createElement('style');
        style.textContent = `
            .hero {
                background-image: none !important;
                background-color: var(--background) !important;
            }
            
            video {
                display: none !important;
            }
            
            .intro-overlay {
                background: var(--background) !important;
            }
            
            img:not(.logo-img):not(.intro-logo-img) {
                filter: blur(1px);
            }
        `;
        document.head.appendChild(style);
    }
    
    enableSlowConnectionMode() {
        // Aggressive optimizations for slow connections
        this.disableHeavyAnimations();
        this.enableDataSavingMode();
        
        // Lazy load everything
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (img.src && !img.classList.contains('critical')) {
                img.dataset.src = img.src;
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
                this.setupImageLazyLoading();
            }
        });
    }
    
    adjustForConnection() {
        if (this.connection.saveData) {
            this.enableDataSavingMode();
        }
        
        if (this.connection.effectiveType === '4g' && !this.connection.saveData) {
            // Re-enable optimizations for better connections
            this.enableOptimizedAnimations();
        }
    }
    
    initializeLazyLoading() {
        // Set up comprehensive lazy loading
        this.lazyLoadSections();
        this.lazyLoadScripts();
        this.lazyLoadStyles();
    }
    
    lazyLoadSections() {
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadSectionContent(entry.target);
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '200px'
            });
            
            const lazySections = document.querySelectorAll('[data-lazy-section]');
            lazySections.forEach(section => {
                sectionObserver.observe(section);
            });
            
            this.observers.push(sectionObserver);
        }
    }
    
    loadSectionContent(section) {
        const content = section.dataset.lazyContent;
        if (content) {
            section.innerHTML = content;
            section.removeAttribute('data-lazy-section');
            section.removeAttribute('data-lazy-content');
        }
    }
    
    lazyLoadScripts() {
        // Load non-critical scripts after user interaction
        const lazyScripts = [
            '/js/analytics.js',
            '/js/chat-widget.js',
            '/js/social-sharing.js'
        ];
        
        const loadLazyScripts = () => {
            lazyScripts.forEach(scriptSrc => {
                const script = document.createElement('script');
                script.src = scriptSrc;
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            });
        };
        
        // Load on first user interaction
        const interactionEvents = ['touchstart', 'click', 'scroll'];
        const loadOnce = () => {
            loadLazyScripts();
            interactionEvents.forEach(event => {
                document.removeEventListener(event, loadOnce);
            });
        };
        
        interactionEvents.forEach(event => {
            document.addEventListener(event, loadOnce, { once: true, passive: true });
        });
        
        // Fallback: load after 5 seconds
        setTimeout(loadLazyScripts, 5000);
    }
    
    lazyLoadStyles() {
        // Load non-critical CSS after load
        const lazyStyles = [
            '/css/animations-extended.css',
            '/css/print.css'
        ];
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                lazyStyles.forEach(styleSrc => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = styleSrc;
                    link.media = 'all';
                    document.head.appendChild(link);
                });
            }, 1000);
        });
    }
    
    postLoadOptimizations() {
        // Run optimizations after DOM is ready
        this.optimizeFormInputs();
        this.setupServiceWorker();
        this.enablePrefetching();
    }
    
    optimizeFormInputs() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Optimize for mobile keyboards
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
                input.setAttribute('autocomplete', 'email');
            }
            
            if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
                input.setAttribute('autocomplete', 'tel');
            }
            
            if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }
            
            // Prevent zoom on iOS
            if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator && 'caches' in window) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }
    
    enablePrefetching() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.prefetchCriticalResources();
            });
        } else {
            setTimeout(() => {
                this.prefetchCriticalResources();
            }, 2000);
        }
    }
    
    prefetchCriticalResources() {
        const criticalPages = [
            '/platform.html',
            '/join.html'
        ];
        
        const criticalImages = [
            '/assets/images/dashboard-preview.png',
            '/assets/images/analytics-dashboard.png'
        ];
        
        // Prefetch pages
        criticalPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
        
        // Prefetch images
        criticalImages.forEach(image => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = image;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }
    
    finalOptimizations() {
        // Final optimizations after page load
        this.cleanupUnusedResources();
        this.enableProgressiveEnhancement();
        this.finalizeMetrics();
    }
    
    cleanupUnusedResources() {
        // Clean up temporary elements and styles
        const tempElements = document.querySelectorAll('[data-temp]');
        tempElements.forEach(element => {
            element.remove();
        });
        
        // Remove loading states
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(element => {
            element.classList.remove('loading');
        });
    }
    
    enableProgressiveEnhancement() {
        // Add enhanced features for capable devices
        if (!this.isLowEndDevice) {
            this.enableAdvancedFeatures();
        }
    }
    
    enableAdvancedFeatures() {
        // Enable advanced animations and interactions
        document.documentElement.classList.add('enhanced');
        
        // Enable advanced touch gestures
        this.setupAdvancedTouch();
        
        // Enable advanced animations
        this.setupAdvancedAnimations();
    }
    
    setupAdvancedTouch() {
        // Add swipe gestures, pull-to-refresh, etc.
        // Implementation depends on specific requirements
    }
    
    setupAdvancedAnimations() {
        // Add intersection observer based animations
        // Implementation depends on specific requirements
    }
    
    finalizeMetrics() {
        // Calculate final performance scores
        const loadTime = performance.now() - this.performanceMetrics.startTime;
        this.performanceMetrics.totalLoadTime = loadTime;
        
        // Set up periodic reporting
        setInterval(() => {
            this.reportMetrics();
        }, 30000); // Report every 30 seconds
    }
    
    // Public API
    getMetrics() {
        return { ...this.performanceMetrics };
    }
    
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isLowEnd: this.isLowEndDevice,
            connection: this.connection
        };
    }
    
    destroy() {
        // Cleanup observers and timers
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        
        clearTimeout(this.scrollTimeout);
        clearTimeout(this.resizeTimeout);
    }
}

// Auto-initialize
let mobileOptimizer = null;

function initMobilePerformanceOptimizer() {
    if (!mobileOptimizer) {
        mobileOptimizer = new MobilePerformanceOptimizer();
        
        // Expose to global scope for debugging
        window.IgniteMobileOptimizer = mobileOptimizer;
    }
}

// Initialize immediately
initMobilePerformanceOptimizer();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobilePerformanceOptimizer;
}

if (typeof window !== 'undefined') {
    window.MobilePerformanceOptimizer = MobilePerformanceOptimizer;
}