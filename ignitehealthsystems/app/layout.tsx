import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ignite Health Systems - Stop Clicking. Start Healing.',
  description: 'AI eliminates screen-clicking. Supercharged human doctors heal. Get 10+ minutes back per patient and return 70+ hours to your life.',
  keywords: ['healthcare', 'AI', 'medical technology', 'physician productivity', 'healthcare automation'],
  authors: [{ name: 'Ignite Health Systems' }],
  creator: 'Ignite Health Systems',
  publisher: 'Ignite Health Systems',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ignitehealthsystems.com'),
  openGraph: {
    title: 'Ignite Health Systems - Stop Clicking. Start Healing.',
    description: 'AI eliminates screen-clicking. Supercharged human doctors heal. Get 10+ minutes back per patient and return 70+ hours to your life.',
    url: 'https://ignitehealthsystems.com',
    siteName: 'Ignite Health Systems',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ignite Health Systems - AI-Powered Healthcare Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ignite Health Systems - Stop Clicking. Start Healing.',
    description: 'AI eliminates screen-clicking. Supercharged human doctors heal.',
    images: ['/og-image.jpg'],
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
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}