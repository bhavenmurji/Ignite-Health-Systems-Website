/**
 * Global Audio Manager
 * Handles audio session management, prevents conflicts between multiple audio players,
 * and provides centralized audio control for the application.
 */

export type AudioPlayerInstance = {
  id: string;
  pause: () => void;
  stop: () => void;
  priority: number;
  type: 'background' | 'ui' | 'notification' | 'cinematic';
};

class AudioManager {
  private instances: Map<string, AudioPlayerInstance> = new Map();
  private currentActiveId: string | null = null;
  private globalMuted: boolean = false;
  private globalVolume: number = 1;
  private lastActiveId: string | null = null;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAll();
      } else {
        this.resumeLastActive();
      }
    });

    // Handle audio interruptions (mobile)
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('pause', () => {
        this.pauseAll();
      });

      navigator.mediaSession.setActionHandler('play', () => {
        this.resumeLastActive();
      });

      navigator.mediaSession.setActionHandler('stop', () => {
        this.stopAll();
      });
    }

    // Handle phone calls and other audio interruptions
    window.addEventListener('blur', () => {
      this.pauseAll();
    });

    // Handle audio context suspension
    if ('webkitAudioContext' in window || 'AudioContext' in window) {
      const resumeAudioContext = async () => {
        const audioContexts = (window as any).__audioContexts || [];
        for (const ctx of audioContexts) {
          if (ctx.state === 'suspended') {
            try {
              await ctx.resume();
            } catch (error) {
              console.warn('Failed to resume audio context:', error);
            }
          }
        }
      };

      document.addEventListener('click', resumeAudioContext, { once: true });
      document.addEventListener('touchstart', resumeAudioContext, { once: true });
    }
  }

  /**
   * Register a new audio player instance
   */
  register(instance: AudioPlayerInstance): void {
    this.instances.set(instance.id, instance);
  }

  /**
   * Unregister an audio player instance
   */
  unregister(id: string): void {
    if (this.currentActiveId === id) {
      this.currentActiveId = null;
    }
    if (this.lastActiveId === id) {
      this.lastActiveId = null;
    }
    this.instances.delete(id);
  }

  /**
   * Set an instance as active (playing)
   */
  setActive(id: string): void {
    const instance = this.instances.get(id);
    if (!instance) return;

    // Pause other instances based on priority
    for (const [otherId, otherInstance] of this.instances) {
      if (otherId !== id) {
        // Lower priority instances should be paused
        if (otherInstance.priority <= instance.priority) {
          otherInstance.pause();
        }
      }
    }

    this.lastActiveId = this.currentActiveId;
    this.currentActiveId = id;
  }

  /**
   * Set an instance as inactive (paused/stopped)
   */
  setInactive(id: string): void {
    if (this.currentActiveId === id) {
      this.currentActiveId = null;
    }
  }

  /**
   * Pause all audio instances
   */
  pauseAll(): void {
    for (const instance of this.instances.values()) {
      instance.pause();
    }
    this.currentActiveId = null;
  }

  /**
   * Stop all audio instances
   */
  stopAll(): void {
    for (const instance of this.instances.values()) {
      instance.stop();
    }
    this.currentActiveId = null;
    this.lastActiveId = null;
  }

  /**
   * Resume the last active instance
   */
  resumeLastActive(): void {
    if (this.lastActiveId && this.instances.has(this.lastActiveId)) {
      // Note: We can't directly resume here as we need the play() method
      // This would need to be handled by the individual player instances
    }
  }

  /**
   * Get the currently active instance
   */
  getActive(): AudioPlayerInstance | null {
    return this.currentActiveId ? this.instances.get(this.currentActiveId) || null : null;
  }

  /**
   * Check if an instance can play based on priority
   */
  canPlay(id: string): boolean {
    const instance = this.instances.get(id);
    if (!instance) return false;

    const activeInstance = this.getActive();
    if (!activeInstance) return true;

    return instance.priority > activeInstance.priority;
  }

  /**
   * Set global mute state
   */
  setGlobalMute(muted: boolean): void {
    this.globalMuted = muted;
    // Individual instances should check this state
  }

  /**
   * Get global mute state
   */
  isGloballyMuted(): boolean {
    return this.globalMuted;
  }

  /**
   * Set global volume
   */
  setGlobalVolume(volume: number): void {
    this.globalVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get global volume
   */
  getGlobalVolume(): number {
    return this.globalVolume;
  }

  /**
   * Get all registered instances
   */
  getAllInstances(): AudioPlayerInstance[] {
    return Array.from(this.instances.values());
  }

  /**
   * Get instance by ID
   */
  getInstance(id: string): AudioPlayerInstance | null {
    return this.instances.get(id) || null;
  }

  /**
   * Check if audio is supported
   */
  isAudioSupported(): boolean {
    try {
      const audio = document.createElement('audio');
      return !!(audio.canPlayType && (
        audio.canPlayType('audio/mpeg').replace(/no/, '') ||
        audio.canPlayType('audio/mp4').replace(/no/, '') ||
        audio.canPlayType('audio/ogg').replace(/no/, '') ||
        audio.canPlayType('audio/wav').replace(/no/, '')
      ));
    } catch {
      return false;
    }
  }

  /**
   * Check browser autoplay policy
   */
  async checkAutoplaySupport(): Promise<boolean> {
    try {
      const audio = document.createElement('audio');
      audio.src = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAA=';
      await audio.play();
      audio.pause();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Attempt to unlock audio context (for mobile browsers)
   */
  async unlockAudioContext(): Promise<boolean> {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return false;

      const context = new AudioContext();
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);

      await context.resume();
      return context.state === 'running';
    } catch {
      return false;
    }
  }
}

// Global singleton instance
export const audioManager = new AudioManager();

// Audio priority levels
export const AUDIO_PRIORITIES = {
  NOTIFICATION: 100,
  UI: 80,
  CINEMATIC: 60,
  BACKGROUND: 40
} as const;

// Audio types
export const AUDIO_TYPES = {
  BACKGROUND: 'background',
  UI: 'ui',
  NOTIFICATION: 'notification',
  CINEMATIC: 'cinematic'
} as const;

// Helper function to generate unique IDs
export const generateAudioId = (): string => {
  return `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Audio format detection
export const getSupportedAudioFormat = (): string => {
  const audio = document.createElement('audio');
  
  if (audio.canPlayType('audio/mpeg').replace(/no/, '')) {
    return 'mp3';
  } else if (audio.canPlayType('audio/mp4').replace(/no/, '')) {
    return 'm4a';
  } else if (audio.canPlayType('audio/ogg').replace(/no/, '')) {
    return 'ogg';
  } else if (audio.canPlayType('audio/wav').replace(/no/, '')) {
    return 'wav';
  }
  
  return 'mp3'; // fallback
};

// Preload audio files
export const preloadAudio = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(url => 
      new Promise<void>((resolve, reject) => {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => resolve());
        audio.addEventListener('error', reject);
        audio.src = url;
        audio.load();
      })
    )
  );
};