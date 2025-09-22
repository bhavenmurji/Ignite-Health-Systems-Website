"use client"

import { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { useAudioContext } from './audio-context-manager'
import { generateSectionConfig } from '@/lib/audio-assets'

interface SectionAudioConfig {
  /** Section ID to observe */
  sectionId: string
  /** Audio track URL for this section */
  trackUrl: string
  /** Volume for this section (0-1) */
  volume?: number
  /** Fade in/out duration in milliseconds */
  fadeDuration?: number
  /** Delay before starting audio when section becomes visible */
  delay?: number
  /** Continue playing in adjacent sections */
  spillover?: boolean
}

interface SectionAwareAudioProps {
  /** Configuration for each section */
  sections: SectionAudioConfig[]
  /** Global fade duration between tracks */
  crossfadeDuration?: number
  /** Threshold for section visibility */
  threshold?: number
  /** Root margin for intersection observer */
  rootMargin?: string
  /** Whether to preload all audio tracks */
  preloadAll?: boolean
}

export function SectionAwareAudio({
  sections,
  crossfadeDuration = 2000,
  threshold = 0.4,
  rootMargin = '-20% 0px -20% 0px',
  preloadAll = true
}: SectionAwareAudioProps) {
  const { isAudioEnabled, masterVolume, registerAudioElement, unregisterAudioElement } = useAudioContext()
  
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map())
  const fadeTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())
  const playbackTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Create and register audio elements
  useEffect(() => {
    sections.forEach((section) => {
      if (!audioElementsRef.current.has(section.sectionId)) {
        const audio = new Audio(section.trackUrl)
        audio.loop = true
        audio.volume = 0
        audio.preload = preloadAll ? 'auto' : 'metadata'
        
        // Set up audio event listeners
        audio.addEventListener('loadeddata', () => {
          console.log(`Audio loaded for section: ${section.sectionId}`)
        })
        
        audio.addEventListener('error', (e) => {
          console.warn(`Failed to load audio for section ${section.sectionId}:`, e)
        })

        audioElementsRef.current.set(section.sectionId, audio)
        registerAudioElement(`section-${section.sectionId}`, audio)
      }
    })

    return () => {
      // Cleanup on unmount
      audioElementsRef.current.forEach((audio, sectionId) => {
        audio.pause()
        audio.remove()
        unregisterAudioElement(`section-${sectionId}`)
      })
      audioElementsRef.current.clear()
      
      // Clear all timers
      fadeTimersRef.current.forEach(timer => clearTimeout(timer))
      playbackTimersRef.current.forEach(timer => clearTimeout(timer))
    }
  }, [sections, preloadAll, registerAudioElement, unregisterAudioElement])

  // Smooth volume fade utility
  const fadeAudioVolume = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const startVolume = audio.volume
    const volumeDiff = targetVolume - startVolume
    const steps = Math.max(1, Math.floor(duration / 16)) // ~60fps
    const stepSize = volumeDiff / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const newVolume = startVolume + (stepSize * currentStep)
      
      if (currentStep >= steps) {
        audio.volume = Math.max(0, Math.min(1, targetVolume))
        clearInterval(interval)
        
        // Pause audio if faded to 0
        if (targetVolume === 0) {
          audio.pause()
        }
      } else {
        audio.volume = Math.max(0, Math.min(1, newVolume))
      }
    }, 16)

    return interval
  }

  // Handle section changes
  const handleSectionChange = (sectionId: string) => {
    if (!isAudioEnabled || sectionId === currentSection || isTransitioning) {
      return
    }

    setIsTransitioning(true)
    const sectionConfig = sections.find(s => s.sectionId === sectionId)
    
    if (!sectionConfig) {
      setIsTransitioning(false)
      return
    }

    // Clear any existing timers
    fadeTimersRef.current.forEach(timer => clearTimeout(timer))
    playbackTimersRef.current.forEach(timer => clearTimeout(timer))
    fadeTimersRef.current.clear()
    playbackTimersRef.current.clear()

    // Fade out current audio
    if (currentSection) {
      const currentAudio = audioElementsRef.current.get(currentSection)
      if (currentAudio && !currentAudio.paused) {
        fadeAudioVolume(currentAudio, 0, crossfadeDuration / 2)
      }
    }

    // Fade in new audio after delay
    const newAudio = audioElementsRef.current.get(sectionId)
    if (newAudio) {
      const delay = sectionConfig.delay || 0
      const targetVolume = (sectionConfig.volume || 0.5) * masterVolume

      const playbackTimer = setTimeout(() => {
        newAudio.currentTime = 0
        newAudio.volume = 0
        
        newAudio.play().then(() => {
          fadeAudioVolume(newAudio, targetVolume, crossfadeDuration / 2)
          setCurrentSection(sectionId)
          
          setTimeout(() => {
            setIsTransitioning(false)
          }, crossfadeDuration / 2)
        }).catch((error) => {
          console.warn(`Failed to play audio for section ${sectionId}:`, error)
          setIsTransitioning(false)
        })
      }, delay)

      playbackTimersRef.current.set(sectionId, playbackTimer)
    } else {
      setCurrentSection(sectionId)
      setIsTransitioning(false)
    }
  }

  // Set up intersection observers for each section
  useEffect(() => {
    if (!isAudioEnabled) return

    const observers: IntersectionObserver[] = []

    sections.forEach((section) => {
      const element = document.getElementById(section.sectionId)
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                handleSectionChange(section.sectionId)
              }
            })
          },
          {
            threshold,
            rootMargin
          }
        )

        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [isAudioEnabled, sections, threshold, rootMargin, currentSection, isTransitioning])

  // Stop all audio when audio is disabled
  useEffect(() => {
    if (!isAudioEnabled) {
      audioElementsRef.current.forEach((audio) => {
        fadeAudioVolume(audio, 0, 500)
      })
      setCurrentSection(null)
    }
  }, [isAudioEnabled])

  // Update volume when master volume changes
  useEffect(() => {
    if (currentSection) {
      const sectionConfig = sections.find(s => s.sectionId === currentSection)
      const currentAudio = audioElementsRef.current.get(currentSection)
      
      if (sectionConfig && currentAudio && !currentAudio.paused) {
        const targetVolume = (sectionConfig.volume || 0.5) * masterVolume
        fadeAudioVolume(currentAudio, targetVolume, 300)
      }
    }
  }, [masterVolume, currentSection, sections])

  // This component doesn't render anything visible
  return (
    <>
      {/* Hidden audio elements */}
      {sections.map((section) => (
        <audio
          key={section.sectionId}
          ref={(audio) => {
            if (audio && !audioElementsRef.current.has(section.sectionId)) {
              audioElementsRef.current.set(section.sectionId, audio)
            }
          }}
          src={section.trackUrl}
          preload={preloadAll ? 'auto' : 'metadata'}
          loop
          className="sr-only"
        />
      ))}
    </>
  )
}

// Preset section configurations using audio assets
export const SectionAudioPresets = (() => {
  // Generate configurations using the audio assets
  const healthcareConfig = generateSectionConfig('healthcare')
  const minimalConfig = generateSectionConfig('minimal')
  const progressiveConfig = generateSectionConfig('progressive')

  // Add custom delays for healthcare sections
  const delayMap: Record<string, number> = {
    hero: 1000,
    platform: 500,
    approach: 800,
    founder: 600,
    join: 400
  }

  return {
    // Healthcare/Medical themed
    healthcare: healthcareConfig.map(config => ({
      ...config,
      delay: delayMap[config.sectionId] || 500
    })),

    // Minimal single track
    minimal: minimalConfig.map(config => ({
      ...config,
      spillover: true
    })),

    // Progressive intensity
    progressive: progressiveConfig
  }
})()

// Quick preset components
export const HealthcareSectionAudio = () => (
  <SectionAwareAudio sections={SectionAudioPresets.healthcare} />
)

export const MinimalSectionAudio = () => (
  <SectionAwareAudio 
    sections={SectionAudioPresets.minimal} 
    crossfadeDuration={3000}
    threshold={0.2}
  />
)

export const ProgressiveSectionAudio = () => (
  <SectionAwareAudio 
    sections={SectionAudioPresets.progressive}
    crossfadeDuration={1500}
    threshold={0.5}
  />
)