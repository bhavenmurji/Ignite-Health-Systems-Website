// Loading Sequence for Ignite Health Systems
// Displays IgniteARevolution.png then fades to main content

document.addEventListener('DOMContentLoaded', function() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-content">
            <img src="/assets/images/IgniteARevolution.png" alt="Ignite A Revolution" class="revolution-image">
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
        </div>
    `;
    
    // Add styles for loading sequence
    const style = document.createElement('style');
    style.textContent = `
        #loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
            transition: opacity 1s ease-out;
        }
        
        #loading-overlay.fade-out {
            opacity: 0;
            pointer-events: none;
        }
        
        .loading-content {
            text-align: center;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .revolution-image {
            max-width: 600px;
            width: 90%;
            height: auto;
            opacity: 0;
            animation: fadeInScale 1.5s ease-out forwards;
            filter: drop-shadow(0 0 50px rgba(255, 107, 53, 0.5));
        }
        
        .loading-progress {
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            margin: 30px auto;
            overflow: hidden;
            opacity: 0;
            animation: fadeIn 0.5s ease-out 1s forwards;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #ff6b35, #ff4500);
            width: 0%;
            border-radius: 2px;
            animation: loadProgress 2s ease-out 1.5s forwards;
            box-shadow: 0 0 10px rgba(255, 107, 53, 0.7);
        }
        
        @keyframes fadeInScale {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }
        
        @keyframes loadProgress {
            0% {
                width: 0%;
            }
            100% {
                width: 100%;
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.02);
            }
        }
        
        /* Hero section fade-in after loading */
        .hero-section {
            opacity: 0;
            animation: heroFadeIn 1.5s ease-out 3.5s forwards;
        }
        
        @keyframes heroFadeIn {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Main headline animation */
        .hero-section h1 {
            opacity: 0;
            animation: headlineFadeIn 1s ease-out 4s forwards;
        }
        
        @keyframes headlineFadeIn {
            0% {
                opacity: 0;
                transform: scale(0.95);
                filter: blur(5px);
            }
            100% {
                opacity: 1;
                transform: scale(1);
                filter: blur(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add overlay to body
    document.body.appendChild(loadingOverlay);
    
    // Hide main content initially
    const mainContent = document.querySelector('.hero-section, main, .container');
    if (mainContent) {
        mainContent.style.opacity = '0';
    }
    
    // Start fade out sequence after 3 seconds
    setTimeout(() => {
        loadingOverlay.classList.add('fade-out');
        
        // Show main content
        if (mainContent) {
            mainContent.style.opacity = '';
        }
        
        // Remove overlay after fade completes
        setTimeout(() => {
            loadingOverlay.remove();
        }, 1000);
    }, 3000);
    
    // Preload critical images
    const imagesToPreload = [
        '/assets/images/IgniteARevolution.png',
        '/assets/images/BhavenMurjiNeedsACoFounder.png',
        '/assets/images/ignite-logo.png'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Export for use in other scripts
window.LoadingSequence = {
    show: function() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.classList.remove('fade-out');
        }
    },
    hide: function() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1000);
        }
    }
};