"use client"

import { useCallback, useEffect, useState } from 'react'

interface SmoothScrollOptions {
  duration?: number
  easing?: (t: number) => number
  offset?: number
  onComplete?: () => void
}

const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
}

export function useSmoothScroll() {
  const [isScrolling, setIsScrolling] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  const scrollToElement = useCallback((
    target: string | Element,
    options: SmoothScrollOptions = {}
  ) => {
    const {
      duration = 800,
      easing = easeInOutCubic,
      offset = 100,
      onComplete
    } = options

    let element: Element | null = null
    
    if (typeof target === 'string') {
      if (target.startsWith('#')) {
        element = document.getElementById(target.slice(1))
      } else {
        element = document.querySelector(target)
      }
    } else {
      element = target
    }

    if (!element) {
      console.warn(`Element not found: ${target}`)
      return
    }

    setIsScrolling(true)
    
    const startPosition = window.pageYOffset
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
    const distance = targetPosition - startPosition
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)
      
      window.scrollTo(0, startPosition + distance * easedProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        setIsScrolling(false)
        onComplete?.()
      }
    }

    requestAnimationFrame(animateScroll)
  }, [])

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return // Don't update during smooth scroll animation

      const sections = ['hero', 'platform', 'approach', 'founder', 'join']
      const scrollPosition = window.scrollY + 200 // Offset for header

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isScrolling])

  return {
    scrollToElement,
    isScrolling,
    activeSection
  }
}