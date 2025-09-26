// Audio Control JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get or create audio element
    let audio = document.getElementById('background-music');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'background-music';
        audio.loop = true;
        const source = document.createElement('source');
        source.src = 'backing-music-compressed.mp3';
        source.type = 'audio/mp3';
        audio.appendChild(source);
        document.body.appendChild(audio);
    }
    
    // Create floating audio control button
    const audioButton = document.createElement('button');
    audioButton.className = 'audio-control-btn';
    audioButton.setAttribute('aria-label', 'Toggle background music');
    audioButton.innerHTML = `
        <svg class="audio-icon audio-on" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34834 21.9979 12C21.9979 14.6517 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg class="audio-icon audio-off" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="audio-tooltip">Click to play music</span>
    `;
    
    // Add button to page
    document.body.appendChild(audioButton);
    
    // Audio state management
    let isPlaying = false;
    let hasInteracted = false;
    
    // Toggle audio playback
    function toggleAudio() {
        if (!hasInteracted) {
            hasInteracted = true;
            audioButton.classList.add('interacted');
        }
        
        if (isPlaying) {
            audio.pause();
            audioButton.classList.remove('playing');
            audioButton.querySelector('.audio-tooltip').textContent = 'Click to play music';
        } else {
            audio.play().then(() => {
                audioButton.classList.add('playing');
                audioButton.querySelector('.audio-tooltip').textContent = 'Click to mute';
            }).catch(error => {
                console.log('Audio playback failed:', error);
                // Fallback for autoplay policy
                audioButton.classList.add('pulse');
            });
        }
        isPlaying = !isPlaying;
    }
    
    // Button click handler
    audioButton.addEventListener('click', toggleAudio);
    
    // Keyboard accessibility
    audioButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAudio();
        }
    });
    
    // Auto-play attempt after user interaction
    let autoplayAttempted = false;
    document.addEventListener('click', function() {
        if (!autoplayAttempted && !isPlaying) {
            autoplayAttempted = true;
            // Add pulse animation to draw attention
            audioButton.classList.add('pulse');
            setTimeout(() => {
                audioButton.classList.remove('pulse');
            }, 3000);
        }
    });
    
    // Volume control with scroll
    let volume = 0.5;
    audio.volume = volume;
    
    audioButton.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        volume = Math.max(0, Math.min(1, volume + delta));
        audio.volume = volume;
        
        // Show volume indicator
        const volumeIndicator = document.createElement('div');
        volumeIndicator.className = 'volume-indicator';
        volumeIndicator.textContent = Math.round(volume * 100) + '%';
        audioButton.appendChild(volumeIndicator);
        
        setTimeout(() => {
            volumeIndicator.remove();
        }, 1000);
    });
    
    // Remember user preference
    const savedPreference = localStorage.getItem('audioPreference');
    if (savedPreference === 'playing') {
        // Wait for user interaction due to browser autoplay policies
        document.addEventListener('click', function firstClick() {
            toggleAudio();
            document.removeEventListener('click', firstClick);
        }, { once: true });
    }
    
    // Save preference when changed
    audio.addEventListener('play', () => {
        localStorage.setItem('audioPreference', 'playing');
    });
    
    audio.addEventListener('pause', () => {
        localStorage.setItem('audioPreference', 'paused');
    });
    
    // Visual feedback for audio beats (optional)
    if (window.AudioContext || window.webkitAudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        function visualize() {
            if (isPlaying) {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / bufferLength;
                const scale = 1 + (average / 256) * 0.2;
                audioButton.style.transform = `scale(${scale})`;
            }
            requestAnimationFrame(visualize);
        }
        
        visualize();
    }
});