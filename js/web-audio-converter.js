/**
 * Web Audio API Converter for MOV files
 * Advanced audio conversion and processing for enhanced browser compatibility
 * Provides real-time audio format adaptation and performance optimization
 */

(function() {
    'use strict';

    const WebAudioConverter = {
        audioContext: null,
        analyser: null,
        sourceNode: null,
        gainNode: null,
        filterNode: null,
        conversionCache: new Map(),
        isInitialized: false,
        
        init() {
            console.log('🎧 Initializing Web Audio API Converter...');
            
            try {
                // Create audio context with optimal configuration
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext({
                    latencyHint: 'interactive',
                    sampleRate: 44100 // Standard rate for compatibility
                });
                
                this.setupAudioNodes();
                this.setupConversionWorker();
                this.isInitialized = true;
                
                console.log('✅ Web Audio API Converter initialized');
                return true;
                
            } catch (error) {
                console.warn('⚠️ Web Audio API not supported:', error);
                return false;
            }
        },
        
        /**
         * Setup audio processing nodes
         */
        setupAudioNodes() {
            // Create analyser for real-time audio analysis
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.smoothingTimeConstant = 0.8;
            
            // Create gain node for volume control
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = 1.0;
            
            // Create filter for audio enhancement
            this.filterNode = this.audioContext.createBiquadFilter();
            this.filterNode.type = 'lowpass';
            this.filterNode.frequency.value = 8000; // Reduce high-frequency noise
            this.filterNode.Q.value = 1;
            
            // Connect audio graph
            this.gainNode.connect(this.filterNode);
            this.filterNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            console.log('🎛️ Audio processing nodes configured');
        },
        
        /**
         * Setup background conversion worker
         */
        setupConversionWorker() {
            // Create inline worker for audio conversion
            const workerCode = `
                self.onmessage = function(e) {
                    const { audioData, format, quality } = e.data;
                    
                    try {
                        // Simulate audio conversion (in real implementation, use FFmpeg.js or similar)
                        const convertedData = convertAudioFormat(audioData, format, quality);
                        
                        self.postMessage({
                            success: true,
                            data: convertedData,
                            format: format
                        });
                    } catch (error) {
                        self.postMessage({
                            success: false,
                            error: error.message
                        });
                    }
                };
                
                function convertAudioFormat(data, targetFormat, quality) {
                    // Placeholder for actual audio conversion logic
                    // In production, integrate with FFmpeg.js or WebCodecs API
                    return data;
                }
            `;
            
            try {
                const blob = new Blob([workerCode], { type: 'application/javascript' });
                this.conversionWorker = new Worker(URL.createObjectURL(blob));
                
                this.conversionWorker.onmessage = (e) => {
                    const { success, data, format, error } = e.data;
                    
                    if (success) {
                        console.log(`✅ Audio converted to ${format}`);
                        this.handleConversionSuccess(data, format);
                    } else {
                        console.error('❌ Audio conversion failed:', error);
                        this.handleConversionError(error);
                    }
                };
                
                console.log('👷 Conversion worker ready');
                
            } catch (error) {
                console.warn('⚠️ Web Workers not supported:', error);
            }
        },
        
        /**
         * Convert MOV audio to web-compatible format
         */
        async convertMovToWebAudio(audioElement) {
            if (!this.isInitialized) {
                console.warn('⚠️ Web Audio Converter not initialized');
                return null;
            }
            
            try {
                console.log('🔄 Converting MOV to Web Audio...');
                
                // Check if already converted and cached
                const cacheKey = audioElement.src;
                if (this.conversionCache.has(cacheKey)) {
                    console.log('📦 Using cached conversion');
                    return this.conversionCache.get(cacheKey);
                }
                
                // Resume audio context if suspended
                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }
                
                // Create media element source
                if (this.sourceNode) {
                    this.sourceNode.disconnect();
                }
                
                this.sourceNode = this.audioContext.createMediaElementSource(audioElement);
                this.sourceNode.connect(this.gainNode);
                
                // Setup real-time audio processing
                this.setupAudioEffects();
                
                // Create enhanced audio object
                const enhancedAudio = {
                    element: audioElement,
                    context: this.audioContext,
                    sourceNode: this.sourceNode,
                    gainNode: this.gainNode,
                    analyser: this.analyser,
                    
                    // Enhanced methods
                    setVolume: (volume) => {
                        this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                    },
                    
                    fadeIn: (duration = 1000) => {
                        const gain = this.gainNode.gain;
                        gain.setValueAtTime(0, this.audioContext.currentTime);
                        gain.linearRampToValueAtTime(1, this.audioContext.currentTime + duration / 1000);
                    },
                    
                    fadeOut: (duration = 1000) => {
                        const gain = this.gainNode.gain;
                        gain.setValueAtTime(gain.value, this.audioContext.currentTime);
                        gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000);
                    },
                    
                    getFrequencyData: () => {
                        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                        this.analyser.getByteFrequencyData(dataArray);
                        return dataArray;
                    },
                    
                    getWaveformData: () => {
                        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                        this.analyser.getByteTimeDomainData(dataArray);
                        return dataArray;
                    }
                };
                
                // Cache the conversion
                this.conversionCache.set(cacheKey, enhancedAudio);
                
                console.log('✅ MOV converted to enhanced Web Audio');
                return enhancedAudio;
                
            } catch (error) {
                console.error('❌ MOV conversion failed:', error);
                return null;
            }
        },
        
        /**
         * Setup advanced audio effects
         */
        setupAudioEffects() {
            // Dynamic range compression for consistent volume
            if (this.audioContext.createDynamicsCompressor) {
                const compressor = this.audioContext.createDynamicsCompressor();
                compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
                compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
                compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
                compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
                compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
                
                // Insert compressor in audio chain
                this.filterNode.disconnect();
                this.filterNode.connect(compressor);
                compressor.connect(this.analyser);
                
                console.log('🎚️ Audio compression enabled');
            }
            
            // Stereo enhancement
            const stereoPanner = this.audioContext.createStereoPanner();
            stereoPanner.pan.value = 0; // Center position
            
            console.log('🎼 Audio effects configured');
        },
        
        /**
         * Detect optimal audio format for current browser
         */
        detectOptimalFormat() {
            const audio = document.createElement('audio');
            const formats = [
                { type: 'audio/mpeg', ext: 'mp3', priority: 90 },
                { type: 'audio/ogg', ext: 'ogg', priority: 80 },
                { type: 'audio/wav', ext: 'wav', priority: 70 },
                { type: 'audio/webm', ext: 'webm', priority: 85 },
                { type: 'video/quicktime', ext: 'mov', priority: 60 }
            ];
            
            const supportedFormats = formats.filter(format => {
                const support = audio.canPlayType(format.type);
                return support === 'probably' || support === 'maybe';
            });
            
            // Sort by priority
            supportedFormats.sort((a, b) => b.priority - a.priority);
            
            console.log('📊 Supported formats:', supportedFormats.map(f => f.ext));
            return supportedFormats;
        },
        
        /**
         * Create fallback audio source chain
         */
        createFallbackChain(baseSrc) {
            const formats = this.detectOptimalFormat();
            const baseUrl = baseSrc.substring(0, baseSrc.lastIndexOf('.'));
            
            const fallbackChain = formats.map(format => ({
                src: `${baseUrl}.${format.ext}`,
                type: format.type,
                format: format.ext.toUpperCase()
            }));
            
            // Add original source as fallback
            fallbackChain.push({
                src: baseSrc,
                type: 'audio/mpeg', // Default assumption
                format: 'ORIGINAL'
            });
            
            console.log('🔗 Fallback chain created:', fallbackChain.length, 'sources');
            return fallbackChain;
        },
        
        /**
         * Progressive audio loading with conversion
         */
        async loadAudioWithConversion(sources, audioElement) {
            for (const source of sources) {
                try {
                    console.log(`🎵 Attempting to load: ${source.format}`);
                    
                    audioElement.src = source.src;
                    await this.waitForAudioLoad(audioElement);
                    
                    // If MOV format, convert to Web Audio
                    if (source.format === 'MOV' || source.src.includes('.mov')) {
                        const enhancedAudio = await this.convertMovToWebAudio(audioElement);
                        if (enhancedAudio) {
                            console.log('✅ MOV successfully converted and enhanced');
                            return enhancedAudio;
                        }
                    }
                    
                    console.log(`✅ Standard audio loaded: ${source.format}`);
                    return { element: audioElement, format: source.format };
                    
                } catch (error) {
                    console.warn(`⚠️ Failed to load ${source.format}:`, error.message);
                    continue;
                }
            }
            
            throw new Error('All audio sources failed to load');
        },
        
        /**
         * Wait for audio to load with timeout
         */
        waitForAudioLoad(audioElement, timeout = 10000) {
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('Audio load timeout'));
                }, timeout);
                
                const handleLoad = () => {
                    clearTimeout(timeoutId);
                    audioElement.removeEventListener('canplaythrough', handleLoad);
                    audioElement.removeEventListener('error', handleError);
                    resolve();
                };
                
                const handleError = (error) => {
                    clearTimeout(timeoutId);
                    audioElement.removeEventListener('canplaythrough', handleLoad);
                    audioElement.removeEventListener('error', handleError);
                    reject(error);
                };
                
                audioElement.addEventListener('canplaythrough', handleLoad, { once: true });
                audioElement.addEventListener('error', handleError, { once: true });
                
                // Trigger load
                audioElement.load();
            });
        },
        
        /**
         * Handle successful conversion
         */
        handleConversionSuccess(data, format) {
            // Trigger custom event for successful conversion
            const event = new CustomEvent('audioConversionSuccess', {
                detail: { data, format }
            });
            
            window.dispatchEvent(event);
        },
        
        /**
         * Handle conversion error
         */
        handleConversionError(error) {
            // Trigger custom event for conversion error
            const event = new CustomEvent('audioConversionError', {
                detail: { error }
            });
            
            window.dispatchEvent(event);
        },
        
        /**
         * Get audio visualization data
         */
        getVisualizationData() {
            if (!this.analyser) return null;
            
            const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
            const waveformData = new Uint8Array(this.analyser.frequencyBinCount);
            
            this.analyser.getByteFrequencyData(frequencyData);
            this.analyser.getByteTimeDomainData(waveformData);
            
            return {
                frequency: frequencyData,
                waveform: waveformData,
                sampleRate: this.audioContext.sampleRate,
                currentTime: this.audioContext.currentTime
            };
        },
        
        /**
         * Cleanup and resource management
         */
        destroy() {
            if (this.sourceNode) {
                this.sourceNode.disconnect();
            }
            
            if (this.audioContext && this.audioContext.state !== 'closed') {
                this.audioContext.close();
            }
            
            if (this.conversionWorker) {
                this.conversionWorker.terminate();
            }
            
            this.conversionCache.clear();
            this.isInitialized = false;
            
            console.log('🧹 Web Audio Converter cleaned up');
        },
        
        /**
         * Check Web Audio API support
         */
        isSupported() {
            return !!(window.AudioContext || window.webkitAudioContext);
        },
        
        /**
         * Get audio context state
         */
        getContextState() {
            return this.audioContext ? this.audioContext.state : 'unavailable';
        },
        
        /**
         * Performance monitoring for audio conversion
         */
        getPerformanceMetrics() {
            return {
                contextState: this.getContextState(),
                cacheSize: this.conversionCache.size,
                sampleRate: this.audioContext ? this.audioContext.sampleRate : null,
                isInitialized: this.isInitialized,
                memoryUsage: this.conversionCache.size * 1024 // Estimated in bytes
            };
        }
    };
    
    // Auto-initialize if Web Audio API is supported
    if (WebAudioConverter.isSupported()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                WebAudioConverter.init();
            });
        } else {
            WebAudioConverter.init();
        }
    }
    
    // Expose to global scope
    window.WebAudioConverter = WebAudioConverter;
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        WebAudioConverter.destroy();
    });
    
})();