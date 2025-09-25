"use client"

import { useState, useEffect } from "react"
import { Header } from "./header"
import { Button } from "@/components/ui/button"
import { ChevronRight, Clock, Shield, Sparkles } from "lucide-react"

export function HeroSectionHealth() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="min-h-screen relative overflow-hidden bg-background">
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.08 }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--fire-accent))", stopOpacity: 0 }} />
              </linearGradient>
              <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="url(#grid-gradient)"
                  strokeWidth="1"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <circle cx="200" cy="200" r="150" fill="hsl(var(--primary))" opacity="0.12" filter="blur(100px)" />
            <circle cx="1720" cy="880" r="200" fill="hsl(var(--fire-accent))" opacity="0.08" filter="blur(120px)" />
            <circle cx="800" cy="600" r="100" fill="hsl(var(--fire-gold))" opacity="0.06" filter="blur(80px)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-6 pt-24 md:pt-32 pb-12 md:pb-20">
          <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
            {/* Announcement Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 transition-all duration-500 ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                HIPAA-Compliant AI Clinical Assistant
              </span>
            </div>

            {/* Main Headline */}
            <div
              className={`space-y-4 transition-all duration-700 delay-100 ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">Plagued by Click Fatigue?</span>
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-foreground font-semibold max-w-4xl mx-auto leading-relaxed">
                It's time to take back the clinic from the coders. Ignite is the physician-built co-pilot that automates administrative work, saving you 70+ hours a month.
              </h2>
            </div>

            {/* Feature Pills */}
            <div
              className={`flex flex-wrap gap-3 justify-center transition-all duration-700 delay-200 ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-accent">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Save 2+ Hours Daily</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-accent">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-accent">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Real-time Documentation</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Join the Movement
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg font-semibold"
              >
                Discover the Platform
              </Button>
            </div>

            {/* Trust Indicators */}
            <div
              className={`pt-8 transition-all duration-700 delay-400 ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <p className="text-sm text-muted-foreground mb-4">Trusted by leading healthcare providers</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="text-xs font-medium">500+ Clinics</div>
                <div className="text-xs font-medium">50,000+ Providers</div>
                <div className="text-xs font-medium">2M+ Patient Encounters</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}