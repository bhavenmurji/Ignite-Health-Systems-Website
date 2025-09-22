"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle,
  Clock,
  Shield,
  Brain,
  Users,
  TrendingUp,
  FileText,
  Sparkles,
  ChevronRight,
  Activity
} from "lucide-react"

interface Benefit {
  icon: React.ReactNode
  title: string
  description: string
  stats?: string
}

const keyBenefits: Benefit[] = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Save 70+ Hours Monthly",
    description: "Automate administrative tasks and eliminate repetitive documentation work.",
    stats: "2+ hours saved daily"
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Clinical Assistant",
    description: "HIPAA-compliant AI that understands medical context and workflows.",
    stats: "90% accuracy rate"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "End-to-end encryption with full HIPAA compliance and audit trails.",
    stats: "SOC 2 Type II certified"
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Real-time Documentation",
    description: "Voice-to-text with intelligent structuring and auto-completion.",
    stats: "60% faster charting"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Multi-Provider Support",
    description: "Seamless collaboration across your entire healthcare team.",
    stats: "Unlimited users"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Practice Growth Tools",
    description: "Analytics and insights to optimize operations and patient outcomes.",
    stats: "25% revenue increase"
  }
]

interface BenefitsSectionProps {
  title?: string
  subtitle?: string
  showStats?: boolean
  showCTA?: boolean
  className?: string
}

export function BenefitsSection({ 
  title = "Why Physicians Choose Ignite",
  subtitle = "Join thousands of healthcare providers who have already transformed their practice with our AI-powered platform.",
  showStats = true,
  showCTA = true,
  className = ""
}: BenefitsSectionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    setIsMounted(true)
    
    // Stagger the card animations
    keyBenefits.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index])
      }, index * 150)
    })
  }, [])

  return (
    <section className={`py-16 md:py-24 relative overflow-hidden bg-accent/5 ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="benefits-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#benefits-grid)" />
            <circle cx="400" cy="200" r="100" fill="hsl(var(--fire-gold))" opacity="0.06" filter="blur(80px)" />
            <circle cx="1520" cy="600" r="120" fill="hsl(var(--fire-accent))" opacity="0.05" filter="blur(100px)" />
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
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Key Benefits</span>
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

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {keyBenefits.map((benefit, index) => (
            <Card
              key={index}
              className={`group transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 border-border hover:border-primary/20 ${
                visibleCards.includes(index) 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {benefit.icon}
                  </div>
                  {showStats && benefit.stats && (
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {benefit.stats}
                      </div>
                    </div>
                  )}
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div
          className={`text-center mb-12 transition-all duration-700 delay-300 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">500+ Clinics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">50,000+ Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">2M+ Patient Encounters</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-medium">HIPAA Certified</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {showCTA && (
          <div
            className={`text-center transition-all duration-700 delay-400 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Activity className="mr-2 w-5 h-5" />
                Start Your Free Trial
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg font-semibold"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                See It In Action
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • 14-day free trial • Setup in under 5 minutes
            </p>
          </div>
        )}
      </div>
    </section>
  )
}