"use client"

import { NewsletterForm } from "@/components/forms/NewsletterForm"
import { GlassFireCard } from "@/components/ui/GlassMorphism"
import { cn } from "@/lib/utils"
import { Sparkles, Zap, Heart, TrendingUp, Users, MessageCircle } from "lucide-react"

interface NewsletterBannerProps {
  className?: string
  variant?: "default" | "compact" | "hero"
}

export function NewsletterBanner({ className, variant = "default" }: NewsletterBannerProps) {
  if (variant === "compact") {
    return (
      <section className={cn(
        "relative py-12 px-4 overflow-hidden",
        "bg-gradient-to-r from-fire-600 via-fire-500 to-fire-600",
        className
      )}>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
            <h2 className="text-2xl font-bold text-white">
              Stay in the Loop
            </h2>
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
          </div>
          
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Get weekly insights on healthcare innovation and platform updates.
          </p>
          
          <div className="flex justify-center px-4">
            <div className="w-full max-w-md">
              <NewsletterForm 
                variant="inline" 
                className="w-full"
                placeholder="Your email address"
                buttonText="Join Now"
              />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (variant === "hero") {
    return (
      <section className={cn(
        "relative py-24 px-4 overflow-hidden min-h-[80vh] flex items-center",
        "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
        className
      )}>
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-fire-500/20 via-transparent to-blue-500/20 animate-pulse" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-fire-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fire-500/20 text-fire-400 mb-6">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Healthcare Innovation</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Transform Healthcare
                <span className="block text-fire-400">Together</span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 max-w-md mx-auto lg:mx-0">
                Join thousands of healthcare professionals revolutionizing patient care with cutting-edge technology.
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-400 mb-8">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-fire-400" />
                  <span>10,000+ Subscribers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-fire-400" />
                  <span>Weekly Updates</span>
                </div>
              </div>
            </div>
            
            {/* Newsletter Form */}
            <div className="flex justify-center lg:justify-end">
              <GlassFireCard className="w-full max-w-lg">
                <NewsletterForm 
                  variant="minimal"
                  className=""
                  showName={true}
                  buttonText="Join the Revolution"
                  placeholder="Enter your email"
                />
              </GlassFireCard>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn(
      "relative py-20 px-4 overflow-hidden",
      "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
      className
    )}>
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-fire-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fire-500/20 text-fire-400 mb-6">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Newsletter</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Stay Ahead of the Curve
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Get exclusive insights, feature updates, and industry trends delivered directly to your inbox. 
            Join our community of healthcare innovators.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-slate-400 mb-12">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-fire-400" />
              <span className="hidden sm:inline">10,000+ Healthcare Professionals</span>
              <span className="sm:hidden">10k+ Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-fire-400" />
              <span className="hidden sm:inline">Weekly Industry Insights</span>
              <span className="sm:hidden">Weekly Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-fire-400" />
              <span className="hidden sm:inline">Exclusive Content</span>
              <span className="sm:hidden">Exclusive Content</span>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Benefits */}
          <div className="lg:col-span-1 space-y-6">
            <GlassFireCard className="p-6 group cursor-pointer hover:scale-105 transition-all duration-300">
              <TrendingUp className="h-8 w-8 text-fire-400 mb-3 group-hover:text-fire-300 transition-colors duration-300" />
              <h3 className="text-lg font-semibold text-white mb-2">Early Access</h3>
              <p className="text-slate-300 text-sm">Be the first to know about new features and platform updates.</p>
            </GlassFireCard>
            
            <GlassFireCard className="p-6 group cursor-pointer hover:scale-105 transition-all duration-300">
              <Heart className="h-8 w-8 text-fire-400 mb-3 group-hover:text-fire-300 transition-colors duration-300" />
              <h3 className="text-lg font-semibold text-white mb-2">Expert Insights</h3>
              <p className="text-slate-300 text-sm">Learn from healthcare technology leaders and industry experts.</p>
            </GlassFireCard>
          </div>
          
          {/* Newsletter Form */}
          <div className="lg:col-span-2 flex justify-center">
            <GlassFireCard className="w-full max-w-lg">
              <NewsletterForm 
                variant="minimal"
                className=""
                showName={true}
                buttonText="Subscribe Now"
                placeholder="Enter your email address"
              />
            </GlassFireCard>
          </div>
        </div>
      </div>
    </section>
  )
}