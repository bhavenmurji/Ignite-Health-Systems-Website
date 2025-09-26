'use client'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'blue' | 'white' | 'gray'
  text?: string
}

export default function LoadingSpinner({ size = 'medium', color = 'blue', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const colorClasses = {
    blue: 'border-[#00A8E8]',
    white: 'border-white',
    gray: 'border-gray-400'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-sm text-gray-300 animate-pulse">{text}</span>
      )}
    </div>
  )
}