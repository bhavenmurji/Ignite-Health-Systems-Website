/**
 * Optimized Music Player - Production Deployment
 * High-performance, accessibility-compliant, MOV-compatible audio implementation
 * Replacing original music player with enhanced MOV support and performance optimizations
 */

(function() {
    'use strict';

    const OptimizedMusicPlayer = {
        audio: null,
        isPlaying: false,
        volume: 0.25, // Optimized default volume (25%)
        fadeInDuration: 1500,
        fadeOutDuration: 800,
        
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
        coreWebVitals: {},
        
        init() {
            console.log('🎵 Initializing Optimized Music Player (Production)...');
            this.loadStartTime = performance.now();
            
            // Initialize Core Web Vitals monitoring
            this.initCoreWebVitalsMonitoring();
            
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
            
            // Register service worker for offline support
            this.registerServiceWorker();
            
            const initTime = (performance.now() - this.loadStartTime).toFixed(2);
            console.log('✅ Music Player initialized in', initTime, 'ms');
            
            // Report initialization performance
            this.reportPerformanceMetric('audio_init_time', parseFloat(initTime));
        },
        
        /**
         * Initialize Core Web Vitals monitoring for zero performance impact
         */
        initCoreWebVitalsMonitoring() {
            // Monitor Largest Contentful Paint (LCP)
            if ('PerformanceObserver' in window) {
                try {
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        this.coreWebVitals.LCP = lastEntry.startTime;
                        console.log('📊 LCP:', lastEntry.startTime, 'ms');
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                    // Monitor First Input Delay (FID)
                    const fidObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            this.coreWebVitals.FID = entry.processingStart - entry.startTime;
                            console.log('📊 FID:', this.coreWebVitals.FID, 'ms');
                        });
                    });
                    fidObserver.observe({ entryTypes: ['first-input'] });

                    // Monitor Cumulative Layout Shift (CLS)
                    let clsValue = 0;
                    const clsObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                            }
                        });
                        this.coreWebVitals.CLS = clsValue;
                        console.log('📊 CLS:', clsValue);
                    });
                    clsObserver.observe({ entryTypes: ['layout-shift'] });
                } catch (e) {
                    console.warn('⚠️ Performance Observer not supported:', e);
                }
            }
        },
        
        /**
         * Adapt audio quality based on network conditions
         */
        adaptToNetworkConditions() {
            if ('connection' in navigator) {
                const connection = navigator.connection;
                const networkSpeed = connection.effectiveType;
                const saveData = connection.saveData;
                
                if (saveData || networkSpeed === 'slow-2g' || networkSpeed === '2g') {
                    console.log('📱 Data saver mode - optimizing for performance');
                    this.audioSources = this.audioSources.filter(source => 
                        source.format === 'MP3' && source.src.includes('compressed')
                    );
                    this.volume = 0.15;
                } else if (networkSpeed === '3g') {
                    console.log('📶 3G connection - balanced quality');
                    // Keep compressed as primary
                } else {
                    console.log('🚀 High-speed connection - full quality available');
                }
            }
        },
        
        /**
         * Create optimized audio player with MOV support
         */
        createOptimizedPlayer() {
            // Check if we need video element for MOV support
            const needsVideoElement = this.audioSources.some(source => 
                source.format === 'MOV' && this.canPlayFormat(source.type)
            );
            
            if (needsVideoElement) {
                this.audio = document.createElement('video');
                this.audio.style.display = 'none';
                this.audio.playsInline = true;
                this.audio.muted = false;
                console.log('🎥 Using video element for MOV support');
            } else {
                this.audio = new Audio();
                console.log('🔊 Using audio element for standard formats');
            }
            
            this.audio.preload = 'none';
            this.audio.loop = false;
            this.audio.volume = 0;
            this.audio.crossOrigin = 'anonymous';
            
            // Load optimal source
            this.loadOptimalSource();
            
            // Setup 27-second loop handling
            this.setupCustomLooping();
            
            // Performance-optimized event listeners
            this.audio.addEventListener('loadstart', () => {
                console.log('🎵 Audio loading started');
                this.reportPerformanceMetric('audio_load_start', performance.now());
            });
            
            this.audio.addEventListener('canplaythrough', () => {
                const loadTime = performance.now() - this.loadStartTime;
                console.log('✅ Audio ready in', loadTime.toFixed(2), 'ms');
                this.reportPerformanceMetric('audio_ready_time', loadTime);
            });
            
            this.audio.addEventListener('error', (e) => {
                console.error('❌ Audio loading failed:', e);
                this.handleAudioError(e);
                this.reportPerformanceMetric('audio_error', 1);
            });
            
            // Battery optimization for mobile
            this.audio.addEventListener('pause', () => {
                if (this.audioContext && this.audioContext.state === 'running') {
                    this.audioContext.suspend();
                }
            });
            
            this.audio.addEventListener('play', () => {
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
         * Inject optimized CSS with performance considerations
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
                    contain: layout style;
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
                    will-change: transform;
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
                
                /* Accessibility enhancements */
                @media (prefers-contrast: high) {
                    #optimized-music-controls {
                        border: 2px solid #ff6b35;
                        background: rgba(0, 0, 0, 0.9);
                    }
                }
                
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
                
                volumeDisplay.textContent = value + '%';
                
                volumeTimeout = setTimeout(() => {
                    this.setVolume(value / 100);
                }, 10);
            });
        },
        
        /**
         * Initialize state management
         */
        initializeStateManagement() {
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
            
            this.setupAutoPlay();
            window.addEventListener('beforeunload', () => this.saveState());
        },
        
        /**
         * Setup compliant auto-play
         */
        setupAutoPlay() {
            const playOnInteraction = (e) => {
                if (!this.isPlaying && e.isTrusted) {
                    this.play();
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                }
            };
            
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
                if (this.audio.readyState === 0) {
                    this.audio.preload = 'auto';
                    this.audio.load();
                }
                
                await this.audio.play();
                this.isPlaying = true;
                this.fadeIn();
                
                const toggleButton = document.getElementById('music-toggle');
                if (toggleButton) {
                    toggleButton.setAttribute('aria-pressed', 'true');
                    toggleButton.querySelector('.visually-hidden').textContent = 'Pause background music';
                }
                
                localStorage.setItem('ignite-audio-playing', 'true');
                this.reportPerformanceMetric('audio_play_success', 1);
                console.log('🎵 Audio playback started');
                
            } catch (error) {
                console.warn('⚠️ Audio play failed:', error.message);
                this.reportPerformanceMetric('audio_play_error', 1);
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
                
                const toggleButton = document.getElementById('music-toggle');
                if (toggleButton) {
                    toggleButton.setAttribute('aria-pressed', 'false');
                    toggleButton.querySelector('.visually-hidden').textContent = 'Play background music';
                }
                
                localStorage.setItem('ignite-audio-playing', 'false');
                this.reportPerformanceMetric('audio_pause', 1);
                console.log('⏸️ Audio playback paused');
            });
        },
        
        toggle() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },
        
        setVolume(value) {
            this.volume = Math.max(0, Math.min(1, value));
            if (this.audio) {
                this.audio.volume = this.isPlaying ? this.volume : 0;
            }
            localStorage.setItem('ignite-audio-volume', this.volume.toString());
        },
        
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
         * Show user-friendly play prompt
         */
        showPlayPrompt() {
            if (document.querySelector('.audio-play-prompt')) return;
            
            const prompt = document.createElement('div');
            prompt.className = 'audio-play-prompt';
            prompt.innerHTML = `
                <div class="prompt-content">
                    <p>🎵 Click to enable ambient background music</p>
                    <button type="button" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `;
            
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
            
            setTimeout(() => {
                if (prompt.parentElement) {
                    prompt.remove();
                }
            }, 5000);
        },
        
        /**
         * Handle audio loading errors with graceful fallback
         */
        handleAudioError(error) {
            console.error('🚨 Audio Error:', error);
            
            const currentSrc = this.audio.currentSrc;
            const currentIndex = this.audioSources.findIndex(source => currentSrc.includes(source.src));
            
            if (currentIndex < this.audioSources.length - 1) {
                console.log('🔄 Trying alternative audio source...');
                const nextSource = this.audioSources[currentIndex + 1];
                this.audio.src = nextSource.src;
                this.audio.load();
            } else {
                console.warn('⚠️ All audio sources failed - hiding controls');
                const controls = document.getElementById('optimized-music-controls');
                if (controls) {
                    controls.style.display = 'none';
                }
            }
        },
        
        /**
         * Setup comprehensive performance monitoring
         */
        setupPerformanceMonitoring() {
            // Monitor audio loading performance
            this.audio.addEventListener('loadstart', () => {
                console.time('audio-load');
            });
            
            this.audio.addEventListener('canplaythrough', () => {
                console.timeEnd('audio-load');
            });
            
            // Monitor memory usage
            if ('memory' in performance) {
                setInterval(() => {
                    const memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024);
                    if (memoryUsage > 50) {
                        console.warn('⚠️ High memory usage:', memoryUsage.toFixed(2), 'MB');
                        this.reportPerformanceMetric('high_memory_usage', memoryUsage);
                    }
                }, 30000);
            }
            
            // Monitor frame rate
            let lastTime = performance.now();
            let frameCount = 0;
            
            const monitorFPS = () => {
                frameCount++;
                const currentTime = performance.now();
                
                if (currentTime - lastTime >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                    this.reportPerformanceMetric('fps', fps);
                    
                    if (fps < 30) {
                        console.warn('⚠️ Low frame rate detected:', fps, 'fps');
                    }
                    
                    frameCount = 0;
                    lastTime = currentTime;
                }
                
                requestAnimationFrame(monitorFPS);
            };
            
            requestAnimationFrame(monitorFPS);
        },
        
        /**
         * Register service worker for offline support
         */
        registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker registered for audio caching');
                    })
                    .catch(error => {
                        console.warn('⚠️ Service Worker registration failed:', error);
                    });
            }
        },
        
        /**
         * Report performance metrics
         */
        reportPerformanceMetric(metric, value) {
            const performanceData = {
                metric,
                value,
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                connection: this.getNetworkInfo()
            };
            
            // Store in session for debugging
            const sessionData = JSON.parse(sessionStorage.getItem('ignite-audio-performance') || '[]');
            sessionData.push(performanceData);
            
            if (sessionData.length > 50) {
                sessionData.shift();
            }
            
            sessionStorage.setItem('ignite-audio-performance', JSON.stringify(sessionData));
            
            // Log critical metrics
            if (['audio_init_time', 'audio_ready_time', 'audio_error'].includes(metric)) {
                console.log(`📊 Performance: ${metric} = ${value}`);
            }
        },
        
        saveState() {
            if (this.audio && this.isPlaying) {
                localStorage.setItem('ignite-audio-volume', this.volume.toString());
                localStorage.setItem('ignite-audio-playing', this.isPlaying.toString());
            }
        },
        
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
        
        canPlayFormat(mimeType) {
            if (!mimeType) return false;
            
            // CRITICAL FIX: Enhanced MOV/QuickTime detection
            if (mimeType.includes('video/quicktime') || mimeType.includes('video/mov')) {
                const video = document.createElement('video');
                const canPlay = video.canPlayType(mimeType);
                // Accept 'maybe' and 'probably' as valid for MOV files
                const supported = canPlay !== '' && canPlay !== 'no';
                console.log(`🎥 MOV format check: ${mimeType} -> ${canPlay} (${supported ? 'SUPPORTED' : 'NOT SUPPORTED'})`);
                return supported;
            }
            
            const audio = document.createElement('audio');
            return audio.canPlayType(mimeType) !== '';
        },
        
        loadOptimalSource() {
            const sortedSources = this.sortSourcesByOptimality();
            
            // CRITICAL FIX: Enhanced source selection logging
            console.log('🎵 Source selection priority order:');
            sortedSources.forEach((source, index) => {
                const score = this.calculateSourceScore(source);
                const supported = this.canPlayFormat(source.type);
                console.log(`${index + 1}. ${source.format} (${source.quality}) - Score: ${score} - Supported: ${supported}`);
            });
            
            for (const source of sortedSources) {
                if (this.canPlayFormat(source.type)) {
                    console.log(`🎵 SELECTED SOURCE: ${source.format} (${source.quality}) from ${source.src}`);
                    
                    this.audio.src = source.src;
                    this.audio.preload = 'auto';
                    
                    this.audio.addEventListener('loadstart', () => {
                        console.log(`🎵 Started loading: ${source.src}`);
                    });
                    
                    this.audio.addEventListener('canplaythrough', () => {
                        console.log(`🎵 Audio ready: ${source.format}`);
                        this.setupCustomLooping();
                    });
                    
                    this.audio.addEventListener('error', (e) => {
                        console.warn(`🎵 Failed to load ${source.src}:`, e);
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
        
        // CRITICAL FIX: Extracted scoring method for debugging
        calculateSourceScore(source) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            let score = 0;
            
            if (connection) {
                const effectiveType = connection.effectiveType;
                const saveData = connection.saveData;
                
                if (saveData || effectiveType === '2g') {
                    score += source.quality === 'compressed' ? 100 : 0;
                    score += source.format === 'OGG' ? 50 : 0;
                } else if (effectiveType === '3g') {
                    score += source.quality === 'compressed' ? 75 : 25;
                    score += source.format === 'MP3' ? 50 : 0;
                } else {
                    score += source.quality === 'original' ? 100 : 50;
                    score += source.format === 'MOV' ? 75 : 0;  // CRITICAL FIX: Higher MOV bonus
                }
            }
            
            if (this.canPlayFormat(source.type)) {
                score += 200;
            }
            
            switch (source.format) {
                case 'MOV': score += 90; break;  // CRITICAL FIX: MOV highest priority
                case 'MP3': score += 80; break;
                case 'WEBM': score += 75; break;
                case 'OGG': score += 70; break;
                default: score += 50;
            }
            
            return score;
        },

        sortSourcesByOptimality() {
            const sources = [...this.audioSources];
            return sources.sort((a, b) => this.calculateSourceScore(b) - this.calculateSourceScore(a));
        },
        
        setupCustomLooping() {
            if (!this.audio) return;
            
            this.audio.removeEventListener('timeupdate', this.loopHandler);
            
            this.loopHandler = () => {
                if (this.audio.currentTime >= 27) {
                    this.audio.currentTime = 0;
                    console.log('🎵 Custom 27-second loop reset');
                }
            };
            
            this.audio.addEventListener('timeupdate', this.loopHandler);
            this.audio.loop = true;
            
            console.log('🎵 Custom 27-second looping configured');
        },
        
        getNetworkInfo() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            if (!connection) {
                return {
                    effectiveType: 'unknown',
                    saveData: false,
                    downlink: 10,
                    rtt: 100
                };
            }
            
            return {
                effectiveType: connection.effectiveType || 'unknown',
                saveData: connection.saveData || false,
                downlink: connection.downlink || 10,
                rtt: connection.rtt || 100
            };
        }
    };
    
    // Initialize with performance optimization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => OptimizedMusicPlayer.init());
            } else {
                setTimeout(() => OptimizedMusicPlayer.init(), 100);
            }
        });
    } else {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => OptimizedMusicPlayer.init());
        } else {
            OptimizedMusicPlayer.init();
        }
    }
    
    // Expose for debugging
    window.OptimizedMusicPlayer = OptimizedMusicPlayer;
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        OptimizedMusicPlayer.destroy();
    });
    
})();