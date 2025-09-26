/**
 * Audio Performance Impact Analyzer
 * Measures and reports audio implementation performance metrics
 */

class AudioPerformanceAnalyzer {
    constructor() {
        this.metrics = {
            loadTimes: [],
            memoryUsage: [],
            networkUsage: [],
            userInteractions: [],
            coreWebVitals: {}
        };
        this.isAnalyzing = false;
    }

    /**
     * Initialize performance monitoring
     */
    startAnalysis() {
        if (this.isAnalyzing) return;
        this.isAnalyzing = true;
        
        console.log('🎵 Starting Audio Performance Analysis...');
        
        // Monitor Core Web Vitals impact
        this.monitorCoreWebVitals();
        
        // Monitor network usage
        this.monitorNetworkUsage();
        
        // Monitor memory usage
        this.monitorMemoryUsage();
        
        // Monitor user interactions
        this.monitorUserInteractions();
        
        return this;
    }

    /**
     * Monitor Core Web Vitals impact of audio implementation
     */
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.coreWebVitals.lcp = lastEntry.startTime;
            console.log('📊 LCP with Audio:', lastEntry.startTime.toFixed(2) + 'ms');
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.coreWebVitals.fid = entry.processingStart - entry.startTime;
                console.log('⚡ FID with Audio:', (entry.processingStart - entry.startTime).toFixed(2) + 'ms');
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        new PerformanceObserver((entryList) => {
            let clsValue = 0;
            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            this.metrics.coreWebVitals.cls = clsValue;
            console.log('📐 CLS with Audio:', clsValue.toFixed(4));
        }).observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * Monitor network usage for audio files
     */
    monitorNetworkUsage() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            const networkData = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
            
            this.metrics.networkUsage.push({
                timestamp: Date.now(),
                ...networkData,
                recommendation: this.getNetworkRecommendation(networkData)
            });
            
            console.log('🌐 Network Analysis:', networkData);
        }
    }

    /**
     * Monitor memory usage impact
     */
    monitorMemoryUsage() {
        if ('memory' in performance) {
            const memoryInfo = {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
            
            this.metrics.memoryUsage.push({
                timestamp: Date.now(),
                ...memoryInfo,
                audioMemoryEstimate: this.estimateAudioMemoryUsage()
            });
            
            console.log('💾 Memory Usage:', memoryInfo);
        }
    }

    /**
     * Monitor user interactions with audio controls
     */
    monitorUserInteractions() {
        const audioControls = [
            '#music-toggle',
            '#volume-slider',
            '.audio-control-btn'
        ];
        
        audioControls.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener('click', (e) => {
                    this.recordUserInteraction('click', selector);
                });
            }
        });
    }

    /**
     * Record user interaction with audio controls
     */
    recordUserInteraction(type, element) {
        const interaction = {
            timestamp: Date.now(),
            type: type,
            element: element,
            userAgent: navigator.userAgent,
            audioState: this.getCurrentAudioState()
        };
        
        this.metrics.userInteractions.push(interaction);
        console.log('👤 User Interaction:', interaction);
    }

    /**
     * Get current audio state
     */
    getCurrentAudioState() {
        const audioElements = document.querySelectorAll('audio');
        if (audioElements.length === 0) return { status: 'no-audio' };
        
        const audio = audioElements[0];
        return {
            paused: audio.paused,
            volume: audio.volume,
            currentTime: audio.currentTime,
            duration: audio.duration,
            muted: audio.muted
        };
    }

    /**
     * Estimate audio memory usage
     */
    estimateAudioMemoryUsage() {
        const audioElements = document.querySelectorAll('audio');
        let totalEstimate = 0;
        
        audioElements.forEach(audio => {
            // Rough estimate: ~1KB per second of audio at 128kbps
            const estimatedSize = audio.duration * 1024 / 8; // bytes
            totalEstimate += estimatedSize;
        });
        
        return totalEstimate;
    }

    /**
     * Get network-based audio format recommendation
     */
    getNetworkRecommendation(networkData) {
        const { effectiveType, downlink, saveData } = networkData;
        
        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
            return {
                format: 'webm-opus-low',
                quality: '64kbps',
                reason: 'Data saver mode or slow connection'
            };
        } else if (effectiveType === '3g' || downlink < 1) {
            return {
                format: 'mp3-compressed',
                quality: '128kbps',
                reason: '3G connection, balanced quality/size'
            };
        } else {
            return {
                format: 'mp3-high',
                quality: '192kbps',
                reason: 'Good connection, high quality'
            };
        }
    }

    /**
     * Generate comprehensive performance report
     */
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            coreWebVitals: this.metrics.coreWebVitals,
            networkAnalysis: this.analyzeNetworkData(),
            memoryAnalysis: this.analyzeMemoryData(),
            userBehaviorAnalysis: this.analyzeUserBehavior(),
            recommendations: this.generateRecommendations()
        };
        
        console.log('📋 Audio Performance Report:', report);
        return report;
    }

    /**
     * Analyze network data trends
     */
    analyzeNetworkData() {
        if (this.metrics.networkUsage.length === 0) {
            return { status: 'no-data' };
        }
        
        const latest = this.metrics.networkUsage[this.metrics.networkUsage.length - 1];
        return {
            currentConnection: latest.effectiveType,
            bandwidth: latest.downlink + 'Mbps',
            latency: latest.rtt + 'ms',
            dataSaverActive: latest.saveData,
            recommendedFormat: latest.recommendation.format,
            impact: this.calculateNetworkImpact(latest)
        };
    }

    /**
     * Calculate network impact of audio
     */
    calculateNetworkImpact(networkData) {
        const audioSizes = {
            'webm-opus-low': 200,  // KB
            'mp3-compressed': 280, // KB
            'mp3-high': 350        // KB
        };
        
        const recommendedSize = audioSizes[networkData.recommendation.format] || 280;
        const downloadTime = (recommendedSize * 8) / (networkData.downlink * 1000); // seconds
        
        return {
            fileSize: recommendedSize + 'KB',
            estimatedDownloadTime: downloadTime.toFixed(2) + 's',
            impact: downloadTime < 1 ? 'low' : downloadTime < 3 ? 'medium' : 'high'
        };
    }

    /**
     * Analyze memory usage patterns
     */
    analyzeMemoryData() {
        if (this.metrics.memoryUsage.length === 0) {
            return { status: 'no-data' };
        }
        
        const latest = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
        const memoryUsagePercent = (latest.usedJSHeapSize / latest.jsHeapSizeLimit) * 100;
        
        return {
            currentUsage: (latest.usedJSHeapSize / (1024 * 1024)).toFixed(2) + 'MB',
            totalAvailable: (latest.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + 'MB',
            usagePercent: memoryUsagePercent.toFixed(2) + '%',
            audioMemoryEstimate: (latest.audioMemoryEstimate / 1024).toFixed(2) + 'KB',
            status: memoryUsagePercent > 80 ? 'high' : memoryUsagePercent > 60 ? 'medium' : 'low'
        };
    }

    /**
     * Analyze user behavior with audio controls
     */
    analyzeUserBehavior() {
        const interactions = this.metrics.userInteractions;
        if (interactions.length === 0) {
            return { status: 'no-interactions' };
        }
        
        const clickCounts = {};
        interactions.forEach(interaction => {
            clickCounts[interaction.element] = (clickCounts[interaction.element] || 0) + 1;
        });
        
        return {
            totalInteractions: interactions.length,
            mostUsedControl: Object.keys(clickCounts).reduce((a, b) => clickCounts[a] > clickCounts[b] ? a : b),
            interactionFrequency: clickCounts,
            averageSessionTime: this.calculateAverageSessionTime(interactions)
        };
    }

    /**
     * Calculate average audio session time
     */
    calculateAverageSessionTime(interactions) {
        // Simple heuristic: time between first and last interaction
        if (interactions.length < 2) return 'insufficient-data';
        
        const firstInteraction = interactions[0].timestamp;
        const lastInteraction = interactions[interactions.length - 1].timestamp;
        const sessionTime = (lastInteraction - firstInteraction) / 1000; // seconds
        
        return sessionTime.toFixed(2) + 's';
    }

    /**
     * Generate optimization recommendations
     */
    generateRecommendations() {
        const recommendations = [];
        
        // Core Web Vitals recommendations
        if (this.metrics.coreWebVitals.lcp > 2500) {
            recommendations.push({
                category: 'Performance',
                priority: 'high',
                issue: 'LCP too slow',
                solution: 'Defer audio loading until after LCP'
            });
        }
        
        if (this.metrics.coreWebVitals.fid > 100) {
            recommendations.push({
                category: 'Interactivity',
                priority: 'medium',
                issue: 'High input delay',
                solution: 'Optimize audio initialization code'
            });
        }
        
        // Network recommendations
        const networkAnalysis = this.analyzeNetworkData();
        if (networkAnalysis.impact === 'high') {
            recommendations.push({
                category: 'Network',
                priority: 'high',
                issue: 'Slow audio download',
                solution: 'Use adaptive bitrate or WebM format'
            });
        }
        
        // Memory recommendations
        const memoryAnalysis = this.analyzeMemoryData();
        if (memoryAnalysis.status === 'high') {
            recommendations.push({
                category: 'Memory',
                priority: 'medium',
                issue: 'High memory usage',
                solution: 'Implement audio cleanup on page unload'
            });
        }
        
        return recommendations;
    }

    /**
     * Export performance data for external analysis
     */
    exportData() {
        return {
            metrics: this.metrics,
            report: this.generateReport(),
            exportTime: new Date().toISOString()
        };
    }
}

// Initialize global analyzer
if (typeof window !== 'undefined') {
    window.AudioPerformanceAnalyzer = AudioPerformanceAnalyzer;
    
    // Auto-start analysis if audio elements are present
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('audio') || document.querySelector('#music-toggle')) {
            const analyzer = new AudioPerformanceAnalyzer();
            analyzer.startAnalysis();
            
            // Export data every 30 seconds for monitoring
            setInterval(() => {
                const data = analyzer.exportData();
                console.log('📊 Audio Performance Export:', data);
            }, 30000);
        }
    });
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioPerformanceAnalyzer;
}