"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({ 
  className, 
  variant = 'default',
  animation = 'pulse',
  ...props 
}: SkeletonProps) {
  const baseClasses = "bg-muted rounded-md"
  
  const variantClasses = {
    default: "h-4 w-full",
    text: "h-4 w-3/4",
    circular: "rounded-full aspect-square",
    rectangular: "w-full aspect-video"
  }
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-[wave_1.5s_ease-in-out_infinite]",
    none: ""
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      {...props}
    />
  )
}

// Skeleton components for specific sections
export function HeroSkeleton() {
  return (
    <div className="max-w-4xl mx-auto text-center px-6 py-20 space-y-8">
      <Skeleton className="h-16 w-3/4 mx-auto" />
      <Skeleton className="h-6 w-2/3 mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <div className="flex justify-center gap-4 pt-8">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  )
}

export function SectionSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-8">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-1/2 mx-auto" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton variant="rectangular" className="h-48" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}