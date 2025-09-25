import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { HealthcareAtmosphericAudio } from '@/components/atmospheric-audio'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ignite Health Systems | The Clinical Co-Pilot for Independent Physicians',
  description: 'Plagued by click fatigue and physician burnout from your EHR? Ignite is the physician-built co-pilot that automates administrative work to help you take back your clinic.',
  keywords: 'physician burnout, EHR optimization, clinical co-pilot, healthcare automation, independent practice, HIPAA compliant, medical AI assistant',
  authors: [{ name: 'Ignite Health Systems' }],
  creator: 'Ignite Health Systems',
  publisher: 'Ignite Health Systems',
  openGraph: {
    title: 'Ignite Health Systems | The Clinical Co-Pilot for Independent Physicians',
    description: 'Plagued by click fatigue and physician burnout from your EHR? Ignite is the physician-built co-pilot that automates administrative work to help you take back your clinic.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ignite Health Systems',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ignite Health Systems | The Clinical Co-Pilot for Independent Physicians',
    description: 'Plagued by click fatigue and physician burnout from your EHR? Ignite is the physician-built co-pilot that automates administrative work to help you take back your clinic.',
    creator: '@IgniteHealthSys',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-token-placeholder',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <HealthcareAtmosphericAudio>
          {children}
        </HealthcareAtmosphericAudio>
        <Analytics />
      </body>
    </html>
  )
}
