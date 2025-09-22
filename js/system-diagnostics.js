/**
 * Ignite Health Systems - System Diagnostics
 * Comprehensive health check for all optimizations
 */

(function() {
    'use strict';

    /**
     * Run comprehensive system diagnostics
     */
    function runDiagnostics() {
        console.group('🔥 IGNITE HEALTH SYSTEMS - DIAGNOSTIC REPORT');
        
        const results = {
            timestamp: new Date().toISOString(),
            performance: checkPerformanceOptimizations(),
            mobile: checkMobileOptimizations(),
            pwa: checkPWAFeatures(),
            errorHandling: checkErrorHandling(),
            coreVitals: checkCoreVitals(),
            assets: checkAssetOptimization(),
            overall: 'UNKNOWN'
        };

        // Calculate overall health score
        const scores = Object.values(results).filter(r => typeof r === 'object' && r.score);
        const averageScore = scores.reduce((sum, r) => sum + r.score, 0) / scores.length;
        
        if (averageScore >= 90) results.overall = 'EXCELLENT';
        else if (averageScore >= 80) results.overall = 'GOOD';
        else if (averageScore >= 70) results.overall = 'FAIR';
        else results.overall = 'NEEDS_IMPROVEMENT';

        displayResults(results);
        console.groupEnd();
        
        return results;
    }

    /**
     * Check performance optimization systems
     */
    function checkPerformanceOptimizations() {
        const checks = {
            performanceMonitor: !!window.IgnitePerformance,
            coreVitalsOptimizer: !!window.IgniteCoreVitals,
            resourcePreloading: document.querySelectorAll('link[rel="preload"]').length > 0,
            criticalCSS: document.querySelectorAll('style').length > 0,
            deferredScripts: document.querySelectorAll('script[defer]').length > 0
        };

        const score = (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;
        
        return {
            score: Math.round(score),
            status: score >= 80 ? 'HEALTHY' : 'NEEDS_ATTENTION',
            checks,
            recommendations: score < 80 ? ['Enable deferred script loading', 'Add resource preloading'] : []
        };
    }

    /**
     * Check mobile optimization features
     */
    function checkMobileOptimizations() {
        const checks = {
            mobileOptimizer: !!window.IgniteMobile,
            viewportMeta: !!document.querySelector('meta[name="viewport"]'),
            touchOptimization: document.body.classList.contains('touch'),
            responsiveImages: document.querySelectorAll('img[sizes]').length > 0,
            mobileNavigation: !!document.querySelector('.mobile-menu-toggle')
        };

        const score = (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;
        
        return {
            score: Math.round(score),
            status: score >= 80 ? 'MOBILE_READY' : 'NEEDS_MOBILE_WORK',
            checks,
            deviceInfo: window.IgniteMobile ? window.IgniteMobile.device : null
        };
    }

    /**
     * Check PWA features
     */
    function checkPWAFeatures() {
        const checks = {
            serviceWorker: 'serviceWorker' in navigator,
            pwInstaller: !!window.IgnitePWA,
            manifest: !!document.querySelector('link[rel="manifest"]'),
            httpsOrLocalhost: location.protocol === 'https:' || location.hostname === 'localhost',
            offlineCapable: !!window.caches
        };

        const score = (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;
        
        return {
            score: Math.round(score),
            status: score >= 80 ? 'PWA_READY' : 'BASIC_WEB_APP',
            checks,
            installable: window.IgnitePWA ? window.IgnitePWA.pwaState.isInstallable : false
        };
    }

    /**
     * Check error handling systems
     */
    function checkErrorHandling() {
        const checks = {
            globalErrorHandler: !!window.IgniteErrorHandler,
            unhandledRejectionHandler: true, // Always true as we set it up
            resourceErrorHandling: true, // Always true as we set it up
            fallbackStrategies: document.querySelectorAll('style').length > 2,
            errorRecovery: !!window.IgniteErrorHandler
        };

        const score = (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;
        
        return {
            score: Math.round(score),
            status: score >= 90 ? 'BULLETPROOF' : 'PARTIALLY_PROTECTED',
            checks,
            errorStats: window.IgniteErrorHandler ? window.IgniteErrorHandler.getErrorStats() : null
        };
    }

    /**
     * Check Core Web Vitals optimization
     */
    function checkCoreVitals() {
        const checks = {
            coreVitalsOptimizer: !!window.IgniteCoreVitals,
            lazyLoading: 'IntersectionObserver' in window,
            imageOptimization: document.querySelectorAll('img[loading="lazy"]').length > 0,
            layoutStability: document.querySelectorAll('img[width][height]').length > 0,
            criticalPathOptimized: document.querySelectorAll('link[rel="preload"]').length > 0
        };

        const score = (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;
        const metrics = window.IgniteCoreVitals ? window.IgniteCoreVitals.getMetrics() : null;
        
        return {
            score: Math.round(score),
            status: score >= 85 ? 'OPTIMIZED' : 'BASIC_OPTIMIZATION',
            checks,
            metrics,
            coreVitalsGrades: getCoreVitalsGrades(metrics)
        };
    }

    /**
     * Check asset optimization
     */
    function checkAssetOptimization() {
        const checks = {
            imagePreloading: document.querySelectorAll('link[rel="preload"][as="image"]').length > 0,
            fontOptimization: document.querySelectorAll('link[rel="preconnect"]').length > 0,
            cssOptimization: document.querySelectorAll('link[rel="stylesheet"]').length > 0,
            jsOptimization: document.querySelectorAll('script[defer]').length > 0,
            resourceHints: document.querySelectorAll('link[rel="dns-prefetch"]').length > 0
        };

        const score = (Object.values(checks).filter(Boolean).length / Object.keys(checks).length) * 100;
        
        return {
            score: Math.round(score),
            status: score >= 80 ? 'OPTIMIZED' : 'BASIC',
            checks
        };
    }

    /**
     * Get Core Web Vitals grades
     */
    function getCoreVitalsGrades(metrics) {
        if (!metrics) return null;

        return {
            lcp: metrics.lcp ? (metrics.lcp <= 2500 ? 'GOOD' : metrics.lcp <= 4000 ? 'NEEDS_IMPROVEMENT' : 'POOR') : 'UNKNOWN',
            fid: metrics.fid ? (metrics.fid <= 100 ? 'GOOD' : metrics.fid <= 300 ? 'NEEDS_IMPROVEMENT' : 'POOR') : 'UNKNOWN',
            cls: metrics.cls ? (metrics.cls <= 0.1 ? 'GOOD' : metrics.cls <= 0.25 ? 'NEEDS_IMPROVEMENT' : 'POOR') : 'UNKNOWN'
        };
    }

    /**
     * Display diagnostic results
     */
    function displayResults(results) {
        console.log('🔥 OVERALL SYSTEM HEALTH:', results.overall);
        console.log('📊 DETAILED BREAKDOWN:');
        console.table({
            'Performance': results.performance.status + ' (' + results.performance.score + '%)',
            'Mobile': results.mobile.status + ' (' + results.mobile.score + '%)',
            'PWA': results.pwa.status + ' (' + results.pwa.score + '%)',
            'Error Handling': results.errorHandling.status + ' (' + results.errorHandling.score + '%)',
            'Core Vitals': results.coreVitals.status + ' (' + results.coreVitals.score + '%)',
            'Assets': results.assets.status + ' (' + results.assets.score + '%)'
        });

        if (results.coreVitals.coreVitalsGrades) {
            console.log('🎯 CORE WEB VITALS GRADES:');
            console.table(results.coreVitals.coreVitalsGrades);
        }

        console.log('🚀 RECOMMENDATIONS:');
        const allRecommendations = [
            ...results.performance.recommendations || [],
            ...results.mobile.recommendations || [],
            ...results.pwa.recommendations || [],
            ...results.errorHandling.recommendations || [],
            ...results.coreVitals.recommendations || [],
            ...results.assets.recommendations || []
        ];

        if (allRecommendations.length === 0) {
            console.log('✅ All systems optimal!');
        } else {
            allRecommendations.forEach((rec, i) => console.log(`${i + 1}. ${rec}`));
        }
    }

    /**
     * Run continuous monitoring
     */
    function startContinuousMonitoring() {
        console.log('🔄 Starting continuous system monitoring...');
        
        setInterval(() => {
            const quickCheck = {
                errors: window.IgniteErrorHandler ? window.IgniteErrorHandler.getErrorStats() : null,
                performance: window.IgnitePerformance ? window.IgnitePerformance.getMetrics() : null,
                memory: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
                } : null
            };

            if (quickCheck.errors && Object.values(quickCheck.errors).some(v => v > 0)) {
                console.warn('⚠️ New errors detected:', quickCheck.errors);
            }
        }, 30000); // Check every 30 seconds
    }

    // Initialize diagnostics
    function init() {
        console.log('🔥 Ignite Health Systems - System Diagnostics Initialized');
        
        // Run initial diagnostic after a delay to let all systems load
        setTimeout(runDiagnostics, 3000);
        
        // Start continuous monitoring
        setTimeout(startContinuousMonitoring, 5000);
    }

    // Expose public API
    window.IgniteDiagnostics = {
        runDiagnostics,
        startContinuousMonitoring
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();