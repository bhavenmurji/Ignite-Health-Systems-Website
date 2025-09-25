import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ignite Health Systems - The Clinical Co-pilot for Independent Medicine',
  description: 'Revolutionary AI co-pilot that unifies your workflow, eliminates 60% of administrative overhead, and restores the vital time needed for clinical thought and patient connection.',
  keywords: 'healthcare AI, clinical copilot, physician burnout, EMR alternative, medical technology, independent medicine, direct primary care',
  authors: [{ name: 'Dr. Bhaven Murji' }],
  creator: 'Dr. Bhaven Murji',
  publisher: 'Ignite Health Systems',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ignitehealthsystems.com',
    title: 'Ignite Health Systems - The Clinical Co-pilot for Independent Medicine',
    description: 'Revolutionary AI co-pilot that unifies your workflow, eliminates 60% of administrative overhead, and restores the vital time needed for clinical thought and patient connection.',
    siteName: 'Ignite Health Systems',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ignite Health Systems - The Clinical Co-pilot for Independent Medicine',
    description: 'Revolutionary AI co-pilot that unifies your workflow, eliminates 60% of administrative overhead, and restores the vital time needed for clinical thought and patient connection.',
    creator: '@ignitehealthsys',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#36454F] text-[#F5F5F5] antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-[#00A8E8] text-white px-4 py-2 rounded-lg">
          Skip to main content
        </a>
        <nav className="bg-[#36454F] border-b border-gray-700 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-[#00A8E8]" aria-label="Ignite Health Systems - Home">
                  Ignite Health Systems
                </a>
              </div>
              <div className="flex items-center space-x-8">
                <a href="/" className="text-[#F5F5F5] hover:text-[#00A8E8] transition-colors" aria-current="page">
                  Home
                </a>
                <a href="/platform/" className="text-[#F5F5F5] hover:text-[#00A8E8] transition-colors">
                  Platform
                </a>
                <a href="/about/" className="text-[#F5F5F5] hover:text-[#00A8E8] transition-colors">
                  About
                </a>
                <a href="#join" className="bg-[#00A8E8] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#36454F]">
                  Join the Movement
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main id="main-content" role="main">
          {children}
        </main>
        <footer className="bg-[#2a363f] border-t border-gray-700 py-12" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-[#00A8E8] font-bold text-lg mb-4">Ignite Health Systems</h3>
                <p className="text-gray-300">
                  The Clinical Co-pilot for Independent Medicine. Restoring autonomy to physicians and putting humanity back at the center of healthcare.
                </p>
              </div>
              <div>
                <h4 className="text-[#F5F5F5] font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2" role="list">
                  <li><a href="/" className="text-gray-300 hover:text-[#00A8E8] transition-colors focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#2a363f] rounded">Home</a></li>
                  <li><a href="/platform/" className="text-gray-300 hover:text-[#00A8E8] transition-colors focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#2a363f] rounded">Platform</a></li>
                  <li><a href="/about/" className="text-gray-300 hover:text-[#00A8E8] transition-colors focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#2a363f] rounded">About</a></li>
                  <li><a href="/privacy" className="text-gray-300 hover:text-[#00A8E8] transition-colors focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#2a363f] rounded">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-gray-300 hover:text-[#00A8E8] transition-colors focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#2a363f] rounded">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[#F5F5F5] font-semibold mb-4">Contact</h4>
                <p className="text-gray-300">
                  Join our mission to transform healthcare technology.
                </p>
                <p className="text-gray-300 mt-4">
                  <a href="mailto:contact@ignitehealthsystems.com" className="hover:text-[#00A8E8] transition-colors focus:ring-2 focus:ring-[#00A8E8] focus:ring-offset-2 focus:ring-offset-[#2a363f] rounded">
                    contact@ignitehealthsystems.com
                  </a>
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-300">
                © 2024 Ignite Health Systems. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}