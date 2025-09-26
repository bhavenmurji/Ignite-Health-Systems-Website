import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ImageOptimized, ImageHero, ImageCard, ImageAvatar, ImageGallery } from '@/components/ui/ImageOptimized'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onLoad, onError, ...props }: any) {
    const handleLoad = () => {
      onLoad?.()
    }
    
    const handleError = () => {
      onError?.()
    }

    return (
      <img
        {...props}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        data-testid="optimized-image"
      />
    )
  }
})

describe('ImageOptimized', () => {
  const mockProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      render(<ImageOptimized {...mockProps} />)
      expect(screen.getByTestId('optimized-image')).toBeInTheDocument()
      expect(screen.getByAltText('Test image')).toBeInTheDocument()
    })

    it('applies correct object-fit styling', () => {
      render(<ImageOptimized {...mockProps} objectFit="cover" />)
      const image = screen.getByTestId('optimized-image')
      expect(image).toHaveStyle({ objectFit: 'cover' })
    })

    it('applies correct object-position styling', () => {
      render(<ImageOptimized {...mockProps} objectPosition="top center" />)
      const image = screen.getByTestId('optimized-image')
      expect(image).toHaveStyle({ objectPosition: 'top center' })
    })
  })

  describe('Aspect Ratio Handling', () => {
    it('applies correct aspect ratio classes', () => {
      const { rerender } = render(<ImageOptimized {...mockProps} aspectRatio="square" />)
      expect(document.querySelector('.aspect-square')).toBeInTheDocument()

      rerender(<ImageOptimized {...mockProps} aspectRatio="video" />)
      expect(document.querySelector('.aspect-video')).toBeInTheDocument()

      rerender(<ImageOptimized {...mockProps} aspectRatio="portrait" />)
      expect(document.querySelector('.aspect-\\[3\\/4\\]')).toBeInTheDocument()

      rerender(<ImageOptimized {...mockProps} aspectRatio="landscape" />)
      expect(document.querySelector('.aspect-\\[4\\/3\\]')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('shows loading spinner by default', () => {
      render(<ImageOptimized {...mockProps} showLoader={true} />)
      expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument() // Loader2 icon
    })

    it('hides loading spinner when showLoader is false', () => {
      render(<ImageOptimized {...mockProps} showLoader={false} />)
      expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument()
    })

    it('handles image load event', async () => {
      const onLoad = jest.fn()
      render(<ImageOptimized {...mockProps} onLoad={onLoad} />)
      
      const image = screen.getByTestId('optimized-image')
      fireEvent.load(image)
      
      await waitFor(() => {
        expect(onLoad).toHaveBeenCalled()
      })
    })
  })

  describe('Error Handling', () => {
    it('shows error state when image fails to load', async () => {
      render(<ImageOptimized {...mockProps} />)
      
      const image = screen.getByTestId('optimized-image')
      fireEvent.error(image)
      
      await waitFor(() => {
        expect(screen.getByText('Image failed to load')).toBeInTheDocument()
      })
    })

    it('uses fallback image when provided', async () => {
      const onError = jest.fn()
      render(
        <ImageOptimized
          {...mockProps}
          fallbackSrc="/fallback-image.jpg"
          onError={onError}
        />
      )
      
      const image = screen.getByTestId('optimized-image')
      fireEvent.error(image)
      
      await waitFor(() => {
        expect(image).toHaveAttribute('src', '/fallback-image.jpg')
      })
    })
  })

  describe('Glass Morphism Effects', () => {
    it('applies glass effect when enabled', () => {
      render(<ImageOptimized {...mockProps} glassEffect={true} />)
      expect(document.querySelector('.backdrop-blur-sm')).toBeInTheDocument()
    })

    it('applies correct glass variant classes', () => {
      const { rerender } = render(
        <ImageOptimized {...mockProps} glassEffect={true} glassVariant="light" />
      )
      expect(document.querySelector('.bg-white\\/10')).toBeInTheDocument()

      rerender(<ImageOptimized {...mockProps} glassEffect={true} glassVariant="dark" />)
      expect(document.querySelector('.bg-\\[\\#1a1a1a\\]\\/20')).toBeInTheDocument()

      rerender(<ImageOptimized {...mockProps} glassEffect={true} glassVariant="fire" />)
      expect(document.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
    })
  })

  describe('Overlay Effects', () => {
    it('applies overlay effects correctly', () => {
      const { rerender } = render(
        <ImageOptimized {...mockProps} overlayType="dark" />
      )
      expect(document.querySelector('.bg-gradient-to-t')).toBeInTheDocument()

      rerender(<ImageOptimized {...mockProps} overlayType="fire" />)
      expect(document.querySelector('.from-\\[\\#ff6b35\\]\\/20')).toBeInTheDocument()

      rerender(<ImageOptimized {...mockProps} overlayType="gradient" />)
      expect(document.querySelector('.from-black\\/50')).toBeInTheDocument()
    })
  })

  describe('Responsive Sizing', () => {
    it('generates correct sizes attribute for different scenarios', () => {
      const { rerender } = render(<ImageOptimized {...mockProps} fill={true} />)
      let image = screen.getByTestId('optimized-image')
      expect(image).toHaveAttribute('sizes', '100vw')

      rerender(<ImageOptimized {...mockProps} sizes="(max-width: 768px) 100vw, 50vw" />)
      image = screen.getByTestId('optimized-image')
      expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw')

      rerender(<ImageOptimized {...mockProps} />)
      image = screen.getByTestId('optimized-image')
      expect(image).toHaveAttribute('sizes', '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw')
    })
  })

  describe('Accessibility', () => {
    it('has proper alt text', () => {
      render(<ImageOptimized {...mockProps} />)
      expect(screen.getByAltText('Test image')).toBeInTheDocument()
    })

    it('maintains keyboard accessibility', () => {
      render(<ImageOptimized {...mockProps} />)
      const container = screen.getByTestId('optimized-image').parentElement
      expect(container).not.toHaveAttribute('tabIndex')
    })
  })
})

describe('ImageHero', () => {
  const mockProps = {
    src: '/hero-image.jpg',
    alt: 'Hero image',
  }

  it('renders with hero-specific classes', () => {
    render(<ImageHero {...mockProps} />)
    expect(document.querySelector('.min-h-\\[60vh\\]')).toBeInTheDocument()
    expect(document.querySelector('.lg\\:min-h-\\[80vh\\]')).toBeInTheDocument()
  })

  it('renders children content in overlay', () => {
    render(
      <ImageHero {...mockProps}>
        <h1>Hero Title</h1>
      </ImageHero>
    )
    expect(screen.getByText('Hero Title')).toBeInTheDocument()
  })

  it('applies brightness filter', () => {
    render(<ImageHero {...mockProps} />)
    expect(document.querySelector('.brightness-75')).toBeInTheDocument()
  })
})

describe('ImageCard', () => {
  const mockProps = {
    src: '/card-image.jpg',
    alt: 'Card image',
  }

  it('renders with card-specific styling', () => {
    render(<ImageCard {...mockProps} />)
    expect(document.querySelector('.rounded-xl')).toBeInTheDocument()
    expect(document.querySelector('.backdrop-blur-sm')).toBeInTheDocument()
  })

  it('applies glass morphism by default', () => {
    render(<ImageCard {...mockProps} />)
    expect(document.querySelector('.bg-gradient-to-br')).toBeInTheDocument()
  })
})

describe('ImageAvatar', () => {
  const mockProps = {
    src: '/avatar-image.jpg',
    alt: 'Avatar image',
  }

  it('renders with default medium size', () => {
    render(<ImageAvatar {...mockProps} />)
    expect(document.querySelector('.w-12')).toBeInTheDocument()
    expect(document.querySelector('.h-12')).toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { rerender } = render(<ImageAvatar {...mockProps} size="sm" />)
    expect(document.querySelector('.w-8')).toBeInTheDocument()

    rerender(<ImageAvatar {...mockProps} size="lg" />)
    expect(document.querySelector('.w-16')).toBeInTheDocument()

    rerender(<ImageAvatar {...mockProps} size="xl" />)
    expect(document.querySelector('.w-24')).toBeInTheDocument()
  })

  it('maintains circular shape', () => {
    render(<ImageAvatar {...mockProps} />)
    expect(document.querySelector('.rounded-full')).toBeInTheDocument()
  })
})

describe('ImageGallery', () => {
  const mockImages = [
    { src: '/image1.jpg', alt: 'Image 1', caption: 'First image' },
    { src: '/image2.jpg', alt: 'Image 2', caption: 'Second image' },
    { src: '/image3.jpg', alt: 'Image 3' },
  ]

  it('renders all images', () => {
    render(<ImageGallery images={mockImages} />)
    expect(screen.getByAltText('Image 1')).toBeInTheDocument()
    expect(screen.getByAltText('Image 2')).toBeInTheDocument()
    expect(screen.getByAltText('Image 3')).toBeInTheDocument()
  })

  it('renders captions when provided', () => {
    render(<ImageGallery images={mockImages} />)
    expect(screen.getByText('First image')).toBeInTheDocument()
    expect(screen.getByText('Second image')).toBeInTheDocument()
  })

  it('applies grid layout classes', () => {
    render(<ImageGallery images={mockImages} />)
    expect(document.querySelector('.grid')).toBeInTheDocument()
    expect(document.querySelector('.md\\:grid-cols-2')).toBeInTheDocument()
    expect(document.querySelector('.lg\\:grid-cols-3')).toBeInTheDocument()
  })
})

describe('Performance Tests', () => {
  it('renders efficiently with multiple images', () => {
    const startTime = performance.now()
    
    const manyImages = Array.from({ length: 20 }, (_, i) => ({
      src: `/image${i}.jpg`,
      alt: `Image ${i}`,
    }))

    render(<ImageGallery images={manyImages} />)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Should render within reasonable time (less than 100ms)
    expect(renderTime).toBeLessThan(100)
  })

  it('handles lazy loading properly', () => {
    render(<ImageOptimized {...mockProps} loading="lazy" />)
    const image = screen.getByTestId('optimized-image')
    expect(image).toHaveAttribute('loading', 'lazy')
  })

  it('prioritizes critical images', () => {
    render(<ImageOptimized {...mockProps} priority={true} />)
    const image = screen.getByTestId('optimized-image')
    expect(image).toHaveAttribute('priority')
  })
})

describe('Edge Cases', () => {
  it('handles empty src gracefully', () => {
    render(<ImageOptimized src="" alt="Empty image" />)
    expect(screen.getByAltText('Empty image')).toBeInTheDocument()
  })

  it('handles very long alt text', () => {
    const longAlt = 'A'.repeat(500)
    render(<ImageOptimized src="/test.jpg" alt={longAlt} />)
    expect(screen.getByAltText(longAlt)).toBeInTheDocument()
  })

  it('handles special characters in src', () => {
    const specialSrc = '/images/test%20image%20with%20spaces.jpg'
    render(<ImageOptimized src={specialSrc} alt="Special image" />)
    expect(screen.getByTestId('optimized-image')).toHaveAttribute('src', specialSrc)
  })

  it('maintains functionality with all optional props', () => {
    render(
      <ImageOptimized
        src="/test.jpg"
        alt="Full test"
        className="custom-class"
        priority={true}
        quality={90}
        fill={true}
        sizes="100vw"
        aspectRatio="square"
        objectFit="contain"
        objectPosition="top"
        placeholder="blur"
        loading="eager"
        unoptimized={false}
        showLoader={true}
        containerClassName="container-class"
        fallbackSrc="/fallback.jpg"
        glassEffect={true}
        glassVariant="fire"
        overlayType="gradient"
        rounded="lg"
      />
    )
    expect(screen.getByTestId('optimized-image')).toBeInTheDocument()
  })
})