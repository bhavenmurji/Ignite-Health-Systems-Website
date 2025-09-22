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
            }, 2000);
            
            // End intro after animation completes (extended for better pacing)
            setTimeout(() => {
                this.endIntro();
            }, 4500);
        },
        
        playIntroSound() {
            // Create a subtle whoosh sound using Web Audio API
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const duration = 2;
                
                // Create white noise
                const bufferSize = audioContext.sampleRate * duration;
                const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = (Math.random() * 2 - 1) * 0.05; // Very quiet white noise
                }
                
                const whiteNoise = audioContext.createBufferSource();
                whiteNoise.buffer = buffer;
                
                // Create filter for whoosh effect
                const filter = audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(200, audioContext.currentTime);
                filter.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.5);
                filter.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + duration);
                
                // Create gain for fade in/out
                const gainNode = audioContext.createGain();
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + duration - 0.5);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
                
                // Connect nodes
                whiteNoise.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Play sound
                whiteNoise.start(audioContext.currentTime);
                whiteNoise.stop(audioContext.currentTime + duration);
            } catch (e) {
                // Silently fail if audio is not supported
                console.log('Intro sound not available');
            }
        },
        
        createParticles() {
            const particleCount = 20;
            const colors = ['#ff6b35', '#ff4500', '#ff8c00'];
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 4 + 's';
                particle.style.animationDuration = (4 + Math.random() * 2) + 's';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.width = particle.style.height = (2 + Math.random() * 4) + 'px';
                
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
            }, 1000);
            
            // Trigger any page animations
            this.triggerPageAnimations();
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