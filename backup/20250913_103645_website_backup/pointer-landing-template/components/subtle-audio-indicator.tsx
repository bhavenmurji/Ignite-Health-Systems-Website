"use client"

import { useState, useEffect } from 'react'
import { Volume2, VolumeX, Music, Headphones } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAudioContext } from './audio-context-manager'

interface SubtleAudioIndicatorProps {
  /** Position of the indicator */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Show only on audio state changes */
  showOnStateChange?: boolean
  /** Auto-hide delay in milliseconds */
  autoHideDelay?: number
  /** Custom icon */
  icon?: 'volume' | 'music' | 'headphones'
  /** Style variant */
  variant?: 'minimal' | 'glass' | 'floating'
}

export function SubtleAudioIndicator({
  position = 'top-right',
  showOnStateChange = true,
  autoHideDelay = 3000,
  icon = 'volume',
  variant = 'glass'
}: SubtleAudioIndicatorProps) {
  const { 
    isAudioEnabled, 
    masterVolume, 
    isGloballyMuted, 
    enableAudio, 
    disableAudio, 
    toggleGlobalMute 
  } = useAudioContext()
  
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Show indicator on audio state changes
  useEffect(() => {
    if (showOnStateChange) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        if (!isHovered) {
          setIsVisible(false)
        }
      }, autoHideDelay)

      return () => clearTimeout(timer)
    }
  }, [isAudioEnabled, isGloballyMuted, masterVolume, showOnStateChange, autoHideDelay, isHovered])

  // Keep visible while hovered
  useEffect(() => {
    if (isHovered) {
      setIsVisible(true)
    }
  }, [isHovered])

  const handleToggleAudio = () => {
    if (isAudioEnabled) {
      disableAudio()
    } else {
      enableAudio()
    }
  }

  const getIcon = () => {
    if (!isAudioEnabled || isGloballyMuted) {
      return <VolumeX className="w-4 h-4" />
    }

    switch (icon) {
      case 'music':
        return <Music className="w-4 h-4" />
      case 'headphones':
        return <Headphones className="w-4 h-4" />
      default:
        return <Volume2 className="w-4 h-4" />
    }
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  const variantClasses = {
    minimal: 'bg-background/90 border border-border/50',
    glass: 'bg-background/60 backdrop-blur-md border border-white/10',
    floating: 'bg-black/20 backdrop-blur-lg border border-white/20 shadow-lg'
  }

  const getVolumeLevel = () => {
    if (masterVolume === 0) return 'Muted'
    if (masterVolume < 0.3) return 'Low'
    if (masterVolume < 0.7) return 'Medium'
    return 'High'
  }

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed z-40 transition-all duration-300 ease-out",
        positionClasses[position],
        variantClasses[variant],
        "rounded-lg",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
      onMouseEnter={() => {
        setIsHovered(true)
        setShowDetails(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowDetails(false)
      }}
    >
      <div className="flex items-center gap-2 p-2">
        {/* Main Audio Toggle */}
        <button
          onClick={handleToggleAudio}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-md",
            "hover:bg-foreground/10 active:bg-foreground/20",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/50",
            isAudioEnabled 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
          aria-label={isAudioEnabled ? "Disable ambient audio" : "Enable ambient audio"}
        >
          {getIcon()}
        </button>

        {/* Audio Details - Shown on Hover */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-out",
            showDetails ? "w-auto opacity-100" : "w-0 opacity-0"
          )}
        >
          <div className="flex items-center gap-2 pr-2">
            {/* Status Text */}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {!isAudioEnabled 
                ? "Audio Off" 
                : isGloballyMuted 
                  ? "Muted" 
                  : `Audio ${getVolumeLevel()}`
              }
            </span>

            {/* Quick Mute Toggle */}
            {isAudioEnabled && (
              <button
                onClick={toggleGlobalMute}
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center",
                  "hover:bg-foreground/10 transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50"
                )}
                aria-label={isGloballyMuted ? "Unmute" : "Mute"}
              >
                {isGloballyMuted ? (
                  <VolumeX className="w-3 h-3 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-3 h-3 text-foreground/70" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Audio Status Dot */}
      <div
        className={cn(
          "absolute -top-1 -right-1 w-2 h-2 rounded-full",
          "transition-all duration-200",
          isAudioEnabled && !isGloballyMuted
            ? "bg-green-500 shadow-sm shadow-green-500/50"
            : "bg-muted-foreground/50"
        )}
        aria-hidden="true"
      />
    </div>
  )
}

// Preset configurations for different use cases
export const AudioIndicatorPresets = {
  // Minimal corner indicator
  corner: {
    position: 'bottom-right' as const,
    showOnStateChange: true,
    autoHideDelay: 2000,
    icon: 'volume' as const,
    variant: 'minimal' as const
  },

  // Ambient floating indicator
  ambient: {
    position: 'top-right' as const,
    showOnStateChange: true,
    autoHideDelay: 4000,
    icon: 'music' as const,
    variant: 'glass' as const
  },

  // Immersive indicator for media-heavy sections
  immersive: {
    position: 'bottom-left' as const,
    showOnStateChange: false, // Always visible when audio is playing
    autoHideDelay: 0,
    icon: 'headphones' as const,
    variant: 'floating' as const
  }
}

// Quick preset components
export const CornerAudioIndicator = () => (
  <SubtleAudioIndicator {...AudioIndicatorPresets.corner} />
)

export const AmbientAudioIndicator = () => (
  <SubtleAudioIndicator {...AudioIndicatorPresets.ambient} />
)

export const ImmersiveAudioIndicator = () => (
  <SubtleAudioIndicator {...AudioIndicatorPresets.immersive} />
)