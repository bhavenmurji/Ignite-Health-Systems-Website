/**
 * Ignite Health Systems - Advanced Animation Library
 * Professional visual effects and animations for healthcare transformation
 */

(function() {
    'use strict';

    // Animation configuration
    const config = {
        particleCount: 50,
        scrollThreshold: 0.15,
        animationDuration: 1000,
        staggerDelay: 100,
        parallaxSpeed: 0.5,
        glowIntensity: 0.8
    };

    // Professional color palette
    const colors = {
        primary: '#ff6b35',
        accent: '#ff4500',
        gold: '#ffb347',
        ember: '#8b0000',
        dark: '#1a0f0a',
        background: '#0d0d0d'
    };

    /**
     * Initialize all animation systems
     */
    function init() {
        initParallaxEffects();
        initScrollAnimations();
        initHoverEffects();
        initTypewriterEffects();
        initGlowEffects();
        initProgressBars();
        initCounterAnimations();
        initMorphingBackgrounds();
        initFloatingElements();
        initPageTransitions();
    }

    /**
     * Parallax scrolling effects
     */
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;
        
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || config.parallaxSpeed;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }

    /**
     * Scroll-triggered animations with Intersection Observer
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, [data-animate]');
        
        if (animatedElements.length === 0) return;
        
        const observerOptions = {
            threshold: config.scrollThreshold,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                        
                        // Add specific animation class if specified
                        const animationType = entry.target.dataset.animate;
                        if (animationType) {
                            entry.target.classList.add(`animate-${animationType}`);
                        }
                        
                        // Trigger custom event
                        entry.target.dispatchEvent(new CustomEvent('animated'));
                    }, index * config.staggerDelay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Advanced hover effects
     */
    function initHoverEffects() {
        // 3D card tilt effect
        const cards = document.querySelectorAll('.card, .feature-card, .credential-card, .role-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function(e) {
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            });
        });
        
        // Magnetic button effect
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translate(0, 0)';
            });
        });
    }

    /**
     * Typewriter effect for headings
     */
    function initTypewriterEffects() {
        const typewriterElements = document.querySelectorAll('[data-typewriter]');
        
        typewriterElements.forEach(element => {
            const text = element.textContent;
            const speed = parseInt(element.dataset.typewriterSpeed) || 50;
            element.textContent = '';
            element.style.visibility = 'visible';
            
            let i = 0;
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            // Start typing when element is in view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    type();
                    observer.disconnect();
                }
            });
            
            observer.observe(element);
        });
    }

    /**
     * Glow effects for important elements
     */
    function initGlowEffects() {
        const glowElements = document.querySelectorAll('[data-glow]');
        
        glowElements.forEach(element => {
            const glowColor = element.dataset.glowColor || colors.primary;
            const glowSize = element.dataset.glowSize || '20px';
            
            element.style.position = 'relative';
            
            // Create glow element
            const glow = document.createElement('div');
            glow.className = 'glow-effect';
            glow.style.cssText = `
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: ${glowColor};
                filter: blur(${glowSize});
                opacity: 0;
                z-index: -1;
                transition: opacity 0.3s ease;
                pointer-events: none;
            `;
            
            element.appendChild(glow);
            
            element.addEventListener('mouseenter', () => {
                glow.style.opacity = config.glowIntensity;
            });
            
            element.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });
        });
    }

    /**
     * Animated progress bars
     */
    function initProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        progressBars.forEach(bar => {
            const progress = parseInt(bar.dataset.progress);
            const duration = parseInt(bar.dataset.duration) || 2000;
            
            bar.style.width = '0%';
            bar.style.transition = `width ${duration}ms ease-out`;
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setTimeout(() => {
                        bar.style.width = `${progress}%`;
                    }, 100);
                    observer.disconnect();
                }
            });
            
            observer.observe(bar);
        });
    }

    /**
     * Animated counter effects
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseInt(counter.dataset.duration) || 2000;
            const start = 0;
            const increment = target / (duration / 16);
            
            let current = start;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
            
            observer.observe(counter);
        });
    }

    /**
     * Morphing gradient backgrounds
     */
    function initMorphingBackgrounds() {
        const morphElements = document.querySelectorAll('[data-morph]');
        
        morphElements.forEach(element => {
            let degree = 0;
            
            function updateGradient() {
                degree = (degree + 1) % 360;
                element.style.background = `linear-gradient(${degree}deg, ${colors.primary}, ${colors.gold}, ${colors.accent})`;
                requestAnimationFrame(updateGradient);
            }
            
            updateGradient();
        });
    }

    /**
     * Floating elements animation
     */
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('[data-float]');
        
        floatingElements.forEach(element => {
            const amplitude = parseInt(element.dataset.floatAmplitude) || 10;
            const speed = parseFloat(element.dataset.floatSpeed) || 2;
            
            let time = 0;
            
            function float() {
                time += 0.01 * speed;
                const y = Math.sin(time) * amplitude;
                const x = Math.cos(time * 0.5) * (amplitude * 0.5);
                element.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(float);
            }
            
            float();
        });
    }

    /**
     * Smooth page transitions
     */
    function initPageTransitions() {
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
            z-index: 10000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        // Intercept internal links
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.target !== '_blank') {
                    e.preventDefault();
                    const href = this.href;
                    
                    overlay.style.opacity = '1';
                    overlay.style.pointerEvents = 'all';
                    
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });
    }

    /**
     * Add CSS for animations
     */
    function injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Animation base styles */
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .animate-on-scroll.animated {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Specific animations */
            .animate-fade-in {
                animation: fadeIn 0.8s ease forwards;
            }
            
            .animate-slide-up {
                animation: slideUp 0.8s ease forwards;
            }
            
            .animate-slide-left {
                animation: slideLeft 0.8s ease forwards;
            }
            
            .animate-slide-right {
                animation: slideRight 0.8s ease forwards;
            }
            
            .animate-zoom-in {
                animation: zoomIn 0.8s ease forwards;
            }
            
            .animate-rotate-in {
                animation: rotateIn 0.8s ease forwards;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideLeft {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideRight {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes zoomIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @keyframes rotateIn {
                from {
                    opacity: 0;
                    transform: rotate(-180deg) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: rotate(0) scale(1);
                }
            }
            
            /* Pulse animation for CTAs */
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.5);
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 20px 10px rgba(255, 107, 53, 0);
                }
            }
            
            .pulse-animation {
                animation: pulse 2s infinite;
            }
            
            /* Shimmer effect */
            @keyframes shimmer {
                0% {
                    background-position: -200% 0;
                }
                100% {
                    background-position: 200% 0;
                }
            }
            
            .shimmer {
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(255, 255, 255, 0.1) 50%, 
                    transparent 100%);
                background-size: 200% 100%;
                animation: shimmer 3s infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectAnimationStyles();
            init();
        });
    } else {
        injectAnimationStyles();
        init();
    }

    // Expose API for external use
    window.IgniteAnimations = {
        init,
        config,
        colors
    };
})();