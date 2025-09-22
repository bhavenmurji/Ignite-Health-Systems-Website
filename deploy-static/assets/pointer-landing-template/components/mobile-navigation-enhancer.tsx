"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface MobileNavigationEnhancerProps {
  sections: Array<{ id: string; name: string }>
  activeSection: string
  onNavigate: (sectionId: string) => void
}

export function MobileNavigationEnhancer({
  sections,
  activeSection,
  onNavigate
}: MobileNavigationEnhancerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const currentIndex = sections.findIndex(section => section.id === activeSection)
  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < sections.length - 1

  // Show navigation on mobile when scrolling stops
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    const handleScroll = () => {
      setIsVisible(true)
      
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsVisible(false)
      }, 2000)
    }

    // Only show on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Initial show
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  // Handle touch gestures for navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return
      
      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > 50
      const isRightSwipe = distance < -50

      if (isLeftSwipe && canGoForward) {
        onNavigate(sections[currentIndex + 1].id)
      }
      
      if (isRightSwipe && canGoBack) {
        onNavigate(sections[currentIndex - 1].id)
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [touchStart, touchEnd, canGoBack, canGoForward, currentIndex, onNavigate, sections])

  const navigateTo = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && canGoBack) {
      onNavigate(sections[currentIndex - 1].id)
    } else if (direction === 'next' && canGoForward) {
      onNavigate(sections[currentIndex + 1].id)
    }
  }

  // Only show on mobile
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-background/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border/50 transition-all duration-300 md:hidden",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Previous button */}
      <button
        onClick={() => navigateTo('prev')}
        disabled={!canGoBack}
        className={cn(
          "p-2 rounded-full transition-all duration-200",
          canGoBack 
            ? "text-foreground hover:bg-primary/10 hover:text-primary" 
            : "text-muted-foreground/50 cursor-not-allowed"
        )}
        aria-label="Previous section"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Section indicator */}
      <div className="flex items-center gap-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => onNavigate(section.id)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-200",
              activeSection === section.id
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
            aria-label={`Go to ${section.name}`}
          />
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={() => navigateTo('next')}
        disabled={!canGoForward}
        className={cn(
          "p-2 rounded-full transition-all duration-200",
          canGoForward 
            ? "text-foreground hover:bg-primary/10 hover:text-primary" 
            : "text-muted-foreground/50 cursor-not-allowed"
        )}
        aria-label="Next section"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Swipe hint */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
        Swipe to navigate
      </div>
    </div>
  )
}