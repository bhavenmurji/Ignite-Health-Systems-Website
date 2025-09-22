/**
 * Mobile Responsiveness Fixes - Critical Issues
 * Addresses priority mobile UX problems identified in testing
 */

(function() {
    'use strict';

    // Mobile fix configuration
    const config = {
        touchThreshold: 10,
        swipeThreshold: 50,
        tapTimeout: 300,
        viewportUpdateDelay: 100,
        performanceMode: 'auto' // 'auto', 'performance', 'quality'
    };

    let isInitialized = false;
    let touchStartTime = 0;
    let lastTouchEnd = 0;

    /**
     * Initialize all mobile fixes
     */
    function init() {
        if (isInitialized) return;
        
        fixViewportHandling();
        enhanceMobileMenu();
        optimizeTouchInteractions();
        improveFormInputs();
        addHapticFeedback();
        optimizePerformance();
        addDebugInfo();
        
        isInitialized = true;
        console.log('[Mobile Fixes] Initialized successfully');
    }

    /**
     * Critical Fix 1: iOS Safari Viewport Handling
     */
    function fixViewportHandling() {
        let viewportUpdateTimeout;

        function updateViewportHeight() {
            clearTimeout(viewportUpdateTimeout);
            viewportUpdateTimeout = setTimeout(() => {
                // Calculate and set custom viewport height
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
                
                // Set dynamic viewport height if supported
                if (CSS.supports('height', '100dvh')) {
                    document.documentElement.style.setProperty('--dvh', '100dvh');
                } else {
                    document.documentElement.style.setProperty('--dvh', `${window.innerHeight}px`);
                }
                
                console.log('[Viewport] Updated: vh=' + vh + 'px, innerHeight=' + window.innerHeight);
            }, config.viewportUpdateDelay);
        }

        // Initial setup
        updateViewportHeight();

        // Handle orientation changes and resize
        window.addEventListener('orientationchange', updateViewportHeight);
        window.addEventListener('resize', updateViewportHeight);
        
        // Handle iOS Safari address bar show/hide
        let lastHeight = window.innerHeight;
        window.addEventListener('scroll', () => {
            if (Math.abs(window.innerHeight - lastHeight) > 100) {
                lastHeight = window.innerHeight;
                updateViewportHeight();
            }
        }, { passive: true });

        // Prevent zoom on input focus for iOS
        const viewport = document.querySelector('meta[name="viewport"]');
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (viewport && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
                    viewport.setAttribute('content', 
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
                    );
                }
            });

            input.addEventListener('blur', () => {
                if (viewport && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
                    setTimeout(() => {
                        viewport.setAttribute('content', 
                            'width=device-width, initial-scale=1.0, viewport-fit=cover'
                        );
                    }, 100);
                }
            });
        });
    }

    /**
     * Critical Fix 2: Enhanced Mobile Menu with Backdrop
     */
    function enhanceMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navbar = document.querySelector('.navbar');
        
        if (!mobileToggle || !navMenu) return;

        let isMenuOpen = false;
        let backdrop = null;

        // Create backdrop element
        function createBackdrop() {
            if (backdrop) return backdrop;
            
            backdrop = document.createElement('div');
            backdrop.className = 'mobile-menu-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 98;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                transform: translateZ(0);
                will-change: opacity, visibility;
            `;
            document.body.appendChild(backdrop);
            return backdrop;
        }

        // Enhanced menu toggle with better touch handling
        function toggleMenu(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            isMenuOpen = !isMenuOpen;
            
            // Update menu state
            navMenu.classList.toggle('active', isMenuOpen);
            mobileToggle.classList.toggle('active', isMenuOpen);
            document.body.classList.toggle('menu-open', isMenuOpen);
            
            // Handle backdrop
            const menuBackdrop = createBackdrop();
            if (isMenuOpen) {
                menuBackdrop.classList.add('active');
                menuBackdrop.style.opacity = '1';
                menuBackdrop.style.visibility = 'visible';
                document.body.style.overflow = 'hidden';
                
                // Add touch and click listeners to backdrop
                menuBackdrop.addEventListener('click', closeMenu);
                menuBackdrop.addEventListener('touchstart', closeMenu, { passive: true });
            } else {
                menuBackdrop.classList.remove('active');
                menuBackdrop.style.opacity = '0';
                menuBackdrop.style.visibility = 'hidden';
                document.body.style.overflow = '';
            }

            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }

            console.log('[Menu] Toggled:', isMenuOpen ? 'OPEN' : 'CLOSED');
        }

        function closeMenu() {
            if (!isMenuOpen) return;
            
            isMenuOpen = false;
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            
            if (backdrop) {
                backdrop.classList.remove('active');
                backdrop.style.opacity = '0';
                backdrop.style.visibility = 'hidden';
            }

            console.log('[Menu] Closed');
        }

        // Add touch-optimized event listeners
        mobileToggle.addEventListener('click', toggleMenu);
        mobileToggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            toggleMenu();
        }, { passive: false });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });

        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
            link.addEventListener('touchend', closeMenu, { passive: true });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        });
    }

    /**
     * Critical Fix 3: Touch Interaction Optimization
     */
    function optimizeTouchInteractions() {
        // Improve touch target sizes and response
        const touchElements = document.querySelectorAll('.btn, .nav-link, .mobile-menu-toggle, .card');
        
        touchElements.forEach(element => {
            // Ensure minimum touch target size
            const computedStyle = window.getComputedStyle(element);
            const width = parseInt(computedStyle.width);
            const height = parseInt(computedStyle.height);
            
            if (width < 44) {
                element.style.minWidth = '44px';
                element.style.paddingLeft = Math.max(12, (44 - width) / 2) + 'px';
                element.style.paddingRight = Math.max(12, (44 - width) / 2) + 'px';
            }
            
            if (height < 44) {
                element.style.minHeight = '44px';
                element.style.paddingTop = Math.max(8, (44 - height) / 2) + 'px';
                element.style.paddingBottom = Math.max(8, (44 - height) / 2) + 'px';
            }

            // Add better touch feedback
            element.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
                this.style.transform = 'scale(0.95) translateZ(0)';
                this.style.transition = 'transform 0.05s ease';
                
                // Visual feedback
                this.style.backgroundColor = this.style.backgroundColor || 'rgba(255, 107, 53, 0.1)';
            }, { passive: true });

            element.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.backgroundColor = '';
                }, 100);

                // Prevent double-tap zoom
                const now = Date.now();
                if (now - lastTouchEnd <= config.tapTimeout) {
                    e.preventDefault();
                }
                lastTouchEnd = now;

                // Haptic feedback for buttons
                if (this.classList.contains('btn') && navigator.vibrate) {
                    navigator.vibrate(20);
                }

                console.log('[Touch] Element touched, duration:', touchDuration + 'ms');
            }, { passive: false });

            element.addEventListener('touchcancel', function() {
                this.style.transform = '';
                this.style.backgroundColor = '';
            }, { passive: true });
        });

        // Add swipe gesture support
        let startX, startY, endX, endY;
        
        document.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', function(e) {
            if (!e.changedTouches[0]) return;
            
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Detect swipe gestures
            if (Math.abs(deltaX) > config.swipeThreshold || Math.abs(deltaY) > config.swipeThreshold) {
                const direction = Math.abs(deltaX) > Math.abs(deltaY) 
                    ? (deltaX > 0 ? 'right' : 'left')
                    : (deltaY > 0 ? 'down' : 'up');
                
                // Dispatch custom swipe event
                const swipeEvent = new CustomEvent('swipe', {
                    detail: { direction, deltaX, deltaY, target: e.target }
                });
                document.dispatchEvent(swipeEvent);
                
                console.log('[Swipe] Direction:', direction, 'Delta:', deltaX, deltaY);
            }
        }, { passive: true });
    }

    /**
     * High Priority Fix 1: Form Input Improvements
     */
    function improveFormInputs() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Set appropriate input modes
            if (input.type === 'email' && !input.hasAttribute('inputmode')) {
                input.setAttribute('inputmode', 'email');
            } else if (input.type === 'tel' && !input.hasAttribute('inputmode')) {
                input.setAttribute('inputmode', 'tel');
            } else if (input.type === 'number' && !input.hasAttribute('inputmode')) {
                input.setAttribute('inputmode', 'numeric');
            }

            // Ensure 16px font size to prevent zoom on iOS
            if (window.innerWidth <= 768) {
                const computedFontSize = window.getComputedStyle(input).fontSize;
                if (parseInt(computedFontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            }

            // Add better focus/blur handling
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
                this.style.transition = 'transform 0.2s ease';
                
                // Scroll into view with offset for mobile keyboards
                setTimeout(() => {
                    this.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center',
                        inline: 'nearest'
                    });
                }, 300);
            });

            input.addEventListener('blur', function() {
                this.style.transform = '';
            });
        });
    }

    /**
     * High Priority Fix 2: Haptic Feedback
     */
    function addHapticFeedback() {
        // Check for vibration API support
        if (!navigator.vibrate) {
            console.log('[Haptic] Vibration API not supported');
            return;
        }

        // Add haptic feedback to key interactions
        document.addEventListener('swipe', function(e) {
            navigator.vibrate(15);
        });

        // Button press feedback
        document.addEventListener('click', function(e) {
            if (e.target.closest('.btn, .nav-link')) {
                navigator.vibrate(10);
            }
        });

        // Menu toggle feedback
        document.addEventListener('menuToggle', function() {
            navigator.vibrate([10, 50, 10]);
        });

        console.log('[Haptic] Feedback enabled');
    }

    /**
     * Performance Optimization for Mobile
     */
    function optimizePerformance() {
        // Detect device performance level
        const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                        navigator.deviceMemory <= 2 ||
                        /Android.*4\.|Android.*5\./.test(navigator.userAgent);

        if (isLowEnd) {
            config.performanceMode = 'performance';
            console.log('[Performance] Low-end device detected, enabling performance mode');
        }

        // Apply performance optimizations
        if (config.performanceMode === 'performance') {
            // Disable complex animations
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    .performance-mode * {
                        animation-duration: 0.1s !important;
                        transition-duration: 0.1s !important;
                    }
                    
                    .performance-mode .fire-gradient,
                    .performance-mode .particle,
                    .performance-mode [data-parallax] {
                        display: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
            document.body.classList.add('performance-mode');
        }

        // Use Intersection Observer for performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });

            // Observe elements that need lazy loading
            document.querySelectorAll('.lazy-load').forEach(el => {
                observer.observe(el);
            });
        }

        // Optimize scroll performance
        let ticking = false;
        function updateScrollPosition() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Update scroll-dependent elements
                    const scrollY = window.pageYOffset;
                    document.body.setAttribute('data-scroll', scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', updateScrollPosition, { passive: true });
    }

    /**
     * Add debug information for testing
     */
    function addDebugInfo() {
        if (window.location.hostname !== 'localhost' && 
            !window.location.search.includes('debug=true')) {
            return;
        }

        const debugInfo = document.createElement('div');
        debugInfo.className = 'debug-mobile';
        debugInfo.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 107, 53, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 11px;
            z-index: 10000;
            font-family: monospace;
            pointer-events: none;
            max-width: 150px;
            font-weight: bold;
        `;

        function updateDebugInfo() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const vh = height * 0.01;
            const deviceType = width <= 768 ? '📱' : width <= 1024 ? '📱' : '🖥️';
            const orientation = width > height ? 'L' : 'P';
            const pixelRatio = window.devicePixelRatio || 1;
            
            debugInfo.innerHTML = `
                ${deviceType} ${width}×${height}<br>
                VH: ${vh.toFixed(1)}px ${orientation}<br>
                DPR: ${pixelRatio}x<br>
                Touch: ${('ontouchstart' in window) ? '✓' : '✗'}
            `;
        }

        updateDebugInfo();
        window.addEventListener('resize', updateDebugInfo);
        window.addEventListener('orientationchange', updateDebugInfo);
        
        document.body.appendChild(debugInfo);
        console.log('[Debug] Mobile debug info enabled');
    }

    /**
     * Initialize fixes when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for external testing
    window.MobileFixes = {
        isInitialized: () => isInitialized,
        config,
        reinitialize: init
    };

})();