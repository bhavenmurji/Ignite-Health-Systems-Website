import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { 
  GlassMorphism, 
  GlassCard, 
  GlassFireCard, 
  GlassModal, 
  GlassButton,
  GlassContainer,
  GlassEffect 
} from '@/components/ui/GlassMorphism'

// Mock Next.js router for navigation tests
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('GlassMorphism Core Component', () => {
  const defaultProps = {
    children: <span>Test Content</span>,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('renders children content correctly', () => {
      render(<GlassMorphism {...defaultProps} />)
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies default light variant styling', () => {
      render(<GlassMorphism {...defaultProps} />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('backdrop-blur-md')
      expect(container).toHaveClass('bg-white/10')
    })

    it('applies custom className correctly', () => {
      render(<GlassMorphism {...defaultProps} className="custom-glass" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('custom-glass')
    })
  })

  describe('Variant Styling', () => {
    it('applies light variant classes correctly', () => {
      render(<GlassMorphism {...defaultProps} variant="light" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('bg-white/10')
      expect(container).toHaveClass('border-white/10')
    })

    it('applies dark variant classes correctly', () => {
      render(<GlassMorphism {...defaultProps} variant="dark" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('bg-[#1a1a1a]/20')
      expect(container).toHaveClass('border-white/5')
    })

    it('applies fire variant classes correctly', () => {
      render(<GlassMorphism {...defaultProps} variant="fire" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('bg-gradient-to-br')
      expect(container).toHaveClass('from-fire-500/10')
    })

    it('applies subtle variant classes correctly', () => {
      render(<GlassMorphism {...defaultProps} variant="subtle" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('bg-white/5')
      expect(container).toHaveClass('backdrop-blur-sm')
    })
  })

  describe('Intensity Levels', () => {
    it('applies low intensity backdrop blur', () => {
      render(<GlassMorphism {...defaultProps} intensity="low" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('backdrop-blur-sm')
    })

    it('applies medium intensity backdrop blur', () => {
      render(<GlassMorphism {...defaultProps} intensity="medium" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('backdrop-blur-md')
    })

    it('applies high intensity backdrop blur', () => {
      render(<GlassMorphism {...defaultProps} intensity="high" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('backdrop-blur-lg')
    })

    it('applies ultra intensity backdrop blur', () => {
      render(<GlassMorphism {...defaultProps} intensity="ultra" />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('backdrop-blur-xl')
    })
  })

  describe('Border Radius Options', () => {
    it('applies correct border radius for different sizes', () => {
      const { rerender } = render(<GlassMorphism {...defaultProps} rounded="sm" />)
      let container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('rounded-sm')

      rerender(<GlassMorphism {...defaultProps} rounded="lg" />)
      container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('rounded-lg')

      rerender(<GlassMorphism {...defaultProps} rounded="full" />)
      container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('rounded-full')
    })
  })

  describe('Animation Support', () => {
    it('applies hover animations when enabled', () => {
      render(<GlassMorphism {...defaultProps} hover={true} />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('hover:scale-105')
      expect(container).toHaveClass('transition-all')
    })

    it('applies pulse animation when enabled', () => {
      render(<GlassMorphism {...defaultProps} pulse={true} />)
      const container = screen.getByText('Test Content').parentElement
      expect(container).toHaveClass('animate-pulse')
    })
  })
})

describe('GlassCard Component', () => {
  const mockProps = {
    title: 'Test Card Title',
    children: <p>Card content here</p>,
  }

  it('renders card with title and content', () => {
    render(<GlassCard {...mockProps} />)
    expect(screen.getByText('Test Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card content here')).toBeInTheDocument()
  })

  it('applies card-specific styling', () => {
    render(<GlassCard {...mockProps} />)
    const cardContainer = document.querySelector('.p-6')
    expect(cardContainer).toBeInTheDocument()
    expect(cardContainer).toHaveClass('rounded-xl')
  })

  it('renders without title when not provided', () => {
    render(<GlassCard>{mockProps.children}</GlassCard>)
    expect(screen.queryByText('Test Card Title')).not.toBeInTheDocument()
    expect(screen.getByText('Card content here')).toBeInTheDocument()
  })

  it('applies hover effects correctly', () => {
    render(<GlassCard {...mockProps} hover={true} />)
    const cardContainer = document.querySelector('.p-6')
    expect(cardContainer).toHaveClass('hover:scale-105')
  })
})

describe('GlassFireCard Component', () => {
  const mockProps = {
    title: 'Fire Card Title',
    children: <p>Fire card content</p>,
  }

  it('renders fire card with fire-themed styling', () => {
    render(<GlassFireCard {...mockProps} />)
    expect(screen.getByText('Fire Card Title')).toBeInTheDocument()
    expect(screen.getByText('Fire card content')).toBeInTheDocument()
  })

  it('applies fire variant and high intensity by default', () => {
    render(<GlassFireCard {...mockProps} />)
    const fireCard = document.querySelector('.bg-gradient-to-br')
    expect(fireCard).toBeInTheDocument()
    expect(fireCard).toHaveClass('backdrop-blur-lg')
  })

  it('includes fire-themed gradient backgrounds', () => {
    render(<GlassFireCard {...mockProps} />)
    const fireCard = document.querySelector('.from-fire-500\\/10')
    expect(fireCard).toBeInTheDocument()
  })
})

describe('GlassModal Component', () => {
  const mockProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Modal Title',
    children: <p>Modal content</p>,
  }

  it('renders modal when open', () => {
    render(<GlassModal {...mockProps} />)
    expect(screen.getByText('Modal Title')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<GlassModal {...mockProps} isOpen={false} />)
    expect(screen.queryByText('Modal Title')).not.toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<GlassModal {...mockProps} />)
    const backdrop = document.querySelector('.fixed.inset-0')
    fireEvent.click(backdrop)
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', () => {
    render(<GlassModal {...mockProps} />)
    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)
    expect(mockProps.onClose).toHaveBeenCalled()
  })

  it('applies modal overlay styling', () => {
    render(<GlassModal {...mockProps} />)
    const overlay = document.querySelector('.bg-black\\/50')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass('backdrop-blur-sm')
  })

  it('handles keyboard events for accessibility', () => {
    render(<GlassModal {...mockProps} />)
    const modal = screen.getByRole('dialog')
    fireEvent.keyDown(modal, { key: 'Escape', code: 'Escape' })
    expect(mockProps.onClose).toHaveBeenCalled()
  })
})

describe('GlassButton Component', () => {
  const mockProps = {
    children: 'Click me',
    onClick: jest.fn(),
  }

  it('renders button with text', () => {
    render(<GlassButton {...mockProps} />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    render(<GlassButton {...mockProps} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockProps.onClick).toHaveBeenCalled()
  })

  it('applies button-specific glass styling', () => {
    render(<GlassButton {...mockProps} />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('backdrop-blur-md')
    expect(button).toHaveClass('border')
  })

  it('supports different variants', () => {
    const { rerender } = render(<GlassButton {...mockProps} variant="fire" />)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gradient-to-br')

    rerender(<GlassButton {...mockProps} variant="dark" />)
    button = screen.getByRole('button')
    expect(button).toHaveClass('bg-[#1a1a1a]/20')
  })

  it('handles disabled state', () => {
    render(<GlassButton {...mockProps} disabled={true} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50')
  })

  it('supports loading state', () => {
    render(<GlassButton {...mockProps} loading={true} />)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Loader icon
  })
})

describe('GlassContainer Component', () => {
  const mockProps = {
    children: <div>Container content</div>,
  }

  it('renders container with content', () => {
    render(<GlassContainer {...mockProps} />)
    expect(screen.getByText('Container content')).toBeInTheDocument()
  })

  it('applies container-specific padding and spacing', () => {
    render(<GlassContainer {...mockProps} />)
    const container = screen.getByText('Container content').parentElement
    expect(container).toHaveClass('p-8')
  })

  it('supports full-height option', () => {
    render(<GlassContainer {...mockProps} fullHeight={true} />)
    const container = screen.getByText('Container content').parentElement
    expect(container).toHaveClass('min-h-screen')
  })
})

describe('Accessibility Tests', () => {
  it('maintains proper focus management in modals', () => {
    const mockProps = {
      isOpen: true,
      onClose: jest.fn(),
      title: 'Accessible Modal',
      children: <button>Focus me</button>,
    }

    render(<GlassModal {...mockProps} />)
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-labelledby')
    expect(modal).toHaveAttribute('aria-modal', 'true')
  })

  it('provides proper button accessibility', () => {
    render(<GlassButton onClick={jest.fn()}>Accessible Button</GlassButton>)
    const button = screen.getByRole('button')
    expect(button).toHaveAccessibleName('Accessible Button')
  })

  it('maintains keyboard navigation', () => {
    const onClose = jest.fn()
    render(
      <GlassModal isOpen={true} onClose={onClose} title="Test">
        <GlassButton onClick={jest.fn()}>Test Button</GlassButton>
      </GlassModal>
    )

    const button = screen.getByRole('button', { name: 'Test Button' })
    button.focus()
    expect(document.activeElement).toBe(button)

    fireEvent.keyDown(button, { key: 'Tab' })
    // Should maintain focus within modal
  })

  it('provides proper ARIA labels and roles', () => {
    render(
      <GlassCard title="Accessible Card">
        <p>Card content with proper semantics</p>
      </GlassCard>
    )

    const title = screen.getByText('Accessible Card')
    expect(title).toBeInTheDocument()
  })
})

describe('Performance Tests', () => {
  it('renders efficiently with complex glass effects', () => {
    const startTime = performance.now()
    
    render(
      <div>
        {Array.from({ length: 10 }, (_, i) => (
          <GlassMorphism key={i} variant="fire" intensity="ultra" hover={true}>
            <div>Glass effect {i}</div>
          </GlassMorphism>
        ))}
      </div>
    )
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Should render multiple glass effects efficiently
    expect(renderTime).toBeLessThan(50)
  })

  it('handles rapid state changes efficiently', async () => {
    let renderCount = 0
    const TestComponent = () => {
      renderCount++
      return (
        <GlassMorphism variant="light">
          <div>Render count: {renderCount}</div>
        </GlassMorphism>
      )
    }

    const { rerender } = render(<TestComponent />)
    
    // Simulate rapid re-renders
    for (let i = 0; i < 5; i++) {
      rerender(<TestComponent />)
    }

    expect(renderCount).toBeLessThan(10) // Should not over-render
  })

  it('optimizes backdrop-blur CSS for browser performance', () => {
    render(<GlassMorphism intensity="ultra" variant="fire" />)
    const glassElement = document.querySelector('.backdrop-blur-xl')
    
    // Verify CSS properties that affect performance
    const computedStyle = window.getComputedStyle(glassElement)
    expect(computedStyle.backdropFilter).toBeTruthy()
  })
})

describe('Cross-Browser Compatibility', () => {
  it('provides fallbacks for unsupported backdrop-filter', () => {
    // Mock unsupported backdrop-filter
    Object.defineProperty(document.documentElement.style, 'backdropFilter', {
      value: undefined,
      configurable: true
    })

    render(<GlassMorphism variant="light">Fallback test</GlassMorphism>)
    const element = screen.getByText('Fallback test').parentElement
    
    // Should still have background styling as fallback
    expect(element).toHaveClass('bg-white/10')
  })

  it('handles older browser gradient syntax', () => {
    render(<GlassMorphism variant="fire">Gradient test</GlassMorphism>)
    const element = screen.getByText('Gradient test').parentElement
    expect(element).toHaveClass('bg-gradient-to-br')
  })
})

describe('Edge Cases', () => {
  it('handles empty children gracefully', () => {
    render(<GlassMorphism>{null}</GlassMorphism>)
    expect(document.querySelector('.backdrop-blur-md')).toBeInTheDocument()
  })

  it('handles invalid variant values', () => {
    // @ts-ignore - testing invalid prop
    render(<GlassMorphism variant="invalid">Test</GlassMorphism>)
    const element = screen.getByText('Test').parentElement
    // Should fall back to default light variant
    expect(element).toHaveClass('bg-white/10')
  })

  it('maintains styling with deeply nested content', () => {
    render(
      <GlassMorphism variant="fire">
        <div>
          <div>
            <div>
              <span>Deeply nested content</span>
            </div>
          </div>
        </div>
      </GlassMorphism>
    )
    
    expect(screen.getByText('Deeply nested content')).toBeInTheDocument()
    const container = document.querySelector('.bg-gradient-to-br')
    expect(container).toBeInTheDocument()
  })

  it('handles rapid variant changes', () => {
    const variants = ['light', 'dark', 'fire', 'subtle'] as const
    const { rerender } = render(<GlassMorphism variant="light">Test</GlassMorphism>)
    
    variants.forEach(variant => {
      rerender(<GlassMorphism variant={variant}>Test</GlassMorphism>)
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})

describe('Integration Tests', () => {
  it('works correctly with other UI components', () => {
    render(
      <GlassCard title="Integration Test">
        <GlassButton onClick={jest.fn()}>
          <span>Nested Button</span>
        </GlassButton>
        <GlassMorphism variant="subtle">
          <p>Nested glass effect</p>
        </GlassMorphism>
      </GlassCard>
    )

    expect(screen.getByText('Integration Test')).toBeInTheDocument()
    expect(screen.getByText('Nested Button')).toBeInTheDocument()
    expect(screen.getByText('Nested glass effect')).toBeInTheDocument()
  })

  it('maintains styling consistency across components', () => {
    render(
      <div>
        <GlassMorphism variant="fire" intensity="high">Fire Effect</GlassMorphism>
        <GlassFireCard title="Fire Card">Fire content</GlassFireCard>
        <GlassButton variant="fire">Fire Button</GlassButton>
      </div>
    )

    // All fire-themed components should have consistent styling
    const fireElements = document.querySelectorAll('.bg-gradient-to-br')
    expect(fireElements.length).toBeGreaterThan(0)
  })
})