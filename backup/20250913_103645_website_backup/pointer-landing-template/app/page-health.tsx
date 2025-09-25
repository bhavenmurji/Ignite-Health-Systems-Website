import { HeroSectionHealth } from "@/components/hero-section-health"
import { DashboardPreviewHealth } from "@/components/dashboard-preview-health"
import { SocialProofHealth } from "@/components/social-proof-health"
import { BentoSectionHealth } from "@/components/bento-section-health"
import { LargeTestimonialHealth } from "@/components/large-testimonial-health"
import { PricingSectionHealth } from "@/components/pricing-section-health"
import { TestimonialGridSectionHealth } from "@/components/testimonial-grid-section-health"
import { FAQSectionHealth } from "@/components/faq-section-health"
import { CTASectionHealth } from "@/components/cta-section-health"
import { FooterSectionHealth } from "@/components/footer-section-health"
import { AnimatedSection } from "@/components/animated-section"

export default function LandingPageHealth() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      <div className="relative z-10">
        <main className="max-w-[1320px] mx-auto relative">
          <HeroSectionHealth />
          {/* Healthcare Dashboard Preview Wrapper */}
          <div className="absolute bottom-[-150px] md:bottom-[-400px] left-1/2 transform -translate-x-1/2 z-30">
            <AnimatedSection>
              <DashboardPreviewHealth />
            </AnimatedSection>
          </div>
        </main>
        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto px-6 mt-[411px] md:mt-[400px]" delay={0.1}>
          <SocialProofHealth />
        </AnimatedSection>
        <AnimatedSection id="features-section" className="relative z-10 max-w-[1320px] mx-auto mt-16" delay={0.2}>
          <BentoSectionHealth />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <LargeTestimonialHealth />
        </AnimatedSection>
        <AnimatedSection
          id="pricing-section"
          className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16"
          delay={0.2}
        >
          <PricingSectionHealth />
        </AnimatedSection>
        <AnimatedSection
          id="testimonials-section"
          className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16"
          delay={0.2}
        >
          <TestimonialGridSectionHealth />
        </AnimatedSection>
        <AnimatedSection id="faq-section" className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <FAQSectionHealth />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <CTASectionHealth />
        </AnimatedSection>
        <AnimatedSection className="relative z-10 max-w-[1320px] mx-auto mt-8 md:mt-16" delay={0.2}>
          <FooterSectionHealth />
        </AnimatedSection>
      </div>
    </div>
  )
}