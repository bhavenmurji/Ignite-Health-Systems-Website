"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertTriangle, X, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  id?: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: () => void
  className?: string
}

export function NewsletterToast({
  id,
  title,
  description,
  type,
  duration = 5000,
  onClose,
  className
}: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Mail,
  }

  const colors = {
    success: {
      bg: "bg-green-500/20",
      border: "border-green-500/30",
      icon: "text-green-400",
      text: "text-green-100"
    },
    error: {
      bg: "bg-red-500/20",
      border: "border-red-500/30", 
      icon: "text-red-400",
      text: "text-red-100"
    },
    warning: {
      bg: "bg-yellow-500/20",
      border: "border-yellow-500/30",
      icon: "text-yellow-400", 
      text: "text-yellow-100"
    },
    info: {
      bg: "bg-fire-500/20",
      border: "border-fire-500/30",
      icon: "text-fire-400",
      text: "text-fire-100"
    }
  }

  const Icon = icons[type]
  const colorScheme = colors[type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "relative w-full max-w-md mx-auto p-4 rounded-xl",
        "backdrop-blur-xl border shadow-2xl",
        colorScheme.bg,
        colorScheme.border,
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", colorScheme.icon)} />
        
        <div className="flex-1 min-w-0">
          <p className={cn("font-semibold text-sm", colorScheme.text)}>
            {title}
          </p>
          {description && (
            <p className={cn("text-sm mt-1 opacity-90", colorScheme.text)}>
              {description}
            </p>
          )}
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "flex-shrink-0 p-1 rounded-full transition-colors",
              "hover:bg-white/10",
              colorScheme.text
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Progress bar for timed toasts */}
      {duration > 0 && (
        <motion.div
          className={cn("absolute bottom-0 left-0 h-1 rounded-b-xl", colorScheme.icon)}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
        />
      )}
    </motion.div>
  )
}

// Toast container component for managing multiple toasts
export function NewsletterToastContainer({
  toasts,
  onRemoveToast,
  className
}: {
  toasts: (ToastProps & { id: string })[]
  onRemoveToast: (id: string) => void
  className?: string
}) {
  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 space-y-3 pointer-events-none",
      "sm:top-6 sm:right-6",
      className
    )}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <NewsletterToast
              {...toast}
              onClose={() => onRemoveToast(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing newsletter-specific toasts
export function useNewsletterToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const success = (title: string, description?: string) => {
    addToast({ type: 'success', title, description })
  }

  const error = (title: string, description?: string) => {
    addToast({ type: 'error', title, description })
  }

  const warning = (title: string, description?: string) => {
    addToast({ type: 'warning', title, description })
  }

  const info = (title: string, description?: string) => {
    addToast({ type: 'info', title, description })
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

