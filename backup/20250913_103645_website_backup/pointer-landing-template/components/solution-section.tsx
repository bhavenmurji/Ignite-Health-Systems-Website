"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, Calendar, Sparkles, Activity, TrendingUp, Heart } from "lucide-react"

export function SolutionSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const benefits = [
    {
      icon: Clock,
      value: "10+",
      label: "Minutes saved per visit",
      description: "More time for direct patient care",
    },
    {
      icon: Calendar,
      value: "2",
      label: "Weeks reclaimed monthly",
      description: "Nearly two full work weeks saved",
    },
    {
      icon: Activity,
      value: "5",
      label: "Minutes or less",
      description: "Complete administrative work",
    },
  ]

  return (
    <section className="w-full px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient - shifting from problem's red/orange to solution's blue/green */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute center w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Section badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">The Solution</span>
          </div>

          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The <span className="text-primary">10-Minute Revolution</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Ignite's Clinical Co-Pilot is designed to automate the 15+ minutes of in-visit administrative work, 
            cutting it to under 5. We give you back over{" "}
            <span className="font-semibold text-foreground">10 minutes of direct patient care time</span> in 
            every single encounter, saving you{" "}
            <span className="font-semibold text-foreground">nearly two full work weeks every month</span>.
          </p>
        </div>

        {/* Benefits grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 transition-all duration-700 delay-200 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 hover:border-primary/40 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-lg bg-primary/10 mb-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-1">{benefit.value}</div>
                  <div className="text-sm font-medium text-foreground mb-2">{benefit.label}</div>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual transformation indicator */}
        <div
          className={`flex items-center justify-center gap-4 mb-12 transition-all duration-700 delay-300 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-20 h-20 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-red-500">15+</span>
            </div>
            <span className="text-sm text-muted-foreground">minutes of admin work</span>
          </div>
          
          <ArrowRight className="w-8 h-8 text-primary animate-pulse" />
          
          <div className="flex items-center gap-2">
            <div className="w-20 h-20 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-green-500">&lt;5</span>
            </div>
            <span className="text-sm text-muted-foreground">minutes with Ignite</span>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`flex justify-center transition-all duration-700 delay-400 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Discover the Platform
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Bottom accent */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-500 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-primary/20">
            <Heart className="w-5 h-5 text-primary" />
            <p className="text-sm md:text-base font-medium">
              Restoring the joy of medicine, one click at a time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}