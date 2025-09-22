"use client"

import { HeroSection } from "@/components/hero-section"
import { DashboardPreview } from "@/components/dashboard-preview"
import { SocialProof } from "@/components/social-proof"
import { PlatformSection } from "@/components/platform-section"
import { FounderSection } from "@/components/founder-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { SectionWrapper } from "@/components/section-wrapper"
import { Header } from "@/components/header"
import { ScrollProgress } from "@/components/scroll-progress"
import { MobileNavigationEnhancer } from "@/components/mobile-navigation-enhancer"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import { Suspense } from "react"
import { HeroSkeleton, SectionSkeleton } from "@/components/loading-skeleton"

export default function LandingPage() {
  const { scrollToElement, activeSection } = useSmoothScroll()
  
  const sections = [
    { id: 'hero', name: 'Home' },
    { id: 'platform', name: 'Platform' },
    { id: 'approach', name: 'Approach' },
    { id: 'founder', name: 'Founder' },
    { id: 'join', name: 'Join' }
  ]
  
  const handleMobileNavigate = (sectionId: string) => {
    scrollToElement(`#${sectionId}`, {
      duration: 800,
      offset: 80
    })
  }
  
  return (
    <div className="min-h-screen bg-background mobile-scroll">
      <ScrollProgress />
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <div className="pt-20">
        {/* Hero Section */}
        <SectionWrapper id="hero" className="relative">
          <Suspense fallback={<HeroSkeleton />}>
            <div className="max-w-[1320px] mx-auto">
              <HeroSection />
            </div>
          </Suspense>
        </SectionWrapper>

        {/* Dashboard Preview - Now properly integrated */}
        <SectionWrapper className="relative -mt-32 md:-mt-48 z-20" delay={0.1}>
          <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg mx-6" />}>
            <div className="max-w-[1320px] mx-auto px-6">
              <DashboardPreview />
            </div>
          </Suspense>
        </SectionWrapper>

        {/* Social Proof */}
        <SectionWrapper className="pt-32 md:pt-48" delay={0.2}>
          <Suspense fallback={<SectionSkeleton />}>
            <div className="max-w-[1320px] mx-auto px-6">
              <SocialProof />
            </div>
          </Suspense>
        </SectionWrapper>

        {/* Platform Section */}
        <SectionWrapper 
          id="platform" 
          className="mt-16 md:mt-24 scroll-mt-20" 
          delay={0.3}
          direction="up"
        >
          <Suspense fallback={<SectionSkeleton />}>
            <PlatformSection />
          </Suspense>
        </SectionWrapper>

        {/* Approach Section */}
        <SectionWrapper 
          id="approach" 
          className="mt-16 md:mt-24 scroll-mt-20" 
          delay={0.4}
          direction="left"
        >
          <Suspense fallback={<SectionSkeleton />}>
            <div className="max-w-6xl mx-auto px-6">
              {/* This would be your approach section content */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Approach</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We believe in a systematic approach to healthcare transformation that puts people first.
                </p>
              </div>
            </div>
          </Suspense>
        </SectionWrapper>

        {/* Founder Section */}
        <SectionWrapper 
          id="founder" 
          className="mt-16 md:mt-24 scroll-mt-20" 
          delay={0.5}
          direction="right"
        >
          <Suspense fallback={<SectionSkeleton />}>
            <FounderSection />
          </Suspense>
        </SectionWrapper>

        {/* CTA Section */}
        <SectionWrapper 
          id="join" 
          className="mt-16 md:mt-24 scroll-mt-20" 
          delay={0.6}
          direction="up"
        >
          <Suspense fallback={<SectionSkeleton />}>
            <CTASection />
          </Suspense>
        </SectionWrapper>

        {/* Footer */}
        <SectionWrapper className="mt-16 md:mt-24" delay={0.7}>
          <Suspense fallback={<div className="h-32 bg-muted animate-pulse" />}>
            <Footer />
          </Suspense>
        </SectionWrapper>
      </div>
      
      {/* Mobile Navigation Enhancer */}
      <MobileNavigationEnhancer
        sections={sections}
        activeSection={activeSection}
        onNavigate={handleMobileNavigate}
      />
    </div>
  )
}
