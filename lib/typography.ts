/**
 * Typography Utility Classes
 * Centralized typography system for consistent design implementation
 */

export const typography = {
  // Display and Heading Styles
  display: "text-foreground font-semibold text-6xl md:text-6xl lg:text-6xl leading-tight tracking-tight",
  h1: "text-foreground font-semibold text-5xl md:text-5xl lg:text-5xl leading-tight tracking-tight",
  h2: "text-foreground font-semibold text-4xl md:text-4xl lg:text-4xl leading-snug tracking-tight",
  h3: "text-foreground font-semibold text-3xl md:text-3xl lg:text-3xl leading-snug",
  h4: "text-foreground font-medium text-2xl md:text-2xl lg:text-2xl leading-normal",
  h5: "text-foreground font-medium text-xl md:text-xl lg:text-xl leading-normal",
  h6: "text-foreground font-medium text-lg md:text-lg lg:text-lg leading-normal",

  // Body Text Styles
  bodyLarge: "text-foreground-muted font-normal text-lg md:text-lg lg:text-lg leading-relaxed",
  bodyBase: "text-foreground-muted font-normal text-base md:text-base lg:text-base leading-relaxed",
  bodySmall: "text-muted-foreground font-normal text-sm md:text-sm lg:text-sm leading-normal",
  bodyXs: "text-muted-foreground-light font-normal text-xs md:text-xs lg:text-xs leading-normal",

  // Special Text Styles
  caption: "text-muted-foreground-light font-normal text-xs leading-tight",
  overline: "text-muted-foreground font-medium text-xs uppercase tracking-wide",
  
  // Interactive Text
  linkPrimary: "text-primary font-medium hover:text-primary-dark transition-colors duration-200",
  linkSecondary: "text-foreground-muted font-medium hover:text-foreground transition-colors duration-200",
  
  // Testimonial Specific
  testimonialQuote: "text-foreground-muted font-normal leading-relaxed",
  testimonialAuthor: "text-foreground font-medium",
  testimonialCompany: "text-muted-foreground font-normal",
  
  // Form Labels
  label: "text-foreground font-medium text-sm leading-normal",
  helperText: "text-muted-foreground font-normal text-xs leading-normal",
  errorText: "text-red-500 font-normal text-xs leading-normal",
}

export const spacing = {
  // Section Spacing
  sectionPadding: "py-16 md:py-20 lg:py-24",
  sectionPaddingSmall: "py-12 md:py-16 lg:py-20",
  sectionPaddingLarge: "py-20 md:py-24 lg:py-32",
  
  // Content Spacing
  contentGap: "space-y-6 md:space-y-8",
  contentGapSmall: "space-y-4 md:space-y-6",
  contentGapLarge: "space-y-8 md:space-y-12",
  
  // Card Spacing
  cardPadding: "p-6 md:p-8",
  cardPaddingSmall: "p-4 md:p-6",
  cardPaddingLarge: "p-8 md:p-12",
  
  // Grid Spacing
  gridGap: "gap-6 md:gap-8",
  gridGapSmall: "gap-4 md:gap-6",
  gridGapLarge: "gap-8 md:gap-12",
}

export const layout = {
  // Container Widths
  containerDefault: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  containerNarrow: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
  containerWide: "max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8",
  
  // Section Layouts
  sectionDefault: "w-full",
  sectionCentered: "w-full flex flex-col items-center text-center",
  
  // Card Layouts
  cardDefault: "rounded-2xl border border-card-border bg-card/50 backdrop-blur-sm",
  cardEnhanced: "card-enhanced",
  cardTestimonial: "card-testimonial",
}

export const effects = {
  // Transitions
  transitionDefault: "transition-all duration-300 ease-in-out",
  transitionSlow: "transition-all duration-500 ease-in-out",
  transitionFast: "transition-all duration-200 ease-in-out",
  
  // Hover Effects
  hoverScale: "hover:scale-105",
  hoverShadow: "hover:shadow-xl",
  hoverBorder: "hover:border-primary/20",
  
  // Focus Effects
  focusRing: "focus:ring-2 focus:ring-primary/20 focus:ring-offset-2",
}

/**
 * Utility function to combine typography classes
 */
export function createTypographyClass(
  baseStyle: keyof typeof typography,
  additionalClasses?: string
): string {
  return `${typography[baseStyle]} ${additionalClasses || ''}`.trim()
}

/**
 * Responsive typography helper
 */
export function responsiveText(
  mobile: keyof typeof typography,
  desktop?: keyof typeof typography
): string {
  if (!desktop) return typography[mobile]
  return `${typography[mobile].replace('text-', 'text-')} lg:${typography[desktop].replace('text-', 'text-')}`
}

/**
 * Section header component styles
 */
export const sectionHeaders = {
  default: {
    container: "flex flex-col items-center gap-6 max-w-4xl mx-auto text-center",
    title: typography.h2,
    subtitle: typography.bodyLarge,
    divider: "divider max-w-xs mx-auto mt-8"
  },
  large: {
    container: "flex flex-col items-center gap-8 max-w-5xl mx-auto text-center",
    title: typography.h1,
    subtitle: typography.bodyLarge,
    divider: "divider max-w-md mx-auto mt-10"
  },
  compact: {
    container: "flex flex-col items-center gap-4 max-w-3xl mx-auto text-center",
    title: typography.h3,
    subtitle: typography.bodyBase,
    divider: "divider max-w-xs mx-auto mt-6"
  }
}