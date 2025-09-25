/**
 * Ignite Health Systems - Mobile Optimizations
 * Responsive design enhancements and mobile-first improvements
 */

(function() {
    'use strict';

    // Mobile optimization configuration
    const config = {
        breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
        },
        touchThreshold: 10,
        swipeThreshold: 50,
        orientationChangeDelay: 100
    };

    // Device and feature detection
    const device = {
        isMobile: false,
        isTablet: false,
        isDesktop: false,
        hasTouch: false,
        orientation: 'portrait',
        pixelRatio: window.devicePixelRatio || 1
    };

    /**
     * Initialize mobile optimizations
     */
    function init() {
        detectDevice();
        optimizeForMobile();
        enhanceNavigation();
        optimizeImages();
        handleOrientationChange();
        improveScrolling();
        optimizeAnimations();
        enhanceFormInputs();
        addSwipeGestures();
        optimizeFireTheme();
    }

    /**
     * Detect device capabilities
     */
    function detectDevice() {
        const width = window.innerWidth;
        
        device.isMobile = width <= config.breakpoints.mobile;
        device.isTablet = width > config.breakpoints.mobile && width <= config.breakpoints.tablet;
        device.isDesktop = width > config.breakpoints.tablet;
        device.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        device.orientation = width > window.innerHeight ? 'landscape' : 'portrait';

        // Add device classes to body
        document.body.classList.remove('mobile', 'tablet', 'desktop', 'touch', 'no-touch');
        
        if (device.isMobile) document.body.classList.add('mobile');
        if (device.isTablet) document.body.classList.add('tablet');
        if (device.isDesktop) document.body.classList.add('desktop');
        if (device.hasTouch) document.body.classList.add('touch');
        if (!device.hasTouch) document.body.classList.add('no-touch');
    }

    /**
     * Optimize specifically for mobile devices
     */
    function optimizeForMobile() {
        if (!device.isMobile) return;

        // Reduce particle effects on mobile
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => particle.remove());

        // Simplify animations on mobile
        const heavyAnimations = document.querySelectorAll('[data-heavy-animation]');
        heavyAnimations.forEach(element => {
            element.style.animation = 'none';
            element.style.transition = 'opacity 0.3s ease';
        });

        // Optimize images for mobile
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Use smaller images on mobile
            if (img.dataset.mobileSrc) {
                img.src = img.dataset.mobileSrc;
            }
        });

        // Disable hover effects on mobile
        const hoverElements = document.querySelectorAll('[data-hover]');
        hoverElements.forEach(element => {
            element.classList.add('no-hover');
        });

        // Optimize font sizes for mobile
        document.documentElement.style.setProperty('--mobile-scale', '0.9');
    }

    /**
     * Enhance mobile navigation
     */
    function enhanceNavigation() {
        const navbar = document.querySelector('.navbar');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!navbar || !mobileToggle || !navMenu) return;

        let isMenuOpen = false;

        // Enhanced mobile menu toggle
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            isMenuOpen = !isMenuOpen;
            
            navMenu.classList.toggle('active', isMenuOpen);
            mobileToggle.classList.toggle('active', isMenuOpen);
            document.body.classList.toggle('menu-open', isMenuOpen);
            
            // Prevent body scroll when menu is open
            if (isMenuOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (isMenuOpen && !navbar.contains(e.target)) {
                isMenuOpen = false;
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                isMenuOpen = false;
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (isMenuOpen) {
                    isMenuOpen = false;
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /**
     * Optimize images for different screen sizes
     */
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Create responsive image sizes
            if (!img.hasAttribute('sizes')) {
                img.setAttribute('sizes', 
                    '(max-width: 768px) 100vw, ' +
                    '(max-width: 1024px) 50vw, ' +
                    '33vw'
                );
            }

            // Add loading states
            img.addEventListener('loadstart', function() {
                this.classList.add('loading');
            });

            img.addEventListener('load', function() {
                this.classList.remove('loading');
                this.classList.add('loaded');
            });

            img.addEventListener('error', function() {
                this.classList.remove('loading');
                this.classList.add('error');
                console.warn('Failed to load image:', this.src);
            });
        });
    }

    /**
     * Handle orientation changes
     */
    function handleOrientationChange() {
        let orientationTimeout;

        function handleOrientation() {
            clearTimeout(orientationTimeout);
            orientationTimeout = setTimeout(() => {
                detectDevice();
                
                // Recalculate layouts
                const event = new CustomEvent('orientationchange');
                window.dispatchEvent(event);
                
                // Update viewport height for mobile browsers
                if (device.isMobile) {
                    const vh = window.innerHeight * 0.01;
                    document.documentElement.style.setProperty('--vh', `${vh}px`);
                }
            }, config.orientationChangeDelay);
        }

        window.addEventListener('orientationchange', handleOrientation);
        window.addEventListener('resize', handleOrientation);
        
        // Initial viewport height setup
        if (device.isMobile) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }

    /**
     * Improve scrolling performance
     */
    function improveScrolling() {
        let ticking = false;
        let lastScrollY = window.pageYOffset;

        function updateScrolling() {
            const currentScrollY = window.pageYOffset;
            const direction = currentScrollY > lastScrollY ? 'down' : 'up';
            
            document.body.setAttribute('data-scroll-direction', direction);
            
            // Auto-hide navbar on mobile scroll down
            if (device.isMobile) {
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    if (direction === 'down' && currentScrollY > 100) {
                        navbar.classList.add('hidden');
                    } else if (direction === 'up') {
                        navbar.classList.remove('hidden');
                    }
                }
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        }

        function requestScrollUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateScrolling);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    /**
     * Optimize animations for mobile
     */
    function optimizeAnimations() {
        if (!device.isMobile) return;

        // Reduce animation complexity
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: ${config.breakpoints.mobile}px) {
                .mobile .fire-gradient {
                    animation: none !important;
                    background: var(--primary) !important;
                }
                
                .mobile [data-parallax] {
                    transform: none !important;
                }
                
                .mobile .floating-element {
                    animation: none !important;
                }
                
                .mobile .typewriter {
                    animation: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Enhance form inputs for mobile
     */
    function enhanceFormInputs() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add better mobile keyboard types
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            } else if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
            } else if (input.type === 'number') {
                input.setAttribute('inputmode', 'numeric');
            }

            // Prevent zoom on focus for mobile
            if (device.isMobile) {
                input.addEventListener('focus', function() {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 
                            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
                        );
                    }
                });

                input.addEventListener('blur', function() {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.setAttribute('content', 
                            'width=device-width, initial-scale=1.0, viewport-fit=cover'
                        );
                    }
                });
            }
        });
    }

    /**
     * Add swipe gesture support
     */
    function addSwipeGestures() {
        if (!device.hasTouch) return;

        let startX, startY, endX, endY;

        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Check if it's a swipe gesture
            if (Math.abs(deltaX) > config.swipeThreshold || Math.abs(deltaY) > config.swipeThreshold) {
                const direction = Math.abs(deltaX) > Math.abs(deltaY) 
                    ? (deltaX > 0 ? 'right' : 'left')
                    : (deltaY > 0 ? 'down' : 'up');
                
                // Dispatch custom swipe event
                const swipeEvent = new CustomEvent('swipe', {
                    detail: { direction, deltaX, deltaY }
                });
                e.target.dispatchEvent(swipeEvent);
            }
        }, { passive: true });
    }

    /**
     * Optimize fire theme for mobile
     */
    function optimizeFireTheme() {
        if (!device.isMobile) return;

        // Simplify fire effects on mobile
        const fireElements = document.querySelectorAll('.fire-text, .fire-gradient, .fire-particle');
        fireElements.forEach(element => {
            element.classList.add('mobile-optimized');
        });

        // Reduce glow effects
        const glowElements = document.querySelectorAll('[data-glow]');
        glowElements.forEach(element => {
            element.style.filter = 'none';
        });
    }

    /**
     * Add mobile-specific CSS
     */
    function injectMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Mobile Navigation Styles */
            @media (max-width: ${config.breakpoints.mobile}px) {
                .navbar.hidden {
                    transform: translateY(-100%);
                    transition: transform 0.3s ease;
                }
                
                .mobile-menu-toggle {
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    padding: 8px;
                }
                
                .mobile-menu-toggle span {
                    width: 25px;
                    height: 3px;
                    background: var(--primary);
                    margin: 3px 0;
                    transition: 0.3s;
                }
                
                .mobile-menu-toggle.active span:nth-child(1) {
                    transform: rotate(-45deg) translate(-5px, 6px);
                }
                
                .mobile-menu-toggle.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-toggle.active span:nth-child(3) {
                    transform: rotate(45deg) translate(-5px, -6px);
                }
                
                .nav-menu {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    width: 100%;
                    height: calc(100vh - 70px);
                    background: var(--background);
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding-top: 2rem;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    z-index: 1000;
                }
                
                .nav-menu.active {
                    transform: translateX(0);
                }
                
                .nav-link {
                    margin: 1rem 0;
                    font-size: 1.2rem;
                }
                
                /* Mobile Hero Adjustments */
                .hero {
                    min-height: calc(var(--vh, 1vh) * 100);
                    padding: 2rem 1rem;
                }
                
                .hero-title {
                    font-size: 2rem;
                    line-height: 1.3;
                }
                
                .hero-subtitle {
                    font-size: 1rem;
                    margin: 1rem 0;
                }
                
                .hero-stats {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .hero-cta {
                    flex-direction: column;
                    gap: 1rem;
                    width: 100%;
                }
                
                .btn-primary, .btn-secondary {
                    width: 100%;
                    text-align: center;
                    padding: 1rem;
                }
                
                /* Mobile Card Optimizations */
                .problem-grid,
                .features-grid,
                .testimonials-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }
                
                .card, .feature-card, .testimonial-card {
                    transform: none !important;
                    transition: box-shadow 0.3s ease;
                }
                
                .card:active,
                .feature-card:active,
                .testimonial-card:active {
                    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
                }
                
                /* Mobile Form Optimizations */
                .calculator-container {
                    flex-direction: column;
                }
                
                .calculator-inputs,
                .calculator-results {
                    width: 100%;
                }
                
                /* Mobile Loading States */
                .loading {
                    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }
                
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            }
            
            /* Touch Optimizations */
            .touch .btn,
            .touch .nav-link,
            .touch .card {
                min-height: 44px;
                min-width: 44px;
            }
            
            .touch .btn:active {
                transform: scale(0.95);
                transition: transform 0.1s ease;
            }
            
            /* Reduced Motion Support */
            @media (prefers-reduced-motion: reduce) {
                .mobile * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectMobileStyles();
            init();
        });
    } else {
        injectMobileStyles();
        init();
    }

    // Expose API for external use
    window.IgniteMobile = {
        device,
        config,
        detectDevice,
        optimizeForMobile
    };

})();