/**
 * Optimized Music Player - Replacing "Horrible Music" with New Backing Music
 * High-performance, accessibility-compliant, mobile-optimized audio implementation
 */

(function() {
    'use strict';

    const OptimizedMusicPlayer = {
        audio: null,
        isPlaying: false,
        volume: 0.25, // Optimized default volume (25%)
        fadeInDuration: 1500, // Reduced for faster startup
        fadeOutDuration: 800,  // Reduced for snappier response
        
        // Audio source configuration with MOV support and fallbacks
        audioSources: [
            { src: 'assets/media/Backing music.mov', type: 'video/quicktime', format: 'MOV', quality: 'original', size: 443032 },
            { src: 'assets/audio/new-backing-music-compressed.mp3', type: 'audio/mpeg', format: 'MP3', quality: 'compressed', size: 'small' },
            { src: 'assets/audio/new-backing-music.mp3', type: 'audio/mpeg', format: 'MP3', quality: 'standard', size: 'medium' },
            { src: 'assets/audio/new-backing-music.ogg', type: 'audio/ogg', format: 'OGG', quality: 'standard', size: 'medium' },
            { src: 'assets/audio/backing-music-compressed.mp3', type: 'audio/mpeg', format: 'MP3', quality: 'compressed', size: 'small' },
            { src: 'assets/audio/backing-music.mp3', type: 'audio/mpeg', format: 'MP3', quality: 'standard', size: 'medium' }
        ],
        
        // Performance monitoring
        performanceAnalyzer: null,
        loadStartTime: null,
        
        init() {
            console.log('🎵 Initializing Optimized Music Player...');
            this.loadStartTime = performance.now();
            
            // Initialize performance monitoring
            if (window.AudioPerformanceAnalyzer) {
                this.performanceAnalyzer = new window.AudioPerformanceAnalyzer();
                this.performanceAnalyzer.startAnalysis();
            }
            
            // Check network conditions for adaptive loading
            this.adaptToNetworkConditions();
            
            // Create optimized audio player
            this.createOptimizedPlayer();
            
            // Create accessibility-compliant controls
            this.createAccessibleControls();
            
            // Initialize state management
            this.initializeStateManagement();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            console.log('✅ Music Player initialized in', (performance.now() - this.loadStartTime).toFixed(2), 'ms');
        },
        
        /**
         * Adapt audio quality based on network conditions
         */
        adaptToNetworkConditions() {
            if ('connection' in navigator) {
                const connection = navigator.connection;
                const networkSpeed = connection.effectiveType;
                const saveData = connection.saveData;
                
                // Adjust audio sources based on network
                if (saveData || networkSpeed === 'slow-2g' || networkSpeed === '2g') {
                    console.log('📱 Data saver mode detected - using low-quality audio');
                    this.audioSources = this.audioSources.filter(source => 
                        source.format === 'WebM' || 
                        (source.format === 'MP3' && source.src.includes('compressed'))
                    );
                    this.volume = 0.15; // Lower volume for data saving
                } else if (networkSpeed === '3g') {
                    console.log('📶 3G connection - using balanced quality');
                    // Keep compressed MP3 as primary
                } else {
                    console.log('🚀 Good connection - using high quality audio');
                    // Keep all formats for best compatibility
                }
            }
        },
        
        /**
         * Create optimized audio player with MOV support and progressive loading
         */
        createOptimizedPlayer() {
            // Determine if we need video element for MOV support
            const needsVideoElement = this.audioSources.some(source => 
                source.format === 'MOV' && this.canPlayFormat(source.type)
            );
            
            if (needsVideoElement) {
                this.audio = document.createElement('video');
                this.audio.style.display = 'none'; // Hide video element
                this.audio.muted = false; // We want audio from video
                console.log('🎥 Using video element for MOV support');
            } else {
                this.audio = new Audio();
                console.log('🔊 Using audio element for standard formats');
            }
            
            this.audio.preload = 'none'; // Don't preload to avoid blocking critical path
            this.audio.loop = false; // We'll handle 27-second looping manually
            this.audio.volume = 0;
            this.audio.crossOrigin = 'anonymous';
            
            // Load optimal source based on browser support and network conditions
            this.loadOptimalSource();
            
            // Setup 27-second loop handling
            this.setupCustomLooping();
            
            // Optimized event listeners
            this.audio.addEventListener('loadstart', () => {
                console.log('🎵 Audio loading started');
            });
            
            this.audio.addEventListener('canplaythrough', () => {
                const loadTime = performance.now() - this.loadStartTime;
                console.log('✅ Audio ready to play in', loadTime.toFixed(2), 'ms');
                
                // Report performance metrics
                if (this.performanceAnalyzer) {
                    this.performanceAnalyzer.recordUserInteraction('audio_ready', 'audio-element');
                }
            });
            
            this.audio.addEventListener('error', (e) => {
                console.error('❌ Audio loading failed:', e);
                this.handleAudioError(e);
            });
            
            // Optimize for mobile battery life
            this.audio.addEventListener('pause', () => {
                // Release audio context when paused to save battery
                if (this.audioContext && this.audioContext.state === 'running') {
                    this.audioContext.suspend();
                }
            });
            
            this.audio.addEventListener('play', () => {
                // Resume audio context when playing
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            });
        },
        
        /**
         * Create accessibility-compliant controls
         */
        createAccessibleControls() {
            const controls = document.createElement('div');
            controls.id = 'optimized-music-controls';
            controls.setAttribute('role', 'region');
            controls.setAttribute('aria-label', 'Background music controls');
            
            controls.innerHTML = `
                <button id="music-toggle" 
                        aria-label="Toggle background music" 
                        aria-pressed="false"
                        type="button">
                    <span class="music-icon" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    </span>
                    <span class="visually-hidden">Play background music</span>
                </button>
                
                <div class="volume-control" role="group" aria-label="Volume control">
                    <label for="volume-slider" class="visually-hidden">Volume level</label>
                    <input type="range" 
                           id="volume-slider" 
                           min="0" 
                           max="100" 
                           value="25"
                           aria-label="Volume level"
                           aria-valuemin="0"
                           aria-valuemax="100"
                           aria-valuenow="25">
                    <span class="volume-display" aria-live="polite" aria-atomic="true">25%</span>
                </div>
            `;
            
            // Add optimized styles
            this.injectOptimizedStyles();
            
            document.body.appendChild(controls);
            
            // Add event listeners with performance optimization
            this.addEventListeners();
        },
        
        /**
         * Inject optimized CSS with critical performance considerations
         */
        injectOptimizedStyles() {
            const styles = document.createElement('style');
            styles.textContent = `
                #optimized-music-controls {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 9998;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(15, 15, 15, 0.95);
                    backdrop-filter: blur(8px);
                    padding: 8px 16px;
                    border-radius: 50px;
                    border: 1px solid rgba(255, 107, 53, 0.2);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
                    will-change: transform;
                }
                
                #optimized-music-controls:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 20px rgba(255, 107, 53, 0.15);
                }
                
                #music-toggle {
                    background: none;
                    border: none;
                    color: #ff6b35;
                    cursor: pointer;
                    padding: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.2s ease, transform 0.1s ease;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                }
                
                #music-toggle:hover {
                    color: #ff8556;
                    transform: scale(1.05);
                }
                
                #music-toggle:active {
                    transform: scale(0.98);
                }
                
                #music-toggle:focus {
                    outline: 2px solid #ff6b35;
                    outline-offset: 2px;
                }
                
                #music-toggle[aria-pressed="true"] {
                    color: #ff4500;
                    animation: playing-pulse 2s ease-in-out infinite;
                }
                
                .volume-control {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    opacity: 0;
                    width: 0;
                    overflow: hidden;
                    transition: opacity 0.3s ease, width 0.3s ease;
                }
                
                #optimized-music-controls:hover .volume-control {
                    opacity: 1;
                    width: 80px;
                }
                
                #volume-slider {
                    width: 60px;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.2);
                    outline: none;
                    -webkit-appearance: none;
                    appearance: none;
                    border-radius: 2px;
                    cursor: pointer;
                }
                
                #volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 10px;
                    height: 10px;
                    background: #ff6b35;
                    cursor: pointer;
                    border-radius: 50%;
                    transition: background 0.2s ease;
                }
                
                #volume-slider::-webkit-slider-thumb:hover {
                    background: #ff4500;
                }
                
                .volume-display {
                    font-size: 11px;
                    color: #999;
                    min-width: 25px;
                    text-align: right;
                }
                
                .visually-hidden {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
                
                @keyframes playing-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                /* Mobile optimizations */
                @media (max-width: 768px) {
                    #optimized-music-controls {
                        bottom: 15px;
                        right: 15px;
                        padding: 6px 12px;
                        gap: 8px;
                    }
                    
                    #music-toggle {
                        width: 28px;
                        height: 28px;
                        padding: 4px;
                    }
                    
                    .music-icon svg {
                        width: 16px;
                        height: 16px;
                    }
                    
                    #optimized-music-controls:hover .volume-control {
                        width: 70px;
                    }
                }
                
                /* High contrast mode */
                @media (prefers-contrast: high) {
                    #optimized-music-controls {
                        border: 2px solid #ff6b35;
                        background: rgba(0, 0, 0, 0.9);
                    }
                }
                
                /* Reduced motion */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `;
            
            document.head.appendChild(styles);
        },
        
        /**
         * Add optimized event listeners
         */
        addEventListeners() {
            const toggleButton = document.getElementById('music-toggle');
            const volumeSlider = document.getElementById('volume-slider');
            const volumeDisplay = document.querySelector('.volume-display');
            
            // Debounced toggle to prevent rapid clicking
            let toggleTimeout;
            toggleButton.addEventListener('click', () => {
                clearTimeout(toggleTimeout);
                toggleTimeout = setTimeout(() => this.toggle(), 50);
            });
            
            // Keyboard accessibility
            toggleButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggle();
                }
            });
            
            // Optimized volume control
            let volumeTimeout;
            volumeSlider.addEventListener('input', (e) => {
                clearTimeout(volumeTimeout);
                const value = e.target.value;
                
                // Update display immediately for responsiveness
                volumeDisplay.textContent = value + '%';
                
                // Debounce actual volume change
                volumeTimeout = setTimeout(() => {
                    this.setVolume(value / 100);
                }, 10);
            });
        },
        
        /**
         * Initialize state management with performance optimization
         */
        initializeStateManagement() {
            // Check for saved preferences
            const savedVolume = localStorage.getItem('ignite-audio-volume');
            const savedMuted = localStorage.getItem('ignite-audio-muted') === 'true';
            
            if (savedVolume) {
                this.volume = parseFloat(savedVolume);
                const volumeSlider = document.getElementById('volume-slider');
                if (volumeSlider) {
                    volumeSlider.value = this.volume * 100;
                    document.querySelector('.volume-display').textContent = Math.round(this.volume * 100) + '%';
                }
            }
            
            // Auto-play setup with user interaction compliance
            this.setupAutoPlay();
            
            // Save state before page unload
            window.addEventListener('beforeunload', () => this.saveState());
        },
        
        /**
         * Setup compliant auto-play
         */
        setupAutoPlay() {
            // Progressive enhancement: try to play after user interaction
            const playOnInteraction = (e) => {
                if (!this.isPlaying && e.isTrusted) {
                    this.play();
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                }
            };
            
            // Wait for genuine user interaction
            document.addEventListener('click', playOnInteraction, { passive: true });
            document.addEventListener('touchstart', playOnInteraction, { passive: true });
            document.addEventListener('keydown', playOnInteraction);
        },
        
        /**
         * Performance-optimized play function
         */
        async play() {
            if (!this.audio) return;
            
            try {
                // Progressive loading: only load when needed
                if (this.audio.readyState === 0) {
                    this.audio.preload = 'auto';
                    this.audio.load();
                }
                
                await this.audio.play();
                this.isPlaying = true;
                this.fadeIn();
                
                // Update UI
                const toggleButton = document.getElementById('music-toggle');
                if (toggleButton) {
                    toggleButton.setAttribute('aria-pressed', 'true');
                    toggleButton.querySelector('.visually-hidden').textContent = 'Pause background music';
                }
                
                // Save preference
                localStorage.setItem('ignite-audio-playing', 'true');
                
                console.log('🎵 Audio playback started');
                
            } catch (error) {
                console.warn('⚠️ Audio play failed (browser policy):', error.message);
                this.showPlayPrompt();
            }
        },
        
        /**
         * Performance-optimized pause function
         */
        pause() {
            if (!this.audio) return;
            
            this.fadeOut(() => {
                this.audio.pause();
                this.isPlaying = false;
                
                // Update UI
                const toggleButton = document.getElementById('music-toggle');
                if (toggleButton) {
                    toggleButton.setAttribute('aria-pressed', 'false');
                    toggleButton.querySelector('.visually-hidden').textContent = 'Play background music';
                }
                
                // Save preference
                localStorage.setItem('ignite-audio-playing', 'false');
                
                console.log('⏸️ Audio playback paused');
            });
        },
        
        /**
         * Toggle audio playback
         */
        toggle() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        
        /**
         * Set volume with optimization
         */
        setVolume(value) {
            this.volume = Math.max(0, Math.min(1, value));
            if (this.audio) {
                this.audio.volume = this.isPlaying ? this.volume : 0;
            }
            
            // Save preference
            localStorage.setItem('ignite-audio-volume', this.volume.toString());
        },
        
        /**
         * Optimized fade in
         */
        fadeIn() {
            if (!this.audio) return;
            
            const steps = 20;
            const stepTime = this.fadeInDuration / steps;
            const volumeStep = this.volume / steps;
            
            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                this.audio.volume = Math.min(volumeStep * currentStep, this.volume);
                
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                }
            }, stepTime);
        },
        
        /**
         * Optimized fade out
         */
        fadeOut(callback) {
            if (!this.audio) return;
            
            const startVolume = this.audio.volume;
            const steps = 15;
            const stepTime = this.fadeOutDuration / steps;
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
        
        /**
         * Show user-friendly play prompt for autoplay restrictions
         */
        showPlayPrompt() {
            // Only show if not already shown
            if (document.querySelector('.audio-play-prompt')) return;
            
            const prompt = document.createElement('div');
            prompt.className = 'audio-play-prompt';
            prompt.innerHTML = `
                <div class="prompt-content">
                    <p>🎵 Click to enable ambient background music</p>
                    <button type="button" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            
            // Add minimal styles
            const style = document.createElement('style');
            style.textContent = `
                .audio-play-prompt {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 107, 53, 0.95);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 10000;
                    animation: slideDown 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                .prompt-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .prompt-content p {
                    margin: 0;
                }
                
                .prompt-content button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(prompt);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (prompt.parentElement) {
                    prompt.remove();
                }
            }, 5000);
        },
        
        /**
         * Handle audio loading errors gracefully
         */
        handleAudioError(error) {
            console.error('🚨 Audio Error:', error);
            
            // Try alternative source if available
            const currentSrc = this.audio.currentSrc;
            const currentIndex = this.audioSources.findIndex(source => currentSrc.includes(source.src));
            
            if (currentIndex < this.audioSources.length - 1) {
                console.log('🔄 Trying alternative audio source...');
                const nextSource = this.audioSources[currentIndex + 1];
                this.audio.src = nextSource.src;
                this.audio.load();
            } else {
                console.warn('⚠️ No more audio sources available');
                // Hide controls if no audio can be loaded
                const controls = document.getElementById('optimized-music-controls');
                if (controls) {
                    controls.style.display = 'none';
                }
            }
        },
        
        /**
         * Setup performance monitoring
         */
        setupPerformanceMonitoring() {
            // Monitor audio loading performance
            this.audio.addEventListener('loadstart', () => {
                console.time('audio-load');
            });
            
            this.audio.addEventListener('canplaythrough', () => {
                console.timeEnd('audio-load');
            });
            
            // Monitor memory usage periodically
            if ('memory' in performance) {
                setInterval(() => {
                    const memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
                    if (memoryUsage > 50) { // 50MB threshold
                        console.warn('⚠️ High memory usage detected:', memoryUsage.toFixed(2), 'MB');
                    }
                }, 30000);
            }
        },
        
        /**
         * Save current state
         */
        saveState() {
            if (this.audio && this.isPlaying) {
                localStorage.setItem('ignite-audio-volume', this.volume.toString());
                localStorage.setItem('ignite-audio-playing', this.isPlaying.toString());
            }
        },
        
        /**
         * Cleanup and resource management
         */
        destroy() {
            if (this.audio) {
                this.audio.pause();
                this.audio.src = '';
                this.audio.load();
            }
            
            const controls = document.getElementById('optimized-music-controls');
            if (controls) {
                controls.remove();
            }
            
            this.saveState();
            console.log('🎵 Music player destroyed and cleaned up');
        },
        
        /**
         * Check if browser can play specific audio format
         */
        canPlayFormat(mimeType) {
            if (!mimeType) return false;
            
            // For MOV files, use video element capability
            if (mimeType.includes('video/quicktime') || mimeType.includes('video/mov')) {
                const video = document.createElement('video');
                return video.canPlayType(mimeType) !== '';
            }
            
            // For standard audio formats
            const audio = document.createElement('audio');
            return audio.canPlayType(mimeType) !== '';
        },
        
        /**
         * Load optimal audio source based on network and browser capabilities
         */
        loadOptimalSource() {
            const sortedSources = this.sortSourcesByOptimality();
            
            for (const source of sortedSources) {
                if (this.canPlayFormat(source.type)) {
                    console.log(`🎵 Loading optimal source: ${source.format} (${source.quality})`);
                    
                    // Set up audio element with selected source
                    this.audio.src = source.src;
                    this.audio.preload = 'auto';
                    
                    // Handle loading events
                    this.audio.addEventListener('loadstart', () => {
                        console.log(`🎵 Started loading: ${source.src}`);
                    });
                    
                    this.audio.addEventListener('canplaythrough', () => {
                        console.log(`🎵 Audio ready to play: ${source.format}`);
                        this.setupCustomLooping();
                    });
                    
                    this.audio.addEventListener('error', (e) => {
                        console.warn(`🎵 Failed to load ${source.src}:`, e);
                        // Try next source in fallback chain
                        const nextIndex = sortedSources.indexOf(source) + 1;
                        if (nextIndex < sortedSources.length) {
                            console.log(`🎵 Trying fallback source...`);
                            this.audio.src = sortedSources[nextIndex].src;
                        }
                    });
                    
                    return source;
                }
            }
            
            console.error('🎵 No compatible audio sources found');
            return null;
        },
        
        /**
         * Sort audio sources by optimality (network, format, size)
         */
        sortSourcesByOptimality() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const sources = [...this.audioSources];
            
            // Scoring function for source selection
            const scoreSource = (source) => {
                let score = 0;
                
                // Network type scoring
                if (connection) {
                    const effectiveType = connection.effectiveType;
                    const saveData = connection.saveData;
                    
                    if (saveData || effectiveType === '2g') {
                        // Prefer smallest files for slow connections
                        score += source.quality === 'compressed' ? 100 : 0;
                        score += source.format === 'OGG' ? 50 : 0;
                    } else if (effectiveType === '3g') {
                        // Balanced quality for 3G
                        score += source.quality === 'compressed' ? 75 : 25;
                        score += source.format === 'MP3' ? 50 : 0;
                    } else {
                        // Prefer quality for fast connections
                        score += source.quality === 'original' ? 100 : 50;
                        score += source.format === 'MOV' ? 25 : 0;
                    }
                }
                
                // Browser compatibility scoring
                if (this.canPlayFormat(source.type)) {
                    score += 200; // High priority for compatible formats
                }
                
                // Format preference scoring
                switch (source.format) {
                    case 'MP3': score += 80; break; // Universal compatibility
                    case 'OGG': score += 70; break; // Good compression
                    case 'MOV': score += 60; break; // Original format
                    case 'WEBM': score += 75; break; // Modern format
                    default: score += 50;
                }
                
                return score;
            };
            
            // Sort by score (highest first)
            return sources.sort((a, b) => scoreSource(b) - scoreSource(a));
        },
        
        /**
         * Setup custom 27-second looping for backing music
         */
        setupCustomLooping() {
            if (!this.audio) return;
            
            // Remove any existing loop listeners
            this.audio.removeEventListener('timeupdate', this.loopHandler);
            
            // Custom loop handler for 27-second segments
            this.loopHandler = () => {
                if (this.audio.currentTime >= 27) {
                    this.audio.currentTime = 0;
                    console.log('🎵 Custom 27-second loop reset');
                }
            };
            
            this.audio.addEventListener('timeupdate', this.loopHandler);
            
            // Fallback: use native loop if custom loop fails
            this.audio.loop = true;
            
            console.log('🎵 Custom 27-second looping configured');
        },
        
        /**
         * Get network connection information for optimization
         */
        getNetworkInfo() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (!connection) {
                return {
                    effectiveType: 'unknown',
                    saveData: false,
                    downlink: 10, // Assume good connection
                    rtt: 100
                };
            }
            
            return {
                effectiveType: connection.effectiveType || 'unknown',
                saveData: connection.saveData || false,
                downlink: connection.downlink || 10,
                rtt: connection.rtt || 100
            };
        },
        
        /**
         * Performance monitoring and analytics
         */
        trackPerformance(event, data = {}) {
            const networkInfo = this.getNetworkInfo();
            const performanceData = {
                timestamp: Date.now(),
                event: event,
                networkType: networkInfo.effectiveType,
                saveDataMode: networkInfo.saveData,
                volume: this.volume,
                isPlaying: this.isPlaying,
                currentSource: this.audio ? this.audio.src : null,
                ...data
            };
            
            // Store in session for analysis
            const sessionData = JSON.parse(sessionStorage.getItem('ignite-audio-analytics') || '[]');
            sessionData.push(performanceData);
            
            // Keep only last 100 events
            if (sessionData.length > 100) {
                sessionData.shift();
            }
            
            sessionStorage.setItem('ignite-audio-analytics', JSON.stringify(sessionData));
            
            // Log important events
            if (['play', 'pause', 'error', 'source_change'].includes(event)) {
                console.log(`🎵 Analytics: ${event}`, performanceData);
            }
        }
    };
    
    // Initialize when DOM is ready with performance optimization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Use requestIdleCallback for non-critical initialization
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => OptimizedMusicPlayer.init());
            } else {
                setTimeout(() => OptimizedMusicPlayer.init(), 100);
            }
        });
    } else {
        // DOM already loaded
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => OptimizedMusicPlayer.init());
        } else {
            OptimizedMusicPlayer.init();
        }
    }
    
    // Expose for debugging and external control
    window.OptimizedMusicPlayer = OptimizedMusicPlayer;
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        OptimizedMusicPlayer.destroy();
    });
    
})();