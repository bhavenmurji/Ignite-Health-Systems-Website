/**
 * Ignite Health Systems - Cinematic Intro Controller
 * Creates an engaging first-time visitor experience
 */

(function() {
    'use strict';

    const IntroController = {
        overlay: null,
        typewriter: null,
        hasPlayed: false,
        
        messages: [
            "Revolutionizing Healthcare Technology",
            "Where Innovation Meets Patient Care",
            "Empowering Physicians, Transforming Lives"
        ],
        
        // Audio for cinematic effect
        introSound: null,
        
        init() {
            // Check if intro has already played this session
            this.hasPlayed = sessionStorage.getItem('introPlayed') === 'true';
            
            this.overlay = document.getElementById('intro-overlay');
            if (!this.overlay) return;
            
            if (this.hasPlayed) {
                // Skip intro for returning visitors in same session
                this.overlay.classList.add('hidden');
                return;
            }
            
            // Prevent scrolling during intro
            document.body.style.overflow = 'hidden';
            
            // Start the intro sequence
            this.startIntro();
        },
        
        startIntro() {
            // Get typewriter element
            this.typewriter = document.querySelector('.typewriter');
            
            // Add floating particles
            this.createParticles();
            
            // Create and play intro sound (subtle whoosh)
            this.playIntroSound();
            
            // Start typewriter effect after logo and title animations
            setTimeout(() => {
                this.typewriterEffect();
            }, 1800);
            
            // End intro after animation completes (optimized timing)
            setTimeout(() => {
                this.endIntro();
            }, 4000);
        },
        
        playIntroSound() {
            // Skip audio on mobile/low-end devices for performance
            const isMobile = window.innerWidth <= 768;
            const isLowEnd = navigator.hardwareConcurrency <= 2;
            
            if (isMobile || isLowEnd) return;
            
            // Create a subtle whoosh sound using Web Audio API
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const duration = 1.5; // Reduced duration for performance
                
                // Create white noise with smaller buffer
                const bufferSize = audioContext.sampleRate * duration;
                const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                
                // Use RAF for non-blocking noise generation
                let i = 0;
                const generateNoise = () => {
                    const batchSize = 1024; // Process in smaller batches
                    const end = Math.min(i + batchSize, bufferSize);
                    
                    for (; i < end; i++) {
                        data[i] = (Math.random() * 2 - 1) * 0.03; // Quieter
                    }
                    
                    if (i < bufferSize) {
                        requestAnimationFrame(generateNoise);
                    } else {
                        playGeneratedSound();
                    }
                };
                
                const playGeneratedSound = () => {
                    const whiteNoise = audioContext.createBufferSource();
                    whiteNoise.buffer = buffer;
                    
                    // Optimized filter chain
                    const filter = audioContext.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(300, audioContext.currentTime);
                    filter.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.3);
                    filter.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + duration);
                    
                    const gainNode = audioContext.createGain();
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
                    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.2);
                    
                    whiteNoise.connect(filter);
                    filter.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    whiteNoise.start(audioContext.currentTime);
                    whiteNoise.stop(audioContext.currentTime + duration);
                };
                
                generateNoise();
            } catch (e) {
                // Silently fail if audio is not supported
                console.log('Intro sound not available');
            }
        },
        
        createParticles() {
            // Reduce particles on mobile for performance
            const isMobile = window.innerWidth <= 768;
            const particleCount = isMobile ? 8 : 16;
            const colors = ['#ff6b35', '#ff4500', '#ff8c00'];
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = (Math.random() * 2 + 0.5) + 's';
                particle.style.animationDuration = (3 + Math.random() * 1.5) + 's';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.width = particle.style.height = (2 + Math.random() * 3) + 'px';
                particle.style.willChange = 'transform, opacity';
                particle.style.transform = 'translateZ(0)';
                
                this.overlay.appendChild(particle);
            }
        },
        
        typewriterEffect() {
            if (!this.typewriter) return;
            
            const message = this.messages[Math.floor(Math.random() * this.messages.length)];
            let index = 0;
            
            const type = () => {
                if (index < message.length) {
                    this.typewriter.textContent = message.substring(0, index + 1);
                    index++;
                    setTimeout(type, 50);
                }
            };
            
            type();
        },
        
        endIntro() {
            // Prevent multiple calls
            if (this.overlay.classList.contains('fade-out')) return;
            
            // Fade out the overlay
            this.overlay.classList.add('fade-out');
            
            // Allow scrolling again
            document.body.style.overflow = '';
            
            // Mark intro as played
            sessionStorage.setItem('introPlayed', 'true');
            
            // Remove overlay from DOM after fade
            setTimeout(() => {
                this.overlay.classList.add('hidden');
                // Clean up particles
                const particles = this.overlay.querySelectorAll('.particle');
                particles.forEach(p => p.remove());
            }, 600);
            
            // Trigger any page animations
            setTimeout(() => {
                this.triggerPageAnimations();
            }, 300);
        },
        
        triggerPageAnimations() {
            // Add entrance animations to hero content
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.animation = 'fadeInUp 1s ease-out';
            }
            
            // Animate navigation
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.animation = 'slideDown 0.5s ease-out';
            }
        },
        
        // Skip intro on click/tap
        skipIntro() {
            if (this.overlay && !this.overlay.classList.contains('fade-out')) {
                // Clear all timeouts
                const highestTimeoutId = setTimeout(() => {}, 0);
                for (let i = 0; i < highestTimeoutId; i++) {
                    clearTimeout(i);
                }
                
                this.endIntro();
            }
        }
    };
    
    // Add skip functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.intro-overlay')) {
            IntroController.skipIntro();
        }
    });
    
    // Add entrance animations to CSS
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-100%);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Mobile optimizations for intro */
        @media (max-width: 768px) {
            .intro-title {
                font-size: 2.5rem;
            }
            
            .intro-logo-img {
                width: 100px;
            }
            
            .intro-tagline {
                font-size: 1rem;
            }
            
            .particle {
                display: none; /* Disable particles on mobile for performance */
            }
        }
    `;
    document.head.appendChild(animationStyles);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => IntroController.init());
    } else {
        IntroController.init();
    }
    
    // Expose to global scope for debugging
    window.IntroController = IntroController;
})();