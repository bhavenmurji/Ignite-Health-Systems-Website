"use client"

import { Suspense, type ReactNode, type ComponentType } from 'react'
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor'
import { Skeleton } from '@/components/loading-skeleton'

interface PerformanceAwareLoaderProps {
  children: ReactNode
  fallback?: ReactNode
  lowPerformanceFallback?: ReactNode
  lazy?: boolean
}

export function PerformanceAwareLoader({
  children,
  fallback = <Skeleton className="h-32 w-full" />,
  lowPerformanceFallback = <div className="h-32 bg-muted animate-pulse rounded" />,
  lazy = true
}: PerformanceAwareLoaderProps) {
  const { isLowPerformance, connectionType } = usePerformanceMonitor()
  
  // Use simpler fallback for low performance or slow connections
  const shouldUseLowPerformanceMode = 
    isLowPerformance || 
    connectionType === 'slow-2g' || 
    connectionType === '2g'

  const activeFallback = shouldUseLowPerformanceMode 
    ? lowPerformanceFallback 
    : fallback

  if (!lazy) {
    return <>{children}</>
  }

  return (
    <Suspense fallback={activeFallback}>
      {children}
    </Suspense>
  )
}

// HOC for lazy loading components with performance awareness
export function withPerformanceAwareLoading<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: ReactNode
    lowPerformanceFallback?: ReactNode
  } = {}
) {
  return function PerformanceAwareComponent(props: P) {
    return (
      <PerformanceAwareLoader
        fallback={options.fallback}
        lowPerformanceFallback={options.lowPerformanceFallback}
      >
        <Component {...props} />
      </PerformanceAwareLoader>
    )
  }
}