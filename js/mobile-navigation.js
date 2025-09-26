/**
 * Ignite Health Systems - Mobile Navigation Controller
 * Handles mobile menu interactions, viewport management, and touch optimizations
 */

class MobileNavigationController {
    constructor() {
        this.isMenuOpen = false;
        this.isAnimating = false;
        this.touchStartY = 0;
        this.viewportHeight = window.innerHeight;
        
        // DOM elements
        this.mobileToggle = null;
        this.navMenu = null;
        this.backdrop = null;
        this.body = document.body;
        this.html = document.documentElement;
        
        // Throttle and debounce utilities
        this.resizeTimeout = null;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        this.initViewport();
        this.setupDOM();
        this.bindEvents();
        this.initAccessibility();
        this.optimizePerformance();
        
        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.postInit());
        } else {
            this.postInit();
        }
    }
    
    initViewport() {
        // Set CSS custom properties for viewport units
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--mobile-vh', `${vh}px`);
            this.viewportHeight = window.innerHeight;
        };
        
        setViewportHeight();
        
        // Update on resize with throttling
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(setViewportHeight, 150);
        }, { passive: true });
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(setViewportHeight, 200);
        }, { passive: true });
    }
    
    setupDOM() {
        // Get or create mobile toggle
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (!this.mobileToggle) {
            this.createMobileToggle();
        }
        
        // Get navigation menu
        this.navMenu = document.querySelector('.nav-menu');
        if (!this.navMenu) {
            console.warn('Navigation menu not found');
            return;
        }
        
        // Create or get backdrop
        this.backdrop = document.querySelector('.mobile-menu-backdrop');
        if (!this.backdrop) {
            this.createBackdrop();
        }
        
        // Setup hamburger animation
        this.setupHamburgerAnimation();
    }
    
    createMobileToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.setAttribute('aria-label', 'Toggle mobile menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Insert into navigation
        const nav = document.querySelector('.navbar .nav-container');
        if (nav) {
            nav.appendChild(toggle);
            this.mobileToggle = toggle;
        }
    }
    
    createBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);
        this.backdrop = backdrop;
    }
    
    setupHamburgerAnimation() {
        if (!this.mobileToggle) return;
        
        // Ensure hamburger has proper structure
        const spans = this.mobileToggle.querySelectorAll('span');
        if (spans.length !== 3) {
            this.mobileToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
        }
    }
    
    bindEvents() {
        if (!this.mobileToggle || !this.navMenu) return;
        
        // Mobile toggle click with debouncing
        let toggleTimeout;
        this.mobileToggle.addEventListener('click', (e) => {
            clearTimeout(toggleTimeout);
            toggleTimeout = setTimeout(() => {
                this.handleToggleClick(e);
            }, 50);
        }, { passive: false });
        
        // Backdrop click
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.closeMenu();
            }, { passive: true });
        }
        
        // Menu link clicks
        const menuLinks = this.navMenu.querySelectorAll('.nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            }, { passive: true });
        });
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        }, { passive: true });
        
        // Handle resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && this.isMenuOpen) {
                    this.closeMenu();
                }
            }, 150);
        }, { passive: true });
        
        // Touch events for better mobile interaction
        this.setupTouchEvents();
        
        // Handle focus trap
        this.setupFocusTrap();
    }
    
    setupTouchEvents() {
        if (!this.navMenu) return;
        
        // Prevent scroll chaining when menu is open
        this.navMenu.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
        }, { passive: false });
        
        this.navMenu.addEventListener('touchmove', (e) => {
            if (!this.isMenuOpen) return;
            
            const currentY = e.touches[0].clientY;
            const scrollTop = this.navMenu.scrollTop;
            const scrollHeight = this.navMenu.scrollHeight;
            const clientHeight = this.navMenu.clientHeight;
            
            // Prevent overscroll
            if (scrollTop === 0 && currentY > this.touchStartY) {
                e.preventDefault();
            }
            
            if (scrollTop + clientHeight >= scrollHeight && currentY < this.touchStartY) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Handle swipe to close
        let startX, startY;
        this.navMenu.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        this.navMenu.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Swipe left to close (threshold: 100px)
            if (Math.abs(diffX) > Math.abs(diffY) && diffX > 100) {
                this.closeMenu();
            }
            
            startX = null;
            startY = null;
        }, { passive: true });
    }
    
    setupFocusTrap() {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        document.addEventListener('keydown', (e) => {
            if (!this.isMenuOpen || e.key !== 'Tab') return;
            
            const focusable = this.navMenu.querySelectorAll(focusableElements);
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
    
    handleToggleClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.isAnimating) return;
        
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        if (this.isAnimating || this.isMenuOpen) return;
        
        this.isAnimating = true;
        this.isMenuOpen = true;
        
        // Prevent body scroll
        const scrollY = window.scrollY;
        this.body.style.position = 'fixed';
        this.body.style.top = `-${scrollY}px`;
        this.body.style.width = '100%';
        this.body.classList.add('menu-open');
        
        // Update ARIA states
        this.mobileToggle.setAttribute('aria-expanded', 'true');
        this.navMenu.setAttribute('aria-hidden', 'false');
        
        // Add active classes with RAF for smooth animation
        requestAnimationFrame(() => {
            this.mobileToggle.classList.add('active');
            this.navMenu.classList.add('active');
            if (this.backdrop) {
                this.backdrop.classList.add('active');
            }
            
            // Focus first menu item
            const firstLink = this.navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 300);
            }
            
            // Reset animation flag
            setTimeout(() => {
                this.isAnimating = false;
            }, 400);
        });
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('mobileMenuOpen'));
    }
    
    closeMenu() {
        if (this.isAnimating || !this.isMenuOpen) return;
        
        this.isAnimating = true;
        this.isMenuOpen = false;
        
        // Update ARIA states
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        this.navMenu.setAttribute('aria-hidden', 'true');
        
        // Remove active classes
        this.mobileToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
        }
        
        // Restore body scroll
        setTimeout(() => {
            const scrollY = this.body.style.top;
            this.body.style.position = '';
            this.body.style.top = '';
            this.body.style.width = '';
            this.body.classList.remove('menu-open');
            
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
            
            this.isAnimating = false;
        }, 350);
        
        // Focus mobile toggle
        this.mobileToggle.focus();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('mobileMenuClose'));
    }
    
    initAccessibility() {
        // Set initial ARIA states
        if (this.mobileToggle) {
            this.mobileToggle.setAttribute('aria-expanded', 'false');
            this.mobileToggle.setAttribute('aria-controls', 'mobile-nav-menu');
        }
        
        if (this.navMenu) {
            this.navMenu.setAttribute('id', 'mobile-nav-menu');
            this.navMenu.setAttribute('aria-hidden', 'true');
            this.navMenu.setAttribute('role', 'navigation');
            this.navMenu.setAttribute('aria-label', 'Mobile navigation');
        }
        
        // Add skip link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #ff6b35;
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.transform = 'translateY(0)';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.transform = 'translateY(-100%)';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    optimizePerformance() {
        // Use Intersection Observer for menu visibility
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Menu is visible, ensure smooth animations
                        this.enableSmoothAnimations();
                    } else {
                        // Menu is hidden, disable animations for performance
                        this.disableSmoothAnimations();
                    }
                });
            });
            
            if (this.navMenu) {
                observer.observe(this.navMenu);
            }
        }
        
        // Passive event listeners where possible
        this.addPassiveScrollListener();
        
        // Preload menu state for faster animations
        this.preloadMenuState();
    }
    
    enableSmoothAnimations() {
        if (this.navMenu) {
            this.navMenu.style.willChange = 'transform';
        }
        if (this.mobileToggle) {
            this.mobileToggle.style.willChange = 'transform';
        }
    }
    
    disableSmoothAnimations() {
        if (this.navMenu) {
            this.navMenu.style.willChange = 'auto';
        }
        if (this.mobileToggle) {
            this.mobileToggle.style.willChange = 'auto';
        }
    }
    
    addPassiveScrollListener() {
        let ticking = false;
        
        const updateScrollPosition = () => {
            if (this.isMenuOpen) {
                // Handle scroll position when menu is open
                this.handleMenuScroll();
            }
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }, { passive: true });
    }
    
    handleMenuScroll() {
        // Additional scroll handling when menu is open
        if (window.scrollY > 100) {
            // Auto-close menu on significant scroll (if needed)
            // this.closeMenu();
        }
    }
    
    preloadMenuState() {
        // Create a style element to preload CSS states
        const preloadStyle = document.createElement('style');
        preloadStyle.textContent = `
            .nav-menu::before { content: ''; }
            .mobile-menu-toggle::before { content: ''; }
            .mobile-menu-backdrop::before { content: ''; }
        `;
        document.head.appendChild(preloadStyle);
        
        // Remove after a short delay
        setTimeout(() => {
            document.head.removeChild(preloadStyle);
        }, 100);
    }
    
    postInit() {
        // Final initialization steps
        this.checkUserPreferences();
        this.initDebugMode();
        
        // Dispatch ready event
        window.dispatchEvent(new CustomEvent('mobileNavigationReady'));
    }
    
    checkUserPreferences() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.classList.add('reduced-motion');
        }
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('reduced-motion');
            } else {
                document.documentElement.classList.remove('reduced-motion');
            }
        });
        
        // Check for high contrast preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        
        if (prefersHighContrast.matches) {
            document.documentElement.classList.add('high-contrast');
        }
        
        prefersHighContrast.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.classList.add('high-contrast');
            } else {
                document.documentElement.classList.remove('high-contrast');
            }
        });
    }
    
    initDebugMode() {
        // Add debug information in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const debugElement = document.createElement('div');
            debugElement.className = 'debug-mobile';
            debugElement.textContent = `${window.innerWidth}x${window.innerHeight}`;
            document.body.appendChild(debugElement);
            
            // Update on resize
            window.addEventListener('resize', () => {
                debugElement.textContent = `${window.innerWidth}x${window.innerHeight}`;
            }, { passive: true });
        }
    }
    
    // Public API methods
    open() {
        this.openMenu();
    }
    
    close() {
        this.closeMenu();
    }
    
    toggle() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    getState() {
        return {
            isOpen: this.isMenuOpen,
            isAnimating: this.isAnimating,
            viewportHeight: this.viewportHeight
        };
    }
    
    destroy() {
        // Cleanup method
        if (this.isMenuOpen) {
            this.closeMenu();
        }
        
        // Remove event listeners
        clearTimeout(this.resizeTimeout);
        clearTimeout(this.scrollTimeout);
        
        // Dispatch destroyed event
        window.dispatchEvent(new CustomEvent('mobileNavigationDestroyed'));
    }
}

// Auto-initialize when DOM is ready
let mobileNav = null;

function initMobileNavigation() {
    if (!mobileNav) {
        mobileNav = new MobileNavigation();
        
        // Expose to global scope for debugging
        window.IgniteMobileNav = mobileNav;
    }
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNavigation);
} else {
    initMobileNavigation();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && mobileNav && mobileNav.isMenuOpen) {
        mobileNav.closeMenu();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavigation;
}

if (typeof window !== 'undefined') {
    window.MobileNavigation = MobileNavigation;
}