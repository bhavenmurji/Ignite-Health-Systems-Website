"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Users,
  Clock,
  Award,
  TrendingUp
} from "lucide-react"

interface Testimonial {
  id: string
  name: string
  title: string
  practice: string
  location: string
  avatar?: string
  quote: string
  rating: number
  stats?: {
    hoursSaved?: string
    patientsPerDay?: string
    efficiencyGain?: string
  }
  highlight?: boolean
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    title: "Family Medicine Physician",
    practice: "Wellness Family Practice",
    location: "Austin, TX",
    quote: "Ignite has given me back the joy of practicing medicine. I spend more time with patients and less time fighting with technology. The AI transcription is so accurate, I barely need to make corrections.",
    rating: 5,
    stats: {
      hoursSaved: "75+ hours/month",
      patientsPerDay: "35+ patients",
      efficiencyGain: "180% increase"
    },
    highlight: true
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    title: "Internal Medicine",
    practice: "Harbor Medical Group",
    location: "San Diego, CA",
    quote: "The seamless integration with our existing systems was impressive. Ignite didn't disrupt our workflow - it enhanced it. Our staff picked it up immediately.",
    rating: 5,
    stats: {
      hoursSaved: "60+ hours/month",
      patientsPerDay: "40+ patients",
      efficiencyGain: "150% increase"
    }
  },
  {
    id: "3",
    name: "Dr. Emily Johnson",
    title: "Pediatrician",
    practice: "Children's Health Partners",
    location: "Denver, CO", 
    quote: "As a pediatrician, I need to focus on my young patients, not paperwork. Ignite captures everything accurately while I stay engaged with families. It's been transformational.",
    rating: 5,
    stats: {
      hoursSaved: "50+ hours/month",
      patientsPerDay: "45+ patients",
      efficiencyGain: "140% increase"
    }
  },
  {
    id: "4",
    name: "Dr. James Thompson",
    title: "Urgent Care Physician",
    practice: "QuickCare Medical",
    location: "Phoenix, AZ",
    quote: "In urgent care, every minute counts. Ignite helps me document patient encounters in real-time without slowing down care. The ROI was immediate.",
    rating: 5,
    stats: {
      hoursSaved: "85+ hours/month",
      patientsPerDay: "60+ patients",
      efficiencyGain: "200% increase"
    },
    highlight: true
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    title: "Dermatologist", 
    practice: "Clear Skin Institute",
    location: "Seattle, WA",
    quote: "The clinical intelligence Ignite provides is remarkable. It helps me catch details I might miss and ensures comprehensive documentation for every patient visit.",
    rating: 5,
    stats: {
      hoursSaved: "45+ hours/month",
      patientsPerDay: "25+ patients",
      efficiencyGain: "120% increase"
    }
  },
  {
    id: "6",
    name: "Dr. Robert Kim",
    title: "Cardiology",
    practice: "Heart Health Specialists",
    location: "Miami, FL",
    quote: "Ignite understands medical terminology perfectly. Complex cardiac cases are documented with precision, and the time savings allow me to see more patients who need care.",
    rating: 5,
    stats: {
      hoursSaved: "70+ hours/month", 
      patientsPerDay: "20+ patients",
      efficiencyGain: "160% increase"
    }
  }
]

interface TestimonialsSectionProps {
  title?: string
  subtitle?: string
  showStats?: boolean
  showNavigation?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export function TestimonialsSection({
  title = "What Physicians Are Saying",
  subtitle = "Join thousands of healthcare providers who have transformed their practice with Ignite Health Systems.",
  showStats = true,
  showNavigation = true,
  autoPlay = true,
  autoPlayInterval = 6000,
  className = ""
}: TestimonialsSectionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    setIsMounted(true)
    
    // Stagger the card animations
    testimonials.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index])
      }, index * 100)
    })
  }, [])

  useEffect(() => {
    if (!autoPlay || !isMounted) return

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, isMounted])

  const handlePrevious = () => {
    setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1)
  }

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length)
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className={`py-16 md:py-24 relative overflow-hidden bg-background ${className}`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <svg
            className="absolute inset-0 w-full h-full opacity-15"
            viewBox="0 0 1920 1080"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="testimonials-gradient" cx="50%" cy="50%" r="60%">
                <stop offset="0%" style={{ stopColor: "hsl(var(--fire-gold))", stopOpacity: 0.12 }} />
                <stop offset="50%" style={{ stopColor: "hsl(var(--fire-primary))", stopOpacity: 0.06 }} />
                <stop offset="100%" style={{ stopColor: "hsl(var(--fire-accent))", stopOpacity: 0 }} />
              </radialGradient>
              <pattern id="testimonials-stars" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="40" cy="40" r="1.5" fill="hsl(var(--fire-gold))" opacity="0.4" />
                <circle cx="20" cy="60" r="1" fill="hsl(var(--primary))" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#testimonials-stars)" />
            <ellipse cx="960" cy="540" rx="500" ry="350" fill="url(#testimonials-gradient)" />
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
              <Quote className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Physician Testimonials</span>
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

        {/* Featured Testimonial */}
        <div
          className={`mb-16 transition-all duration-700 delay-200 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Card className={`max-w-5xl mx-auto p-8 md:p-12 text-center border-border hover:border-primary/20 transition-all duration-300 ${
            currentTestimonial.highlight ? "border-primary/30 bg-primary/5" : ""
          }`}>
            <CardContent className="p-0 space-y-8">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Quote className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-fire-gold fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed italic mb-8">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="space-y-2">
                <div className="text-lg font-semibold text-primary">
                  {currentTestimonial.name}
                </div>
                <div className="text-muted-foreground">
                  {currentTestimonial.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentTestimonial.practice} • {currentTestimonial.location}
                </div>
              </div>

              {/* Stats */}
              {showStats && currentTestimonial.stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-accent/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {currentTestimonial.stats.hoursSaved}
                    </div>
                    <div className="text-sm text-muted-foreground">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {currentTestimonial.stats.patientsPerDay}
                    </div>
                    <div className="text-sm text-muted-foreground">Patients/Day</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {currentTestimonial.stats.efficiencyGain}
                    </div>
                    <div className="text-sm text-muted-foreground">Efficiency Gain</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div
            className={`flex items-center justify-center gap-8 transition-all duration-700 delay-300 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-primary scale-125"
                      : "bg-accent/50 hover:bg-accent"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Testimonial Cards Grid (Alternative Display) */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 transition-all duration-700 delay-400 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`p-6 hover:shadow-lg hover:shadow-primary/10 border-border hover:border-primary/20 transition-all duration-300 ${
                visibleCards.includes(index) 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8"
              }`}
            >
              <CardContent className="p-0 space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-fire-gold fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground leading-relaxed text-sm">
                  "{testimonial.quote.substring(0, 120)}..."
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-accent/30">
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.practice}
                  </div>
                </div>

                {/* Quick Stat */}
                {testimonial.stats && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-primary font-medium">
                      {testimonial.stats.hoursSaved} saved
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div
          className={`text-center mt-16 transition-all duration-700 delay-500 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Physician Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.9</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-sm text-muted-foreground">Happy Providers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">165%</div>
              <div className="text-sm text-muted-foreground">Avg Efficiency Gain</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}