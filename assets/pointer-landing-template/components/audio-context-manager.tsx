"use client"

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react'

interface AudioContextType {
  isAudioEnabled: boolean
  masterVolume: number
  isGloballyMuted: boolean
  enableAudio: () => void
  disableAudio: () => void
  setMasterVolume: (volume: number) => void
  toggleGlobalMute: () => void
  playAmbientSound: (soundId: string, volume?: number) => void
  stopAmbientSound: (soundId: string) => void
  registerAudioElement: (id: string, element: HTMLAudioElement) => void
  unregisterAudioElement: (id: string) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

interface AudioContextProviderProps {
  children: ReactNode
  /** Automatically enable audio after first user interaction */
  autoEnable?: boolean
  /** Default master volume */
  defaultVolume?: number
  /** Respect user's motion preferences */
  respectMotionPreferences?: boolean
}

export function AudioContextProvider({
  children,
  autoEnable = true,
  defaultVolume = 0.3,
  respectMotionPreferences = true
}: AudioContextProviderProps) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [masterVolume, setMasterVolumeState] = useState(defaultVolume)
  const [isGloballyMuted, setIsGloballyMuted] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map())

  // Check for reduced motion preference
  useEffect(() => {
    if (!respectMotionPreferences) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
      // Optionally disable audio if user prefers reduced motion
      if (e.matches) {
        setIsAudioEnabled(false)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [respectMotionPreferences])

  // Listen for first user interaction
  useEffect(() => {
    if (hasUserInteracted) return

    const handleFirstInteraction = () => {
      setHasUserInteracted(true)
      if (autoEnable && !prefersReducedMotion) {
        setIsAudioEnabled(true)
      }
    }

    const events = ['click', 'touch', 'keydown', 'scroll']
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: true, passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction)
      })
    }
  }, [hasUserInteracted, autoEnable, prefersReducedMotion])

  // Store audio preference in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ambient-audio-enabled')
      if (stored !== null) {
        setIsAudioEnabled(JSON.parse(stored))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('ambient-audio-enabled', JSON.stringify(isAudioEnabled))
    } catch {
      // Ignore localStorage errors
    }
  }, [isAudioEnabled])

  // Store volume preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ambient-audio-volume')
      if (stored !== null) {
        setMasterVolumeState(parseFloat(stored))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('ambient-audio-volume', masterVolume.toString())
    } catch {
      // Ignore localStorage errors
    }
  }, [masterVolume])

  // Apply master volume and mute state to all registered audio elements
  useEffect(() => {
    const effectiveVolume = isGloballyMuted ? 0 : masterVolume
    
    audioElementsRef.current.forEach((audio) => {
      const targetVolume = audio.dataset.originalVolume 
        ? parseFloat(audio.dataset.originalVolume) * effectiveVolume
        : effectiveVolume

      // Smooth volume transition
      if (audio.volume !== targetVolume) {
        const startVolume = audio.volume
        const volumeDiff = targetVolume - startVolume
        const duration = 300 // ms
        const steps = 30
        const stepSize = volumeDiff / steps
        let currentStep = 0

        const interval = setInterval(() => {
          currentStep++
          const newVolume = startVolume + (stepSize * currentStep)
          
          if (currentStep >= steps) {
            audio.volume = targetVolume
            clearInterval(interval)
          } else {
            audio.volume = Math.max(0, Math.min(1, newVolume))
          }
        }, duration / steps)
      }
    })
  }, [masterVolume, isGloballyMuted])

  const enableAudio = () => {
    if (!prefersReducedMotion) {
      setIsAudioEnabled(true)
    }
  }

  const disableAudio = () => {
    setIsAudioEnabled(false)
    // Stop all playing audio
    audioElementsRef.current.forEach((audio) => {
      audio.pause()
    })
  }

  const setMasterVolume = (volume: number) => {
    setMasterVolumeState(Math.max(0, Math.min(1, volume)))
  }

  const toggleGlobalMute = () => {
    setIsGloballyMuted(!isGloballyMuted)
  }

  const playAmbientSound = (soundId: string, volume?: number) => {
    if (!isAudioEnabled) return

    const audio = audioElementsRef.current.get(soundId)
    if (audio) {
      if (volume !== undefined) {
        audio.dataset.originalVolume = volume.toString()
        audio.volume = volume * masterVolume
      }
      
      audio.play().catch((error) => {
        console.warn(`Failed to play ambient sound ${soundId}:`, error)
      })
    }
  }

  const stopAmbientSound = (soundId: string) => {
    const audio = audioElementsRef.current.get(soundId)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  const registerAudioElement = (id: string, element: HTMLAudioElement) => {
    audioElementsRef.current.set(id, element)
    
    // Store original volume if not already set
    if (!element.dataset.originalVolume) {
      element.dataset.originalVolume = element.volume.toString()
    }
  }

  const unregisterAudioElement = (id: string) => {
    const audio = audioElementsRef.current.get(id)
    if (audio) {
      audio.pause()
      audioElementsRef.current.delete(id)
    }
  }

  const contextValue: AudioContextType = {
    isAudioEnabled,
    masterVolume,
    isGloballyMuted,
    enableAudio,
    disableAudio,
    setMasterVolume,
    toggleGlobalMute,
    playAmbientSound,
    stopAmbientSound,
    registerAudioElement,
    unregisterAudioElement
  }

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudioContext() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioContextProvider')
  }
  return context
}

// Utility hook for ambient sound effects
export function useAmbientSound(soundId: string, src: string, options?: {
  loop?: boolean
  autoPlay?: boolean
  volume?: number
}) {
  const { 
    isAudioEnabled, 
    playAmbientSound, 
    stopAmbientSound, 
    registerAudioElement, 
    unregisterAudioElement 
  } = useAudioContext()
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(src)
    audio.preload = 'metadata'
    audio.loop = options?.loop ?? false
    audio.volume = options?.volume ?? 0.5

    audio.addEventListener('canplaythrough', () => setIsLoaded(true))
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    audio.addEventListener('ended', () => setIsPlaying(false))

    audioRef.current = audio
    registerAudioElement(soundId, audio)

    return () => {
      audio.remove()
      unregisterAudioElement(soundId)
    }
  }, [soundId, src, options?.loop, options?.volume, registerAudioElement, unregisterAudioElement])

  useEffect(() => {
    if (options?.autoPlay && isAudioEnabled && isLoaded && !isPlaying) {
      playAmbientSound(soundId, options.volume)
    }
  }, [isAudioEnabled, isLoaded, isPlaying, soundId, options?.autoPlay, options?.volume, playAmbientSound])

  const play = () => playAmbientSound(soundId, options?.volume)
  const stop = () => stopAmbientSound(soundId)

  return {
    isLoaded,
    isPlaying,
    play,
    stop
  }
}