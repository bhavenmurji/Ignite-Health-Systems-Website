'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAudioPlayer } from '@/hooks/use-audio-player';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Loader2,
  AlertCircle,
  Settings,
  Headphones,
  RefreshCw,
  WifiOff,
  Wifi
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { audioManager, generateAudioId, AUDIO_PRIORITIES, AUDIO_TYPES } from '@/lib/audio-manager';

export interface AudioPlayerProps {
  src: string;
  compressedSrc?: string;
  title?: string;
  artist?: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  showProgress?: boolean;
  showVolumeControl?: boolean;
  showTitle?: boolean;
  variant?: 'minimal' | 'compact' | 'full';
  cinematicMode?: boolean;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onError?: (error: string) => void;
  priority?: number;
  type?: keyof typeof AUDIO_TYPES;
  enableRetry?: boolean;
  showNetworkStatus?: boolean;
  enableWebAudioFallback?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  compressedSrc,
  title = 'Cinematic Intro',
  artist = 'Ignite Health Systems',
  className,
  autoplay = false,
  loop = true,
  showProgress = true,
  showVolumeControl = true,
  showTitle = true,
  variant = 'full',
  cinematicMode = false,
  fadeInDuration = 2000,
  fadeOutDuration = 1500,
  onPlayStateChange,
  onError,
  priority = AUDIO_PRIORITIES.BACKGROUND,
  type = 'background',
  enableRetry = true,
  showNetworkStatus = false,
  enableWebAudioFallback = false
}) => {
  const [preferCompressed, setPreferCompressed] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [retryAttempts, setRetryAttempts] = useState(0);
  
  // Generate unique ID for this player instance
  const playerId = useMemo(() => generateAudioId(), []);

  // Determine which source to use
  const audioSrc = preferCompressed && compressedSrc ? compressedSrc : src;

  const [audioState, audioControls] = useAudioPlayer({
    src: audioSrc,
    loop,
    autoplay: userInteracted && autoplay,
    volume: cinematicMode ? 0.7 : 0.8,
    fadeInDuration,
    fadeOutDuration,
    preload: 'auto',
    maxRetries: enableRetry ? 3 : 0,
    retryDelay: 2000,
    enableVisibilityPause: type === 'background',
    enableAudioContextFallback: enableWebAudioFallback,
    persistVolume: true,
    onPlay: () => {
      audioManager.setActive(playerId);
      onPlayStateChange?.(true);
    },
    onPause: () => {
      audioManager.setInactive(playerId);
      onPlayStateChange?.(false);
    },
    onError: (error) => {
      console.error('Audio player error:', error);
      setRetryAttempts(prev => prev + 1);
      onError?.(error);
    },
    onTimeUpdate: (currentTime) => {
      // Handle seamless loop for 27-second intro
      if (loop && currentTime >= 26.8 && currentTime < 27) {
        // Prepare for seamless loop
        setTimeout(() => {
          audioControls.seek(0);
        }, 100);
      }
    }
  });

  // Register with audio manager
  useEffect(() => {
    const instance = {
      id: playerId,
      pause: audioControls.pause,
      stop: audioControls.stop,
      priority,
      type: type as any
    };
    
    audioManager.register(instance);
    
    return () => {
      audioManager.unregister(playerId);
    };
  }, [playerId, audioControls, priority, type]);

  // Handle browser autoplay policies
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    if (!userInteracted) {
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('touchstart', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);
    }

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [userInteracted]);

  // Network status monitoring
  useEffect(() => {
    if (!showNetworkStatus) return;

    const updateNetworkStatus = () => {
      if (!navigator.onLine) {
        setNetworkStatus('offline');
      } else {
        // Simple network speed detection
        const connection = (navigator as any).connection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            setNetworkStatus('slow');
          } else {
            setNetworkStatus('online');
          }
        } else {
          setNetworkStatus('online');
        }
      }
    };

    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, [showNetworkStatus]);

  // Preload audio when component mounts
  useEffect(() => {
    if (audioState.canPlay) {
      audioControls.preload().catch(console.warn);
    }
  }, [audioState.canPlay, audioControls]);

  const handlePlayPause = useCallback(async () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }

    // Check if we can play based on audio manager priority
    if (!audioState.isPlaying && !audioManager.canPlay(playerId)) {
      console.warn('Cannot play audio: higher priority audio is active');
      return;
    }

    try {
      if (audioState.isPlaying) {
        if (cinematicMode) {
          await audioControls.fadeOut(fadeOutDuration);
        } else {
          audioControls.pause();
        }
      } else {
        if (cinematicMode) {
          await audioControls.fadeIn(fadeInDuration);
        } else {
          await audioControls.play();
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      setRetryAttempts(prev => prev + 1);
    }
  }, [audioState.isPlaying, cinematicMode, userInteracted, audioControls, fadeInDuration, fadeOutDuration, playerId]);

  const handleRetry = useCallback(() => {
    setRetryAttempts(0);
    audioControls.reload();
  }, [audioControls]);

  const handleRestart = useCallback(() => {
    audioControls.restart();
  }, [audioControls]);

  const handleVolumeChange = useCallback((value: number[]) => {
    audioControls.setVolume(value[0] / 100);
  }, [audioControls]);

  const handleProgressChange = useCallback((value: number[]) => {
    const newTime = (value[0] / 100) * audioState.duration;
    audioControls.seek(newTime);
  }, [audioControls, audioState.duration]);

  const toggleMute = useCallback(() => {
    if (audioState.isMuted) {
      audioControls.unmute();
    } else {
      audioControls.mute();
    }
  }, [audioState.isMuted, audioControls]);

  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const toggleCompressionPreference = useCallback(() => {
    setPreferCompressed(!preferCompressed);
  }, [preferCompressed]);

  const getConnectionStatus = useCallback(() => {
    switch (networkStatus) {
      case 'offline':
        return { icon: WifiOff, label: 'Offline', color: 'text-red-500' };
      case 'slow':
        return { icon: Wifi, label: 'Slow Connection', color: 'text-yellow-500' };
      default:
        return { icon: Wifi, label: 'Online', color: 'text-green-500' };
    }
  }, [networkStatus]);

  const shouldShowRetry = enableRetry && audioState.error && retryAttempts > 0;

  // Render variants
  const renderMinimal = () => (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlayPause}
        disabled={!audioState.canPlay || audioState.isLoading}
        className="h-8 w-8 p-0"
      >
        {audioState.isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : audioState.isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      {showVolumeControl && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="h-8 w-8 p-0"
        >
          {audioState.isMuted || audioState.volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );

  const renderCompact = () => (
    <div className={cn('flex items-center gap-3 p-3 bg-background/80 backdrop-blur rounded-lg border', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePlayPause}
        disabled={!audioState.canPlay || audioState.isLoading}
        className="h-10 w-10 p-0"
      >
        {audioState.isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : audioState.isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>

      {showTitle && (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>
        </div>
      )}

      {showVolumeControl && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-8 w-8 p-0"
          >
            {audioState.isMuted || audioState.volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[audioState.isMuted ? 0 : audioState.volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-16"
          />
        </div>
      )}
    </div>
  );

  const renderFull = () => (
    <div className={cn(
      'w-full max-w-md mx-auto bg-background/90 backdrop-blur-lg rounded-xl border shadow-lg',
      cinematicMode && 'bg-black/80 border-white/20',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-primary" />
            <span className="font-medium">Audio Player</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Track Info */}
        {showTitle && (
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{artist}</p>
          </div>
        )}

        {/* Progress Bar */}
        {showProgress && audioState.duration > 0 && (
          <div className="mb-6">
            <Slider
              value={[(audioState.currentTime / audioState.duration) * 100]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{formatTime(audioState.currentTime)}</span>
              <span>{formatTime(audioState.duration)}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            disabled={!audioState.canPlay}
            className="h-10 w-10 p-0"
            title="Restart from beginning"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          {shouldShowRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="h-10 w-10 p-0"
              title="Retry loading audio"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          )}

          <Button
            onClick={handlePlayPause}
            disabled={!audioState.canPlay || audioState.isLoading}
            size="lg"
            className="h-12 w-12 p-0 rounded-full"
          >
            {audioState.isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : audioState.isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="h-10 w-10 p-0"
          >
            {audioState.isMuted || audioState.volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Volume Control */}
        {showVolumeControl && (
          <div className="flex items-center gap-3">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[audioState.isMuted ? 0 : audioState.volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="space-y-3">
              {compressedSrc && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Compressed Audio</span>
                  <Button
                    variant={preferCompressed ? "default" : "outline"}
                    size="sm"
                    onClick={toggleCompressionPreference}
                  >
                    {preferCompressed ? 'On' : 'Off'}
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Buffer Status</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(audioState.buffered)}%
                </span>
              </div>
              
              {showNetworkStatus && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Network Status</span>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const status = getConnectionStatus();
                      return (
                        <>
                          <status.icon className={cn("h-3 w-3", status.color)} />
                          <span className={cn("text-xs", status.color)}>
                            {status.label}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
              
              {audioState.retryCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Retry Attempts</span>
                  <span className="text-xs text-muted-foreground">
                    {audioState.retryCount}
                  </span>
                </div>
              )}
              
              {audioState.isStalled && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Playback Status</span>
                  <span className="text-xs text-yellow-500">Stalled</span>
                </div>
              )}
              
              {loop && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Loop Mode</span>
                  <span className="text-xs text-green-500">Active</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Ready State</span>
                <span className="text-xs text-muted-foreground">
                  {audioState.readyState}/4
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {audioState.error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive font-medium">Audio Error</span>
            </div>
            <p className="text-sm text-destructive/80 mb-3">{audioState.error}</p>
            {enableRetry && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="h-8"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreferCompressed(!preferCompressed)}
                  className="h-8"
                >
                  {preferCompressed ? 'Try Full Quality' : 'Try Compressed'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {audioState.isLoading && !audioState.error && (
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading audio...
            </div>
          </div>
        )}

        {/* Autoplay Warning */}
        {!userInteracted && autoplay && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Click anywhere to enable autoplay
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'minimal':
      return renderMinimal();
    case 'compact':
      return renderCompact();
    case 'full':
    default:
      return renderFull();
  }
};

export default AudioPlayer;