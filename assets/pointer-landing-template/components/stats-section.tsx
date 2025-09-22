"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  TrendingUp,
  Clock,
  Users,
  Activity,
  Building2,
  FileText,
  Shield,
  Sparkles
} from "lucide-react"

interface Stat {
  icon: React.ReactNode
  value: string
  label: string
  description?: string
  trend?: string
  highlight?: boolean
}

const primaryStats: Stat[] = [
  {
    icon: <Clock className="w-8 h-8" />,
    value: "70+",
    label: "Hours Saved Monthly",
    description: "Average time savings per physician",
    trend: "+150% efficiency",
    highlight: true
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: "50,000+",
    label: "Healthcare Providers",
    description: "Physicians using Ignite daily",
    trend: "+300% growth YoY"
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    value: "500+",
    label: "Healthcare Clinics",
    description: "Independent practices transformed",
    trend: "99.8% uptime"
  },
  {
    icon: <Activity className="w-8 h-8" />,
    value: "2M+",
    label: "Patient Encounters",
    description: "Successfully documented with AI",
    trend: "90% accuracy rate",
    highlight: true
  }
]

const secondaryStats: Stat[] = [
  {
    icon: <FileText className="w-6 h-6" />,
    value: "60%",
    label: "Faster Documentation",
    description: "Real-time AI transcription"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    value: "100%",
    label: "HIPAA Compliant",
    description: "SOC 2 Type II certified"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    value: "25%",
    label: "Revenue Increase",
    description: "Average practice growth"
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    value: "<5min",
    label: "Setup Time",
    description: "From signup to first use"
  }
]

interface StatsSectionProps {
  title?: string
  subtitle?: string
  showSecondaryStats?: boolean
  className?: string
}

export function StatsSection({ 
  title = "Proven Results Across Healthcare",
  subtitle = "Join thousands of physicians who have transformed their practice and reclaimed their time with Ignite Health Systems.",
  showSecondaryStats = true,
  className = ""
}: StatsSectionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [visibleStats, setVisibleStats] = useState<number[]>([])

  useEffect(() => {
    setIsMounted(true)
    
    // Stagger the stat animations
    primaryStats.forEach((_, index) => {
      setTimeout(() => {
        setVisibleStats(prev => [...prev, index])
      }, index * 200)
    })
  }, [])

  return (
    <section className={`py-16 md:py-24 relative overflow-hidden bg-background ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <svg
            className="absolute inset-0 w-full h-full opacity-10"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="stats-gradient" cx="50%" cy="50%" r="70%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--fire-primary))", stopOpacity: 0.15 }} />
                <stop offset="50%" style={{ stopColor: "hsl(var(--fire-gold))", stopOpacity: 0.08 }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--fire-accent))", stopOpacity: 0 }} />
              </radialGradient>
              <pattern id="stats-dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="hsl(var(--primary))" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stats-dots)" />
            <ellipse cx="960" cy="540" rx="600" ry="400" fill="url(#stats-gradient)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div
            className={`transition-all duration-700 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Impact Metrics</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-primary">{title.split(' ').slice(0, 2).join(' ')}</span>{' '}
              <span className="text-foreground">{title.split(' ').slice(2).join(' ')}</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {primaryStats.map((stat, index) => (
            <Card
              key={index}
              className={`group text-center p-8 transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 ${
                stat.highlight 
                  ? "border-primary/30 bg-primary/5 hover:bg-primary/10" 
                  : "border-border hover:border-primary/20"
              } ${
                visibleStats.includes(index) 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-8 scale-95"
              }`}
            >
              <CardContent className="p-0">
                <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center transition-all duration-300 ${
                  stat.highlight 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                }`}>
                  {stat.icon}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className={`text-4xl md:text-5xl font-bold transition-colors ${
                    stat.highlight ? "text-primary" : "text-foreground group-hover:text-primary"
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {stat.label}
                  </div>
                </div>

                {stat.description && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {stat.description}
                  </p>
                )}

                {stat.trend && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-xs font-medium text-primary">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Stats */}
        {showSecondaryStats && (
          <div
            className={`transition-all duration-700 delay-600 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl bg-accent/20 border border-accent/30 backdrop-blur-sm">
              {secondaryStats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group cursor-pointer hover:transform hover:scale-105 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-3 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-foreground mb-1">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <div className="text-xs text-muted-foreground">
                      {stat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Quote */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-800 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <blockquote className="text-xl md:text-2xl text-muted-foreground italic max-w-4xl mx-auto">
            "Ignite has given me back the joy of practicing medicine. I spend more time with patients and less time fighting with technology."
          </blockquote>
          <div className="mt-6 text-primary font-semibold">
            — Dr. Sarah Chen, Family Medicine
          </div>
        </div>
      </div>
    </section>
  )
}