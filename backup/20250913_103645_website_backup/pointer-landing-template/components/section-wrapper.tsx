"use client"

import { motion, useInView } from "framer-motion"
import { type ReactNode, useRef, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface SectionWrapperProps {
  children: ReactNode
  id?: string
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number
  threshold?: number
  triggerOnce?: boolean
  viewport?: { margin?: string; once?: boolean }
}

const animationVariants = {
  up: {
    initial: { opacity: 0, y: 60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 }
  },
  down: {
    initial: { opacity: 0, y: -60, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 }
  },
  left: {
    initial: { opacity: 0, x: -60, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 }
  },
  right: {
    initial: { opacity: 0, x: 60, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 }
  },
  fade: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 }
  }
}

export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(({
  children,
  id,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.8,
  threshold = 0.1,
  triggerOnce = true,
  viewport = { margin: "-50px", once: true }
}, ref) => {
  const localRef = useRef<HTMLElement>(null)
  const sectionRef = ref || localRef
  const isInView = useInView(sectionRef as any, { 
    threshold,
    ...viewport
  })

  const variants = animationVariants[direction]

  return (
    <motion.section
      ref={sectionRef}
      id={id}
      className={cn("relative", className)}
      initial={variants.initial}
      animate={isInView ? variants.animate : variants.initial}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smooth animation
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
    >
      {children}
    </motion.section>
  )
})

SectionWrapper.displayName = "SectionWrapper"