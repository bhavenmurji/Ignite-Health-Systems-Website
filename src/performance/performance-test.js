/**
 * Ignite Health Systems - Comprehensive Performance Testing Suite
 * Tests animation performance, loading times, Core Web Vitals, and system optimization
 */

class IgnitePerformanceTest {
    constructor() {
        this.testResults = {
            coreWebVitals: {},
            animationPerformance: {},
            loadingMetrics: {},
            systemPerformance: {},
            overallScore: 0,
            recommendations: []
        };
        
        this.thresholds = {
            LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
            FID: { good: 100, poor: 300 },   // First Input Delay
            CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
            FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
            TTI: { good: 3800, poor: 7300 }, // Time to Interactive
            FPS: { good: 55, poor: 30 }      // Frames Per Second
        };
        
        this.testDuration = 10000; // 10 seconds
        this.init();
    }
    
    async init() {
        console.log('[Performance Test] Starting comprehensive performance analysis...');
        
        try {
            // Wait for page to fully load
            await this.waitForPageLoad();
            
            // Run all tests in parallel
            await Promise.all([
                this.testCoreWebVitals(),
                this.testAnimationPerformance(),
                this.testLoadingMetrics(),
                this.testSystemPerformance()
            ]);
            
            // Calculate overall score
            this.calculateOverallScore();
            
            // Generate recommendations
            this.generateRecommendations();
            
            // Report results
            this.reportResults();
            
        } catch (error) {
            console.error('[Performance Test] Error during testing:', error);
        }
    }
    
    waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }
    
    async testCoreWebVitals() {
        console.log('[Performance Test] Testing Core Web Vitals...');
        
        return new Promise((resolve) => {
            // Test LCP (Largest Contentful Paint)
            this.observeLCP((lcp) => {
                this.testResults.coreWebVitals.LCP = {
                    value: lcp,
                    score: this.getScore(lcp, this.thresholds.LCP),
                    rating: this.getRating(lcp, this.thresholds.LCP)
                };
            });
            
            // Test FID (First Input Delay)
            this.observeFID((fid) => {
                this.testResults.coreWebVitals.FID = {
                    value: fid,
                    score: this.getScore(fid, this.thresholds.FID),
                    rating: this.getRating(fid, this.thresholds.FID)
                };
            });
            
            // Test CLS (Cumulative Layout Shift)
            this.observeCLS((cls) => {
                this.testResults.coreWebVitals.CLS = {
                    value: cls,
                    score: this.getScore(cls, this.thresholds.CLS, true), // Lower is better
                    rating: this.getRating(cls, this.thresholds.CLS, true)
                };
            });
            
            // Test FCP (First Contentful Paint)
            this.observeFCP((fcp) => {
                this.testResults.coreWebVitals.FCP = {
                    value: fcp,
                    score: this.getScore(fcp, this.thresholds.FCP),
                    rating: this.getRating(fcp, this.thresholds.FCP)
                };
            });
            
            // Test TTI (Time to Interactive)
            this.observeTTI((tti) => {
                this.testResults.coreWebVitals.TTI = {
                    value: tti,
                    score: this.getScore(tti, this.thresholds.TTI),
                    rating: this.getRating(tti, this.thresholds.TTI)
                };
            });
            
            setTimeout(resolve, 5000); // Allow time for metrics collection
        });
    }
    
    async testAnimationPerformance() {
        console.log('[Performance Test] Testing animation performance...');
        
        return new Promise((resolve) => {
            let frameCount = 0;
            let totalFrameTime = 0;
            let droppedFrames = 0;
            let lastFrameTime = performance.now();
            
            const measureFrame = (currentTime) => {
                frameCount++;
                const frameTime = currentTime - lastFrameTime;
                totalFrameTime += frameTime;
                
                // Detect dropped frames (frame time > 16.67ms for 60fps)
                if (frameTime > 16.67) {
                    droppedFrames++;
                }
                
                lastFrameTime = currentTime;
                
                if (frameCount < this.testDuration / 16.67) { // Expected frames in test duration
                    requestAnimationFrame(measureFrame);
                } else {
                    const averageFPS = 1000 / (totalFrameTime / frameCount);
                    const frameDropRate = (droppedFrames / frameCount) * 100;
                    
                    this.testResults.animationPerformance = {
                        averageFPS: averageFPS,
                        droppedFrames: droppedFrames,
                        frameDropRate: frameDropRate,
                        score: this.getScore(averageFPS, this.thresholds.FPS),
                        rating: this.getRating(averageFPS, this.thresholds.FPS)
                    };
                    
                    resolve();
                }
            };
            
            requestAnimationFrame(measureFrame);
        });
    }
    
    async testLoadingMetrics() {
        console.log('[Performance Test] Testing loading metrics...');
        
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        const paintTiming = performance.getEntriesByType('paint');
        
        this.testResults.loadingMetrics = {
            domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
            windowLoad: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
            resourceLoadTime: this.calculateResourceLoadTime(),
            criticalResourcesLoaded: this.checkCriticalResources(),
            lazyLoadingEfficiency: this.testLazyLoading(),
            cacheEfficiency: this.testCacheEfficiency()
        };
        
        // Calculate loading score
        const totalLoadTime = navigationTiming.loadEventEnd - navigationTiming.navigationStart;
        this.testResults.loadingMetrics.totalLoadTime = totalLoadTime;
        this.testResults.loadingMetrics.score = this.getLoadingScore(totalLoadTime);
    }
    
    async testSystemPerformance() {
        console.log('[Performance Test] Testing system performance...');
        
        // Test memory usage
        const memoryInfo = performance.memory || {};
        
        // Test script execution time
        const scriptStart = performance.now();
        await this.simulateComplexOperation();
        const scriptExecutionTime = performance.now() - scriptStart;
        
        // Test DOM manipulation performance
        const domPerformance = this.testDOMPerformance();
        
        // Test network efficiency
        const networkEfficiency = await this.testNetworkEfficiency();
        
        this.testResults.systemPerformance = {
            memoryUsage: {
                used: memoryInfo.usedJSHeapSize || 0,
                total: memoryInfo.totalJSHeapSize || 0,
                limit: memoryInfo.jsHeapSizeLimit || 0
            },
            scriptExecutionTime: scriptExecutionTime,
            domPerformance: domPerformance,
            networkEfficiency: networkEfficiency,
            hardwareAcceleration: this.testHardwareAcceleration()
        };
    }
    
    calculateResourceLoadTime() {
        const resourceTiming = performance.getEntriesByType('resource');
        let totalTime = 0;
        let slowResources = [];
        
        resourceTiming.forEach(resource => {
            const loadTime = resource.responseEnd - resource.startTime;
            totalTime += loadTime;
            
            if (loadTime > 2000) { // Resources taking more than 2 seconds
                slowResources.push({
                    name: resource.name,
                    loadTime: loadTime
                });
            }
        });
        
        return {
            averageLoadTime: totalTime / resourceTiming.length,
            slowResources: slowResources,
            totalResources: resourceTiming.length
        };
    }
    
    checkCriticalResources() {
        const criticalResources = [
            'src/performance/performance-integration.js',
            'src/performance/animation-engine.js',
            'src/performance/lazy-loader.js',
            'css/style.css'
        ];
        
        const loadedResources = performance.getEntriesByType('resource').map(r => r.name);
        const criticalLoaded = criticalResources.filter(resource => 
            loadedResources.some(loaded => loaded.includes(resource))
        );
        
        return {
            total: criticalResources.length,
            loaded: criticalLoaded.length,
            efficiency: (criticalLoaded.length / criticalResources.length) * 100
        };
    }
    
    testLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-lazy]');
        const totalImages = document.querySelectorAll('img').length;
        
        return {
            lazyImages: lazyImages.length,
            totalImages: totalImages,
            efficiency: (lazyImages.length / totalImages) * 100
        };
    }
    
    testCacheEfficiency() {
        const resourceTiming = performance.getEntriesByType('resource');
        let cachedResources = 0;
        
        resourceTiming.forEach(resource => {
            // Resource is cached if transferSize is much smaller than encodedBodySize
            if (resource.transferSize < resource.encodedBodySize * 0.1) {
                cachedResources++;
            }
        });
        
        return {
            cachedResources: cachedResources,
            totalResources: resourceTiming.length,
            efficiency: (cachedResources / resourceTiming.length) * 100
        };
    }
    
    async simulateComplexOperation() {
        // Simulate complex operation to test script performance
        return new Promise(resolve => {
            let result = 0;
            for (let i = 0; i < 100000; i++) {
                result += Math.sqrt(i);
            }
            resolve(result);
        });
    }
    
    testDOMPerformance() {
        const start = performance.now();
        
        // Test DOM manipulation
        const testElement = document.createElement('div');
        testElement.innerHTML = '<span>Performance Test</span>';
        document.body.appendChild(testElement);
        
        // Test style calculations
        const styles = window.getComputedStyle(testElement);
        const width = styles.width;
        
        // Clean up
        document.body.removeChild(testElement);
        
        return performance.now() - start;
    }
    
    async testNetworkEfficiency() {
        // Test network efficiency using Resource Timing API
        const resourceTiming = performance.getEntriesByType('resource');
        let networkTime = 0;
        let dnsTime = 0;
        let tcpTime = 0;
        
        resourceTiming.forEach(resource => {
            networkTime += resource.responseEnd - resource.fetchStart;
            dnsTime += resource.domainLookupEnd - resource.domainLookupStart;
            tcpTime += resource.connectEnd - resource.connectStart;
        });
        
        return {
            averageNetworkTime: networkTime / resourceTiming.length,
            averageDNSTime: dnsTime / resourceTiming.length,
            averageTCPTime: tcpTime / resourceTiming.length
        };
    }
    
    testHardwareAcceleration() {
        // Test if hardware acceleration is working
        const testElement = document.createElement('div');
        testElement.style.transform = 'translateZ(0)';
        testElement.style.willChange = 'transform';
        document.body.appendChild(testElement);
        
        const styles = window.getComputedStyle(testElement);
        const hasAcceleration = styles.transform !== 'none' || styles.willChange !== 'auto';
        
        document.body.removeChild(testElement);
        
        return {
            enabled: hasAcceleration,
            score: hasAcceleration ? 100 : 0
        };
    }
    
    // Performance Observer methods
    observeLCP(callback) {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                callback(lastEntry.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }
    
    observeFID(callback) {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const fid = entry.processingStart - entry.startTime;
                    callback(fid);
                }
            });
            observer.observe({ entryTypes: ['first-input'] });
        }
    }
    
    observeCLS(callback) {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                callback(clsValue);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    observeFCP(callback) {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        callback(entry.startTime);
                    }
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }
    
    observeTTI(callback) {
        // Simplified TTI calculation
        window.addEventListener('load', () => {
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            const tti = navigationTiming.domInteractive - navigationTiming.navigationStart;
            callback(tti);
        });
    }
    
    // Scoring methods
    getScore(value, threshold, lowerIsBetter = false) {
        if (lowerIsBetter) {
            if (value <= threshold.good) return 100;
            if (value >= threshold.poor) return 0;
            return Math.round(100 - ((value - threshold.good) / (threshold.poor - threshold.good)) * 100);
        } else {
            if (value <= threshold.good) return 100;
            if (value >= threshold.poor) return 0;
            return Math.round(100 - ((value - threshold.good) / (threshold.poor - threshold.good)) * 100);
        }
    }
    
    getRating(value, threshold, lowerIsBetter = false) {
        if (lowerIsBetter) {
            if (value <= threshold.good) return 'good';
            if (value >= threshold.poor) return 'poor';
            return 'needs-improvement';
        } else {
            if (value <= threshold.good) return 'good';
            if (value >= threshold.poor) return 'poor';
            return 'needs-improvement';
        }
    }
    
    getLoadingScore(totalLoadTime) {
        if (totalLoadTime <= 2000) return 100;
        if (totalLoadTime >= 5000) return 0;
        return Math.round(100 - ((totalLoadTime - 2000) / 3000) * 100);
    }
    
    calculateOverallScore() {
        let totalScore = 0;
        let scoreCount = 0;
        
        // Core Web Vitals (50% weight)
        Object.values(this.testResults.coreWebVitals).forEach(metric => {
            if (metric.score !== undefined) {
                totalScore += metric.score * 0.5;
                scoreCount += 0.5;
            }
        });
        
        // Animation Performance (25% weight)
        if (this.testResults.animationPerformance.score !== undefined) {
            totalScore += this.testResults.animationPerformance.score * 0.25;
            scoreCount += 0.25;
        }
        
        // Loading Metrics (15% weight)
        if (this.testResults.loadingMetrics.score !== undefined) {
            totalScore += this.testResults.loadingMetrics.score * 0.15;
            scoreCount += 0.15;
        }
        
        // System Performance (10% weight)
        if (this.testResults.systemPerformance.hardwareAcceleration) {
            totalScore += this.testResults.systemPerformance.hardwareAcceleration.score * 0.1;
            scoreCount += 0.1;
        }
        
        this.testResults.overallScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        // Core Web Vitals recommendations
        if (this.testResults.coreWebVitals.LCP?.rating === 'poor') {
            recommendations.push({
                type: 'critical',
                metric: 'LCP',
                issue: 'Largest Contentful Paint is too slow',
                solution: 'Optimize critical resources, use preload for key assets, consider image optimization'
            });
        }
        
        if (this.testResults.coreWebVitals.FID?.rating === 'poor') {
            recommendations.push({
                type: 'critical',
                metric: 'FID',
                issue: 'First Input Delay is too high',
                solution: 'Break up long tasks, optimize JavaScript execution, use web workers for heavy computations'
            });
        }
        
        if (this.testResults.coreWebVitals.CLS?.rating === 'poor') {
            recommendations.push({
                type: 'critical',
                metric: 'CLS',
                issue: 'Cumulative Layout Shift is too high',
                solution: 'Set size attributes on images, reserve space for dynamic content, avoid layout-inducing CSS changes'
            });
        }
        
        // Animation recommendations
        if (this.testResults.animationPerformance.averageFPS < 50) {
            recommendations.push({
                type: 'performance',
                metric: 'FPS',
                issue: 'Low frame rate detected',
                solution: 'Enable hardware acceleration, optimize animations, reduce animation complexity'
            });
        }
        
        // Loading recommendations
        if (this.testResults.loadingMetrics.resourceLoadTime?.slowResources?.length > 0) {
            recommendations.push({
                type: 'optimization',
                metric: 'Resource Loading',
                issue: 'Slow loading resources detected',
                solution: 'Optimize images, minify scripts, enable compression, use CDN'
            });
        }
        
        // System recommendations
        if (!this.testResults.systemPerformance.hardwareAcceleration?.enabled) {
            recommendations.push({
                type: 'enhancement',
                metric: 'Hardware Acceleration',
                issue: 'Hardware acceleration not fully utilized',
                solution: 'Apply CSS transforms (translateZ(0)) to animated elements, use will-change property'
            });
        }
        
        this.testResults.recommendations = recommendations;
    }
    
    reportResults() {
        console.log('\n=== IGNITE HEALTH SYSTEMS PERFORMANCE TEST RESULTS ===\n');
        
        // Overall Score
        console.log(`Overall Performance Score: ${this.testResults.overallScore}/100`);
        
        // Core Web Vitals
        console.log('\n--- Core Web Vitals ---');
        Object.entries(this.testResults.coreWebVitals).forEach(([metric, data]) => {
            console.log(`${metric}: ${data.value.toFixed(2)}ms (${data.rating}) - Score: ${data.score}/100`);
        });
        
        // Animation Performance
        console.log('\n--- Animation Performance ---');
        const anim = this.testResults.animationPerformance;
        console.log(`Average FPS: ${anim.averageFPS?.toFixed(2)} (${anim.rating})`);
        console.log(`Frame Drop Rate: ${anim.frameDropRate?.toFixed(2)}%`);
        console.log(`Dropped Frames: ${anim.droppedFrames}`);
        
        // Loading Metrics
        console.log('\n--- Loading Metrics ---');
        const loading = this.testResults.loadingMetrics;
        console.log(`Total Load Time: ${loading.totalLoadTime?.toFixed(2)}ms`);
        console.log(`DOM Content Loaded: ${loading.domContentLoaded?.toFixed(2)}ms`);
        console.log(`Critical Resources Loaded: ${loading.criticalResourcesLoaded?.loaded}/${loading.criticalResourcesLoaded?.total}`);
        console.log(`Lazy Loading Efficiency: ${loading.lazyLoadingEfficiency?.efficiency?.toFixed(2)}%`);
        
        // System Performance
        console.log('\n--- System Performance ---');
        const system = this.testResults.systemPerformance;
        console.log(`Memory Usage: ${(system.memoryUsage.used / 1024 / 1024).toFixed(2)}MB`);
        console.log(`Script Execution Time: ${system.scriptExecutionTime?.toFixed(2)}ms`);
        console.log(`Hardware Acceleration: ${system.hardwareAcceleration?.enabled ? 'Enabled' : 'Disabled'}`);
        
        // Recommendations
        if (this.testResults.recommendations.length > 0) {
            console.log('\n--- Recommendations ---');
            this.testResults.recommendations.forEach((rec, index) => {
                console.log(`${index + 1}. [${rec.type.toUpperCase()}] ${rec.metric}: ${rec.issue}`);
                console.log(`   Solution: ${rec.solution}\n`);
            });
        }
        
        // Report to window for external access
        window.IgnitePerformanceTestResults = this.testResults;
        
        // Trigger custom event for analytics
        window.dispatchEvent(new CustomEvent('ignite-performance-test-complete', {
            detail: this.testResults
        }));
    }
    
    // Public API
    getResults() {
        return this.testResults;
    }
    
    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...this.testResults
        };
        
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ignite-performance-test-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Auto-start performance test after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        window.IgnitePerformanceTest = new IgnitePerformanceTest();
    }, 2000); // Wait 2 seconds after page load
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IgnitePerformanceTest;
}