"use client"

import React, { useState, useEffect } from "react"

export function ResponsiveTest() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function updateSize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
      
      const container = document.getElementById('test-container')
      if (container) {
        setContainerSize({
          width: container.offsetWidth,
          height: container.offsetHeight
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const isOverflowing = containerSize.width > windowSize.width

  return (
    <div 
      id="test-container"
      className="fixed top-4 left-4 z-[9999] bg-black/80 text-white p-4 rounded-lg text-sm font-mono max-w-xs"
    >
      <div className="space-y-2">
        <div>Window: {windowSize.width}x{windowSize.height}</div>
        <div>Container: {containerSize.width}x{containerSize.height}</div>
        <div className={`font-bold ${isOverflowing ? 'text-red-400' : 'text-green-400'}`}>
          {isOverflowing ? '❌ OVERFLOW DETECTED' : '✅ Responsive OK'}
        </div>
        <div className="text-xs opacity-75">
          Device Ratio: {typeof window !== 'undefined' ? window.devicePixelRatio : 'N/A'}
        </div>
        <div className="text-xs opacity-75">
          Viewport: {typeof document !== 'undefined' ? 
            `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}` : 
            'N/A'
          }
        </div>
      </div>
    </div>
  )
}