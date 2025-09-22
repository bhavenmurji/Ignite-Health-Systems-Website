import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}) {
  const elementRef = useRef<Element | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Don't re-observe if frozen and already been visible
    if (freezeOnceVisible && hasBeenVisible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true)
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [root, rootMargin, threshold, freezeOnceVisible, hasBeenVisible])

  return {
    elementRef,
    isIntersecting: freezeOnceVisible ? hasBeenVisible : isIntersecting,
    hasBeenVisible,
  }
}