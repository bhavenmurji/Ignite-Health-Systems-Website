"use client"

import { useState, useEffect, Suspense } from "react"
import dynamic from "next/dynamic"
import { CinematicIntro } from "@/components/sections/cinematic-intro"
import { EnhancedHero } from "@/components/sections/enhanced-hero"

// Dynamic imports for code splitting large components
const EHRPreview = dynamic(() => import("@/components/healthcare/ehr-preview").then(mod => ({ default: mod.EHRPreview })), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fire-500"></div>
    </div>
  ),
  ssr: false
})

const JourneySections = dynamic(() => import("@/components/sections/journey-sections"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fire-500"></div>
    </div>
  ),
  ssr: false
})

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false)
  const [currentSection, setCurrentSection] = useState<'intro' | 'hero' | 'ehr' | 'journey'>('intro')

  useEffect(() => {
    if (introComplete) {
      // Smooth transition to hero section after intro
      const timer = setTimeout(() => {
        setCurrentSection('hero')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [introComplete])

  const handleSectionTransition = (section: 'hero' | 'ehr' | 'journey') => {
    setCurrentSection(section)
  }

  return (
    <main className="min-h-screen-safe w-full max-w-none overflow-x-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Cinematic Intro - Always rendered first */}
      {!introComplete && (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      )}
      
      {/* Main Content - Rendered after intro completion */}
      {introComplete && (
        <div className="relative w-full max-w-none overflow-x-hidden">
          {/* Hero Section */}
          <section 
            className={`w-full max-w-none overflow-x-hidden transition-opacity duration-1000 ${
              currentSection === 'hero' ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <EnhancedHero onExploreClick={() => handleSectionTransition('ehr')} />
          </section>

          {/* EHR Preview Section */}
          <section 
            className={`w-full max-w-none overflow-x-hidden transition-opacity duration-1000 ${
              currentSection === 'ehr' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'
            }`}
          >
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fire-500"></div>
              </div>
            }>
              <EHRPreview onContinueJourney={() => handleSectionTransition('journey')} />
            </Suspense>
          </section>

          {/* Journey Sections */}
          <section 
            className={`w-full max-w-none overflow-x-hidden transition-opacity duration-1000 ${
              currentSection === 'journey' ? 'opacity-100' : 'opacity-0 pointer-events-none absolute top-0 left-0 w-full'
            }`}
          >
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fire-500"></div>
              </div>
            }>
              <JourneySections />
            </Suspense>
          </section>

          {/* Navigation Overlay */}
          <div className="fixed top-4 right-4 z-50 flex gap-2 max-w-none">
            <button
              onClick={() => handleSectionTransition('hero')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                currentSection === 'hero'
                  ? 'bg-fire-500 text-white'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              Hero
            </button>
            <button
              onClick={() => handleSectionTransition('ehr')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                currentSection === 'ehr'
                  ? 'bg-fire-500 text-white'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              EHR
            </button>
            <button
              onClick={() => handleSectionTransition('journey')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                currentSection === 'journey'
                  ? 'bg-fire-500 text-white'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              Journey
            </button>
          </div>
        </div>
      )}
    </main>
  )
}