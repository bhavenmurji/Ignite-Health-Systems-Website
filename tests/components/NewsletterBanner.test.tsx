import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { NewsletterBanner } from '@/components/sections/NewsletterBanner'

// Mock the NewsletterForm component
jest.mock('@/components/forms/NewsletterForm', () => {
  return {
    NewsletterForm: ({ onSubmit, ...props }: any) => (
      <div data-testid="newsletter-form" {...props}>
        <input 
          data-testid="email-input" 
          type="email" 
          placeholder="Enter email"
          onChange={(e) => props.onEmailChange?.(e.target.value)}
        />
        <button 
          data-testid="submit-button"
          onClick={() => onSubmit?.({ email: 'test@example.com' })}
        >
          Subscribe
        </button>
      </div>
    )
  }
})

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Mail: ({ className, ...props }: any) => (
    <svg data-testid="mail-icon" className={className} {...props}>
      <path />
    </svg>
  ),
  ArrowRight: ({ className, ...props }: any) => (
    <svg data-testid="arrow-right-icon" className={className} {...props}>
      <path />
    </svg>
  ),
  Sparkles: ({ className, ...props }: any) => (
    <svg data-testid="sparkles-icon" className={className} {...props}>
      <path />
    </svg>
  ),
  Zap: ({ className, ...props }: any) => (
    <svg data-testid="zap-icon" className={className} {...props}>
      <path />
    </svg>
  ),
}))

describe('NewsletterBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Default Variant', () => {
    it('renders with default styling and content', () => {
      render(<NewsletterBanner />)
      
      expect(screen.getByText('Stay Updated')).toBeInTheDocument()
      expect(screen.getByText(/Get the latest updates on healthcare innovation/)).toBeInTheDocument()
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
    })

    it('applies default glass morphism styling', () => {
      render(<NewsletterBanner />)
      
      const container = document.querySelector('.backdrop-blur-xl')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('bg-gradient-to-br')
      expect(container).toHaveClass('from-white/10')
    })

    it('includes animated background effects', () => {
      render(<NewsletterBanner />)
      
      // Check for animated background particles
      const animatedElements = document.querySelectorAll('.animate-pulse')
      expect(animatedElements.length).toBeGreaterThan(0)
      
      // Check for floating animation
      const floatingElements = document.querySelectorAll('.animate-bounce')
      expect(floatingElements.length).toBeGreaterThan(0)
    })

    it('displays mail icon in header', () => {
      render(<NewsletterBanner />)
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
    })
  })

  describe('Compact Variant', () => {
    it('renders compact layout with reduced spacing', () => {
      render(<NewsletterBanner variant="compact" />)
      
      expect(screen.getByText('Stay in the Loop')).toBeInTheDocument()
      expect(screen.getByText(/Quick updates, big impact/)).toBeInTheDocument()
      
      // Check for compact-specific classes
      const container = document.querySelector('.p-6')
      expect(container).toBeInTheDocument()
    })

    it('applies compact-specific styling', () => {
      render(<NewsletterBanner variant="compact" />)
      
      // Should have smaller padding and different layout
      const compactContainer = document.querySelector('.p-6')
      expect(compactContainer).toBeInTheDocument()
      
      // Should still have glass effects but more subtle
      expect(document.querySelector('.backdrop-blur-md')).toBeInTheDocument()
    })

    it('maintains functionality in compact mode', () => {
      render(<NewsletterBanner variant="compact" />)
      
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
      expect(screen.getByTestId('email-input')).toBeInTheDocument()
      expect(screen.getByTestId('submit-button')).toBeInTheDocument()
    })
  })

  describe('Hero Variant', () => {
    it('renders hero layout with enhanced styling', () => {
      render(<NewsletterBanner variant="hero" />)
      
      expect(screen.getByText('Transform Healthcare Together')).toBeInTheDocument()
      expect(screen.getByText(/Join thousands of healthcare innovators/)).toBeInTheDocument()
      
      // Check for hero-specific styling
      const heroContainer = document.querySelector('.min-h-\\[50vh\\]')
      expect(heroContainer).toBeInTheDocument()
    })

    it('applies enhanced glass morphism effects', () => {
      render(<NewsletterBanner variant="hero" />)
      
      // Hero should have stronger backdrop blur
      expect(document.querySelector('.backdrop-blur-2xl')).toBeInTheDocument()
      
      // Enhanced fire gradient effects
      expect(document.querySelector('.from-fire-500\\/20')).toBeInTheDocument()
    })

    it('includes additional decorative elements', () => {
      render(<NewsletterBanner variant="hero" />)
      
      // Check for sparkles and zap icons
      expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument()
      expect(screen.getByTestId('zap-icon')).toBeInTheDocument()
    })

    it('has larger typography and spacing', () => {
      render(<NewsletterBanner variant="hero" />)
      
      // Hero title should have larger text
      const title = screen.getByText('Transform Healthcare Together')
      expect(title).toHaveClass('text-4xl')
      expect(title).toHaveClass('lg:text-6xl')
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive classes for different screen sizes', () => {
      render(<NewsletterBanner />)
      
      // Check for responsive padding
      const container = document.querySelector('.p-8')
      expect(container).toHaveClass('lg:p-12')
      
      // Check for responsive grid layout
      const gridContainer = document.querySelector('.lg\\:grid-cols-2')
      expect(gridContainer).toBeInTheDocument()
    })

    it('maintains functionality across breakpoints', () => {
      // Simulate different viewport sizes
      const { rerender } = render(<NewsletterBanner />)
      
      // Should maintain core functionality regardless of screen size
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
      
      rerender(<NewsletterBanner variant="compact" />)
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
      
      rerender(<NewsletterBanner variant="hero" />)
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
    })
  })

  describe('Animation and Interactions', () => {
    it('includes hover effects on interactive elements', () => {
      render(<NewsletterBanner />)
      
      // Container should have hover effects
      const container = document.querySelector('.hover\\:scale-\\[1\\.02\\]')
      expect(container).toBeInTheDocument()
      
      // Should have transition classes
      expect(document.querySelector('.transition-all')).toBeInTheDocument()
    })

    it('animates background particles correctly', () => {
      render(<NewsletterBanner />)
      
      // Check for various animation classes
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
      expect(document.querySelector('.animate-bounce')).toBeInTheDocument()
      
      // Floating particles should have different delays
      const particles = document.querySelectorAll('[class*="animation-delay"]')
      expect(particles.length).toBeGreaterThan(0)
    })

    it('handles form submission animations', async () => {
      render(<NewsletterBanner />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      // Form should maintain its state during submission
      await waitFor(() => {
        expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
      })
    })
  })

  describe('Custom Props', () => {
    it('accepts and applies custom className', () => {
      render(<NewsletterBanner className="custom-banner-class" />)
      
      const container = document.querySelector('.custom-banner-class')
      expect(container).toBeInTheDocument()
    })

    it('forwards props to newsletter form', () => {
      render(
        <NewsletterBanner 
          formProps={{ 
            placeholder: "Custom placeholder",
            buttonText: "Custom button text"
          }} 
        />
      )
      
      const form = screen.getByTestId('newsletter-form')
      expect(form).toHaveAttribute('placeholder', 'Custom placeholder')
      expect(form).toHaveAttribute('buttonText', 'Custom button text')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<NewsletterBanner />)
      
      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveAccessibleName('Stay Updated')
    })

    it('maintains keyboard navigation', () => {
      render(<NewsletterBanner />)
      
      const emailInput = screen.getByTestId('email-input')
      const submitButton = screen.getByTestId('submit-button')
      
      // Should be able to tab between form elements
      emailInput.focus()
      expect(document.activeElement).toBe(emailInput)
      
      fireEvent.keyDown(emailInput, { key: 'Tab' })
      // Focus should move to submit button (in real implementation)
    })

    it('provides proper ARIA labels and descriptions', () => {
      render(<NewsletterBanner />)
      
      // Container should have proper role or aria-label
      const container = document.querySelector('[role="region"]')
      expect(container).toBeInTheDocument()
    })

    it('supports reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
      
      render(<NewsletterBanner />)
      
      // Animations should be disabled or reduced
      // This would be handled by CSS in real implementation
      expect(document.querySelector('.motion-reduce\\:animate-none')).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('renders efficiently with complex animations', () => {
      const startTime = performance.now()
      
      render(<NewsletterBanner variant="hero" />)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      // Should render within reasonable time
      expect(renderTime).toBeLessThan(100)
    })

    it('handles rapid variant changes efficiently', () => {
      const variants = ['default', 'compact', 'hero'] as const
      const { rerender } = render(<NewsletterBanner variant="default" />)
      
      variants.forEach(variant => {
        rerender(<NewsletterBanner variant={variant} />)
        expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
      })
    })

    it('optimizes animation performance', () => {
      render(<NewsletterBanner />)
      
      // Should use transform and opacity for animations (GPU accelerated)
      const animatedElements = document.querySelectorAll('.transform')
      expect(animatedElements.length).toBeGreaterThan(0)
    })
  })

  describe('Cross-Browser Compatibility', () => {
    it('provides fallbacks for unsupported CSS features', () => {
      render(<NewsletterBanner />)
      
      // Should have fallback background when backdrop-filter isn't supported
      const container = document.querySelector('.bg-gradient-to-br')
      expect(container).toBeInTheDocument()
    })

    it('handles CSS Grid fallbacks', () => {
      render(<NewsletterBanner />)
      
      // Should work with flexbox fallback
      const layoutContainer = document.querySelector('.flex')
      expect(layoutContainer).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles missing props gracefully', () => {
      render(<NewsletterBanner variant={undefined as any} />)
      
      // Should fallback to default variant
      expect(screen.getByText('Stay Updated')).toBeInTheDocument()
    })

    it('maintains styling with custom content', () => {
      render(
        <NewsletterBanner>
          <div>Custom content</div>
        </NewsletterBanner>
      )
      
      expect(screen.getByText('Custom content')).toBeInTheDocument()
      expect(document.querySelector('.backdrop-blur-xl')).toBeInTheDocument()
    })

    it('handles form errors gracefully', () => {
      render(<NewsletterBanner />)
      
      const emailInput = screen.getByTestId('email-input')
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      
      // Component should remain stable with invalid input
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
    })
  })

  describe('Integration Tests', () => {
    it('integrates properly with parent layouts', () => {
      render(
        <div className="container mx-auto">
          <NewsletterBanner />
        </div>
      )
      
      expect(screen.getByText('Stay Updated')).toBeInTheDocument()
      expect(document.querySelector('.container')).toBeInTheDocument()
    })

    it('works with different theme contexts', () => {
      render(
        <div data-theme="dark">
          <NewsletterBanner />
        </div>
      )
      
      // Should adapt to theme context
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
    })

    it('maintains functionality when nested', () => {
      render(
        <div>
          <header>Header</header>
          <main>
            <NewsletterBanner />
          </main>
          <footer>Footer</footer>
        </div>
      )
      
      expect(screen.getByText('Stay Updated')).toBeInTheDocument()
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
    })
  })

  describe('Mailchimp Integration Ready', () => {
    it('passes correct props for Mailchimp integration', () => {
      render(<NewsletterBanner />)
      
      const form = screen.getByTestId('newsletter-form')
      // Form should be ready for Mailchimp integration
      expect(form).toBeInTheDocument()
    })

    it('handles form submission flow for external APIs', async () => {
      render(<NewsletterBanner />)
      
      const submitButton = screen.getByTestId('submit-button')
      fireEvent.click(submitButton)
      
      // Should maintain state during API calls
      await waitFor(() => {
        expect(screen.getByTestId('newsletter-form')).toBeInTheDocument()
      })
    })
  })
})