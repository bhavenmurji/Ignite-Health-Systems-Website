"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale'
  duration?: number
  distance?: number
  once?: boolean
  threshold?: number
}

const animationVariants = {
  up: (distance: number) => ({
    initial: { opacity: 0, y: distance, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 }
  }),
  down: (distance: number) => ({
    initial: { opacity: 0, y: -distance, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 }
  }),
  left: (distance: number) => ({
    initial: { opacity: 0, x: -distance, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 }
  }),
  right: (distance: number) => ({
    initial: { opacity: 0, x: distance, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 }
  }),
  fade: () => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  }),
  scale: () => ({
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 }
  })
}

export function AnimatedSection({ 
  children, 
  className, 
  delay = 0,
  direction = 'up',
  duration = 0.8,
  distance = 30,
  once = true,
  threshold = 0.1,
  ...props 
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion()
  const variants = animationVariants[direction](distance)
  
  // Reduce motion for users who prefer it
  const motionProps = shouldReduceMotion
    ? {
        initial: false,
        animate: variants.animate,
        transition: { duration: 0.01 }
      }
    : {
        initial: variants.initial,
        whileInView: variants.animate,
        viewport: { 
          once, 
          threshold,
          margin: "-50px 0px -50px 0px" // Start animation slightly before element is visible
        },
        transition: {
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94], // Custom easing curve
          type: "tween"
        }
      }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger animation wrapper for child elements
export function StaggeredAnimatedSection({ 
  children, 
  className,
  staggerDelay = 0.1,
  ...props 
}: AnimatedSectionProps & { staggerDelay?: number }) {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, threshold: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
export const StaggerItem = motion.div

// Set default variants for StaggerItem
const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

StaggerItem.defaultProps = {
  variants: staggerItemVariants
}