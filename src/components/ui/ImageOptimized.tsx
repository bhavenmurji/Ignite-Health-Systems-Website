"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ImageOptimizedProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto"
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  objectPosition?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  loading?: "lazy" | "eager"
  unoptimized?: boolean
  onLoad?: () => void
  onError?: () => void
  showLoader?: boolean
  containerClassName?: string
  fallbackSrc?: string
  glassEffect?: boolean
  glassVariant?: "light" | "dark" | "fire" | "subtle"
  overlayType?: "none" | "dark" | "fire" | "gradient"
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full"
}

export function ImageOptimized({
  src,
  alt,
  className,
  priority = false,
  quality = 85,
  fill = false,
  sizes,
  aspectRatio = "auto",
  objectFit = "cover",
  objectPosition = "center",
  placeholder = "empty",
  blurDataURL,
  loading = "lazy",
  unoptimized = false,
  onLoad,
  onError,
  showLoader = true,
  containerClassName,
  fallbackSrc,
  glassEffect = false,
  glassVariant = "subtle",
  overlayType = "none",
  rounded = "none",
  ...props
}: ImageOptimizedProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const imageRef = useRef<HTMLImageElement>(null)

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    auto: ""
  }

  // Handle image load
  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  // Handle image error
  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    
    // Try fallback source if available
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(false)
      setIsLoading(true)
      return
    }
    
    onError?.()
  }

  // Generate optimized sizes based on common breakpoints
  const generateSizes = () => {
    if (sizes) return sizes
    
    if (fill) {
      return "100vw"
    }
    
    return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  }

  // Blur data URL for placeholder
  const shimmer = `
    <svg width="400" height="400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#1a1a1a" offset="20%" />
          <stop stop-color="#333" offset="50%" />
          <stop stop-color="#1a1a1a" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#1a1a1a" />
      <rect id="r" width="400" height="400" fill="url(#g)" opacity="0.5" />
      <animate xlink:href="#r" attributeName="x" from="-400" to="400" dur="1s" repeatCount="indefinite"  />
    </svg>
  `

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  const defaultBlurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer)}`

  // Rounded corner classes
  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md", 
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full"
  }

  // Overlay classes
  const overlayClasses = {
    none: "",
    dark: "absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent",
    fire: "absolute inset-0 bg-gradient-to-t from-[#ff6b35]/20 via-transparent to-transparent",
    gradient: "absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"
  }

  return (
    <div 
      className={cn(
        "relative overflow-hidden force-image-consistency",
        aspectRatio !== "auto" && aspectRatioClasses[aspectRatio],
        roundedClasses[rounded],
        glassEffect && "backdrop-blur-sm",
        containerClassName
      )}
    >
      {/* Loading spinner */}
      {isLoading && showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]/50 backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff6b35]" />
        </div>
      )}

      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]/80 backdrop-blur-sm">
          <div className="text-center text-white/60">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image failed to load</div>
          </div>
        </div>
      )}

      {/* Main image */}
      {!hasError && (
        <Image
          ref={imageRef}
          src={currentSrc}
          alt={alt}
          className={cn(
            "transition-all duration-300",
            isLoading && "opacity-0 scale-105",
            !isLoading && "opacity-100 scale-100",
            className
          )}
          style={{
            objectFit,
            objectPosition,
          }}
          fill={fill}
          sizes={generateSizes()}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          loading={loading}
          unoptimized={unoptimized}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* Glass morphism overlay and overlays */}
      {!isLoading && !hasError && (
        <>
          {/* Glass morphism effect */}
          {glassEffect && (
            <div className={cn(
              "absolute inset-0 pointer-events-none",
              glassVariant === "light" && "bg-white/10 backdrop-blur-sm",
              glassVariant === "dark" && "bg-[#1a1a1a]/20 backdrop-blur-sm",
              glassVariant === "fire" && "bg-gradient-to-br from-[#ff6b35]/10 via-[#1a1a1a]/10 to-[#ff6b35]/10 backdrop-blur-md",
              glassVariant === "subtle" && "bg-gradient-to-br from-white/5 to-white/8 backdrop-blur-sm"
            )} />
          )}
          
          {/* Overlay effects */}
          {overlayType !== "none" && (
            <div className={cn(
              "absolute inset-0 pointer-events-none",
              overlayClasses[overlayType]
            )} />
          )}
        </>
      )}
    </div>
  )
}

// Preset components for common use cases
export function ImageHero({ 
  src, 
  alt, 
  children, 
  className,
  ...props 
}: ImageOptimizedProps & { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-[60vh] lg:min-h-[80vh] overflow-hidden">
      <ImageOptimized
        src={src}
        alt={alt}
        fill
        priority
        aspectRatio="auto"
        objectFit="cover"
        className={cn("brightness-75", className)}
        sizes="100vw"
        {...props}
      />
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

export function ImageCard({ 
  src, 
  alt, 
  className,
  ...props 
}: ImageOptimizedProps) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#1a1a1a]/50 backdrop-blur-sm border border-white/10">
      <ImageOptimized
        src={src}
        alt={alt}
        aspectRatio="landscape"
        objectFit="cover"
        className={cn("rounded-xl", className)}
        glassEffect={true}
        glassVariant="subtle"
        overlayType="dark"
        rounded="xl"
        {...props}
      />
    </div>
  )
}

export function ImageAvatar({ 
  src, 
  alt, 
  size = "md",
  className,
  ...props 
}: ImageOptimizedProps & { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  }

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden bg-[#1a1a1a]/50 border border-white/20",
      sizeClasses[size]
    )}>
      <ImageOptimized
        src={src}
        alt={alt}
        fill
        aspectRatio="square"
        objectFit="cover"
        className={cn("rounded-full", className)}
        glassEffect={true}
        glassVariant="dark"
        rounded="full"
        {...props}
      />
    </div>
  )
}

export function ImageGallery({
  images,
  className,
  imageClassName,
  ...props
}: {
  images: Array<{ src: string; alt: string; caption?: string }>
  className?: string
  imageClassName?: string
} & Omit<ImageOptimizedProps, 'src' | 'alt'>) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {images.map((image, index) => (
        <div key={index} className="space-y-2">
          <ImageCard
            src={image.src}
            alt={image.alt}
            className={imageClassName}
            glassEffect={true}
            glassVariant="fire"
            overlayType="gradient"
            {...props}
          />
          {image.caption && (
            <p className="text-sm text-white/60 text-center">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  )
}

// Additional migration-ready components for specialized use cases

export function ImageHeroFire({ 
  src, 
  alt, 
  children, 
  className,
  ...props 
}: ImageOptimizedProps & { children?: React.ReactNode }) {
  return (
    <div className="relative min-h-[60vh] lg:min-h-[80vh] overflow-hidden">
      <ImageOptimized
        src={src}
        alt={alt}
        fill
        priority
        aspectRatio="auto"
        objectFit="cover"
        className={cn("brightness-75", className)}
        sizes="100vw"
        glassEffect={true}
        glassVariant="fire"
        overlayType="fire"
        {...props}
      />
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}
      {/* Fire glow effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#ff6b35]/20 via-transparent to-transparent pointer-events-none z-5" />
    </div>
  )
}

export function ImageCardGlass({ 
  src, 
  alt, 
  variant = "subtle",
  className,
  ...props 
}: ImageOptimizedProps & { variant?: "light" | "dark" | "fire" | "subtle" }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a]/30 backdrop-blur-md border border-white/10 hover:border-[#ff6b35]/30 transition-all duration-300">
      <ImageOptimized
        src={src}
        alt={alt}
        aspectRatio="landscape"
        objectFit="cover"
        className={cn("rounded-2xl", className)}
        glassEffect={true}
        glassVariant={variant}
        overlayType="gradient"
        rounded="xl"
        {...props}
      />
    </div>
  )
}

export function ImageThumbnail({ 
  src, 
  alt, 
  size = "md",
  className,
  ...props 
}: ImageOptimizedProps & { size?: "xs" | "sm" | "md" | "lg" | "xl" }) {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-10 h-10",
    md: "w-16 h-16", 
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  }

  return (
    <div className={cn(
      "relative rounded-lg overflow-hidden bg-[#1a1a1a]/40 border border-white/10 hover:border-[#ff6b35]/40 transition-all duration-200",
      sizeClasses[size]
    )}>
      <ImageOptimized
        src={src}
        alt={alt}
        fill
        aspectRatio="square"
        objectFit="cover"
        className={cn("rounded-lg", className)}
        glassEffect={true}
        glassVariant="dark"
        rounded="lg"
        {...props}
      />
    </div>
  )
}

export function ImageBanner({ 
  src, 
  alt, 
  height = "40vh",
  children,
  className,
  ...props 
}: ImageOptimizedProps & { 
  height?: string
  children?: React.ReactNode 
}) {
  return (
    <div className="relative overflow-hidden" style={{ height }}>
      <ImageOptimized
        src={src}
        alt={alt}
        fill
        priority
        aspectRatio="auto"
        objectFit="cover"
        className={cn("brightness-90", className)}
        sizes="100vw"
        glassEffect={true}
        glassVariant="subtle"
        overlayType="dark"
        {...props}
      />
      {children && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {children}
        </div>
      )}
    </div>
  )
}

export function ImageLogo({ 
  src, 
  alt, 
  maxHeight = "h-12",
  className,
  ...props 
}: ImageOptimizedProps & { maxHeight?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center", maxHeight)}>
      <ImageOptimized
        src={src}
        alt={alt}
        className={cn("object-contain w-auto h-full max-w-full", className)}
        objectFit="contain"
        quality={100}
        priority
        {...props}
      />
    </div>
  )
}

export function ImageMasonry({
  images,
  className,
  imageClassName,
  ...props
}: {
  images: Array<{ src: string; alt: string; caption?: string; height?: number }>
  className?: string
  imageClassName?: string
} & Omit<ImageOptimizedProps, 'src' | 'alt'>) {
  return (
    <div className={cn("columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4", className)}>
      {images.map((image, index) => (
        <div key={index} className="break-inside-avoid space-y-2">
          <div 
            className="relative overflow-hidden rounded-xl bg-[#1a1a1a]/30 backdrop-blur-sm border border-white/10"
            style={{ height: image.height ? `${image.height}px` : 'auto' }}
          >
            <ImageOptimized
              src={image.src}
              alt={image.alt}
              className={cn("rounded-xl", imageClassName)}
              aspectRatio="auto"
              objectFit="cover"
              glassEffect={true}
              glassVariant="fire"
              overlayType="gradient"
              rounded="xl"
              {...props}
            />
          </div>
          {image.caption && (
            <p className="text-sm text-white/60 px-2">{image.caption}</p>
          )}
        </div>
      ))}
    </div>
  )
}