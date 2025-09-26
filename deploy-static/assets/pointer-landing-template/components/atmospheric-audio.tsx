"use client"

import { AudioContextProvider } from './audio-context-manager'
import { SubtleAudioIndicator } from './subtle-audio-indicator'
import { SectionAwareAudio, SectionAudioPresets } from './section-aware-audio'
import { ReactNode } from 'react'

interface AtmosphericAudioProps {
  children: ReactNode
  /** Audio preset configuration */
  preset?: 'healthcare' | 'minimal' | 'progressive' | 'custom'
  /** Custom section audio configuration (when preset is 'custom') */
  customSections?: Array<{
    sectionId: string
    trackUrl: string
    volume?: number
    delay?: number
  }>
  /** Audio indicator configuration */
  indicator?: {
    enabled?: boolean
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    variant?: 'minimal' | 'glass' | 'floating'
    showOnStateChange?: boolean
    autoHideDelay?: number
  }
  /** Audio context configuration */
  context?: {
    autoEnable?: boolean
    defaultVolume?: number
    respectMotionPreferences?: boolean
  }
  /** Section audio configuration */
  sectionAudio?: {
    crossfadeDuration?: number
    threshold?: number
    rootMargin?: string
    preloadAll?: boolean
  }
}

/**
 * AtmosphericAudio - A complete ambient audio solution
 * 
 * Features:
 * - Automatic section-based audio switching
 * - Subtle, unobtrusive controls
 * - Respects user preferences (reduced motion, etc.)
 * - Smart volume management
 * - Seamless crossfades between sections
 * - Accessibility compliant
 * 
 * Usage:
 * ```tsx
 * <AtmosphericAudio preset="healthcare">
 *   <YourPageContent />
 * </AtmosphericAudio>
 * ```
 */
export function AtmosphericAudio({
  children,
  preset = 'minimal',
  customSections,
  indicator = {},
  context = {},
  sectionAudio = {}
}: AtmosphericAudioProps) {
  // Get section configuration based on preset
  const getSectionConfig = () => {
    switch (preset) {
      case 'healthcare':
        return SectionAudioPresets.healthcare
      case 'minimal':
        return SectionAudioPresets.minimal
      case 'progressive':
        return SectionAudioPresets.progressive
      case 'custom':
        return customSections || []
      default:
        return SectionAudioPresets.minimal
    }
  }

  const sectionConfig = getSectionConfig()

  // Default configurations
  const indicatorConfig = {
    enabled: true,
    position: 'bottom-right' as const,
    variant: 'glass' as const,
    showOnStateChange: true,
    autoHideDelay: 3000,
    ...indicator
  }

  const contextConfig = {
    autoEnable: true,
    defaultVolume: 0.25,
    respectMotionPreferences: true,
    ...context
  }

  const sectionAudioConfig = {
    crossfadeDuration: 2000,
    threshold: 0.4,
    rootMargin: '-20% 0px -20% 0px',
    preloadAll: false,
    ...sectionAudio
  }

  return (
    <AudioContextProvider
      autoEnable={contextConfig.autoEnable}
      defaultVolume={contextConfig.defaultVolume}
      respectMotionPreferences={contextConfig.respectMotionPreferences}
    >
      {children}
      
      {/* Section-aware ambient audio */}
      {sectionConfig.length > 0 && (
        <SectionAwareAudio
          sections={sectionConfig}
          crossfadeDuration={sectionAudioConfig.crossfadeDuration}
          threshold={sectionAudioConfig.threshold}
          rootMargin={sectionAudioConfig.rootMargin}
          preloadAll={sectionAudioConfig.preloadAll}
        />
      )}
      
      {/* Subtle audio indicator */}
      {indicatorConfig.enabled && (
        <SubtleAudioIndicator
          position={indicatorConfig.position}
          variant={indicatorConfig.variant}
          showOnStateChange={indicatorConfig.showOnStateChange}
          autoHideDelay={indicatorConfig.autoHideDelay}
        />
      )}
    </AudioContextProvider>
  )
}

// Preset configurations for quick setup
export const AtmosphericAudioPresets = {
  // Healthcare/medical - calm, professional
  healthcare: {
    preset: 'healthcare' as const,
    context: {
      defaultVolume: 0.2,
      autoEnable: true
    },
    indicator: {
      variant: 'glass' as const,
      position: 'bottom-right' as const,
      autoHideDelay: 4000
    },
    sectionAudio: {
      crossfadeDuration: 3000,
      threshold: 0.3
    }
  },

  // Minimal - single subtle track
  minimal: {
    preset: 'minimal' as const,
    context: {
      defaultVolume: 0.15,
      autoEnable: false // Wait for user interaction
    },
    indicator: {
      variant: 'minimal' as const,
      position: 'top-right' as const,
      autoHideDelay: 2000
    },
    sectionAudio: {
      crossfadeDuration: 4000,
      threshold: 0.2,
      preloadAll: false
    }
  },

  // Progressive - builds energy
  progressive: {
    preset: 'progressive' as const,
    context: {
      defaultVolume: 0.3,
      autoEnable: true
    },
    indicator: {
      variant: 'floating' as const,
      position: 'bottom-left' as const,
      autoHideDelay: 3000
    },
    sectionAudio: {
      crossfadeDuration: 1500,
      threshold: 0.5
    }
  },

  // Silent - just provides the context without auto-playing
  silent: {
    preset: 'custom' as const,
    customSections: [],
    context: {
      defaultVolume: 0.2,
      autoEnable: false
    },
    indicator: {
      enabled: false
    }
  }
}

// Quick preset components
export const HealthcareAtmosphericAudio = ({ children }: { children: ReactNode }) => (
  <AtmosphericAudio {...AtmosphericAudioPresets.healthcare}>
    {children}
  </AtmosphericAudio>
)

export const MinimalAtmosphericAudio = ({ children }: { children: ReactNode }) => (
  <AtmosphericAudio {...AtmosphericAudioPresets.minimal}>
    {children}
  </AtmosphericAudio>
)

export const ProgressiveAtmosphericAudio = ({ children }: { children: ReactNode }) => (
  <AtmosphericAudio {...AtmosphericAudioPresets.progressive}>
    {children}
  </AtmosphericAudio>
)

export const SilentAtmosphericAudio = ({ children }: { children: ReactNode }) => (
  <AtmosphericAudio {...AtmosphericAudioPresets.silent}>
    {children}
  </AtmosphericAudio>
)

// Example custom configuration
export const CustomAtmosphericAudio = ({ children }: { children: ReactNode }) => (
  <AtmosphericAudio
    preset="custom"
    customSections={[
      {
        sectionId: 'hero',
        trackUrl: '/audio/my-custom-track.mp3',
        volume: 0.3,
        delay: 1000
      }
    ]}
    indicator={{
      position: 'top-left',
      variant: 'minimal',
      showOnStateChange: true
    }}
    context={{
      defaultVolume: 0.25,
      autoEnable: false
    }}
  >
    {children}
  </AtmosphericAudio>
)