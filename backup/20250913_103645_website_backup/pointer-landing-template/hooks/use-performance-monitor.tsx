"use client"

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  fps: number
  isLowPerformance: boolean
  memoryUsage?: number
  connectionType?: string
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    isLowPerformance: false
  })

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    // FPS monitoring
    const measureFPS = () => {
      frameCount++
      const now = performance.now()
      
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          isLowPerformance: fps < 30
        }))
        
        frameCount = 0
        lastTime = now
      }
      
      animationId = requestAnimationFrame(measureFPS)
    }

    measureFPS()

    // Connection type detection
    const connection = (navigator as any).connection
    if (connection) {
      setMetrics(prev => ({
        ...prev,
        connectionType: connection.effectiveType
      }))
    }

    // Memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memoryInfo.usedJSHeapSize
      }))
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return metrics
}