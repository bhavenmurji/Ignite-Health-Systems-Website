# Ignite Health Systems - Frontend Components

This document outlines the enhanced frontend components for the Ignite Health Systems website rebuild, focusing on responsive design, glass morphism effects, and optimized image handling.

## 🎨 Brand Colors

The website uses the following brand color palette:

- **Primary Dark Background**: `#1a1a1a` (or `bg-slate-950`)
- **Primary Orange Accent**: `#f97316` (fire-500)
- **Secondary Orange**: `#ea580c` (fire-600)
- **Tertiary Orange**: `#fb923c` (fire-400)

## 📦 Components Overview

### 1. NewsletterForm Component

**Location**: `/src/components/forms/NewsletterForm.tsx`

Enhanced newsletter form with Google Forms API integration and glass morphism effects.

#### Features:
- ✅ Google Forms API integration (with n8n fallback)
- ✅ Enhanced glass morphism effects
- ✅ Brand color consistency (#1a1a1a + #ff6b35)
- ✅ Mobile-first responsive design
- ✅ Smooth animations and hover effects

#### Usage:
```tsx
import { NewsletterForm } from "@/components/forms/NewsletterForm"

// Basic usage
<NewsletterForm />

// Inline variant
<NewsletterForm variant="inline" />

// Minimal variant
<NewsletterForm variant="minimal" />

// With custom props
<NewsletterForm 
  showName={true}
  buttonText="Join the Revolution"
  placeholder="Enter your email"
/>
```

#### Environment Variables:
```env
# Google Forms URL (primary)
GOOGLE_FORMS_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse

# n8n Webhook URL (fallback)
N8N_WEBHOOK_URL=http://localhost:5678/webhook/subscribe
```

### 2. ImageOptimized Component

**Location**: `/src/components/ui/ImageOptimized.tsx`

Advanced image component that fixes aspect ratio issues and provides optimized loading.

#### Features:
- ✅ Proper aspect ratio maintenance
- ✅ Advanced loading states with shimmer effect
- ✅ Error handling with fallback images
- ✅ Responsive image sizing
- ✅ Glass morphism overlay effects
- ✅ Multiple preset components

#### Usage:
```tsx
import { 
  ImageOptimized, 
  ImageHero, 
  ImageCard, 
  ImageAvatar,
  ImageGallery 
} from "@/components/ui/ImageOptimized"

// Basic usage
<ImageOptimized
  src="/path/to/image.jpg"
  alt="Description"
  aspectRatio="landscape"
  objectFit="cover"
/>

// Hero image
<ImageHero
  src="/hero-image.jpg"
  alt="Hero Background"
  priority
>
  <div>Hero Content</div>
</ImageHero>

// Card image
<ImageCard
  src="/card-image.jpg"
  alt="Card Image"
  aspectRatio="square"
/>

// Avatar
<ImageAvatar
  src="/avatar.jpg"
  alt="User Avatar"
  size="lg"
/>

// Gallery
<ImageGallery
  images={[
    { src: "/img1.jpg", alt: "Image 1", caption: "Caption 1" },
    { src: "/img2.jpg", alt: "Image 2", caption: "Caption 2" }
  ]}
/>
```

#### Props:
- `aspectRatio`: "square" | "video" | "portrait" | "landscape" | "auto"
- `objectFit`: "cover" | "contain" | "fill" | "none" | "scale-down"
- `showLoader`: boolean - Show loading spinner
- `fallbackSrc`: string - Fallback image URL
- `containerClassName`: string - Container styling

### 3. GlassMorphism Component

**Location**: `/src/components/ui/GlassMorphism.tsx`

Comprehensive glass morphism component system with brand-consistent styling.

#### Features:
- ✅ Multiple variants (light, dark, fire, subtle)
- ✅ Configurable blur and opacity levels
- ✅ Hover and animation effects
- ✅ Brand color integration
- ✅ Preset components for common use cases

#### Usage:
```tsx
import { 
  GlassMorphism,
  GlassCard,
  GlassFireCard,
  GlassModal,
  GlassButton,
  GlassNavigation,
  GlassFAB
} from "@/components/ui/GlassMorphism"

// Basic glass morphism
<GlassMorphism
  variant="fire"
  blur="md"
  opacity="medium"
  border
  shadow
  hover
  animate
>
  <div>Content</div>
</GlassMorphism>

// Fire-themed card
<GlassFireCard>
  <h3>Fire Card Content</h3>
</GlassFireCard>

// Glass button
<GlassButton variant="fire" size="lg">
  Click Me
</GlassButton>

// Modal
<GlassModal isOpen={showModal} onClose={() => setShowModal(false)}>
  <div>Modal Content</div>
</GlassModal>
```

### 4. NewsletterBanner Component

**Location**: `/src/components/sections/NewsletterBanner.tsx`

Enhanced newsletter banner with improved glass morphism effects.

#### Features:
- ✅ Enhanced glass morphism cards
- ✅ Improved hover effects
- ✅ Brand color consistency
- ✅ Multiple layout variants

#### Usage:
```tsx
import { NewsletterBanner } from "@/components/sections/NewsletterBanner"

// Default variant
<NewsletterBanner />

// Compact variant
<NewsletterBanner variant="compact" />

// Hero variant
<NewsletterBanner variant="hero" />
```

## 🎯 API Integration

### Google Forms Integration

The newsletter form now supports Google Forms API integration:

1. **Create a Google Form** with email and name fields
2. **Get the form URL** and extract the form ID
3. **Set environment variable**:
   ```env
   GOOGLE_FORMS_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
   ```
4. **Update entry IDs** in the API route to match your form fields

### n8n Fallback

If Google Forms URL is not provided, the system falls back to n8n webhook:

```env
N8N_WEBHOOK_URL=http://localhost:5678/webhook/subscribe
```

## 🎨 Glass Morphism Effects

### Implementation

All glass morphism effects use consistent styling:

```css
/* Base glass effect */
backdrop-blur-md
bg-white/10
border border-white/10
shadow-lg

/* Fire variant */
bg-gradient-to-br from-fire-500/10 via-white/5 to-fire-600/10
border border-fire-500/20

/* Hover effects */
hover:bg-white/15
hover:border-fire-500/30
transition-all duration-300
```

### Brand Color Integration

Glass effects incorporate the brand colors:
- Fire orange (#f97316) for primary accents
- Dark background (#1a1a1a) for contrast
- White overlays for glass transparency

## 📱 Mobile-First Responsive Design

All components use mobile-first responsive design:

### Breakpoints:
- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Responsive Utilities:
```css
/* Responsive text */
text-responsive-hero: clamp(2.5rem, 8vw, 8rem)
text-responsive-title: clamp(1.5rem, 4vw, 4rem)

/* Responsive spacing */
px-responsive: clamp(1rem, 4vw, 2rem)
py-responsive: clamp(1rem, 4vh, 2rem)

/* Responsive containers */
container-responsive: width: 100%, padding: clamp(1rem, 4vw, 2rem)
```

## 🔧 Performance Optimizations

### Image Optimization:
- Next.js Image component with optimized loading
- Responsive image sizing based on viewport
- Shimmer loading effects
- Error handling with fallbacks

### Animation Performance:
- GPU-accelerated transforms
- Will-change properties for smooth animations
- Reduced motion support for accessibility
- Optimized Framer Motion animations

### CSS Optimizations:
- Tailwind CSS for minimal bundle size
- Custom utilities for common patterns
- Efficient glass morphism implementations
- Mobile-optimized layouts

## 🚀 Getting Started

1. **Install dependencies** (already done in project)
2. **Set environment variables** for newsletter integration
3. **Import components** as shown in usage examples
4. **Customize styling** using Tailwind classes and component props

## 🧪 Testing

Components are designed for easy testing:

```tsx
import { render, screen } from '@testing-library/react'
import { NewsletterForm } from '@/components/forms/NewsletterForm'

test('renders newsletter form', () => {
  render(<NewsletterForm />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

## 📝 Notes

- All components support TypeScript with full type safety
- Glass morphism effects work across all modern browsers
- Images are optimized for Core Web Vitals
- Newsletter integration supports both Google Forms and n8n
- Components follow accessibility best practices
- Mobile performance is prioritized throughout