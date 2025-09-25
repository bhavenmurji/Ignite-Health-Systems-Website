"use client"

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react'
import { Volume2, VolumeX, Volume1 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface AmbientAudioProps {
  /** Array of audio track URLs */
  tracks?: string[]
  /** Auto-play when component mounts (respects user preferences) */
  autoPlay?: boolean
  /** Initial volume (0-1) */
  initialVolume?: number
  /** Fade duration in milliseconds */
  fadeDuration?: number
  /** Show controls on hover only */
  hoverControlsOnly?: boolean
  /** Position of the audio controls */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-bottom'
  /** Theme variant */
  variant?: 'minimal' | 'ambient' | 'floating'
  /** Section-based audio switching */
  sectionTrackMap?: Record<string, string>
}

const defaultTracks = [
  // Placeholder URLs - replace with your actual audio files
  '/audio/ambient-1.mp3',
  '/audio/ambient-2.mp3',
  '/audio/ambient-3.mp3'
]

export function AmbientAudio({
  tracks = defaultTracks,
  autoPlay = false,
  initialVolume = 0.3,
  fadeDuration = 1000,
  hoverControlsOnly = true,
  position = 'bottom-right',
  variant = 'minimal',
  sectionTrackMap
}: AmbientAudioProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(initialVolume)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(!hoverControlsOnly)
  const [isLoading, setIsLoading] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const fadeTimeoutRef = useRef<NodeJS.Timeout>()
  const volumeIntervalRef = useRef<NodeJS.Timeout>()

  // Check for reduced motion preference
  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Smooth volume fade utility
  const fadeVolume = useCallback((targetVolume: number, duration: number = fadeDuration) => {
    if (!audioRef.current || prefersReducedMotion) {
      if (audioRef.current) audioRef.current.volume = targetVolume
      return
    }

    const audio = audioRef.current
    const startVolume = audio.volume
    const volumeDiff = targetVolume - startVolume
    const steps = 60 // 60fps
    const stepSize = volumeDiff / (duration / (1000 / steps))
    
    let currentStep = 0
    const totalSteps = duration / (1000 / steps)

    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current)
    }

    volumeIntervalRef.current = setInterval(() => {
      currentStep++
      const newVolume = startVolume + (stepSize * currentStep)
      
      if (currentStep >= totalSteps) {
        audio.volume = targetVolume
        clearInterval(volumeIntervalRef.current!)
        
        // If fading to 0, pause the audio
        if (targetVolume === 0 && isPlaying) {
          audio.pause()
          setIsPlaying(false)
        }
      } else {
        audio.volume = Math.max(0, Math.min(1, newVolume))
      }
    }, 1000 / steps)
  }, [fadeDuration, isPlaying, prefersReducedMotion])

  // Handle play/pause with fade effects
  const togglePlayback = useCallback(async () => {
    if (!audioRef.current) return
    
    setHasUserInteracted(true)
    const audio = audioRef.current

    if (isPlaying) {
      fadeVolume(0)
    } else {
      try {
        setIsLoading(true)
        audio.volume = 0
        await audio.play()
        setIsPlaying(true)
        fadeVolume(volume)
      } catch (error) {
        console.warn('Audio playback failed:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [isPlaying, volume, fadeVolume])

  // Handle volume changes with smooth transitions
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current && isPlaying) {
      fadeVolume(newVolume, 300)
    }
  }, [isPlaying, fadeVolume])

  // Track switching with crossfade
  const switchTrack = useCallback((index: number) => {
    if (index === currentTrackIndex || !tracks[index]) return
    
    if (isPlaying) {
      fadeVolume(0, 500)
      fadeTimeoutRef.current = setTimeout(() => {
        setCurrentTrackIndex(index)
        if (audioRef.current) {
          audioRef.current.currentTime = 0
        }
      }, 500)
    } else {
      setCurrentTrackIndex(index)
    }
  }, [currentTrackIndex, tracks, isPlaying, fadeVolume])

  // Auto-play logic (respects user preferences and browser policies)
  useEffect(() => {
    if (autoPlay && hasUserInteracted && audioRef.current) {
      togglePlayback()
    }
  }, [autoPlay, hasUserInteracted, togglePlayback])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlayThrough = () => {
      setIsLoading(false)
      if (isPlaying && audio.volume === 0) {
        fadeVolume(volume, 1000)
      }
    }

    const handleEnded = () => {
      // Auto-advance to next track
      const nextIndex = (currentTrackIndex + 1) % tracks.length
      switchTrack(nextIndex)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    const handleError = () => {
      setIsLoading(false)
      console.warn('Audio loading failed for track:', tracks[currentTrackIndex])
    }

    audio.addEventListener('canplaythrough', handleCanPlayThrough)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('error', handleError)
    }
  }, [currentTrackIndex, tracks, isPlaying, volume, fadeVolume, switchTrack])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current)
      }
    }
  }, [])

  // Control visibility logic
  useEffect(() => {
    if (hoverControlsOnly) {
      setIsVisible(isHovered || isPlaying)
    } else {
      setIsVisible(true)
    }
  }, [hoverControlsOnly, isHovered, isPlaying])

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center-bottom': 'bottom-4 left-1/2 -translate-x-1/2'
  }

  // Variant styles
  const variantClasses = {
    minimal: 'bg-background/80 backdrop-blur-sm border border-border/50',
    ambient: 'bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-md border border-white/10',
    floating: 'bg-black/20 backdrop-blur-lg border border-white/20 shadow-2xl'
  }

  // Volume icon based on level
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={tracks[currentTrackIndex]}
        loop={tracks.length === 1}
        preload="metadata"
        className="sr-only"
      />

      {/* Ambient Audio Controls */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-500 ease-out",
          positionClasses[position],
          variantClasses[variant],
          "rounded-full p-2",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
          prefersReducedMotion && "transition-none"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="region"
        aria-label="Ambient audio controls"
      >
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayback}
            disabled={isLoading}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "hover:bg-foreground/10 active:bg-foreground/20",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              isLoading && "opacity-50 cursor-not-allowed",
              prefersReducedMotion && "transition-none"
            )}
            aria-label={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
          >
            {isLoading ? (
              <div className="w-3 h-3 border border-foreground/30 border-t-foreground/70 rounded-full animate-spin" />
            ) : (
              <VolumeIcon className="w-4 h-4 text-foreground/70" />
            )}
          </button>

          {/* Volume Slider - Appears on Hover */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-out",
              isHovered ? "w-16 opacity-100" : "w-0 opacity-0",
              prefersReducedMotion && "transition-none"
            )}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className={cn(
                "w-full h-1 bg-foreground/20 rounded-full appearance-none cursor-pointer",
                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3",
                "[&::-webkit-slider-thumb]:bg-foreground/70 [&::-webkit-slider-thumb]:rounded-full",
                "[&::-webkit-slider-thumb]:hover:bg-foreground/90 [&::-webkit-slider-thumb]:transition-colors",
                "[&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-foreground/70",
                "[&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:rounded-full"
              )}
              aria-label="Volume control"
            />
          </div>

          {/* Track Selector - Multiple Tracks Only */}
          {tracks.length > 1 && isHovered && (
            <div className="flex gap-1">
              {tracks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => switchTrack(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors duration-200",
                    index === currentTrackIndex
                      ? "bg-foreground/70"
                      : "bg-foreground/30 hover:bg-foreground/50",
                    prefersReducedMotion && "transition-none"
                  )}
                  aria-label={`Switch to track ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invisible click area for first user interaction */}
      {!hasUserInteracted && (
        <div
          className="fixed inset-0 z-0 cursor-default"
          onClick={() => setHasUserInteracted(true)}
          role="button"
          tabIndex={-1}
          aria-label="Enable audio"
        />
      )}
    </>
  )
}

// Section-aware audio hook
export function useSectionAudio(sectionTrackMap: Record<string, string>) {
  const [currentSection, setCurrentSection] = useState<string>('')
  const [currentTrack, setCurrentTrack] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            if (sectionTrackMap[sectionId] && sectionId !== currentSection) {
              setCurrentSection(sectionId)
              setCurrentTrack(sectionTrackMap[sectionId])
            }
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    // Observe all sections with mapped tracks
    Object.keys(sectionTrackMap).forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [sectionTrackMap, currentSection])

  return { currentSection, currentTrack }
}