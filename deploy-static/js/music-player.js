/**
 * Ignite Health Systems - Ambient Background Music Player
 * Persistent audio experience across all pages
 */

(function() {
    'use strict';

    const MusicPlayer = {
        audio: null,
        isPlaying: false,
        isMuted: false,
        volume: 0.3, // Default volume (30%)
        fadeInDuration: 2000,
        fadeOutDuration: 1000,
        loopDuration: 27, // Loop after 27 seconds
        
        init() {
            // Check if music player already exists (for page navigation)
            const existingAudio = window.sessionStorage.getItem('musicPlaying');
            const currentTime = window.sessionStorage.getItem('musicTime');
            const savedVolume = window.sessionStorage.getItem('musicVolume');
            const savedMuted = window.sessionStorage.getItem('musicMuted');
            
            // Restore saved volume
            if (savedVolume) {
                this.volume = parseFloat(savedVolume);
            }
            
            // Restore mute state
            this.isMuted = savedMuted === 'true';
            
            this.createPlayer();
            this.createControls();
            
            // Apply saved settings to controls
            if (savedVolume) {
                document.getElementById('volume-slider').value = this.volume * 100;
            }
            
            if (this.isMuted) {
                this.toggleMute(); // This will set up the muted state properly
            }
            
            if (existingAudio === 'true' && currentTime) {
                // Ensure loaded time is within loop duration
                const time = parseFloat(currentTime);
                this.audio.currentTime = time < this.loopDuration ? time : 0;
                this.play();
            } else if (!existingAudio) {
                // Auto-play on first visit (with user interaction)
                this.setupAutoPlay();
            }
            
            // Save state before page unload
            window.addEventListener('beforeunload', () => this.saveState());
            
            // Update time periodically
            setInterval(() => this.saveState(), 1000);
        },
        
        createPlayer() {
            this.audio = new Audio();
            this.audio.loop = false; // We'll handle looping manually
            this.audio.volume = 0;
            this.audio.preload = 'auto'; // Preload audio for better performance
            this.audio.crossOrigin = 'anonymous'; // Enable CORS for audio
            
            // Add metadata for better browser handling
            this.audio.setAttribute('aria-label', 'Background ambient music');
            
            // Try multiple audio formats for browser compatibility
            this.audioSources = [
                'assets/audio/backing-music-compressed.mp3',
                'assets/audio/backing-music.mp3',
                'assets/audio/backing-music.ogg',
                'public/assets/audio/backing-music-compressed.mp3',
                'public/assets/audio/backing-music.mp3'
            ];
            
            this.loadAudioSource();
            
            this.audio.addEventListener('loadeddata', () => {
                console.log('New backing music loaded successfully');
            });
            
            // Handle custom 27-second loop
            this.audio.addEventListener('timeupdate', () => {
                if (this.audio.currentTime >= this.loopDuration) {
                    this.audio.currentTime = 0;
                }
            });
        },
        
        loadAudioSource() {
            let sourceIndex = 0;
            
            const tryNextSource = () => {
                if (sourceIndex < this.audioSources.length) {
                    this.audio.src = this.audioSources[sourceIndex];
                    console.log(`Trying audio source: ${this.audioSources[sourceIndex]}`);
                    sourceIndex++;
                } else {
                    console.warn('All audio sources failed to load');
                    // Fallback to online source as last resort
                    this.audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
                }
            };
            
            this.audio.addEventListener('error', tryNextSource);
            this.audio.addEventListener('canplaythrough', () => {
                console.log('New backing music ready to play:', this.audio.src);
                this.showNotification('🎵 New background music loaded!', 2000);
            });
            
            // Start with first source
            tryNextSource();
        },
        
        createControls() {
            const controls = document.createElement('div');
            controls.id = 'music-controls';
            controls.innerHTML = `
                <button id="music-toggle" aria-label="Toggle music">
                    <span class="music-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    </span>
                    <span class="music-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
                <button id="music-mute" aria-label="Mute music">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                </button>
                <div class="volume-control">
                    <input type="range" id="volume-slider" min="0" max="100" value="30" aria-label="Volume">
                </div>
            `;
            
            // Add styles
            const styles = document.createElement('style');
            styles.textContent = `
                #music-controls {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(10, 10, 10, 0.95);
                    backdrop-filter: blur(15px);
                    padding: 12px 20px;
                    border-radius: 50px;
                    border: 1px solid rgba(255, 107, 53, 0.3);
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.1);
                    max-width: 300px;
                }
                
                #music-controls:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 30px rgba(255, 107, 53, 0.2);
                    border-color: rgba(255, 107, 53, 0.5);
                }
                
                #music-toggle, #music-mute {
                    background: none;
                    border: none;
                    color: #ff6b35;
                    cursor: pointer;
                    padding: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                
                #music-toggle:hover, #music-mute:hover {
                    transform: scale(1.1);
                    background: rgba(255, 107, 53, 0.1);
                }
                
                #music-mute.muted {
                    color: #666;
                }
                
                .music-icon {
                    display: block;
                    transition: opacity 0.3s ease;
                }
                
                .music-bars {
                    position: absolute;
                    display: flex;
                    gap: 3px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .playing .music-icon {
                    opacity: 0;
                }
                
                .playing .music-bars {
                    opacity: 1;
                }
                
                .music-bars span {
                    width: 3px;
                    height: 16px;
                    background: linear-gradient(to top, #ff6b35, #ff4500);
                    border-radius: 3px;
                    animation: musicBar 0.8s ease-in-out infinite;
                }
                
                .music-bars span:nth-child(2) {
                    animation-delay: 0.2s;
                    height: 20px;
                }
                
                .music-bars span:nth-child(3) {
                    animation-delay: 0.4s;
                    height: 14px;
                }
                
                @keyframes musicBar {
                    0%, 100% { transform: scaleY(0.5); }
                    50% { transform: scaleY(1); }
                }
                
                .volume-control {
                    width: 0;
                    overflow: hidden;
                    transition: width 0.3s ease;
                }
                
                #music-controls:hover .volume-control {
                    width: 100px;
                }
                
                #volume-slider {
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    outline: none;
                    -webkit-appearance: none;
                    appearance: none;
                    border-radius: 2px;
                }
                
                #volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: #ff6b35;
                    cursor: pointer;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                #volume-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    background: #ff4500;
                }
                
                #volume-slider::-moz-range-thumb {
                    width: 12px;
                    height: 12px;
                    background: #ff6b35;
                    cursor: pointer;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                
                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    #music-controls {
                        bottom: 20px;
                        right: 20px;
                        padding: 10px 15px;
                    }
                    
                    #music-controls:hover .volume-control {
                        width: 80px;
                    }
                }
                
                /* Pulse animation for first-time visitors */
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.7); }
                    70% { box-shadow: 0 0 0 20px rgba(255, 107, 53, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
                }
                
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
            `;
            
            document.head.appendChild(styles);
            document.body.appendChild(controls);
            
            // Add event listeners
            document.getElementById('music-toggle').addEventListener('click', () => this.toggle());
            document.getElementById('music-mute').addEventListener('click', () => this.toggleMute());
            document.getElementById('volume-slider').addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
            
            // Add pulse animation for first-time visitors
            if (!window.sessionStorage.getItem('musicPlaying')) {
                controls.classList.add('pulse-animation');
                setTimeout(() => controls.classList.remove('pulse-animation'), 6000);
            }
        },
        
        setupAutoPlay() {
            // Try to auto-play with user gesture
            const playOnInteraction = () => {
                if (!this.isPlaying) {
                    this.play();
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                }
            };
            
            // Wait for user interaction
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('touchstart', playOnInteraction);
            document.addEventListener('keydown', playOnInteraction);
            
            // Show a subtle notification
            this.showNotification('Click anywhere to enable ambient music');
        },
        
        showNotification(message, duration = 3500) {
            const notification = document.createElement('div');
            notification.className = 'music-notification';
            notification.textContent = message;
            
            const style = document.createElement('style');
            style.textContent = `
                .music-notification {
                    position: fixed;
                    top: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 107, 53, 0.9);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 10000;
                    animation: slideDown 0.5s ease, fadeOut 0.5s ease 3s forwards;
                }
                
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
                
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), duration);
        },
        
        play() {
            if (this.audio) {
                // Ensure we start within the loop duration
                if (this.audio.currentTime >= this.loopDuration) {
                    this.audio.currentTime = 0;
                }
                
                this.audio.play().then(() => {
                    this.isPlaying = true;
                    this.fadeIn();
                    document.getElementById('music-toggle').classList.add('playing');
                    window.sessionStorage.setItem('musicPlaying', 'true');
                }).catch(err => {
                    console.log('Audio play failed:', err);
                });
            }
        },
        
        pause() {
            if (this.audio) {
                this.fadeOut(() => {
                    this.audio.pause();
                    this.isPlaying = false;
                    document.getElementById('music-toggle').classList.remove('playing');
                    window.sessionStorage.setItem('musicPlaying', 'false');
                });
            }
        },
        
        toggle() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        
        setVolume(value) {
            this.volume = value;
            if (this.audio && !this.isMuted) {
                this.audio.volume = value;
            }
            // Update session storage
            window.sessionStorage.setItem('musicVolume', value.toString());
        },
        
        toggleMute() {
            const muteButton = document.getElementById('music-mute');
            const volumeSlider = document.getElementById('volume-slider');
            
            if (this.isMuted) {
                // Unmute
                this.isMuted = false;
                this.audio.volume = this.volume;
                muteButton.classList.remove('muted');
                muteButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                    </svg>
                `;
                volumeSlider.style.opacity = '1';
                window.sessionStorage.setItem('musicMuted', 'false');
            } else {
                // Mute
                this.isMuted = true;
                this.audio.volume = 0;
                muteButton.classList.add('muted');
                muteButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                `;
                volumeSlider.style.opacity = '0.5';
                window.sessionStorage.setItem('musicMuted', 'true');
            }
        },
        
        fadeIn() {
            const startVolume = 0;
            const endVolume = this.volume;
            const duration = this.fadeInDuration;
            const steps = 30;
            const stepTime = duration / steps;
            const volumeStep = (endVolume - startVolume) / steps;
            
            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                this.audio.volume = Math.min(startVolume + (volumeStep * currentStep), endVolume);
                
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                }
            }, stepTime);
        },
        
        fadeOut(callback) {
            const startVolume = this.audio.volume;
            const duration = this.fadeOutDuration;
            const steps = 20;
            const stepTime = duration / steps;
            const volumeStep = startVolume / steps;
            
            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                this.audio.volume = Math.max(startVolume - (volumeStep * currentStep), 0);
                
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    if (callback) callback();
                }
            }, stepTime);
        },
        
        saveState() {
            if (this.audio && this.isPlaying) {
                // Save time within the loop duration
                const loopTime = this.audio.currentTime % this.loopDuration;
                window.sessionStorage.setItem('musicTime', loopTime.toString());
                window.sessionStorage.setItem('musicVolume', this.volume.toString());
            }
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => MusicPlayer.init());
    } else {
        MusicPlayer.init();
    }
    
    // Expose to global scope for debugging
    window.MusicPlayer = MusicPlayer;
})();