/**
 * Ignite Health Systems - Script Loading Configuration
 * Optimized script loading with priority management and performance monitoring
 */

class IgniteScriptLoader {
    constructor() {
        this.config = {
            loadTimeout: 10000,
            maxConcurrentLoads: 3,
            retryAttempts: 2,
            enablePreloading: true,
            enablePrefetching: true
        };
        
        this.loadQueue = {
            critical: [],
            high: [],
            medium: [],
            low: []
        };
        
        this.loadedScripts = new Set();
        this.failedScripts = new Set();
        this.loadingScripts = new Map();
        this.metrics = {
            totalLoads: 0,
            successfulLoads: 0,
            failedLoads: 0,
            averageLoadTime: 0,
            loadTimes: []
        };
        
        this.init();
    }
    
    init() {
        this.setupScriptPriorities();
        this.preloadCriticalScripts();
        this.startLoadingSequence();
    }
    
    setupScriptPriorities() {
        // Critical scripts - Load immediately, block rendering if necessary
        this.loadQueue.critical = [
            {
                src: 'src/performance/performance-integration.js',
                module: true,
                async: false,
                defer: false,
                critical: true
            },
            {
                src: 'js/error-handler.js',
                async: false,
                defer: false,
                critical: true
            }
        ];
        
        // High priority - Load as soon as possible after critical
        this.loadQueue.high = [
            {
                src: 'src/performance/animation-engine.js',
                module: true,
                async: true,
                defer: false
            },
            {
                src: 'src/performance/lazy-loader.js',
                module: true,
                async: true,
                defer: false
            },
            {
                src: 'js/core-vitals-optimizer.js',
                async: true,
                defer: false
            },
            {
                src: 'js/performance-optimizer.js',
                async: true,
                defer: false
            }
        ];
        
        // Medium priority - Load after DOM content loaded
        this.loadQueue.medium = [
            {
                src: 'src/performance/intro-animation-enhanced.js',
                module: true,
                async: true,
                defer: true,
                condition: () => document.getElementById('intro-overlay') !== null
            },
            {
                src: 'js/animations.js',
                async: true,
                defer: true
            },
            {
                src: 'js/mobile-optimizations.js',
                async: true,
                defer: true
            },
            {
                src: 'js/mobile-fixes.js',
                async: true,
                defer: true
            },
            {
                src: 'js/performance-monitor.js',
                async: true,
                defer: true
            }
        ];
        
        // Low priority - Load after window load or during idle time
        this.loadQueue.low = [
            {
                src: 'js/web-audio-converter.js',
                async: true,
                defer: true,
                idle: true
            },
            {
                src: 'js/optimized-music-player.js',
                async: true,
                defer: true,
                idle: true,
                dependencies: ['js/web-audio-converter.js']
            },
            {
                src: 'js/form-optimizer.js',
                async: true,
                defer: true,
                idle: true
            },
            {
                src: 'js/pwa-installer.js',
                async: true,
                defer: true,
                idle: true
            },
            {
                src: 'js/system-diagnostics.js',
                async: true,
                defer: true,
                idle: true
            }
        ];
    }
    
    async startLoadingSequence() {
        try {
            // Load critical scripts immediately
            await this.loadScriptsByPriority('critical');
            
            // Load high priority scripts
            this.loadScriptsByPriority('high');
            
            // Load medium priority after DOM content loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => this.loadScriptsByPriority('medium'), 100);
                });
            } else {
                setTimeout(() => this.loadScriptsByPriority('medium'), 100);
            }
            
            // Load low priority after window load
            window.addEventListener('load', () => {
                this.loadLowPriorityScripts();
            });
            
        } catch (error) {
            console.error('[ScriptLoader] Critical error in loading sequence:', error);
        }
    }
    
    preloadCriticalScripts() {
        if (!this.config.enablePreloading) return;
        
        // Preload high priority scripts
        this.loadQueue.high.forEach(script => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = script.src;
            link.as = 'script';
            if (script.module) {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }
    
    async loadScriptsByPriority(priority) {
        const scripts = this.loadQueue[priority];
        if (!scripts || scripts.length === 0) return;
        
        const loadPromises = scripts.map(scriptConfig => {
            return this.loadScript(scriptConfig);
        });
        
        if (priority === 'critical') {
            // Wait for all critical scripts to load
            await Promise.all(loadPromises);
        } else {
            // Don't wait for non-critical scripts
            Promise.all(loadPromises).catch(error => {
                console.warn(`[ScriptLoader] Some ${priority} priority scripts failed to load:`, error);
            });
        }
    }
    
    loadLowPriorityScripts() {
        const loadWithIdle = () => {
            this.loadQueue.low.forEach(scriptConfig => {
                if (scriptConfig.idle && 'requestIdleCallback' in window) {
                    requestIdleCallback(() => {
                        this.loadScript(scriptConfig);
                    }, { timeout: 5000 });
                } else {
                    setTimeout(() => {
                        this.loadScript(scriptConfig);
                    }, Math.random() * 1000 + 500); // Stagger loading
                }
            });
        };
        
        // Use timeout as fallback for requestIdleCallback
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadWithIdle, { timeout: 3000 });
        } else {
            setTimeout(loadWithIdle, 1000);
        }
    }
    
    async loadScript(scriptConfig) {
        const { src, condition, dependencies } = scriptConfig;
        
        // Check if already loaded or failed
        if (this.loadedScripts.has(src) || this.failedScripts.has(src)) {
            return Promise.resolve();
        }
        
        // Check if currently loading
        if (this.loadingScripts.has(src)) {
            return this.loadingScripts.get(src);
        }
        
        // Check condition
        if (condition && !condition()) {
            console.log(`[ScriptLoader] Skipping ${src} - condition not met`);
            return Promise.resolve();
        }
        
        // Check dependencies
        if (dependencies) {
            const dependencyPromises = dependencies.map(dep => {
                if (!this.loadedScripts.has(dep)) {
                    return this.waitForScript(dep);
                }
                return Promise.resolve();
            });
            await Promise.all(dependencyPromises);
        }
        
        const loadPromise = this.createScriptElement(scriptConfig);
        this.loadingScripts.set(src, loadPromise);
        
        try {
            await loadPromise;
            this.loadedScripts.add(src);
            this.loadingScripts.delete(src);
            this.metrics.successfulLoads++;
            console.log(`[ScriptLoader] Successfully loaded: ${src}`);
        } catch (error) {
            this.failedScripts.add(src);
            this.loadingScripts.delete(src);
            this.metrics.failedLoads++;
            console.error(`[ScriptLoader] Failed to load: ${src}`, error);
            
            // Retry logic
            if (scriptConfig.retryCount === undefined) {
                scriptConfig.retryCount = 0;
            }
            
            if (scriptConfig.retryCount < this.config.retryAttempts) {
                scriptConfig.retryCount++;
                console.log(`[ScriptLoader] Retrying ${src} (attempt ${scriptConfig.retryCount})`);
                setTimeout(() => {
                    this.failedScripts.delete(src);
                    this.loadScript(scriptConfig);
                }, 1000 * scriptConfig.retryCount);
            }
        }
        
        this.metrics.totalLoads++;
        return loadPromise;
    }
    
    createScriptElement(scriptConfig) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const startTime = performance.now();
            
            // Configure script element
            script.src = scriptConfig.src;
            script.async = scriptConfig.async !== false;
            script.defer = scriptConfig.defer === true;
            
            if (scriptConfig.module) {
                script.type = 'module';
            }
            
            if (scriptConfig.crossOrigin) {
                script.crossOrigin = scriptConfig.crossOrigin;
            }
            
            // Set up event handlers
            script.onload = () => {
                const loadTime = performance.now() - startTime;
                this.metrics.loadTimes.push(loadTime);
                this.updateAverageLoadTime();
                resolve();
            };
            
            script.onerror = (error) => {
                console.error(`[ScriptLoader] Script error for ${scriptConfig.src}:`, error);
                reject(error);
            };
            
            // Timeout handling
            const timeout = setTimeout(() => {
                console.error(`[ScriptLoader] Timeout loading ${scriptConfig.src}`);
                reject(new Error(`Script load timeout: ${scriptConfig.src}`));
            }, this.config.loadTimeout);
            
            script.onload = () => {
                clearTimeout(timeout);
                const loadTime = performance.now() - startTime;
                this.metrics.loadTimes.push(loadTime);
                this.updateAverageLoadTime();
                resolve();
            };
            
            // Add to document
            document.head.appendChild(script);
        });
    }
    
    waitForScript(src, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const checkInterval = 100;
            let elapsed = 0;
            
            const check = () => {
                if (this.loadedScripts.has(src)) {
                    resolve();
                } else if (elapsed >= timeout) {
                    reject(new Error(`Timeout waiting for script: ${src}`));
                } else {
                    elapsed += checkInterval;
                    setTimeout(check, checkInterval);
                }
            };
            
            check();
        });
    }
    
    updateAverageLoadTime() {
        if (this.metrics.loadTimes.length > 0) {
            const total = this.metrics.loadTimes.reduce((sum, time) => sum + time, 0);
            this.metrics.averageLoadTime = total / this.metrics.loadTimes.length;
        }
    }
    
    // Public API
    getMetrics() {
        return {
            ...this.metrics,
            loadedScripts: Array.from(this.loadedScripts),
            failedScripts: Array.from(this.failedScripts),
            currentlyLoading: Array.from(this.loadingScripts.keys())
        };
    }
    
    isLoaded(src) {
        return this.loadedScripts.has(src);
    }
    
    isFailed(src) {
        return this.failedScripts.has(src);
    }
    
    isLoading(src) {
        return this.loadingScripts.has(src);
    }
    
    addScript(scriptConfig, priority = 'low') {
        if (this.loadQueue[priority]) {
            this.loadQueue[priority].push(scriptConfig);
        }
    }
    
    preloadScript(src) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'script';
        document.head.appendChild(link);
    }
    
    prefetchScript(src) {
        if (!this.config.enablePrefetching) return;
        
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
    }
}

// Initialize script loader
window.IgniteScriptLoader = new IgniteScriptLoader();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IgniteScriptLoader;
}