/**
 * Deployment Verification Script for Optimized Music Player
 * Tests MOV file support and integration with existing website
 */

(function() {
    'use strict';
    
    const DeploymentTester = {
        testResults: {},
        isComplete: false,
        
        init() {
            console.log('🚀 Starting deployment verification...');
            this.runAllTests();
        },
        
        async runAllTests() {
            const tests = [
                this.testMOVFileExists,
                this.testOptimizedPlayerLoaded,
                this.testWebAudioConverterLoaded,
                this.testPlayerInitialization,
                this.testMOVPlayback,
                this.testControlFunctionality,
                this.testPerformanceImpact,
                this.testAccessibility,
                this.testCoreWebVitals
            ];
            
            for (const test of tests) {
                try {
                    await test.call(this);
                } catch (error) {
                    console.error(`❌ Test failed: ${test.name}`, error);
                    this.testResults[test.name] = { status: 'failed', error: error.message };
                }
            }
            
            this.generateReport();
        },
        
        async testMOVFileExists() {
            const testName = 'MOV File Existence';
            console.log(`🔍 Testing: ${testName}`);
            
            try {
                const response = await fetch('assets/media/Backing music.mov', { method: 'HEAD' });
                if (response.ok) {
                    console.log('✅ MOV file exists and is accessible');
                    this.testResults[testName] = { status: 'passed', details: 'MOV file accessible' };
                } else {
                    throw new Error(`MOV file not accessible: ${response.status}`);
                }
            } catch (error) {
                console.error('❌ MOV file test failed:', error);
                this.testResults[testName] = { status: 'failed', error: error.message };
            }
        },
        
        testOptimizedPlayerLoaded() {
            const testName = 'Optimized Player Loaded';
            console.log(`🔍 Testing: ${testName}`);
            
            if (window.OptimizedMusicPlayer) {
                console.log('✅ OptimizedMusicPlayer is loaded');
                this.testResults[testName] = { 
                    status: 'passed',
                    details: `Player version: ${window.OptimizedMusicPlayer.version || 'Unknown'}`
                };
            } else {
                console.error('❌ OptimizedMusicPlayer not found');
                this.testResults[testName] = { 
                    status: 'failed', 
                    error: 'OptimizedMusicPlayer not loaded' 
                };
            }
        },
        
        testWebAudioConverterLoaded() {
            const testName = 'Web Audio Converter Loaded';
            console.log(`🔍 Testing: ${testName}`);
            
            if (window.WebAudioConverter) {
                console.log('✅ WebAudioConverter is loaded');
                this.testResults[testName] = { 
                    status: 'passed',
                    details: `Converter initialized: ${window.WebAudioConverter.isInitialized}`
                };
            } else {
                console.error('❌ WebAudioConverter not found');
                this.testResults[testName] = { 
                    status: 'failed', 
                    error: 'WebAudioConverter not loaded' 
                };
            }
        },
        
        async testPlayerInitialization() {
            const testName = 'Player Initialization';
            console.log(`🔍 Testing: ${testName}`);
            
            if (window.OptimizedMusicPlayer && window.OptimizedMusicPlayer.isInitialized) {
                console.log('✅ Player is properly initialized');
                this.testResults[testName] = { 
                    status: 'passed',
                    details: 'Player initialized successfully'
                };
            } else {
                console.warn('⚠️ Player not yet initialized, waiting...');
                await this.waitForPlayerInit();
            }
        },
        
        async waitForPlayerInit(timeout = 5000) {
            return new Promise((resolve, reject) => {
                const checkInit = () => {
                    if (window.OptimizedMusicPlayer && window.OptimizedMusicPlayer.isInitialized) {
                        console.log('✅ Player initialized after waiting');
                        this.testResults['Player Initialization'] = { 
                            status: 'passed',
                            details: 'Player initialized after delay'
                        };
                        resolve();
                    }
                };
                
                const interval = setInterval(checkInit, 100);
                setTimeout(() => {
                    clearInterval(interval);
                    console.error('❌ Player initialization timeout');
                    this.testResults['Player Initialization'] = { 
                        status: 'failed',
                        error: 'Initialization timeout'
                    };
                    reject(new Error('Player initialization timeout'));
                }, timeout);
            });
        },
        
        async testMOVPlayback() {
            const testName = 'MOV Playback Test';
            console.log(`🔍 Testing: ${testName}`);
            
            if (!window.OptimizedMusicPlayer) {
                this.testResults[testName] = { status: 'skipped', error: 'Player not loaded' };
                return;
            }
            
            try {
                // Create test audio element
                const testAudio = document.createElement('audio');
                testAudio.src = 'assets/media/Backing music.mov';
                testAudio.muted = true; // Don't play audio during test
                
                await new Promise((resolve, reject) => {
                    testAudio.addEventListener('loadedmetadata', () => {
                        console.log('✅ MOV file metadata loaded successfully');
                        console.log(`Duration: ${testAudio.duration}s`);
                        this.testResults[testName] = { 
                            status: 'passed',
                            details: `Duration: ${testAudio.duration}s, Can play: ${testAudio.canPlayType('video/quicktime')}`
                        };
                        resolve();
                    });
                    
                    testAudio.addEventListener('error', (e) => {
                        reject(new Error(`MOV loading error: ${e.message || 'Unknown error'}`));
                    });
                    
                    setTimeout(() => {
                        reject(new Error('MOV loading timeout'));
                    }, 10000);
                    
                    testAudio.load();
                });
                
            } catch (error) {
                console.error('❌ MOV playback test failed:', error);
                this.testResults[testName] = { status: 'failed', error: error.message };
            }
        },
        
        testControlFunctionality() {
            const testName = 'Control Functionality';
            console.log(`🔍 Testing: ${testName}`);
            
            const playButton = document.querySelector('.music-play-btn');
            const volumeSlider = document.querySelector('.volume-slider');
            const progressBar = document.querySelector('.progress-bar');
            
            let passedTests = 0;
            let totalTests = 3;
            
            if (playButton) {
                console.log('✅ Play button found');
                passedTests++;
            } else {
                console.warn('⚠️ Play button not found');
            }
            
            if (volumeSlider) {
                console.log('✅ Volume control found');
                passedTests++;
            } else {
                console.warn('⚠️ Volume control not found');
            }
            
            if (progressBar) {
                console.log('✅ Progress bar found');
                passedTests++;
            } else {
                console.warn('⚠️ Progress bar not found');
            }
            
            const score = `${passedTests}/${totalTests}`;
            if (passedTests === totalTests) {
                this.testResults[testName] = { status: 'passed', details: `All controls found (${score})` };
            } else {
                this.testResults[testName] = { status: 'partial', details: `Some controls missing (${score})` };
            }
        },
        
        testPerformanceImpact() {
            const testName = 'Performance Impact';
            console.log(`🔍 Testing: ${testName}`);
            
            const performanceData = {
                memoryUsage: this.getMemoryUsage(),
                domNodes: document.querySelectorAll('*').length,
                scriptElements: document.querySelectorAll('script').length,
                audioElements: document.querySelectorAll('audio, video').length
            };
            
            console.log('📊 Performance metrics:', performanceData);
            
            this.testResults[testName] = { 
                status: 'measured',
                details: performanceData
            };
        },
        
        getMemoryUsage() {
            if (performance.memory) {
                return {
                    used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
                    total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100,
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100
                };
            }
            return 'Memory API not available';
        },
        
        testAccessibility() {
            const testName = 'Accessibility Features';
            console.log(`🔍 Testing: ${testName}`);
            
            const accessibilityChecks = {
                ariaLabels: document.querySelectorAll('[aria-label]').length,
                focusableElements: document.querySelectorAll('[tabindex], button, input, select, textarea, a[href]').length,
                altText: document.querySelectorAll('img[alt]').length,
                headingStructure: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length
            };
            
            console.log('♿ Accessibility metrics:', accessibilityChecks);
            
            this.testResults[testName] = { 
                status: 'measured',
                details: accessibilityChecks
            };
        },
        
        async testCoreWebVitals() {
            const testName = 'Core Web Vitals';
            console.log(`🔍 Testing: ${testName}`);
            
            if (!window.IgnitePerformance) {
                this.testResults[testName] = { status: 'skipped', error: 'Performance monitor not available' };
                return;
            }
            
            // Wait for performance data to be collected
            setTimeout(() => {
                if (window.IgnitePerformance.getMetrics) {
                    const metrics = window.IgnitePerformance.getMetrics();
                    console.log('📊 Core Web Vitals:', metrics);
                    
                    this.testResults[testName] = { 
                        status: 'measured',
                        details: metrics
                    };
                } else {
                    this.testResults[testName] = { 
                        status: 'skipped', 
                        error: 'Metrics not yet available' 
                    };
                }
            }, 2000);
        },
        
        generateReport() {
            console.log('\n📋 DEPLOYMENT VERIFICATION REPORT');
            console.log('================================');
            
            let passedTests = 0;
            let totalTests = 0;
            let criticalFailures = 0;
            
            Object.entries(this.testResults).forEach(([testName, result]) => {
                totalTests++;
                const status = result.status;
                const icon = status === 'passed' ? '✅' : 
                           status === 'failed' ? '❌' : 
                           status === 'partial' ? '⚠️' : 
                           status === 'measured' ? '📊' : 
                           status === 'skipped' ? '⏭️' : '❓';
                
                console.log(`${icon} ${testName}: ${status.toUpperCase()}`);
                if (result.details) {
                    console.log(`   Details: ${typeof result.details === 'object' ? JSON.stringify(result.details) : result.details}`);
                }
                if (result.error) {
                    console.log(`   Error: ${result.error}`);
                    if (['MOV File Existence', 'Optimized Player Loaded', 'Web Audio Converter Loaded'].includes(testName)) {
                        criticalFailures++;
                    }
                }
                
                if (status === 'passed') {
                    passedTests++;
                }
            });
            
            console.log('\n📈 SUMMARY');
            console.log(`Tests Passed: ${passedTests}/${totalTests}`);
            console.log(`Critical Failures: ${criticalFailures}`);
            
            if (criticalFailures === 0 && passedTests >= totalTests * 0.8) {
                console.log('🎉 DEPLOYMENT VERIFICATION: SUCCESS');
                console.log('✅ Safe to proceed with production deployment');
            } else if (criticalFailures > 0) {
                console.log('🚨 DEPLOYMENT VERIFICATION: CRITICAL ISSUES');
                console.log('❌ Fix critical issues before proceeding');
            } else {
                console.log('⚠️ DEPLOYMENT VERIFICATION: PARTIAL SUCCESS');
                console.log('🔍 Review issues before proceeding');
            }
            
            // Store results in session storage for later analysis
            sessionStorage.setItem('deploymentVerification', JSON.stringify({
                timestamp: new Date().toISOString(),
                results: this.testResults,
                summary: {
                    passed: passedTests,
                    total: totalTests,
                    criticalFailures: criticalFailures
                }
            }));
            
            this.isComplete = true;
        }
    };
    
    // Auto-start verification when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => DeploymentTester.init(), 2000); // Wait for other scripts to load
        });
    } else {
        setTimeout(() => DeploymentTester.init(), 2000);
    }
    
    // Expose for manual testing
    window.DeploymentTester = DeploymentTester;
    
})();