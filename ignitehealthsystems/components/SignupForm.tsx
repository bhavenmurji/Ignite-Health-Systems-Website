'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FormData {
  name: string
  email: string
  role: string
  note: string
}

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: '',
    note: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const roles = [
    { value: '', label: 'Select your role...' },
    { value: 'physician', label: 'Physician' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'other', label: 'Other' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error('Name is required')
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required')
      }
      if (!formData.role) {
        throw new Error('Please select your role')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      setSuccess(true)
      
      // Redirect to thank you page after a brief success message
      setTimeout(() => {
        router.push('/thank-you')
      }, 1500)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="card text-center animate-fade-in">
        <div className="w-16 h-16 bg-medical-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-medical-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">
          We've received your information and will be in touch soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card animate-fade-in">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Transform Your Practice Today
        </h3>
        <p className="text-gray-600">
          Get started with a personalized demo and see how Ignite can save you hours every day.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Dr. Jane Smith"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="jane.smith@hospital.com"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Role Field */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Your Role *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-input"
            required
            disabled={isSubmitting}
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Note Field */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Tell us about your biggest workflow challenge (optional)
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows={3}
            className="form-input"
            placeholder="e.g., Documentation takes too long, EHR system is clunky, need better patient communication tools..."
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting Started...
            </>
          ) : (
            <>
              Get My Free Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </button>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to our{' '}
          <a href="#" className="text-medical-blue-600 hover:text-medical-blue-700">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="#" className="text-medical-blue-600 hover:text-medical-blue-700">
            Terms of Service
          </a>
          . We respect your privacy and will never share your information.
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-medical-green-500" />
            HIPAA Compliant
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-medical-green-500" />
            SOC 2 Certified
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-medical-green-500" />
            No Spam Guarantee
          </div>
        </div>
      </div>
    </form>
  )
}