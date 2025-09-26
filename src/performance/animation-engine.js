/**
 * Advanced Animation Engine - Ignite Health Systems
 * High-performance animation system with hardware acceleration and adaptive optimization
 */

class IgniteAnimationEngine {
    constructor() {
        this.config = {
            targetFPS: 60,
            frameTimeBudget: 16.67, // ms for 60fps
            adaptiveQuality: true,
            hardwareAcceleration: true,
            prioritySystem: true,
            debugMode: false
        };

        this.state = {
            currentFPS: 60,
            frameDrops: 0,
            activeAnimations: new Map(),
            performanceMode: 'high',
            lastFrameTime: 0,
            avgFrameTime: 16.67
        };

        this.queues = {
            high: [], // Critical UI (navigation, modals)
            medium: [], // Content animations (cards, text)
            low: [], // Decorative (particles, background effects)
            cleanup: []
        };

        this.initialize();
    }

    initialize() {
        this.detectCapabilities();
        this.setupFrameMonitoring();
        this.createHardwareAcceleration();
        this.setupIntersectionObserver();
        this.bindEventListeners();
        
        if (this.config.debugMode) {
            this.createDebugPanel();
        }
    }

    detectCapabilities() {
        // Detect device performance capabilities
        const hardwareConcurrency = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 4;
        const connection = navigator.connection?.effectiveType || '4g';
        
        // Determine performance tier
        if (hardwareConcurrency >= 8 && memory >= 8) {
            this.state.performanceMode = 'high';
        } else if (hardwareConcurrency >= 4 && memory >= 4) {
            this.state.performanceMode = 'medium';
        } else {
            this.state.performanceMode = 'low';
        }

        // Adjust settings based on capabilities
        if (this.state.performanceMode === 'low') {
            this.config.targetFPS = 30;
            this.config.frameTimeBudget = 33.33;
        }

        console.log(`Animation Engine initialized - Performance mode: ${this.state.performanceMode}`);
    }

    setupFrameMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const monitor = (currentTime) => {
            frameCount++;
            
            // Calculate frame time
            if (this.state.lastFrameTime > 0) {
                const frameTime = currentTime - this.state.lastFrameTime;
                this.state.avgFrameTime = (this.state.avgFrameTime * 0.9) + (frameTime * 0.1);
                
                // Detect frame drops
                if (frameTime > this.config.frameTimeBudget * 1.5) {
                    this.state.frameDrops++;
                    this.handleFrameDrop();
                }
            }
            
            this.state.lastFrameTime = currentTime;
            
            // Calculate FPS every second
            if (currentTime - lastTime >= 1000) {
                this.state.currentFPS = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                this.adaptPerformance();
            }
            
            this.processAnimationQueues();
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }

    handleFrameDrop() {
        // Temporarily reduce animation quality
        if (this.config.adaptiveQuality) {
            this.queues.low = []; // Skip low priority animations
            
            // Reduce particles if any
            document.querySelectorAll('.particle').forEach(particle => {
                if (Math.random() > 0.5) particle.style.display = 'none';
            });
        }
    }

    adaptPerformance() {
        const { currentFPS, performanceMode } = this.state;
        
        if (currentFPS < 30 && performanceMode !== 'emergency') {
            this.state.performanceMode = 'emergency';
            document.body.classList.add('emergency-performance');
            this.disableNonCriticalAnimations();
        } else if (currentFPS > 50 && performanceMode === 'emergency') {
            this.state.performanceMode = 'medium';
            document.body.classList.remove('emergency-performance');
        }
    }

    createHardwareAcceleration() {
        const style = document.createElement('style');
        style.id = 'ignite-hardware-acceleration';
        style.textContent = `
            .ignite-gpu-layer {
                transform: translateZ(0);
                backface-visibility: hidden;
                perspective: 1000px;
                will-change: transform, opacity;
            }
            
            .ignite-3d-accelerated {
                transform: translate3d(0, 0, 0);
                transform-style: preserve-3d;
            }
            
            .ignite-optimized-transition {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                           opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            /* Emergency performance mode */
            .emergency-performance * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            
            .emergency-performance .particle,
            .emergency-performance [data-priority="low"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupIntersectionObserver() {
        const options = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.queueAnimation(entry.target, 'enter');
                } else {
                    this.queueAnimation(entry.target, 'exit');
                }
            });
        }, options);

        // Observe elements with animation attributes
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.observer.observe(el);
        });
    }

    queueAnimation(element, type, priority = 'medium') {
        const animation = {
            element,
            type,
            timestamp: performance.now(),
            id: Math.random().toString(36).substr(2, 9)
        };

        // Add to appropriate queue based on priority
        if (this.queues[priority]) {
            this.queues[priority].push(animation);
        }

        // Apply hardware acceleration immediately
        this.applyHardwareAcceleration(element);
    }

    processAnimationQueues() {
        const budget = this.config.frameTimeBudget * 0.8; // Reserve 20% for other tasks
        const startTime = performance.now();

        // Process high priority first
        ['high', 'medium', 'low'].forEach(priority => {
            while (this.queues[priority].length > 0 && (performance.now() - startTime) < budget) {
                const animation = this.queues[priority].shift();
                this.executeAnimation(animation);
            }
        });

        // Process cleanup queue
        while (this.queues.cleanup.length > 0 && (performance.now() - startTime) < budget) {
            const cleanup = this.queues.cleanup.shift();
            cleanup();
        }
    }

    executeAnimation(animation) {
        const { element, type, id } = animation;
        
        // Skip if element is no longer in DOM
        if (!document.contains(element)) return;

        // Register active animation
        this.state.activeAnimations.set(id, animation);

        switch (type) {
            case 'enter':
                this.animateEnter(element);
                break;
            case 'exit':
                this.animateExit(element);
                break;
            case 'hover':
                this.animateHover(element);
                break;
            case 'focus':
                this.animateFocus(element);
                break;
        }

        // Schedule cleanup
        setTimeout(() => {
            this.state.activeAnimations.delete(id);
            this.cleanupElementStyles(element);
        }, 1000);
    }

    animateEnter(element) {
        const animationType = element.dataset.animate || 'fadeIn';
        
        // Apply initial state
        element.style.willChange = 'transform, opacity';
        
        switch (animationType) {
            case 'fadeIn':
                element.style.opacity = '0';
                requestAnimationFrame(() => {
                    element.style.transition = 'opacity 0.6s ease-out';
                    element.style.opacity = '1';
                });
                break;
                
            case 'slideUp':
                element.style.opacity = '0';
                element.style.transform = 'translate3d(0, 30px, 0)';
                requestAnimationFrame(() => {
                    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translate3d(0, 0, 0)';
                });
                break;
                
            case 'scaleIn':
                element.style.opacity = '0';
                element.style.transform = 'scale3d(0.8, 0.8, 1)';
                requestAnimationFrame(() => {
                    element.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'scale3d(1, 1, 1)';
                });
                break;
        }
    }

    animateExit(element) {
        element.style.transition = 'opacity 0.3s ease-out';
        element.style.opacity = '0.5';
    }

    animateHover(element) {
        if (this.state.performanceMode === 'emergency') return;
        
        element.style.transform = 'translate3d(0, -2px, 0) scale3d(1.02, 1.02, 1)';
    }

    animateFocus(element) {
        element.style.outline = '2px solid rgba(255, 107, 53, 0.5)';
        element.style.boxShadow = '0 0 0 4px rgba(255, 107, 53, 0.1)';
    }

    applyHardwareAcceleration(element) {
        if (!this.config.hardwareAcceleration) return;
        
        element.classList.add('ignite-gpu-layer');
        
        // Force composite layer creation
        if (!element.style.transform.includes('translateZ')) {
            element.style.transform = (element.style.transform || '') + ' translateZ(0)';
        }
    }

    cleanupElementStyles(element) {
        this.queues.cleanup.push(() => {
            element.style.willChange = 'auto';
            if (element.style.transform === 'translateZ(0)') {
                element.style.transform = '';
            }
        });
    }

    disableNonCriticalAnimations() {
        // Hide particles
        document.querySelectorAll('.particle').forEach(p => p.style.display = 'none');
        
        // Simplify complex animations
        document.querySelectorAll('[data-priority="low"]').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }

    // Intro animation optimization
    optimizeIntroSequence() {
        const overlay = document.getElementById('intro-overlay');
        if (!overlay) return;

        // Apply hardware acceleration to all intro elements
        const introElements = overlay.querySelectorAll('*');
        introElements.forEach(el => this.applyHardwareAcceleration(el));

        // Optimize timing to prevent conflicts
        const sequence = [
            { element: '.intro-logo', delay: 0, duration: 600 },
            { element: '.intro-title .word:nth-child(1)', delay: 400, duration: 400 },
            { element: '.intro-title .word:nth-child(2)', delay: 600, duration: 400 },
            { element: '.intro-title .word:nth-child(3)', delay: 800, duration: 400 },
            { element: '.intro-progress', delay: 1000, duration: 3000 },
            { element: '.typewriter', delay: 1200, duration: 2000 }
        ];

        sequence.forEach(({ element, delay, duration }) => {
            setTimeout(() => {
                const el = overlay.querySelector(element);
                if (el) this.queueAnimation(el, 'enter', 'high');
            }, delay);
        });
    }

    bindEventListeners() {
        // Optimize hover animations
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('.btn, .card, .nav-link')) {
                this.queueAnimation(e.target, 'hover', 'medium');
            }
        }, { passive: true });

        // Optimize focus animations
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('input, button, a')) {
                this.queueAnimation(e.target, 'focus', 'high');
            }
        }, { passive: true });

        // Handle reduced motion preference
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedMotion.addListener((e) => {
            if (e.matches) {
                this.state.performanceMode = 'emergency';
                this.disableNonCriticalAnimations();
            }
        });
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'animation-debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            width: 200px;
        `;
        
        document.body.appendChild(panel);
        
        setInterval(() => {
            panel.innerHTML = `
                <div>FPS: ${this.state.currentFPS}</div>
                <div>Avg Frame: ${this.state.avgFrameTime.toFixed(1)}ms</div>
                <div>Drops: ${this.state.frameDrops}</div>
                <div>Mode: ${this.state.performanceMode}</div>
                <div>Active: ${this.state.activeAnimations.size}</div>
                <div>Queued: ${Object.values(this.queues).reduce((sum, queue) => sum + queue.length, 0)}</div>
            `;
        }, 1000);
    }

    // Public API
    animate(element, type, priority = 'medium') {
        this.queueAnimation(element, type, priority);
    }

    setPerformanceMode(mode) {
        this.state.performanceMode = mode;
        if (mode === 'emergency') {
            this.disableNonCriticalAnimations();
        }
    }

    getMetrics() {
        return {
            fps: this.state.currentFPS,
            avgFrameTime: this.state.avgFrameTime,
            frameDrops: this.state.frameDrops,
            performanceMode: this.state.performanceMode,
            activeAnimations: this.state.activeAnimations.size
        };
    }
}

// Initialize animation engine
const animationEngine = new IgniteAnimationEngine();

// Export for external use
window.IgniteAnimationEngine = animationEngine;

export default animationEngine;