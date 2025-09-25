/**
 * Ignite Health Systems - JavaScript Performance Optimizer
 * Comprehensive performance enhancements for animations, mobile interactions, and UI smoothness
 */

(function() {
    'use strict';

    // Performance optimization configuration
    const config = {
        // Animation performance settings
        animation: {
            useRAF: true,
            debounceDelay: 16, // 60fps target
            animationThreshold: 100, // Skip animations if CPU is overloaded
            reducedMotionSupport: true
        },
        
        // Mobile optimization settings
        mobile: {
            touchDelayThreshold: 300,
            scrollThreshold: 5,
            orientationChangeDelay: 150,
            maxParticles: 8,
            simplifyAnimations: true
        },
        
        // Hardware acceleration settings
        hardware: {
            forceGPU: true,
            use3DTransforms: true,
            enableWillChange: true,
            compositingLayers: ['transform', 'opacity', 'filter']
        },
        
        // Calculator performance settings
        calculator: {
            updateDelay: 150,
            batchUpdates: true,
            useMemoization: true
        }
    };

    // Performance monitoring
    const metrics = {
        animationFrames: 0,
        droppedFrames: 0,
        lastFrameTime: 0,
        avgFrameTime: 16.67, // Target 60fps
        isThrottled: false
    };

    // Memoization cache for calculator
    const calculatorCache = new Map();

    /**
     * Initialize performance optimizations
     */
    function init() {
        optimizeAnimationPerformance();
        optimizeIntroAnimation();
        optimizeMobileMenu();
        implementHardwareAcceleration();
        optimizeROICalculator();
        resolveAnimationConflicts();
        setupFrameRateMonitoring();
        optimizeScrollPerformance();
        setupReducedMotionSupport();
        optimizeEventListeners();
    }

    /**
     * Optimize animation performance with RAF and throttling
     */
    function optimizeAnimationPerformance() {
        // Replace CSS animations with optimized JavaScript animations
        const animatedElements = document.querySelectorAll('.animate-on-scroll, [data-animate]');
        const animationQueue = [];
        let rafId = null;

        function processAnimationQueue() {
            const startTime = performance.now();
            
            // Process animations in batches to avoid frame drops
            const batchSize = metrics.isThrottled ? 2 : 5;
            const batch = animationQueue.splice(0, batchSize);
            
            batch.forEach(({ element, animation }) => {
                executeOptimizedAnimation(element, animation);
            });

            // Continue processing if queue has items and we have time
            if (animationQueue.length > 0 && (performance.now() - startTime) < 10) {
                rafId = requestAnimationFrame(processAnimationQueue);
            } else {
                rafId = null;
            }
        }

        function queueAnimation(element, animation) {
            animationQueue.push({ element, animation });
            
            if (!rafId) {
                rafId = requestAnimationFrame(processAnimationQueue);
            }
        }

        // Enhanced Intersection Observer with performance optimizations
        const observerOptions = {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '50px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
                    const animationType = entry.target.dataset.animate || 'fade-in';
                    queueAnimation(entry.target, animationType);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            // Apply hardware acceleration immediately
            applyHardwareAcceleration(element);
            observer.observe(element);
        });
    }

    /**
     * Execute optimized animations with hardware acceleration
     */
    function executeOptimizedAnimation(element, animationType) {
        // Ensure element has hardware acceleration
        applyHardwareAcceleration(element);
        
        // Set initial state
        element.style.willChange = 'transform, opacity';
        
        const animations = {
            'fade-in': () => {
                element.style.opacity = '0';
                element.style.transform = 'translateZ(0)';
                
                requestAnimationFrame(() => {
                    element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                });
            },
            
            'slide-up': () => {
                element.style.opacity = '0';
                element.style.transform = 'translate3d(0, 30px, 0)';
                
                requestAnimationFrame(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translate3d(0, 0, 0)';
                });
            },
            
            'slide-left': () => {
                element.style.opacity = '0';
                element.style.transform = 'translate3d(50px, 0, 0)';
                
                requestAnimationFrame(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translate3d(0, 0, 0)';
                });
            },
            
            'zoom-in': () => {
                element.style.opacity = '0';
                element.style.transform = 'scale3d(0.8, 0.8, 1)';
                
                requestAnimationFrame(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'scale3d(1, 1, 1)';
                });
            }
        };

        const animationFn = animations[animationType] || animations['fade-in'];
        animationFn();

        // Clean up will-change after animation completes
        setTimeout(() => {
            element.style.willChange = 'auto';
        }, 600);
    }

    /**
     * Optimize intro animation performance
     */
    function optimizeIntroAnimation() {
        const introOverlay = document.getElementById('intro-overlay');
        if (!introOverlay) return;

        // Apply immediate hardware acceleration to intro elements
        const introElements = introOverlay.querySelectorAll('.intro-logo, .intro-title, .intro-tagline');
        introElements.forEach(element => {
            applyHardwareAcceleration(element);
            element.style.willChange = 'transform, opacity';
        });

        // Optimize typewriter effect
        const typewriter = document.querySelector('.typewriter');
        if (typewriter) {
            applyHardwareAcceleration(typewriter);
            
            // Use requestAnimationFrame for smoother typewriter effect
            const originalTypewriterFn = window.IntroController?.typewriterEffect;
            if (originalTypewriterFn) {
                window.IntroController.typewriterEffect = function() {
                    if (!this.typewriter) return;
                    
                    const message = this.messages[Math.floor(Math.random() * this.messages.length)];
                    let index = 0;
                    
                    const typeChar = () => {
                        if (index < message.length) {
                            this.typewriter.textContent = message.substring(0, index + 1);
                            index++;
                            
                            // Use RAF instead of setTimeout for smoother animation
                            requestAnimationFrame(() => {
                                setTimeout(typeChar, 50);
                            });
                        }
                    };
                    
                    typeChar();
                };
            }
        }

        // Optimize particle generation for intro
        if (window.IntroController?.createParticles) {
            const originalCreateParticles = window.IntroController.createParticles;
            window.IntroController.createParticles = function() {
                const isMobile = window.innerWidth <= 768;
                const isLowEnd = navigator.hardwareConcurrency <= 2;
                
                if (isMobile || isLowEnd) {
                    // Skip particles on low-end devices
                    return;
                }
                
                originalCreateParticles.call(this);
                
                // Apply hardware acceleration to particles
                const particles = this.overlay.querySelectorAll('.particle');
                particles.forEach(particle => {
                    applyHardwareAcceleration(particle);
                    particle.style.willChange = 'transform';
                });
            };
        }
    }

    /**
     * Optimize mobile menu JavaScript
     */
    function optimizeMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;

        if (!mobileToggle || !navMenu) return;

        let isAnimating = false;
        let menuState = false;

        // Debounced toggle function
        const debouncedToggle = debounce((e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (isAnimating) return;
            
            isAnimating = true;
            menuState = !menuState;
            
            // Apply hardware acceleration to menu elements
            applyHardwareAcceleration(navMenu);
            applyHardwareAcceleration(mobileToggle);
            
            // Use transform instead of class toggling for better performance
            if (menuState) {
                navMenu.style.transform = 'translateX(0)';
                navMenu.style.visibility = 'visible';
                mobileToggle.classList.add('active');
                body.style.overflow = 'hidden';
            } else {
                navMenu.style.transform = 'translateX(-100%)';
                mobileToggle.classList.remove('active');
                body.style.overflow = '';
                
                // Hide menu after animation
                setTimeout(() => {
                    if (!menuState) {
                        navMenu.style.visibility = 'hidden';
                    }
                }, 300);
            }
            
            // Reset animation flag
            setTimeout(() => {
                isAnimating = false;
            }, 300);
            
        }, 50);

        // Replace click handler with optimized version
        mobileToggle.removeEventListener('click', mobileToggle.clickHandler);
        mobileToggle.addEventListener('click', debouncedToggle, { passive: false });

        // Optimize close handlers
        const optimizedCloseMenu = () => {
            if (menuState && !isAnimating) {
                isAnimating = true;
                menuState = false;
                
                navMenu.style.transform = 'translateX(-100%)';
                mobileToggle.classList.remove('active');
                body.style.overflow = '';
                
                setTimeout(() => {
                    navMenu.style.visibility = 'hidden';
                    isAnimating = false;
                }, 300);
            }
        };

        // Use passive listeners where possible
        document.addEventListener('click', (e) => {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                optimizedCloseMenu();
            }
        }, { passive: true });

        // Optimize resize handler
        const optimizedResize = throttle(() => {
            if (window.innerWidth > 768 && menuState) {
                optimizedCloseMenu();
            }
        }, 250);

        window.addEventListener('resize', optimizedResize, { passive: true });
    }

    /**
     * Implement hardware acceleration
     */
    function implementHardwareAcceleration() {
        // Elements that benefit from hardware acceleration
        const acceleratedSelectors = [
            '.hero',
            '.navbar',
            '.btn',
            '.card',
            '.feature-card',
            '.testimonial-card',
            '.intro-overlay',
            '.nav-menu',
            '.calculator-container',
            '[data-animate]',
            '.animate-on-scroll'
        ];

        acceleratedSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                applyHardwareAcceleration(element);
            });
        });

        // Create CSS rules for hardware acceleration
        const style = document.createElement('style');
        style.textContent = `
            .gpu-accelerated {
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
            }
            
            .gpu-accelerated-3d {
                transform: translate3d(0, 0, 0);
                transform-style: preserve-3d;
            }
            
            /* Optimize common animations */
            .btn, .nav-link, .card {
                will-change: auto;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .btn:hover, .nav-link:hover, .card:hover {
                will-change: transform, box-shadow;
            }
            
            /* Optimize scroll-triggered elements */
            .animate-on-scroll {
                contain: layout style paint;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Apply hardware acceleration to an element
     */
    function applyHardwareAcceleration(element) {
        if (!element) return;
        
        element.style.backfaceVisibility = 'hidden';
        element.style.perspective = '1000px';
        
        if (config.hardware.use3DTransforms) {
            element.style.transform = element.style.transform || 'translate3d(0, 0, 0)';
        } else {
            element.style.transform = element.style.transform || 'translateZ(0)';
        }
        
        element.classList.add('gpu-accelerated');
    }

    /**
     * Optimize ROI Calculator with debouncing and memoization
     */
    function optimizeROICalculator() {
        const inputs = [
            document.getElementById('patients-per-day'),
            document.getElementById('minutes-per-note'),
            document.getElementById('working-days')
        ];

        const outputs = {
            currentTime: document.getElementById('current-time'),
            timeSaved: document.getElementById('time-saved'),
            monthlyValue: document.getElementById('monthly-value')
        };

        if (!inputs.every(input => input) || !Object.values(outputs).every(output => output)) {
            return;
        }

        // Memoized calculation function
        function calculateROI(patientsPerDay, minutesPerNote, workingDays) {
            const cacheKey = `${patientsPerDay}-${minutesPerNote}-${workingDays}`;
            
            if (config.calculator.useMemoization && calculatorCache.has(cacheKey)) {
                return calculatorCache.get(cacheKey);
            }

            const currentMinutesPerWeek = patientsPerDay * minutesPerNote * workingDays;
            const currentHoursPerWeek = Math.round(currentMinutesPerWeek / 60 * 10) / 10;
            
            const timeReduction = 0.4; // 40% reduction
            const timesSavedHours = Math.round(currentHoursPerWeek * timeReduction * 10) / 10;
            
            const hourlyValue = 200; // Assumed physician hourly value
            const monthlySavings = Math.round(timesSavedHours * 4 * hourlyValue);

            const result = {
                currentHours: currentHoursPerWeek,
                savedHours: timesSavedHours,
                monthlySavings: monthlySavings
            };

            if (config.calculator.useMemoization) {
                calculatorCache.set(cacheKey, result);
            }

            return result;
        }

        // Optimized update function with RAF
        const updateCalculator = throttle(() => {
            const patientsPerDay = parseInt(inputs[0].value) || 20;
            const minutesPerNote = parseInt(inputs[1].value) || 15;
            const workingDays = parseInt(inputs[2].value) || 5;

            const result = calculateROI(patientsPerDay, minutesPerNote, workingDays);

            // Use RAF for smooth updates
            requestAnimationFrame(() => {
                // Animate number changes
                animateValue(outputs.currentTime, result.currentHours, 'hours/week');
                animateValue(outputs.timeSaved, result.savedHours, 'hours/week');
                animateValue(outputs.monthlyValue, result.monthlySavings, 'saved', true);
            });
        }, config.calculator.updateDelay);

        // Add optimized event listeners
        inputs.forEach(input => {
            input.addEventListener('input', updateCalculator, { passive: true });
            
            // Apply hardware acceleration to inputs for smooth interactions
            applyHardwareAcceleration(input);
        });

        // Initial calculation
        updateCalculator();
    }

    /**
     * Animate value changes in calculator
     */
    function animateValue(element, targetValue, suffix, isDollar = false) {
        const currentValue = parseFloat(element.textContent.replace(/[^\d.]/g, '')) || 0;
        const difference = targetValue - currentValue;
        const steps = 30; // Animation steps
        const stepValue = difference / steps;
        let step = 0;

        function animate() {
            if (step < steps) {
                const value = currentValue + (stepValue * step);
                const displayValue = isDollar 
                    ? `$${Math.round(value).toLocaleString()} ${suffix}`
                    : `${Math.round(value * 10) / 10} ${suffix}`;
                
                element.textContent = displayValue;
                step++;
                requestAnimationFrame(animate);
            } else {
                const finalValue = isDollar 
                    ? `$${targetValue.toLocaleString()} ${suffix}`
                    : `${targetValue} ${suffix}`;
                element.textContent = finalValue;
            }
        }

        animate();
    }

    /**
     * Resolve animation conflicts
     */
    function resolveAnimationConflicts() {
        // Prevent multiple animations on the same element
        const animationRegistry = new WeakMap();

        function registerAnimation(element, animationType) {
            if (animationRegistry.has(element)) {
                // Cancel previous animation
                const previousAnimation = animationRegistry.get(element);
                if (previousAnimation.cancelFn) {
                    previousAnimation.cancelFn();
                }
            }

            animationRegistry.set(element, { type: animationType, timestamp: Date.now() });
        }

        // Override existing animation functions to use registry
        const originalRequestAnimationFrame = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            return originalRequestAnimationFrame(() => {
                // Check if we're dropping frames
                const now = performance.now();
                if (metrics.lastFrameTime > 0) {
                    const frameTime = now - metrics.lastFrameTime;
                    metrics.avgFrameTime = (metrics.avgFrameTime * 0.9) + (frameTime * 0.1);
                    
                    if (frameTime > 32) { // More than 2 frames at 60fps
                        metrics.droppedFrames++;
                        metrics.isThrottled = true;
                    } else {
                        metrics.isThrottled = false;
                    }
                }
                
                metrics.lastFrameTime = now;
                metrics.animationFrames++;
                
                callback(now);
            });
        };

        // Priority-based animation queue
        const animationPriorities = {
            'intro': 1,
            'navigation': 2,
            'calculator': 3,
            'scroll': 4,
            'hover': 5
        };

        // Sort animations by priority when system is under load
        if (metrics.isThrottled) {
            // Implement animation priority system here
            console.log('System under load, implementing animation priorities');
        }
    }

    /**
     * Setup frame rate monitoring
     */
    function setupFrameRateMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();

        function monitorFrameRate() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // Adjust performance based on frame rate
                if (fps < 30) {
                    // Enable performance mode
                    document.body.classList.add('performance-mode');
                    config.animation.reducedMotionSupport = true;
                    console.log('Low frame rate detected, enabling performance mode');
                } else if (fps > 55) {
                    // Disable performance mode
                    document.body.classList.remove('performance-mode');
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(monitorFrameRate);
        }

        requestAnimationFrame(monitorFrameRate);
    }

    /**
     * Optimize scroll performance
     */
    function optimizeScrollPerformance() {
        let ticking = false;
        let lastScrollY = window.pageYOffset;

        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.pageYOffset;
                    const deltaY = Math.abs(currentScrollY - lastScrollY);
                    
                    // Only process significant scroll changes
                    if (deltaY > config.mobile.scrollThreshold) {
                        // Update scroll-dependent elements
                        updateScrollDependentElements(currentScrollY, deltaY);
                        lastScrollY = currentScrollY;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        };

        function updateScrollDependentElements(scrollY, deltaY) {
            // Optimized parallax effects
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });

            // Optimized navbar hide/show on mobile
            if (window.innerWidth <= 768) {
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    const direction = scrollY > lastScrollY ? 'down' : 'up';
                    if (direction === 'down' && scrollY > 100) {
                        navbar.style.transform = 'translateY(-100%)';
                    } else if (direction === 'up') {
                        navbar.style.transform = 'translateY(0)';
                    }
                }
            }
        }

        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    }

    /**
     * Setup reduced motion support
     */
    function setupReducedMotionSupport() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        function handleReducedMotion(e) {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
                config.animation.reducedMotionSupport = true;
                
                // Disable complex animations
                const style = document.createElement('style');
                style.textContent = `
                    .reduced-motion * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                `;
                document.head.appendChild(style);
            } else {
                document.body.classList.remove('reduced-motion');
                config.animation.reducedMotionSupport = false;
            }
        }

        prefersReducedMotion.addListener(handleReducedMotion);
        handleReducedMotion(prefersReducedMotion);
    }

    /**
     * Optimize event listeners
     */
    function optimizeEventListeners() {
        // Use passive listeners where possible
        const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
        
        passiveEvents.forEach(eventType => {
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (passiveEvents.includes(type) && typeof options !== 'object') {
                    options = { passive: true };
                } else if (typeof options === 'object' && !options.hasOwnProperty('passive')) {
                    options.passive = true;
                }
                
                return originalAddEventListener.call(this, type, listener, options);
            };
        });
    }

    /**
     * Utility functions
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for debugging and external use
    window.IgnitePerformance = {
        config,
        metrics,
        applyHardwareAcceleration,
        optimizeROICalculator,
        calculateROI: (p, m, w) => {
            const result = calculateROI(p, m, w);
            return result;
        },
        reportMetrics: () => {
            console.log('Performance Metrics:', {
                averageFrameTime: metrics.avgFrameTime.toFixed(2) + 'ms',
                fps: Math.round(1000 / metrics.avgFrameTime),
                droppedFrames: metrics.droppedFrames,
                totalFrames: metrics.animationFrames,
                dropRate: ((metrics.droppedFrames / metrics.animationFrames) * 100).toFixed(2) + '%',
                isThrottled: metrics.isThrottled
            });
        }
    };

})();