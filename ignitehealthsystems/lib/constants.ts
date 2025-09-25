// Site Configuration
export const SITE_CONFIG = {
  name: 'Ignite Health Systems',
  description: 'AI eliminates screen-clicking. Supercharged human doctors heal.',
  tagline: 'Stop Clicking. Start Healing.',
  url: 'https://ignitehealthsystems.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/ignitehealthsys',
    linkedin: 'https://linkedin.com/company/ignite-health-systems',
    github: 'https://github.com/ignite-health-systems',
  },
} as const

// Contact Information
export const CONTACT_INFO = {
  email: 'hello@ignitehealthsystems.com',
  phone: '+1 (555) 123-4567',
  address: '123 Healthcare Drive, Medical City, MC 12345',
  supportEmail: 'support@ignitehealthsystems.com',
  salesEmail: 'sales@ignitehealthsystems.com',
} as const

// Form Configuration
export const FORM_CONFIG = {
  roles: [
    { value: 'physician', label: 'Physician' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'administrator', label: 'Administrator' },
    { value: 'other', label: 'Other' },
  ],
  maxNoteLength: 500,
  requiredFields: ['name', 'email', 'role'],
} as const

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || '',
  timeout: 10000, // 10 seconds
} as const

// Analytics and Tracking
export const ANALYTICS_CONFIG = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
  facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
} as const

// Feature Flags
export const FEATURES = {
  enableAnalytics: process.env.NODE_ENV === 'production',
  enableHotjar: process.env.NODE_ENV === 'production',
  enableChatWidget: false,
  enableA11yWidget: true,
  enableMaintenanceMode: false,
} as const

// Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
  },
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Merriweather', 'serif'],
  },
} as const

// Content Configuration
export const CONTENT_CONFIG = {
  hero: {
    title: 'Stop Clicking. Start Healing.',
    subtitle: 'AI eliminates screen-clicking. Supercharged human doctors heal.',
    description: 'Transform your practice with intelligent automation that gives you back the most precious resource: time with your patients.',
  },
  valueProps: {
    timesSaved: '10+',
    hoursReturned: '70+',
    satisfactionRate: '95%',
    activeUsers: '5,000+',
    organizations: '200+',
  },
  trustIndicators: [
    'HIPAA Compliant',
    'SOC 2 Certified',
    'Enterprise Security',
    '24/7 Support',
    'No Spam Guarantee',
  ],
} as const

// Navigation Configuration
export const NAVIGATION = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Solutions', href: '/#solutions' },
    { name: 'Contact', href: '/#signup' },
  ],
  footer: {
    solutions: [
      { name: 'AI Documentation', href: '#' },
      { name: 'Workflow Automation', href: '#' },
      { name: 'Clinical Intelligence', href: '#' },
      { name: 'Integration Platform', href: '#' },
    ],
    support: [
      { name: 'Documentation', href: '#' },
      { name: 'Training', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
    ],
    legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'HIPAA', href: '#' },
    ],
  },
} as const

// SEO Configuration
export const SEO_CONFIG = {
  defaultTitle: 'Ignite Health Systems - Stop Clicking. Start Healing.',
  titleTemplate: '%s | Ignite Health Systems',
  defaultDescription: 'AI eliminates screen-clicking. Supercharged human doctors heal. Get 10+ minutes back per patient and return 70+ hours to your life.',
  siteUrl: 'https://ignitehealthsystems.com',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@ignitehealthsys',
  keywords: [
    'healthcare AI',
    'medical technology',
    'physician productivity',
    'healthcare automation',
    'clinical documentation',
    'EHR optimization',
    'healthcare efficiency',
    'medical AI assistant',
    'clinical workflow',
    'healthcare innovation',
  ],
} as const

// Environment Configuration
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  vercelEnv: process.env.VERCEL_ENV,
  deploymentUrl: process.env.VERCEL_URL,
} as const