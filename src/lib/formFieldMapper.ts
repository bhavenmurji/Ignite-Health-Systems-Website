// Field mapping utility to ensure form data matches n8n/Mailchimp expectations
// Maps form fields to the expected webhook payload structure

export interface FormData {
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

export interface WebhookPayload {
  userType: string
  firstName: string
  lastName: string
  email: string
  specialty?: string
  practiceModel?: string
  emrSystem?: string
  linkedin?: string
  involvement?: string
  challenge?: string
  cofounder?: boolean
  timestamp?: string
  source?: string
  formType?: string
  userAgent?: string
  url?: string
}

/**
 * Maps form data from the InterestForm component to the webhook payload
 * expected by n8n and Mailchimp
 */
export function mapFormToWebhookPayload(formData: FormData): WebhookPayload {
  // Map userType values
  let mappedUserType = formData.userType
  if (formData.userType === 'ai-specialist') {
    mappedUserType = 'specialist' // Normalize for Mailchimp
  }

  return {
    // Basic fields (same names)
    userType: mappedUserType,
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,

    // Renamed fields for consistency with n8n/Mailchimp
    specialty: formData.medicalSpecialty || '',
    practiceModel: formData.practiceModel || '',
    emrSystem: formData.currentEMR || '',
    linkedin: formData.linkedinProfile || '',
    involvement: formData.involvement || '',
    challenge: formData.challenge || '',
    cofounder: formData.coFounderInterest || false,

    // Additional metadata
    timestamp: new Date().toISOString(),
    source: 'ignite-health-systems-website',
    formType: 'interest-form',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    url: typeof window !== 'undefined' ? window.location.href : ''
  }
}

/**
 * Validates that required fields are present based on user type
 */
export function validateFormData(formData: FormData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Universal required fields
  if (!formData.firstName) errors.push('First name is required')
  if (!formData.lastName) errors.push('Last name is required')
  if (!formData.email) errors.push('Email is required')
  if (!formData.userType) errors.push('Please select your role')

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (formData.email && !emailRegex.test(formData.email)) {
    errors.push('Please enter a valid email address')
  }

  // User type specific validation
  if (formData.userType === 'physician') {
    if (!formData.medicalSpecialty) errors.push('Medical specialty is required')
    if (!formData.practiceModel) errors.push('Practice model is required')
    if (!formData.involvement) errors.push('Please select how you would like to be involved')
  }

  if (formData.userType === 'investor' || formData.userType === 'ai-specialist') {
    if (!formData.linkedinProfile) {
      errors.push('LinkedIn profile or website is required')
    } else if (!formData.linkedinProfile.startsWith('http')) {
      errors.push('Please enter a valid URL starting with http:// or https://')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}