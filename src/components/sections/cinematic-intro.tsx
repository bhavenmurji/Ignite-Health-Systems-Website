"use client"

import React, { useState, useEffect, useRef, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Play, Pause, Volume2, VolumeX, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AudioPlayer } from "@/components/ui/audio-player"
import { AudioTroubleshooter } from "@/components/ui/audio-troubleshooter"
import { audioManager, AUDIO_PRIORITIES, AUDIO_TYPES } from "@/lib/audio-manager"

interface CinematicIntroProps {
  onComplete?: () => void
  autoPlay?: boolean
  skipable?: boolean
  showTroubleshooter?: boolean
  enableRetry?: boolean
}

const CinematicIntro = memo(function CinematicIntro({ 
  onComplete, 
  autoPlay = true, 
  skipable = true,
  showTroubleshooter = false,
  enableRetry = true
}: CinematicIntroProps) {
  const [currentPhase, setCurrentPhase] = useState<'dark' | 'fade-in' | 'blur-focus' | 'text-reveal' | 'complete'>('dark')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [showControls, setShowControls] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [showAudioPlayer, setShowAudioPlayer] = useState(false)
  const [showTroubleshooterDialog, setShowTroubleshooterDialog] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const phaseTimeouts = useRef<NodeJS.Timeout[]>([])

  // Cinematic timing sequence (in milliseconds)
  const TIMING = {
    DARK_SCREEN: 1500,
    AUDIO_FADE_IN: 2000,
    IMAGE_FADE_IN: 3000,
    BLUR_TO_FOCUS: 5000,
    TEXT_REVEAL: 7000,
    COMPLETE: 12000
  }

  // Handle user interaction for audio autoplay
  const handleFirstInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true)
      if (audioRef.current && autoPlay) {
        audioRef.current.play().catch(console.error)
        setIsPlaying(true)
      }
    }
  }

  // Enhanced audio controls with error handling
  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true)
          setAudioError(null)
        })
        .catch((error) => {
          console.error('Audio play failed:', error)
          setAudioError(`Playback failed: ${error.message}`)
          setShowTroubleshooterDialog(true)
        })
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    audioRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return
    audioRef.current.volume = newVolume
    setVolume(newVolume)
  }

  const handleAudioError = (error: string) => {
    setAudioError(error)
    if (enableRetry) {
      setShowTroubleshooterDialog(true)
    }
  }

  const handleTroubleshooterResolution = (resolution: string) => {
    console.log('Audio troubleshooter resolution:', resolution)
    setShowTroubleshooterDialog(false)
    // Optionally show the resolution to the user
  }

  const skipIntro = () => {
    // Clear all timeouts
    phaseTimeouts.current.forEach(clearTimeout)
    setCurrentPhase('complete')
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    onComplete?.()
  }

  // Initialize cinematic sequence
  useEffect(() => {
    if (!autoPlay) return

    // Phase 1: Dark screen (immediate)
    setCurrentPhase('dark')

    // Phase 2: Audio fade in + Image fade in
    const fadeInTimeout = setTimeout(() => {
      setCurrentPhase('fade-in')
    }, TIMING.DARK_SCREEN)

    // Phase 3: Blur to focus transition
    const blurFocusTimeout = setTimeout(() => {
      setCurrentPhase('blur-focus')
    }, TIMING.BLUR_TO_FOCUS)

    // Phase 4: Text reveal
    const textRevealTimeout = setTimeout(() => {
      setCurrentPhase('text-reveal')
    }, TIMING.TEXT_REVEAL)

    // Phase 5: Complete
    const completeTimeout = setTimeout(() => {
      setCurrentPhase('complete')
      onComplete?.()
    }, TIMING.COMPLETE)

    phaseTimeouts.current = [fadeInTimeout, blurFocusTimeout, textRevealTimeout, completeTimeout]

    return () => {
      phaseTimeouts.current.forEach(clearTimeout)
    }
  }, [autoPlay, onComplete])

  // Enhanced audio setup with error handling
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
    audio.loop = true
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'

    const handleEnded = () => setIsPlaying(false)
    const handlePlay = () => {
      setIsPlaying(true)
      setAudioError(null)
    }
    const handlePause = () => setIsPlaying(false)
    const handleError = () => {
      const errorMessage = audio.error ? 
        `Audio error: ${audio.error.message}` : 
        'Unknown audio playback error'
      handleAudioError(errorMessage)
      setIsPlaying(false)
    }
    const handleCanPlay = () => {
      setAudioError(null)
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [volume, handleAudioError])

  // Show/hide controls on mouse movement
  useEffect(() => {
    let hideControlsTimeout: NodeJS.Timeout

    const handleMouseMove = () => {
      setShowControls(true)
      clearTimeout(hideControlsTimeout)
      hideControlsTimeout = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    const handleMouseLeave = () => {
      setShowControls(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      clearTimeout(hideControlsTimeout)
    }
  }, [])

  // Animation variants
  const backgroundVariants = {
    dark: { 
      opacity: 1,
      background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
    },
    fadeIn: { 
      opacity: 1,
      background: "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a1810 100%)",
      transition: { duration: 2, ease: "easeInOut" }
    },
    complete: {
      opacity: 0,
      transition: { duration: 1, ease: "easeInOut" }
    }
  }

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 1.2, 
      filter: "blur(20px) brightness(0.3)" 
    },
    fadeIn: { 
      opacity: 0.4, 
      scale: 1.1, 
      filter: "blur(15px) brightness(0.5)",
      transition: { duration: 2, ease: "easeOut" }
    },
    focused: { 
      opacity: 0.8, 
      scale: 1, 
      filter: "blur(0px) brightness(1)",
      transition: { duration: 3, ease: [0.33, 1, 0.68, 1] }
    }
  }

  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 2, 
        ease: [0.33, 1, 0.68, 1],
        delay: 0.5
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  if (currentPhase === 'complete') {
    return null
  }

  return (
    <motion.div
      className="cinematic-intro fixed inset-0 z-50 flex items-center justify-center cursor-pointer motion-container"
      onClick={handleFirstInteraction}
      initial="dark"
      animate={currentPhase === 'fade-in' || currentPhase === 'blur-focus' || currentPhase === 'text-reveal' ? 'fadeIn' : currentPhase}
      variants={backgroundVariants}
    >
      {/* Audio Element */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        muted={isMuted}
      >
        <source src="/assets/audio/backing-music-compressed.mp3" type="audio/mpeg" />
        <source src="/assets/audio/backing-music.mp3" type="audio/mpeg" />
      </audio>

      {/* Background Image */}
      <AnimatePresence>
        {(currentPhase === 'fade-in' || currentPhase === 'blur-focus' || currentPhase === 'text-reveal') && (
          <motion.div
            className="hero-background absolute inset-0"
            initial="hidden"
            animate={currentPhase === 'blur-focus' || currentPhase === 'text-reveal' ? 'focused' : 'fadeIn'}
            exit="hidden"
            variants={imageVariants}
          >
            <Image
              src="/assets/images/IgniteARevolution.png"
              alt="Ignite A Revolution"
              fill
              className="object-cover object-center w-full h-full"
              priority
              quality={95}
              sizes="100vw"
            />
            
            {/* Fire gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-red-800/20 to-yellow-600/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dramatic Typography */}
      <AnimatePresence>
        {currentPhase === 'text-reveal' && (
          <motion.div
            className="intro-content relative z-10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={textVariants}
          >
            <motion.h1 
              className="intro-title font-bold mb-6 leading-none typography-responsive"
              style={{
                background: "linear-gradient(135deg, #ff6b35 0%, #ff8c42 25%, #ffd23f 50%, #ff6b35 75%, #ff4757 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 30px rgba(255, 107, 53, 0.5), 0 0 60px rgba(255, 71, 87, 0.3)",
                filter: "drop-shadow(0 4px 20px rgba(255, 107, 53, 0.4))"
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                backgroundPosition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            >
              Plagued by click fatigue?
            </motion.h1>
            
            <motion.div 
              className="w-32 h-1 mx-auto mb-8 rounded-full"
              style={{
                background: "linear-gradient(90deg, #ff6b35, #ff8c42, #ffd23f)"
              }}
              animate={{
                scaleX: [0, 1, 0.8, 1],
                opacity: [0, 1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                delay: 1,
                ease: "easeInOut"
              }}
            />
            
            <motion.p 
              className="text-subtitle-responsive text-white/90 font-medium tracking-wide leading-relaxed typography-responsive"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.7)"
              }}
              animate={{
                opacity: [0, 1],
                y: [20, 0]
              }}
              transition={{
                duration: 1.5,
                delay: 2,
                ease: "easeOut"
              }}
            >
              Revolutionary healthcare technology is here.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Audio Controls */}
      <AnimatePresence>
        {showControls && hasUserInteracted && (
          <motion.div
            className="absolute bottom-8 right-8 flex items-center gap-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-3 border border-white/10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              className="text-white hover:text-orange-400 hover:bg-white/10"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleMute()
              }}
              className="text-white hover:text-orange-400 hover:bg-white/10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                e.stopPropagation()
                handleVolumeChange(parseFloat(e.target.value))
              }}
              className="w-16 h-1 bg-white/20 rounded-full appearance-none slider"
              style={{
                background: `linear-gradient(to right, #ff6b35 0%, #ff6b35 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            
            {audioError && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTroubleshooterDialog(true)
                }}
                className="text-white hover:text-red-400 hover:bg-white/10"
                title="Audio troubleshooter"
              >
                <AlertTriangle className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <AnimatePresence>
        {skipable && currentPhase !== 'dark' && (
          <motion.div
            className="absolute top-8 right-8"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          >
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                skipIntro()
              }}
              className="text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium tracking-wide"
            >
              Skip Intro →
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click to Continue Hint */}
      <AnimatePresence>
        {!hasUserInteracted && currentPhase !== 'dark' && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          >
            <motion.p 
              className="text-white/60 text-sm font-medium tracking-wide"
              animate={{
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {audioError ? 'Audio issue detected - click for troubleshooter' : 'Click anywhere to enable audio'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Troubleshooter Dialog */}
      <AnimatePresence>
        {showTroubleshooterDialog && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTroubleshooterDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AudioTroubleshooter
                onResolutionFound={handleTroubleshooterResolution}
                className="max-w-lg"
              />
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowTroubleshooterDialog(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Audio Player (Alternative Mode) */}
      <AnimatePresence>
        {showAudioPlayer && (
          <motion.div
            className="absolute bottom-8 left-8"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          >
            <AudioPlayer
              src="/assets/audio/backing-music.mp3"
              compressedSrc="/assets/audio/backing-music-compressed.mp3"
              title="Cinematic Intro"
              artist="Ignite Health Systems"
              variant="compact"
              cinematicMode
              loop
              autoplay={hasUserInteracted}
              priority={AUDIO_PRIORITIES.CINEMATIC}
              type="cinematic"
              enableRetry={enableRetry}
              showNetworkStatus
              onPlayStateChange={setIsPlaying}
              onError={handleAudioError}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ff6b35;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ff6b35;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </motion.div>
  )
})

export { CinematicIntro }