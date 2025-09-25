"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ScrollProgressProps {
  className?: string
  showPercentage?: boolean
}

export function ScrollProgress({ className, showPercentage = false }: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      
      setScrollProgress(Math.min(100, Math.max(0, progress)))
      setIsVisible(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-1 bg-border/20",
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-300 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
      {showPercentage && (
        <div className="absolute top-2 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          {Math.round(scrollProgress)}%
        </div>
      )}
    </div>
  )
}