"use client"

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean
  skip?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
    skip = false,
  } = options

  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (skip || !elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry)
        
        if (entry.isIntersecting && triggerOnce && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    )

    observer.observe(elementRef.current)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, triggerOnce, hasTriggered, skip])

  const isIntersecting = entry?.isIntersecting || false
  const shouldAnimate = triggerOnce ? (isIntersecting || hasTriggered) : isIntersecting

  return {
    ref: elementRef,
    isIntersecting,
    shouldAnimate,
    entry,
  }
}