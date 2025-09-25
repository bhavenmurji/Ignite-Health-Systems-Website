/**
 * Ignite Health Systems - Progressive Web App (PWA) Installer
 * Modern PWA features for enhanced user experience
 */

(function() {
    'use strict';

    // PWA configuration
    const config = {
        enableNotifications: true,
        enableOffline: true,
        enableInstallPrompt: true,
        cacheVersion: 'v1.0.0',
        staticCacheName: 'ignite-static-v1',
        dynamicCacheName: 'ignite-dynamic-v1'
    };

    // PWA state
    const pwaState = {
        isInstallable: false,
        isInstalled: false,
        isOnline: navigator.onLine,
        deferredPrompt: null
    };

    /**
     * Initialize PWA features
     */
    function init() {
        registerServiceWorker();
        setupInstallPrompt();
        handleNetworkStatus();
        createManifest();
        addPWAStyles();
        setupNotifications();
        checkIfInstalled();
    }

    /**
     * Register service worker
     */
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    showUpdateAvailable();
                                }
                            });
                        });
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    /**
     * Setup install prompt
     */
    function setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing
            e.preventDefault();
            pwaState.deferredPrompt = e;
            pwaState.isInstallable = true;
            
            if (config.enableInstallPrompt) {
                showInstallButton();
            }
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            pwaState.isInstalled = true;
            hideInstallButton();
            
            // Track installation
            if ('gtag' in window) {
                gtag('event', 'pwa_install', {
                    event_category: 'PWA',
                    event_label: 'App Installed'
                });
            }
        });
    }

    /**
     * Handle network status changes
     */
    function handleNetworkStatus() {
        function updateNetworkStatus() {
            pwaState.isOnline = navigator.onLine;
            document.body.classList.toggle('offline', !pwaState.isOnline);
            
            if (pwaState.isOnline) {
                hideOfflineIndicator();
            } else {
                showOfflineIndicator();
            }
        }

        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
        
        // Initial check
        updateNetworkStatus();
    }

    /**
     * Create dynamic manifest
     */
    function createManifest() {
        const manifest = {
            name: "Ignite Health Systems",
            short_name: "Ignite Health",
            description: "AI-Powered Clinical Co-Pilot for Independent Physicians",
            start_url: "/",
            display: "standalone",
            background_color: "#0d0d0d",
            theme_color: "#ff6b35",
            orientation: "portrait-primary",
            categories: ["health", "medical", "productivity"],
            lang: "en-US",
            icons: [
                {
                    src: "/assets/images/Ignite Logo.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "any maskable"
                },
                {
                    src: "/assets/images/Ignite Logo.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any maskable"
                }
            ],
            screenshots: [
                {
                    src: "/assets/images/IgniteARevolution.png",
                    sizes: "1280x720",
                    type: "image/png",
                    form_factor: "wide"
                }
            ],
            shortcuts: [
                {
                    name: "Join Waitlist",
                    short_name: "Join",
                    description: "Join the Ignite Health waitlist",
                    url: "/join.html",
                    icons: [
                        {
                            src: "/assets/images/Ignite Logo.png",
                            sizes: "96x96"
                        }
                    ]
                },
                {
                    name: "Platform",
                    short_name: "Platform",
                    description: "View platform features",
                    url: "/platform.html",
                    icons: [
                        {
                            src: "/assets/images/Ignite Logo.png",
                            sizes: "96x96"
                        }
                    ]
                }
            ]
        };

        // Create and inject manifest
        const manifestBlob = new Blob([JSON.stringify(manifest)], {
            type: 'application/json'
        });
        const manifestURL = URL.createObjectURL(manifestBlob);
        
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = manifestURL;
        document.head.appendChild(link);
    }

    /**
     * Show install button
     */
    function showInstallButton() {
        // Remove existing install button
        const existingButton = document.querySelector('.pwa-install-button');
        if (existingButton) existingButton.remove();

        // Create install button
        const installButton = document.createElement('button');
        installButton.className = 'pwa-install-button';
        installButton.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Install App
        `;
        
        installButton.addEventListener('click', installPWA);
        
        // Add to header or create floating button
        const header = document.querySelector('.navbar');
        if (header) {
            header.appendChild(installButton);
        } else {
            installButton.classList.add('floating');
            document.body.appendChild(installButton);
        }
    }

    /**
     * Hide install button
     */
    function hideInstallButton() {
        const installButton = document.querySelector('.pwa-install-button');
        if (installButton) {
            installButton.style.display = 'none';
        }
    }

    /**
     * Install PWA
     */
    function installPWA() {
        if (pwaState.deferredPrompt) {
            pwaState.deferredPrompt.prompt();
            
            pwaState.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                pwaState.deferredPrompt = null;
            });
        }
    }

    /**
     * Show offline indicator
     */
    function showOfflineIndicator() {
        // Remove existing indicator
        const existingIndicator = document.querySelector('.offline-indicator');
        if (existingIndicator) existingIndicator.remove();

        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
            <div class="offline-content">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01L16.17 16l1.42 1.42 1.41-1.42z"/>
                </svg>
                <span>You're offline</span>
            </div>
        `;
        
        document.body.appendChild(indicator);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (indicator && indicator.parentNode) {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                }, 300);
            }
        }, 3000);
    }

    /**
     * Hide offline indicator
     */
    function hideOfflineIndicator() {
        const indicator = document.querySelector('.offline-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }

    /**
     * Show update available notification
     */
    function showUpdateAvailable() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div class="update-content">
                <span>New version available!</span>
                <button onclick="window.location.reload()">Refresh</button>
                <button onclick="this.parentNode.parentNode.remove()">Later</button>
            </div>
        `;
        
        document.body.appendChild(notification);
    }

    /**
     * Setup notifications
     */
    function setupNotifications() {
        if (!config.enableNotifications || !('Notification' in window)) return;

        // Request permission
        if (Notification.permission === 'default') {
            // Don't request immediately, wait for user interaction
            const buttons = document.querySelectorAll('.btn-primary');
            buttons.forEach(button => {
                button.addEventListener('click', requestNotificationPermission, { once: true });
            });
        }
    }

    /**
     * Request notification permission
     */
    function requestNotificationPermission() {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showWelcomeNotification();
            }
        });
    }

    /**
     * Show welcome notification
     */
    function showWelcomeNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Welcome to Ignite Health!', {
                body: 'Thanks for installing our app. We\'ll keep you updated on our progress.',
                icon: '/assets/images/Ignite Logo.png',
                badge: '/assets/images/Ignite Logo.png',
                tag: 'welcome',
                requireInteraction: false
            });
        }
    }

    /**
     * Check if app is already installed
     */
    function checkIfInstalled() {
        // Check if running in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            pwaState.isInstalled = true;
            document.body.classList.add('pwa-installed');
        }
    }

    /**
     * Add PWA-specific styles
     */
    function addPWAStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* PWA Install Button */
            .pwa-install-button {
                background: var(--primary);
                color: var(--white);
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .pwa-install-button:hover {
                background: var(--accent);
                transform: translateY(-2px);
            }

            .pwa-install-button.floating {
                position: fixed;
                bottom: 20px;
                right: 20px;
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
                animation: fadeInUp 0.5s ease;
            }

            /* Offline Indicator */
            .offline-indicator {
                position: fixed;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
                z-index: 10000;
                animation: slideDown 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .offline-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            /* Update Notification */
            .update-notification {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: var(--card-background);
                border: 1px solid var(--primary);
                border-radius: 8px;
                padding: 16px;
                z-index: 10000;
                animation: slideUp 0.3s ease;
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
            }

            .update-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                color: var(--text-primary);
            }

            .update-content button {
                background: var(--primary);
                color: var(--white);
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.3s ease;
            }

            .update-content button:hover {
                background: var(--accent);
            }

            .update-content button:last-child {
                background: transparent;
                color: var(--text-secondary);
                border: 1px solid var(--border-light);
            }

            /* PWA Offline Styles */
            .offline .nav-menu {
                pointer-events: none;
                opacity: 0.6;
            }

            .offline .btn-primary:not(.offline-available) {
                pointer-events: none;
                opacity: 0.6;
            }

            /* PWA Installed Styles */
            .pwa-installed .pwa-install-button {
                display: none;
            }

            /* Animations */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translate(-50%, -20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Mobile optimizations */
            @media (max-width: 768px) {
                .pwa-install-button.floating {
                    bottom: 80px;
                    right: 16px;
                    padding: 12px 16px;
                }

                .update-notification {
                    left: 16px;
                    right: 16px;
                    bottom: 16px;
                }

                .update-content {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 8px;
                }

                .update-content button {
                    width: 100%;
                    padding: 8px 16px;
                }
            }

            /* Safe area adjustments for PWA */
            @supports (padding: max(0px)) {
                .pwa-installed .navbar {
                    padding-left: max(16px, env(safe-area-inset-left));
                    padding-right: max(16px, env(safe-area-inset-right));
                }

                .pwa-installed .hero {
                    padding-top: max(0px, env(safe-area-inset-top));
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API for external use
    window.IgnitePWA = {
        config,
        pwaState,
        installPWA,
        showInstallButton,
        hideInstallButton
    };

})();