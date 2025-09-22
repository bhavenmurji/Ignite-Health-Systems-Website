import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface AudioPlayerState {
  isLoading: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  error: string | null;
  canPlay: boolean;
  buffered: number;
  readyState: number;
  networkState: number;
  isStalled: boolean;
  retryCount: number;
  lastPlayTime: number;
}

export interface AudioPlayerControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  mute: () => void;
  unmute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  fadeIn: (duration?: number) => Promise<void>;
  fadeOut: (duration?: number) => Promise<void>;
  preload: () => Promise<void>;
  restart: () => void;
  reload: () => void;
  getPlaybackInfo: () => any;
  initializeWebAudio: () => Promise<void>;
}

export interface UseAudioPlayerOptions {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  onTimeUpdate?: (currentTime: number) => void;
  crossfadeDuration?: number;
  maxRetries?: number;
  retryDelay?: number;
  enableVisibilityPause?: boolean;
  enableAudioContextFallback?: boolean;
  persistVolume?: boolean;
}

export const useAudioPlayer = (options: UseAudioPlayerOptions): [AudioPlayerState, AudioPlayerControls] => {
  const {
    src,
    loop = false,
    autoplay = false,
    preload = 'metadata',
    volume = 1,
    fadeInDuration = 1000,
    fadeOutDuration = 1000,
    onPlay,
    onPause,
    onEnded,
    onError,
    onTimeUpdate,
    crossfadeDuration = 500,
    maxRetries = 3,
    retryDelay = 1000,
    enableVisibilityPause = true,
    enableAudioContextFallback = false,
    persistVolume = true
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stallCheckRef = useRef<NodeJS.Timeout | null>(null);
  const volumeBeforeMuteRef = useRef<number>(state.volume);
  const lastPlayPositionRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const [state, setState] = useState<AudioPlayerState>({
    isLoading: true,
    isPlaying: false,
    isMuted: false,
    volume: persistVolume ? (parseFloat(localStorage.getItem('audio-volume') || volume.toString())) : volume,
    currentTime: 0,
    duration: 0,
    error: null,
    canPlay: false,
    buffered: 0,
    readyState: 0,
    networkState: 0,
    isStalled: false,
    retryCount: 0,
    lastPlayTime: 0
  });

  // Enhanced cleanup function
  const cleanup = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (stallCheckRef.current) {
      clearInterval(stallCheckRef.current);
      stallCheckRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.warn);
      audioContextRef.current = null;
    }
  }, []);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    // Set initial properties
    audio.preload = preload;
    audio.loop = loop;
    audio.volume = volume;
    audio.crossOrigin = 'anonymous'; // For CORS support

    // Enhanced event handlers with better error recovery
    const handleCanPlay = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        canPlay: true,
        duration: audio.duration || 0,
        readyState: audio.readyState,
        networkState: audio.networkState,
        error: null,
        retryCount: 0
      }));
    };

    const handleCanPlayThrough = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        canPlay: true
      }));
    };

    const handleLoadStart = () => {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
    };

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: audio.duration || 0
      }));
    };

    const handleError = () => {
      const errorMessage = audio.error ? 
        `Audio error: ${audio.error.message}` : 
        'Unknown audio error occurred';
      
      setState(prev => {
        const newRetryCount = prev.retryCount + 1;
        
        // Auto-retry if under max retries
        if (newRetryCount <= maxRetries) {
          retryTimeoutRef.current = setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.load();
            }
          }, retryDelay * newRetryCount);
          
          return {
            ...prev,
            isLoading: true,
            error: `${errorMessage} (Retry ${newRetryCount}/${maxRetries})`,
            retryCount: newRetryCount
          };
        }
        
        return {
          ...prev,
          isLoading: false,
          error: errorMessage,
          canPlay: false,
          retryCount: newRetryCount
        };
      });
      
      onError?.(errorMessage);
    };

    const handlePlay = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: true,
        lastPlayTime: Date.now(),
        error: null 
      }));
      onPlay?.();
      
      // Start time update interval
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
      timeUpdateIntervalRef.current = setInterval(() => {
        if (audio.currentTime !== lastPlayPositionRef.current) {
          lastPlayPositionRef.current = audio.currentTime;
          setState(prev => ({ ...prev, currentTime: audio.currentTime, isStalled: false }));
          onTimeUpdate?.(audio.currentTime);
        }
      }, 100);
      
      // Start stall detection
      if (stallCheckRef.current) {
        clearInterval(stallCheckRef.current);
      }
      stallCheckRef.current = setInterval(() => {
        if (audio.currentTime === lastPlayPositionRef.current && !audio.paused) {
          setState(prev => ({ ...prev, isStalled: true }));
          // Try to resume playback
          audio.play().catch(console.warn);
        }
      }, 2000);
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false, isStalled: false }));
      onPause?.();
      
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
      if (stallCheckRef.current) {
        clearInterval(stallCheckRef.current);
        stallCheckRef.current = null;
      }
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      onEnded?.();
      
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration;
        const bufferedPercentage = duration ? (bufferedEnd / duration) * 100 : 0;
        
        setState(prev => ({ 
          ...prev, 
          buffered: bufferedPercentage,
          readyState: audio.readyState,
          networkState: audio.networkState
        }));
      }
    };

    const handleVolumeChange = () => {
      setState(prev => ({
        ...prev,
        volume: audio.volume,
        isMuted: audio.muted
      }));
    };

    // Add event listeners
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('volumechange', handleVolumeChange);

    // Set source and start loading
    audio.src = src;

    return () => {
      cleanup();
      
      // Remove event listeners
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('progress', handleProgress);
      audio.removeEventListener('volumechange', handleVolumeChange);
      
      // Cleanup audio
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [src, loop, preload, volume, onPlay, onPause, onEnded, onError, onTimeUpdate, cleanup]);

  // Enhanced autoplay with better user interaction detection
  useEffect(() => {
    const handleUserGesture = () => {
      if (autoplay && state.canPlay && !state.isPlaying && audioRef.current) {
        play().catch(console.warn);
        document.removeEventListener('click', handleUserGesture);
        document.removeEventListener('touchstart', handleUserGesture);
        document.removeEventListener('keydown', handleUserGesture);
      }
    };

    if (autoplay && state.canPlay && !state.isPlaying) {
      // Try immediate play first
      play().catch(() => {
        // If failed, wait for user interaction
        document.addEventListener('click', handleUserGesture, { once: true });
        document.addEventListener('touchstart', handleUserGesture, { once: true });
        document.addEventListener('keydown', handleUserGesture, { once: true });
      });
    }

    return () => {
      document.removeEventListener('click', handleUserGesture);
      document.removeEventListener('touchstart', handleUserGesture);
      document.removeEventListener('keydown', handleUserGesture);
    };
  }, [autoplay, state.canPlay, play]);

  // Page visibility change handler
  useEffect(() => {
    if (!enableVisibilityPause) return;

    const handleVisibilityChange = () => {
      if (document.hidden && state.isPlaying) {
        pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enableVisibilityPause, state.isPlaying, pause]);

  // Volume persistence
  useEffect(() => {
    if (persistVolume) {
      localStorage.setItem('audio-volume', state.volume.toString());
    }
  }, [state.volume, persistVolume]);

  // Fade effect helper
  const fade = useCallback((
    fromVolume: number, 
    toVolume: number, 
    duration: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (!audioRef.current) {
        resolve();
        return;
      }

      const audio = audioRef.current;
      const steps = Math.ceil(duration / 50); // 50ms intervals
      const volumeStep = (toVolume - fromVolume) / steps;
      let currentStep = 0;

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVolume = fromVolume + (volumeStep * currentStep);
        
        if (currentStep >= steps) {
          audio.volume = Math.max(0, Math.min(1, toVolume));
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          resolve();
        } else {
          audio.volume = Math.max(0, Math.min(1, newVolume));
        }
      }, 50);
    });
  }, []);

  // Control functions
  const play = useCallback(async (): Promise<void> => {
    if (!audioRef.current || !state.canPlay) return;

    try {
      await audioRef.current.play();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to play audio';
      setState(prev => ({ ...prev, error: errorMessage }));
      onError?.(errorMessage);
    }
  }, [state.canPlay, onError]);

  const pause = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const mute = useCallback((): void => {
    if (audioRef.current) {
      volumeBeforeMuteRef.current = audioRef.current.volume;
      audioRef.current.muted = true;
    }
  }, []);

  const unmute = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = volumeBeforeMuteRef.current;
    }
  }, []);

  const setVolume = useCallback((newVolume: number): void => {
    if (audioRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      audioRef.current.volume = clampedVolume;
      
      if (!audioRef.current.muted) {
        volumeBeforeMuteRef.current = clampedVolume;
      }
      
      // Update gain node if using Web Audio API
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = clampedVolume;
      }
    }
  }, []);

  const seek = useCallback((time: number): void => {
    if (audioRef.current && state.duration > 0) {
      const clampedTime = Math.max(0, Math.min(state.duration, time));
      audioRef.current.currentTime = clampedTime;
    }
  }, [state.duration]);

  const fadeIn = useCallback(async (duration: number = fadeInDuration): Promise<void> => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = 0;
    await play();
    await fade(0, volumeBeforeMuteRef.current, duration);
  }, [play, fade, fadeInDuration]);

  const fadeOut = useCallback(async (duration: number = fadeOutDuration): Promise<void> => {
    if (!audioRef.current) return;
    
    const currentVolume = audioRef.current.volume;
    await fade(currentVolume, 0, duration);
    pause();
    audioRef.current.volume = currentVolume;
  }, [pause, fade, fadeOutDuration]);

  const preloadAudio = useCallback(async (): Promise<void> => {
    if (!audioRef.current) return;
    
    return new Promise((resolve, reject) => {
      const audio = audioRef.current!;
      
      const handleCanPlayThrough = () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
        resolve();
      };
      
      const handleError = () => {
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
        reject(new Error('Failed to preload audio'));
      };
      
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('error', handleError);
      
      if (audio.readyState >= 4) {
        // Already loaded
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
        resolve();
      } else {
        audio.load();
      }
    });
  }, []);

  // Audio Context fallback for better compatibility
  const initializeWebAudio = useCallback(async () => {
    if (!enableAudioContextFallback || audioContextRef.current) return;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = state.volume;
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }, [enableAudioContextFallback, state.volume]);

  // Enhanced restart function
  const restart = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (state.isPlaying) {
        audioRef.current.play().catch(console.warn);
      }
    }
  }, [state.isPlaying]);

  // Force reload audio
  const reload = useCallback((): void => {
    if (audioRef.current) {
      const wasPlaying = state.isPlaying;
      audioRef.current.load();
      if (wasPlaying) {
        // Wait for canplay event before playing
        const handleCanPlayOnce = () => {
          audioRef.current?.play().catch(console.warn);
          audioRef.current?.removeEventListener('canplay', handleCanPlayOnce);
        };
        audioRef.current.addEventListener('canplay', handleCanPlayOnce);
      }
    }
  }, [state.isPlaying]);

  // Get current playback state info
  const getPlaybackInfo = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return null;
    
    return {
      currentTime: audio.currentTime,
      duration: audio.duration,
      buffered: Array.from({ length: audio.buffered.length }, (_, i) => ({
        start: audio.buffered.start(i),
        end: audio.buffered.end(i)
      })),
      readyState: audio.readyState,
      networkState: audio.networkState,
      playbackRate: audio.playbackRate,
      volume: audio.volume,
      muted: audio.muted
    };
  }, []);

  const controls: AudioPlayerControls = {
    play,
    pause,
    stop,
    mute,
    unmute,
    setVolume,
    seek,
    fadeIn,
    fadeOut,
    preload: preloadAudio,
    restart,
    reload,
    getPlaybackInfo,
    initializeWebAudio
  };

  return [state, controls];
};

export default useAudioPlayer;