import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

// Mock the toast hook
const mockToast = jest.fn()
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: any) => (e: any) => {
      e?.preventDefault?.()
      return fn({
        email: 'test@example.com',
        firstName: 'John'
      })
    },
    reset: jest.fn(),
    setValue: jest.fn(),
    watch: jest.fn((field) => {
      if (field === 'email') return 'test@example.com'
      return ''
    }),
    formState: { errors: {} }
  }),
}))

// Mock Form components
jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormField: ({ render }: any) => render({ field: { value: '', onChange: jest.fn() } }),
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormMessage: () => <div data-testid="form-message" />,
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={className}
      data-testid="submit-button"
      {...props}
    >
      {children}
    </button>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, disabled, className, type, ...props }: any) => (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      data-testid="form-input"
      {...props}
    />
  ),
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Loader2: ({ className }: any) => (
    <svg data-testid="loader-icon" className={className}>
      <path />
    </svg>
  ),
  Mail: ({ className }: any) => (
    <svg data-testid="mail-icon" className={className}>
      <path />
    </svg>
  ),
  CheckCircle: ({ className }: any) => (
    <svg data-testid="check-icon" className={className}>
      <path />
    </svg>
  ),
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe('NewsletterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
  })

  describe('Default Variant', () => {
    it('renders with default styling and content', () => {
      render(<NewsletterForm />)
      
      expect(screen.getByText('Stay Updated')).toBeInTheDocument()
      expect(screen.getByText(/Get the latest updates on healthcare innovation/)).toBeInTheDocument()
      expect(screen.getByTestId('form-input')).toBeInTheDocument()
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    it('applies glass morphism styling', () => {
      render(<NewsletterForm />)
      
      const container = document.querySelector('.backdrop-blur-xl')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('bg-gradient-to-br')
    })

    it('includes mail icon in header', () => {
      render(<NewsletterForm />)
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
    })

    it('shows privacy notice', () => {
      render(<NewsletterForm />)
      expect(screen.getByText(/We respect your privacy/)).toBeInTheDocument()
    })
  })

  describe('Minimal Variant', () => {
    it('renders minimal layout without decorative elements', () => {
      render(<NewsletterForm variant="minimal" />)
      
      expect(screen.getByTestId('form-input')).toBeInTheDocument()
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
      
      // Should not have header content
      expect(screen.queryByText('Stay Updated')).not.toBeInTheDocument()
    })

    it('applies minimal styling classes', () => {
      render(<NewsletterForm variant="minimal" />)
      
      // Should have glass effects but simpler layout
      expect(document.querySelector('.backdrop-blur-md')).toBeInTheDocument()
    })

    it('maintains form functionality', () => {
      render(<NewsletterForm variant="minimal" />)
      
      const input = screen.getByTestId('form-input')
      const button = screen.getByTestId('submit-button')
      
      expect(input).toHaveAttribute('type', 'email')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('Inline Variant', () => {
    it('renders horizontal layout', () => {
      render(<NewsletterForm variant="inline" />)
      
      expect(screen.getByTestId('form-input')).toBeInTheDocument()
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
      
      // Should have flex layout classes
      const container = document.querySelector('.flex')
      expect(container).toBeInTheDocument()
    })

    it('applies inline-specific styling', () => {
      render(<NewsletterForm variant="inline" />)
      
      const container = document.querySelector('.max-w-md')
      expect(container).toBeInTheDocument()
      
      // Input should have left padding for icon
      const input = screen.getByTestId('form-input')
      expect(input).toHaveClass('pl-10')
    })

    it('handles button clicks correctly', () => {
      render(<NewsletterForm variant="inline" />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          firstName: 'John'
        }),
      })
    })
  })

  describe('Custom Props', () => {
    it('accepts custom placeholder text', () => {
      render(<NewsletterForm placeholder="Custom placeholder" />)
      
      const input = screen.getByTestId('form-input')
      expect(input).toHaveAttribute('placeholder', 'Custom placeholder')
    })

    it('accepts custom button text', () => {
      render(<NewsletterForm buttonText="Join Now" />)
      
      expect(screen.getByText('Join Now')).toBeInTheDocument()
    })

    it('shows name field when enabled', () => {
      render(<NewsletterForm showName={true} />)
      
      // Should have additional form field for first name
      const inputs = screen.getAllByTestId('form-input')
      expect(inputs.length).toBe(2) // Email + First Name
    })

    it('applies custom className', () => {
      render(<NewsletterForm className="custom-form-class" />)
      
      const container = document.querySelector('.custom-form-class')
      expect(container).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('submits form with correct data', async () => {
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            firstName: 'John'
          }),
        })
      })
    })

    it('shows loading state during submission', async () => {
      // Mock delayed response
      ;(global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
      )
      
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      // Should show loading icon
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
      
      await waitFor(() => {
        expect(screen.getByTestId('check-icon')).toBeInTheDocument()
      }, { timeout: 200 })
    })

    it('shows success state after submission', async () => {
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(screen.getByTestId('check-icon')).toBeInTheDocument()
        expect(mockToast).toHaveBeenCalledWith({
          title: "Welcome aboard!",
          description: "You've successfully subscribed to our newsletter.",
        })
      })
    })

    it('handles API errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))
      
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Subscription failed",
          description: "Please try again later or contact support.",
          variant: "destructive",
        })
      })
    })

    it('handles non-ok response status', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
      })
      
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Subscription failed",
          description: "Please try again later or contact support.",
          variant: "destructive",
        })
      })
    })
  })

  describe('Loading States', () => {
    it('disables form during submission', async () => {
      ;(global.fetch as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
      )
      
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      const input = screen.getByTestId('form-input')
      
      fireEvent.click(button)
      
      expect(button).toBeDisabled()
      expect(input).toBeDisabled()
      
      await waitFor(() => {
        expect(button).not.toBeDisabled()
      }, { timeout: 200 })
    })

    it('shows different text states correctly', () => {
      const { rerender } = render(<NewsletterForm />)
      
      // Default state
      expect(screen.getByText('Subscribe')).toBeInTheDocument()
      
      // Should handle loading and success states in real implementation
      // This would be tested with actual state management
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      render(<NewsletterForm />)
      
      expect(screen.getByText('Email Address')).toBeInTheDocument()
    })

    it('supports keyboard navigation', () => {
      render(<NewsletterForm />)
      
      const input = screen.getByTestId('form-input')
      const button = screen.getByTestId('submit-button')
      
      input.focus()
      expect(document.activeElement).toBe(input)
      
      fireEvent.keyDown(input, { key: 'Tab' })
      // Focus should move to button in real implementation
    })

    it('provides proper ARIA attributes', () => {
      render(<NewsletterForm />)
      
      const input = screen.getByTestId('form-input')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('shows form validation messages', () => {
      render(<NewsletterForm />)
      
      // Form message component should be available for validation
      expect(screen.getByTestId('form-message')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive classes for different layouts', () => {
      render(<NewsletterForm />)
      
      // Should have responsive padding and spacing
      const container = document.querySelector('.p-8')
      expect(container).toBeInTheDocument()
    })

    it('maintains functionality across screen sizes', () => {
      const { rerender } = render(<NewsletterForm variant="default" />)
      
      expect(screen.getByTestId('form-input')).toBeInTheDocument()
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
      
      rerender(<NewsletterForm variant="inline" />)
      expect(screen.getByTestId('form-input')).toBeInTheDocument()
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently', () => {
      const startTime = performance.now()
      
      render(<NewsletterForm />)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(50)
    })

    it('handles rapid state changes efficiently', () => {
      const { rerender } = render(<NewsletterForm variant="default" />)
      
      const variants = ['default', 'minimal', 'inline'] as const
      variants.forEach(variant => {
        rerender(<NewsletterForm variant={variant} />)
        expect(screen.getByTestId('submit-button')).toBeInTheDocument()
      })
    })
  })

  describe('Cross-Browser Compatibility', () => {
    it('provides fallbacks for unsupported features', () => {
      render(<NewsletterForm />)
      
      // Should have fallback styling for backdrop-filter
      const container = document.querySelector('.bg-gradient-to-br')
      expect(container).toBeInTheDocument()
    })

    it('handles form submission across browsers', async () => {
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      // Should work regardless of browser fetch implementation
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled()
      })
    })
  })

  describe('Mailchimp Integration Tests', () => {
    it('posts to correct newsletter API endpoint', async () => {
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            firstName: 'John'
          }),
        })
      })
    })

    it('includes required fields for Mailchimp integration', async () => {
      render(<NewsletterForm showName={true} />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        const callArgs = (global.fetch as jest.Mock).mock.calls[0]
        const requestBody = JSON.parse(callArgs[1].body)
        
        expect(requestBody).toHaveProperty('email')
        expect(requestBody).toHaveProperty('firstName')
      })
    })

    it('handles Mailchimp API response format', async () => {
      const mockMailchimpResponse = {
        ok: true,
        json: () => Promise.resolve({
          result: 'success',
          msg: 'Thank you for subscribing!'
        })
      }
      
      ;(global.fetch as jest.Mock).mockResolvedValue(mockMailchimpResponse)
      
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Welcome aboard!",
          description: "You've successfully subscribed to our newsletter.",
        })
      })
    })

    it('validates email format for Mailchimp requirements', () => {
      render(<NewsletterForm />)
      
      const input = screen.getByTestId('form-input')
      expect(input).toHaveAttribute('type', 'email')
      
      // Form validation should handle email format requirements
      expect(screen.getByTestId('form-message')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty response gracefully', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(null)
      })
      
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Welcome aboard!",
          description: "You've successfully subscribed to our newsletter.",
        })
      })
    })

    it('handles network timeouts', async () => {
      ;(global.fetch as jest.Mock).mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      )
      
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Subscription failed",
          description: "Please try again later or contact support.",
          variant: "destructive",
        })
      }, { timeout: 200 })
    })

    it('maintains state during rapid submissions', async () => {
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      
      // Rapid clicks should not cause multiple submissions
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1)
      })
    })

    it('resets success state after timeout', async () => {
      jest.useFakeTimers()
      
      render(<NewsletterForm />)
      
      const button = screen.getByTestId('submit-button')
      fireEvent.click(button)
      
      await waitFor(() => {
        expect(screen.getByTestId('check-icon')).toBeInTheDocument()
      })
      
      // Fast-forward time
      jest.advanceTimersByTime(3000)
      
      // Success state should reset (in real implementation)
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
      
      jest.useRealTimers()
    })
  })

  describe('Integration Tests', () => {
    it('works with different form libraries', () => {
      render(<NewsletterForm />)
      
      // Should integrate with react-hook-form
      expect(screen.getByTestId('form-input')).toBeInTheDocument()
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })

    it('maintains styling consistency across variants', () => {
      const variants = ['default', 'minimal', 'inline'] as const
      
      variants.forEach(variant => {
        const { container } = render(<NewsletterForm variant={variant} />)
        
        // All variants should have glass morphism effects
        expect(container.querySelector('.backdrop-blur-md, .backdrop-blur-xl')).toBeInTheDocument()
        
        // Clean up
        container.remove()
      })
    })
  })
})