/**
 * Ignite Health Systems - Enhanced Intro Animation with Performance Optimization
 * Uses the advanced animation engine for smooth, hardware-accelerated intro sequence
 */

class IgniteIntroEnhanced {
    constructor() {
        this.config = {
            skipForReturningVisitors: true,
            enableAudio: true,
            enableParticles: true,
            hardwareAcceleration: true,
            reducedMotionSupport: true,
            performanceOptimized: true
        };
        
        this.elements = {
            overlay: null,
            typewriter: null,
            logo: null,
            title: null
        };
        
        this.state = {
            hasPlayed: false,
            isPlaying: false,
            currentMessage: 0,
            animationEngine: null
        };
        
        this.messages = [
            "Revolutionizing Healthcare Technology",
            "Where Innovation Meets Patient Care", 
            "Empowering Physicians, Transforming Lives"
        ];
        
        this.timings = {
            logoFade: 1000,
            titleAppear: 1500,
            typewriterStart: 2500,
            typewriterSpeed: 80,
            messageDisplay: 3000,
            totalSequence: 8000
        };
        
        this.init();
    }
    
    async init() {
        try {
            // Check if intro should be skipped
            if (this.shouldSkipIntro()) {
                this.skipIntro();
                return;
            }
            
            // Get DOM elements
            this.initElements();
            
            // Wait for animation engine to be available
            await this.waitForAnimationEngine();
            
            // Check for reduced motion preference
            if (this.config.reducedMotionSupport && this.prefersReducedMotion()) {
                this.playReducedMotionIntro();
            } else {
                this.playFullIntro();
            }
            
        } catch (error) {
            console.error('[Intro Enhanced] Initialization failed:', error);
            this.skipIntro(); // Fallback to skip intro on error
        }
    }
    
    shouldSkipIntro() {
        // Skip for returning visitors in same session
        if (this.config.skipForReturningVisitors) {
            return sessionStorage.getItem('igniteIntroPlayed') === 'true';
        }
        
        // Skip if no intro overlay exists
        return !document.getElementById('intro-overlay');
    }
    
    initElements() {
        this.elements.overlay = document.getElementById('intro-overlay');
        this.elements.typewriter = document.querySelector('.typewriter');
        this.elements.logo = document.querySelector('.intro-logo-img');
        this.elements.title = document.querySelector('.intro-title');
        
        if (!this.elements.overlay) {
            throw new Error('Intro overlay not found');
        }
        
        // Prevent scrolling during intro
        document.body.style.overflow = 'hidden';
    }
    
    async waitForAnimationEngine(timeout = 5000) {
        const start = Date.now();
        
        while (!window.IgnitePerformance?.systems?.animationEngine && Date.now() - start < timeout) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        if (window.IgnitePerformance?.systems?.animationEngine) {
            this.state.animationEngine = window.IgnitePerformance.systems.animationEngine;
            console.log('[Intro Enhanced] Animation engine connected');
        } else {
            console.warn('[Intro Enhanced] Animation engine not available, using fallback');
        }
    }
    
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    async playFullIntro() {
        console.log('[Intro Enhanced] Starting full intro sequence');
        this.state.isPlaying = true;
        
        try {
            // Apply hardware acceleration to all intro elements
            this.applyHardwareAcceleration();
            
            // Create floating particles
            if (this.config.enableParticles) {
                this.createParticles();
            }
            
            // Play intro sound
            if (this.config.enableAudio) {
                this.playIntroSound();
            }
            
            // Start animation sequence
            await this.playAnimationSequence();
            
            // Complete intro
            this.completeIntro();
            
        } catch (error) {
            console.error('[Intro Enhanced] Error during intro playback:', error);
            this.skipIntro();
        }
    }
    
    async playReducedMotionIntro() {
        console.log('[Intro Enhanced] Playing reduced motion intro');
        
        // Simple fade-in with no complex animations
        this.elements.overlay.style.opacity = '1';
        this.elements.logo.style.opacity = '1';
        this.elements.title.style.opacity = '1';
        
        // Show final message immediately
        if (this.elements.typewriter) {
            this.elements.typewriter.textContent = this.messages[this.messages.length - 1];
        }
        
        // Quick fade out after 2 seconds
        setTimeout(() => {
            this.completeIntro();
        }, 2000);
    }
    
    applyHardwareAcceleration() {
        const elements = [
            this.elements.overlay,
            this.elements.logo,
            this.elements.title,
            this.elements.typewriter
        ].filter(Boolean);
        
        elements.forEach(element => {
            if (this.state.animationEngine) {
                this.state.animationEngine.applyHardwareAcceleration(element);
            } else {
                // Fallback hardware acceleration
                element.style.transform = 'translateZ(0)';
                element.style.willChange = 'auto';
                element.style.backfaceVisibility = 'hidden';
            }
        });
    }
    
    async playAnimationSequence() {
        const engine = this.state.animationEngine;
        
        // Step 1: Logo fade in
        await this.animateElement(this.elements.logo, {
            from: { opacity: 0, transform: 'scale(0.8) translateY(20px)' },
            to: { opacity: 1, transform: 'scale(1) translateY(0)' },
            duration: this.timings.logoFade,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            priority: 'high'
        });
        
        // Step 2: Title appear
        await this.animateElement(this.elements.title, {
            from: { opacity: 0, transform: 'translateY(30px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
            duration: this.timings.titleAppear,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            priority: 'high',
            delay: 300
        });
        
        // Step 3: Typewriter effect
        await this.playTypewriterSequence();
        
        // Step 4: Final flourish
        await this.playFinalFlourish();
    }
    
    async animateElement(element, options) {
        if (!element) return Promise.resolve();
        
        return new Promise((resolve) => {
            const {
                from = {},
                to = {},
                duration = 500,
                easing = 'ease',
                delay = 0,
                priority = 'medium'
            } = options;
            
            // Apply initial state
            Object.assign(element.style, from);
            
            const startAnimation = () => {
                if (this.state.animationEngine) {
                    // Use animation engine
                    this.state.animationEngine.queueAnimation(() => {
                        element.style.transition = `all ${duration}ms ${easing}`;
                        Object.assign(element.style, to);
                        
                        setTimeout(() => {
                            element.style.transition = '';
                            resolve();
                        }, duration);
                    }, { priority });
                } else {
                    // Fallback animation
                    element.style.transition = `all ${duration}ms ${easing}`;
                    Object.assign(element.style, to);
                    
                    setTimeout(() => {
                        element.style.transition = '';
                        resolve();
                    }, duration);
                }
            };
            
            if (delay > 0) {
                setTimeout(startAnimation, delay);
            } else {
                startAnimation();
            }
        });
    }
    
    async playTypewriterSequence() {
        if (!this.elements.typewriter) return;
        
        for (let messageIndex = 0; messageIndex < this.messages.length; messageIndex++) {
            const message = this.messages[messageIndex];
            
            // Clear previous message
            this.elements.typewriter.textContent = '';
            
            // Type out message
            await this.typeMessage(message);
            
            // Display complete message
            if (messageIndex < this.messages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, this.timings.messageDisplay));
            }
        }
    }
    
    async typeMessage(message) {
        return new Promise((resolve) => {
            let charIndex = 0;
            
            const typeChar = () => {
                if (charIndex < message.length) {
                    this.elements.typewriter.textContent = message.substring(0, charIndex + 1);
                    charIndex++;
                    
                    // Variable typing speed for more natural feel
                    const delay = this.timings.typewriterSpeed + Math.random() * 40 - 20;
                    setTimeout(typeChar, delay);
                } else {
                    resolve();
                }
            };
            
            typeChar();
        });
    }
    
    async playFinalFlourish() {
        // Add subtle scale and glow effect to complete intro
        const elements = [this.elements.logo, this.elements.title];
        
        const flourishPromises = elements.map(element => {
            if (!element) return Promise.resolve();
            
            return this.animateElement(element, {
                from: { transform: 'scale(1)' },
                to: { transform: 'scale(1.02)' },
                duration: 300,
                easing: 'ease-in-out'
            }).then(() => {
                return this.animateElement(element, {
                    from: { transform: 'scale(1.02)' },
                    to: { transform: 'scale(1)' },
                    duration: 300,
                    easing: 'ease-in-out'
                });
            });
        });
        
        await Promise.all(flourishPromises);
    }
    
    createParticles() {
        const particleCount = this.prefersReducedMotion() ? 5 : 15;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createSingleParticle();
            }, Math.random() * 3000);
        }
    }
    
    createSingleParticle() {
        const particle = document.createElement('div');
        particle.className = 'intro-particle';
        
        // Particle styles
        Object.assign(particle.style, {
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'rgba(255, 107, 53, 0.6)',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: '1000',
            left: Math.random() * window.innerWidth + 'px',
            top: window.innerHeight + 'px'
        });
        
        // Apply hardware acceleration to particle
        if (this.state.animationEngine) {
            this.state.animationEngine.applyHardwareAcceleration(particle);
        }
        
        this.elements.overlay.appendChild(particle);
        
        // Animate particle
        this.animateParticle(particle);
    }
    
    animateParticle(particle) {
        const startY = window.innerHeight;
        const endY = -100;
        const duration = 4000 + Math.random() * 2000;
        
        this.animateElement(particle, {
            from: {
                transform: `translateY(${startY}px) translateX(0) scale(0)`,
                opacity: 0
            },
            to: {
                transform: `translateY(${endY}px) translateX(${Math.random() * 100 - 50}px) scale(1)`,
                opacity: 1
            },
            duration: duration * 0.2,
            easing: 'ease-out'
        }).then(() => {
            return this.animateElement(particle, {
                from: { opacity: 1 },
                to: { opacity: 0 },
                duration: duration * 0.8,
                easing: 'ease-in'
            });
        }).then(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
    }
    
    playIntroSound() {
        try {
            // Create subtle whoosh sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create oscillator for whoosh effect
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Configure whoosh sound
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
        } catch (error) {
            console.log('[Intro Enhanced] Audio not available:', error);
        }
    }
    
    completeIntro() {
        console.log('[Intro Enhanced] Completing intro sequence');
        
        // Mark as played
        sessionStorage.setItem('igniteIntroPlayed', 'true');
        this.state.isPlaying = false;
        
        // Fade out intro
        this.animateElement(this.elements.overlay, {
            from: { opacity: 1 },
            to: { opacity: 0 },
            duration: 800,
            easing: 'ease-in-out'
        }).then(() => {
            this.elements.overlay.style.display = 'none';
            document.body.style.overflow = '';
            
            // Trigger completion event
            window.dispatchEvent(new CustomEvent('ignite-intro-complete'));
        });
    }
    
    skipIntro() {
        console.log('[Intro Enhanced] Skipping intro');
        
        if (this.elements.overlay) {
            this.elements.overlay.style.display = 'none';
        }
        document.body.style.overflow = '';
        
        // Mark as played to prevent future playback
        sessionStorage.setItem('igniteIntroPlayed', 'true');
        
        // Trigger completion event
        window.dispatchEvent(new CustomEvent('ignite-intro-complete'));
    }
    
    // Public API
    play() {
        if (!this.state.isPlaying) {
            this.playFullIntro();
        }
    }
    
    stop() {
        this.skipIntro();
    }
    
    reset() {
        sessionStorage.removeItem('igniteIntroPlayed');
        this.state.hasPlayed = false;
    }
}

// Initialize enhanced intro when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.IgniteIntroEnhanced = new IgniteIntroEnhanced();
    });
} else {
    window.IgniteIntroEnhanced = new IgniteIntroEnhanced();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IgniteIntroEnhanced;
}