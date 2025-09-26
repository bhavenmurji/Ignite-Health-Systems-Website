"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GlassMorphismProps {
  children: React.ReactNode
  className?: string
  variant?: "light" | "dark" | "fire" | "subtle"
  blur?: "sm" | "md" | "lg" | "xl"
  opacity?: "low" | "medium" | "high"
  border?: boolean
  shadow?: boolean
  animate?: boolean
  hover?: boolean
}

export function GlassMorphism({
  children,
  className,
  variant = "light",
  blur = "md",
  opacity = "medium",
  border = true,
  shadow = true,
  animate = false,
  hover = false
}: GlassMorphismProps) {
  // Base glass morphism styles
  const baseClasses = "relative overflow-hidden"
  
  // Backdrop blur variations
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl"
  }
  
  // Variant styles
  const variantClasses = {
    light: {
      low: "bg-white/5",
      medium: "bg-white/10",
      high: "bg-white/20"
    },
    dark: {
      low: "bg-[#1a1a1a]/10",
      medium: "bg-[#1a1a1a]/20", 
      high: "bg-[#1a1a1a]/30"
    },
    fire: {
      low: "bg-gradient-to-br from-[#ff6b35]/5 via-[#1a1a1a]/5 to-[#ff6b35]/5",
      medium: "bg-gradient-to-br from-[#ff6b35]/10 via-[#1a1a1a]/10 to-[#ff6b35]/10", 
      high: "bg-gradient-to-br from-[#ff6b35]/20 via-[#1a1a1a]/15 to-[#ff6b35]/20"
    },
    subtle: {
      low: "bg-gradient-to-br from-white/3 to-white/8",
      medium: "bg-gradient-to-br from-white/8 to-white/12",
      high: "bg-gradient-to-br from-white/12 to-white/18"
    }
  }
  
  // Border styles
  const borderClasses = {
    light: "border border-white/10",
    dark: "border border-[#1a1a1a]/20",
    fire: "border border-[#ff6b35]/20",
    subtle: "border border-white/5"
  }
  
  // Shadow styles
  const shadowClasses = {
    light: "shadow-lg shadow-white/5",
    dark: "shadow-lg shadow-[#1a1a1a]/25",
    fire: "shadow-lg shadow-[#ff6b35]/10",
    subtle: "shadow-md shadow-[#1a1a1a]/10"
  }
  
  // Hover effects
  const hoverClasses = hover ? {
    light: "hover:bg-white/15 hover:border-white/20",
    dark: "hover:bg-[#1a1a1a]/25 hover:border-[#1a1a1a]/30",
    fire: "hover:bg-gradient-to-br hover:from-[#ff6b35]/15 hover:via-[#1a1a1a]/15 hover:to-[#ff6b35]/15 hover:border-[#ff6b35]/30",
    subtle: "hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15 hover:border-white/10"
  } : {}
  
  const combinedClasses = cn(
    baseClasses,
    blurClasses[blur],
    variantClasses[variant][opacity],
    border && borderClasses[variant],
    shadow && shadowClasses[variant],
    hover && hoverClasses[variant],
    hover && "transition-all duration-300 ease-out",
    className
  )

  if (animate) {
    return (
      <motion.div
        className={combinedClasses}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.21, 1.11, 0.81, 0.99] 
        }}
        whileHover={hover ? { 
          scale: 1.02,
          y: -2,
          transition: { duration: 0.2 }
        } : undefined}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  )
}

// Preset components for common use cases
export function GlassCard({ 
  children, 
  className,
  ...props 
}: GlassMorphismProps) {
  return (
    <GlassMorphism
      variant="subtle"
      blur="md"
      opacity="medium"
      border
      shadow
      hover
      className={cn("rounded-xl p-6", className)}
      {...props}
    >
      {children}
    </GlassMorphism>
  )
}

export function GlassFireCard({ 
  children, 
  className,
  ...props 
}: GlassMorphismProps) {
  return (
    <GlassMorphism
      variant="fire"
      blur="lg"
      opacity="medium"
      border
      shadow
      hover
      animate
      className={cn("rounded-2xl p-8", className)}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
      {/* Fire glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff6b35]/5 via-transparent to-[#ff6b35]/5 pointer-events-none" />
    </GlassMorphism>
  )
}

export function GlassModal({ 
  children, 
  className,
  isOpen,
  onClose,
  ...props 
}: GlassMorphismProps & { 
  isOpen?: boolean
  onClose?: () => void 
}) {
  if (!isOpen) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <GlassMorphism
          variant="light"
          blur="xl"
          opacity="high"
          border
          shadow
          className={cn("rounded-2xl p-8 max-w-md w-full", className)}
          {...props}
        >
          {children}
        </GlassMorphism>
      </motion.div>
    </motion.div>
  )
}

export function GlassButton({ 
  children, 
  className,
  variant = "fire",
  size = "md",
  ...props 
}: GlassMorphismProps & { 
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  }

  return (
    <motion.button
      className={cn(
        "relative font-medium transition-all duration-200 active:scale-95",
        sizeClasses[size]
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <GlassMorphism
        variant={variant}
        blur="md"
        opacity="medium"
        border
        shadow
        hover
        className={cn("absolute inset-0", className)}
        {...props}
      />
      <span className="relative z-10 text-white">
        {children}
      </span>
    </motion.button>
  )
}

// Navigation component with glass morphism
export function GlassNavigation({ 
  children, 
  className,
  ...props 
}: GlassMorphismProps) {
  return (
    <GlassMorphism
      variant="light"
      blur="xl"
      opacity="medium"
      border
      shadow
      className={cn(
        "fixed top-0 left-0 right-0 z-40",
        "border-t-0 border-l-0 border-r-0",
        className
      )}
      {...props}
    >
      {children}
    </GlassMorphism>
  )
}

// Floating action button with glass morphism
export function GlassFAB({ 
  children, 
  className,
  ...props 
}: GlassMorphismProps & { onClick?: () => void }) {
  return (
    <motion.button
      className="fixed bottom-6 right-6 z-40"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <GlassMorphism
        variant="fire"
        blur="lg"
        opacity="high"
        border
        shadow
        className={cn("rounded-full p-4", className)}
        {...props}
      >
        <div className="text-white">
          {children}
        </div>
      </GlassMorphism>
    </motion.button>
  )
}