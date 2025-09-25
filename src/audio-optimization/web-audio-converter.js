/**
 * Web-native Audio Conversion and Optimization Script
 * Converts MOV files to optimized web audio formats using Web APIs
 */

class WebAudioConverter {
    constructor() {
        this.audioContext = null;
        this.supportedFormats = this.detectSupportedFormats();
        this.progressCallback = null;
    }

    /**
     * Detect supported audio formats by the browser
     */
    detectSupportedFormats() {
        const audio = document.createElement('audio');
        const formats = {
            mp3: audio.canPlayType('audio/mpeg') !== '',
            ogg: audio.canPlayType('audio/ogg') !== '',
            webm: audio.canPlayType('audio/webm') !== '',
            wav: audio.canPlayType('audio/wav') !== '',
            m4a: audio.canPlayType('audio/mp4') !== '',
            mov: audio.canPlayType('video/quicktime') !== ''
        };
        
        console.log('Supported audio formats:', formats);
        return formats;
    }

    /**
     * Initialize Web Audio API context
     */
    async initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Handle browser autoplay restrictions
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
        }
        return this.audioContext;
    }

    /**
     * Convert MOV file to optimized web audio formats
     */
    async convertMovToWebAudio(movFile, options = {}) {
        const {
            targetFormats = ['mp3', 'webm', 'ogg'],
            quality = 0.8,
            sampleRate = 44100,
            channels = 2,
            bitRate = 128000,
            maxDuration = 30 // seconds
        } = options;

        try {
            // Create video element to extract audio from MOV
            const video = document.createElement('video');
            video.src = URL.createObjectURL(movFile);
            video.crossOrigin = 'anonymous';
            video.muted = true;

            await this.waitForVideoLoad(video);
            
            // Limit duration to specified max
            const duration = Math.min(video.duration, maxDuration);
            
            const audioContext = await this.initAudioContext();
            const source = audioContext.createMediaElementSource(video);
            
            // Create analyzer for audio processing
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);

            const conversions = [];
            
            for (const format of targetFormats) {
                if (this.supportedFormats[format]) {
                    const conversion = this.convertToFormat(video, format, {
                        quality,
                        duration,
                        sampleRate,
                        channels,
                        bitRate
                    });
                    conversions.push({ format, promise: conversion });
                }
            }

            const results = await Promise.all(
                conversions.map(async ({ format, promise }) => {
                    try {
                        const blob = await promise;
                        return { format, blob, success: true };
                    } catch (error) {
                        console.error(`Failed to convert to ${format}:`, error);
                        return { format, error, success: false };
                    }
                })
            );

            // Clean up
            URL.revokeObjectURL(video.src);
            
            return results;

        } catch (error) {
            console.error('Audio conversion failed:', error);
            throw error;
        }
    }

    /**
     * Convert video element to specific audio format
     */
    async convertToFormat(video, format, options) {
        const { quality, duration } = options;
        
        return new Promise((resolve, reject) => {
            const mediaRecorder = this.createMediaRecorder(video, format, quality);
            const chunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const mimeType = this.getMimeType(format);
                const blob = new Blob(chunks, { type: mimeType });
                resolve(blob);
            };

            mediaRecorder.onerror = (error) => {
                reject(error);
            };

            // Start recording
            video.currentTime = 0;
            video.play();
            mediaRecorder.start();

            // Stop after specified duration
            setTimeout(() => {
                video.pause();
                mediaRecorder.stop();
            }, duration * 1000);
        });
    }

    /**
     * Create MediaRecorder for specific format
     */
    createMediaRecorder(video, format, quality) {
        const mimeType = this.getMimeType(format);
        const stream = video.captureStream();
        
        // Filter to audio tracks only
        const audioTracks = stream.getAudioTracks();
        const audioStream = new MediaStream(audioTracks);
        
        const options = {
            mimeType: mimeType,
            audioBitsPerSecond: this.getBitRate(format, quality)
        };

        return new MediaRecorder(audioStream, options);
    }

    /**
     * Get MIME type for format
     */
    getMimeType(format) {
        const mimeTypes = {
            mp3: 'audio/mpeg',
            webm: 'audio/webm',
            ogg: 'audio/ogg',
            wav: 'audio/wav',
            m4a: 'audio/mp4'
        };
        return mimeTypes[format] || 'audio/mpeg';
    }

    /**
     * Get bit rate based on format and quality
     */
    getBitRate(format, quality) {
        const baseBitRates = {
            mp3: 128000,
            webm: 96000,
            ogg: 96000,
            wav: 1411000,
            m4a: 128000
        };
        return Math.floor((baseBitRates[format] || 128000) * quality);
    }

    /**
     * Wait for video to load
     */
    waitForVideoLoad(video) {
        return new Promise((resolve, reject) => {
            video.onloadedmetadata = () => resolve();
            video.onerror = () => reject(new Error('Failed to load video'));
            video.load();
        });
    }

    /**
     * Create compressed versions for mobile optimization
     */
    async createMobileOptimizedVersions(audioBlobs) {
        const optimized = [];
        
        for (const { format, blob } of audioBlobs) {
            if (!blob) continue;
            
            // Create compressed version
            const compressedBlob = await this.compressAudio(blob, {
                quality: 0.6,
                bitRate: 64000
            });
            
            optimized.push({
                format: `${format}-compressed`,
                blob: compressedBlob,
                originalSize: blob.size,
                compressedSize: compressedBlob.size,
                compressionRatio: (1 - compressedBlob.size / blob.size) * 100
            });
        }
        
        return optimized;
    }

    /**
     * Compress audio blob
     */
    async compressAudio(blob, options) {
        // For now, return the original blob as Web APIs don't provide
        // direct audio compression. In a real implementation, you would
        // use a library like Opus or implement custom compression
        return blob;
    }

    /**
     * Generate audio URLs from blobs
     */
    generateAudioUrls(audioResults) {
        const urls = {};
        
        audioResults.forEach(({ format, blob, success }) => {
            if (success && blob) {
                urls[format] = URL.createObjectURL(blob);
            }
        });
        
        return urls;
    }

    /**
     * Set progress callback for conversion updates
     */
    setProgressCallback(callback) {
        this.progressCallback = callback;
    }

    /**
     * Download converted audio files
     */
    downloadAudioFiles(audioResults, filename = 'backing-music') {
        audioResults.forEach(({ format, blob, success }) => {
            if (success && blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename}.${format}`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }
        });
    }

    /**
     * Clean up resources
     */
    cleanup() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebAudioConverter;
} else {
    window.WebAudioConverter = WebAudioConverter;
}