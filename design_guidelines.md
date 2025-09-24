# Ignite Health Systems Design Guidelines

## Design Approach
**Reference-Based Approach** - Drawing inspiration from premium healthcare and productivity platforms like Notion and Linear, with emphasis on clinical professionalism and trust-building visual hierarchy.

## Core Design Principles
- **Clinical Authority**: Professional, trustworthy design that conveys medical expertise
- **Minimal Complexity**: Clean, focused layouts that respect physicians' time constraints
- **Conversion-Focused**: Strategic use of color and whitespace to guide toward sign-up actions

## Color Palette

### Primary Colors
- **Brand Primary**: 220 85% 35% (Deep medical blue)
- **Brand Secondary**: 220 25% 15% (Charcoal)

### Supporting Colors
- **Success/Action**: 142 70% 45% (Medical green)
- **Warning/Accent**: 25 85% 55% (Warm orange - used sparingly)
- **Background Light**: 220 15% 98%
- **Background Dark**: 220 25% 8%

### Gradient Applications
- **Hero sections**: Subtle blue gradient (220 85% 35% to 220 60% 45%)
- **CTA buttons**: Gentle gradient overlays on primary blue
- **Section dividers**: Soft gradient borders between major content blocks

## Typography
- **Primary**: Inter (Google Fonts) - Clean, medical-professional readability
- **Secondary**: Source Serif Pro (Google Fonts) - For testimonials and quotes
- **Mono**: JetBrains Mono - For any technical specifications

## Layout System
**Tailwind Spacing Primitives**: 2, 4, 6, 8, 12, 16, 24
- Consistent use of p-6, m-8, gap-4 patterns
- Major section spacing: py-16 or py-24
- Component internal spacing: p-4, p-6

## Component Library

### Core Navigation
- Clean header with logo and minimal navigation links
- Prominent "Join Innovation Council" CTA button in header
- Mobile-first hamburger menu

### Hero Components
- Large hero sections with gradient backgrounds
- Statistics cards with large numbers and descriptive text
- Multi-step signup forms with conditional field logic

### Content Blocks
- Testimonial cards with physician credentials
- Problem/solution comparison layouts
- Timeline components for Dr. Murji's story
- Episode archive with transcript previews

### Forms & CTAs
- Multi-step conditional forms (physician/investor/specialist paths)
- Newsletter signup with inline validation
- Primary buttons with subtle gradients, secondary outline buttons

## Images
### Hero Image Requirements
- **Large hero image**: Professional photo of diverse healthcare professionals collaborating with technology
- **Platform screenshots**: Clean interface mockups showing the unified clinical OS
- **Dr. Murji portrait**: Professional headshot for About page
- **Testimonial avatars**: Professional physician headshots (placeholder initially)
- **Statistics visualizations**: Simple, clean charts showing burnout rates and time savings

### Image Placement
- Hero: Full-width background with overlay text
- Platform page: Side-by-side layout with interface screenshots
- About page: Portrait integration within narrative text
- Testimonials: Small circular avatars next to quotes

## Accessibility & Dark Mode
- Consistent dark mode implementation across all components
- High contrast ratios meeting WCAG AA standards
- Form inputs maintain visibility in both light and dark themes
- Button states clearly visible in all color modes

## Marketing Page Constraints
- **Maximum 5 sections per page** to avoid endless scrolling
- **Hero-focused design** with primary visual impact in first viewport
- **Strategic color placement** - vibrant blues for conversion moments only
- **Breathing room** - generous whitespace between major sections