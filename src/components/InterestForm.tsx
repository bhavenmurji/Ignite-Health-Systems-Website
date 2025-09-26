'use client'

import { useState } from 'react'
import LoadingSpinner from './LoadingSpinner'
import { submitFormData, getWebhookHealth } from '@/lib/webhookUtils'
import { mapFormToWebhookPayload, validateFormData } from '@/lib/formFieldMapper'

interface FormData {
  userType: string
  firstName: string
  lastName: string
  email: string
  medicalSpecialty?: string
  practiceModel?: string
  currentEMR?: string
  linkedinProfile?: string
  involvement?: string
  challenge?: string
  coFounderInterest?: boolean
}

export default function InterestForm() {
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    medicalSpecialty: '',
    practiceModel: '',
    currentEMR: '',
    linkedinProfile: '',
    involvement: '',
    challenge: '',
    coFounderInterest: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Add validation
      if (!formData.email || !formData.firstName || !formData.lastName) {
        throw new Error('Please fill in all required fields')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      // Check if userType specific required fields are filled
      if (formData.userType === 'physician' && (!formData.medicalSpecialty || !formData.practiceModel || !formData.involvement)) {
        throw new Error('Please fill in all required fields for physician registration')
      }

      if ((formData.userType === 'investor' || formData.userType === 'ai-specialist') && !formData.linkedinProfile) {
        throw new Error('LinkedIn profile or website is required for this role')
      }

      // Map form fields to webhook payload structure
      const webhookPayload = mapFormToWebhookPayload(formData)

      // Use enhanced webhook utilities for better reliability
      const result = await submitFormData(webhookPayload)

      if (result.success) {
        setSubmitMessage('✅ Thank you for joining the movement! We will be in touch soon.')

        // Reset form
        setFormData({
          userType: '',
          firstName: '',
          lastName: '',
          email: '',
          medicalSpecialty: '',
          practiceModel: '',
          currentEMR: '',
          linkedinProfile: '',
          involvement: '',
          challenge: '',
          coFounderInterest: false,
        })

        // Track successful submission (if analytics are configured)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'form_submit', {
            form_name: 'interest_form',
            user_type: formData.userType,
            success: true
          })
        }
      } else {
        throw new Error(result.message || 'Failed to submit form')
      }

    } catch (error) {
      console.error('Form submission error:', error)
      let errorMessage = 'There was an error submitting your information. Please try again.'

      if (error instanceof Error) {
        errorMessage = error.message

        // Provide more helpful error messages
        if (error.message.includes('queued for retry')) {
          errorMessage = 'Your submission is being processed. You can close this page - we will contact you if there are any issues.'
        } else if (error.message.includes('All webhook endpoints failed')) {
          errorMessage = 'Our servers are temporarily unavailable. Your information has been saved and we will process it shortly.'
        }
      }

      setSubmitMessage(`❌ ${errorMessage}`)

      // Track failed submission for analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_submit', {
          form_name: 'interest_form',
          user_type: formData.userType,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderPhysicianFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          Medical Specialty *
        </label>
        <input
          type="text"
          name="medicalSpecialty"
          value={formData.medicalSpecialty}
          onChange={handleChange}
          required
          placeholder="e.g., Family Medicine, Internal Medicine, Cardiology"
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          Practice Model *
        </label>
        <select
          name="practiceModel"
          value={formData.practiceModel}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        >
          <option value="">Select Practice Model</option>
          <option value="Private Practice">Private Practice</option>
          <option value="Direct Primary Care">Direct Primary Care</option>
          <option value="Hospital">Hospital</option>
          <option value="Academia">Academia</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          Current EMR System (Optional)
        </label>
        <input
          type="text"
          name="currentEMR"
          value={formData.currentEMR}
          onChange={handleChange}
          placeholder="e.g., Epic, Cerner, Athenahealth"
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          LinkedIn Profile (Optional)
        </label>
        <input
          type="url"
          name="linkedinProfile"
          value={formData.linkedinProfile}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourprofile"
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          How would you like to be involved? *
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="involvement"
              value="innovation-council"
              checked={formData.involvement === 'innovation-council'}
              onChange={handleChange}
              className="mr-3 w-4 h-4 text-[#00A8E8] border-gray-600 focus:ring-[#00A8E8]"
            />
            <span className="text-[#F5F5F5]">Join the Innovation Council: Actively collaborate on product development, shape the platform, and receive priority access.</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="involvement"
              value="general-waitlist"
              checked={formData.involvement === 'general-waitlist'}
              onChange={handleChange}
              className="mr-3 w-4 h-4 text-[#00A8E8] border-gray-600 focus:ring-[#00A8E8]"
            />
            <span className="text-[#F5F5F5]">Join the General Waitlist: Stay informed about our progress, get future beta testing opportunities, and be notified at launch.</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          Help us build the right solution: What is your biggest technological challenge in healthcare today? (Optional)
        </label>
        <textarea
          name="challenge"
          value={formData.challenge}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about the technology challenges you face in your daily practice..."
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>
    </>
  )

  const renderInvestorFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          LinkedIn Profile or Personal Website *
        </label>
        <input
          type="url"
          name="linkedinProfile"
          value={formData.linkedinProfile}
          onChange={handleChange}
          required
          placeholder="https://linkedin.com/in/yourprofile or https://yourwebsite.com"
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>
    </>
  )

  const renderAISpecialistFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
          LinkedIn Profile or Personal Website *
        </label>
        <input
          type="url"
          name="linkedinProfile"
          value={formData.linkedinProfile}
          onChange={handleChange}
          required
          placeholder="https://linkedin.com/in/yourprofile or https://yourwebsite.com"
          className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="coFounderInterest"
            checked={formData.coFounderInterest}
            onChange={handleChange}
            className="mr-3 w-4 h-4 text-[#00A8E8] border-gray-600 focus:ring-[#00A8E8] rounded"
          />
          <span className="text-[#F5F5F5]">I am interested in exploring a potential co-founder role.</span>
        </label>
      </div>
    </>
  )

  return (
    <section id="join" className="bg-[#2a363f] py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F5F5] mb-4">
            Join Us in Shaping the Future of Medicine
          </h2>
          <p className="text-xl text-gray-300">
            Be the first to access our platform, provide critical feedback, and help us build a tool that truly serves you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#36454F] p-8 rounded-lg shadow-lg space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#F5F5F5] mb-2">
              I am a... *
            </label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#2a363f] border border-gray-600 rounded-lg text-[#F5F5F5] focus:ring-2 focus:ring-[#00A8E8] focus:border-transparent"
            >
              <option value="">Select your role</option>
              <option value="physician">Physician</option>
              <option value="investor">Potential Investor</option>
              <option value="ai-specialist">AI/ML Specialist</option>
            </select>
          </div>

          {formData.userType === 'physician' && (
            <>
              <div className="bg-[#2a363f] p-6 rounded-lg border-l-4 border-[#00A8E8]">
                <h3 className="text-lg font-semibold text-[#00A8E8] mb-2">Welcome, Doctor!</h3>
                <p className="text-gray-300">Help us understand your practice.</p>
              </div>
              {renderPhysicianFields()}
            </>
          )}

          {formData.userType === 'investor' && (
            <>
              <div className="bg-[#2a363f] p-6 rounded-lg border-l-4 border-[#00A8E8]">
                <h3 className="text-lg font-semibold text-[#00A8E8] mb-2">Welcome!</h3>
                <p className="text-gray-300">We're excited to connect.</p>
              </div>
              {renderInvestorFields()}
            </>
          )}

          {formData.userType === 'ai-specialist' && (
            <>
              <div className="bg-[#2a363f] p-6 rounded-lg border-l-4 border-[#00A8E8]">
                <h3 className="text-lg font-semibold text-[#00A8E8] mb-2">Welcome!</h3>
                <p className="text-gray-300">We're looking for brilliant minds to join the mission.</p>
              </div>
              {renderAISpecialistFields()}
            </>
          )}

          {formData.userType && (
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00A8E8] text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#36454F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" color="white" />
                    <span>Joining the Movement...</span>
                  </>
                ) : (
                  'Join the Movement'
                )}
              </button>
            </div>
          )}

          {submitMessage && (
            <div className={`p-4 rounded-lg ${submitMessage.includes('error') ? 'bg-red-900 text-red-100' : 'bg-green-900 text-green-100'}`}>
              {submitMessage}
            </div>
          )}

          {formData.userType && (
            <p className="text-sm text-gray-400 text-center">
              By submitting, you agree to our Terms of Service and Privacy Policy. We'll only use your information to contact you about Ignite Health Systems.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}