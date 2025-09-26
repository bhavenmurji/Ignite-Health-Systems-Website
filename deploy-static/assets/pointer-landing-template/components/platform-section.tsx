"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Stethoscope, TrendingUp, Network, ChevronRight, Users, BarChart3, Globe } from "lucide-react"

export function PlatformSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const pillars = [
    {
      icon: Stethoscope,
      title: "Clinical-Led User Experience",
      description: "Experience an intuitive, voice-enabled platform that reduces clicks and cognitive load, with personalized workflows that adapt to your unique style of practice."
    },
    {
      icon: TrendingUp,
      title: "End-to-End Practice Growth",
      description: "Ignite is more than an EHR. With an integrated Member App, training-free Staff Tools, and real-time Business Insights, our platform provides everything you need to run an efficient and profitable independent practice."
    },
    {
      icon: Network,
      title: "Universal Integration",
      description: "Our platform offers seamless connectivity with the labs, pharmacies, and specialty systems you rely on, creating a unified hub for all patient information."
    }
  ]

  const adjacentMarkets = [
    "Chiropractic",
    "Veterinary Care", 
    "Dentistry",
    "Physical Therapy"
  ]

  return (
    <section id="platform" className="py-24 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/3 to-blue-500/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-purple-500/3 to-primary/3 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center space-y-6 mb-16 transition-all duration-700 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            The OS for Independent Healthcare
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            One unified platform to run your entire practice, from patient engagement to clinical documentation.
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className={`space-y-6 p-8 rounded-2xl bg-accent/30 border border-accent/50 backdrop-blur-sm hover:bg-accent/40 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] transition-all duration-700 delay-${index * 100} ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <pillar.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {pillar.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Adjacent Markets Section */}
        <div
          className={`space-y-8 transition-all duration-700 delay-400 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              More Than Just Medicine
            </h3>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              The same administrative burdens plaguing physicians also affect independent practices in{" "}
              <span className="text-primary font-semibold">chiropractic, veterinary care, dentistry, and physical therapy</span>. 
              Our core automation engine is designed to solve these universal operational challenges, making Ignite the definitive platform for all independent healthcare services.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {adjacentMarkets.map((market) => (
              <div
                key={market}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors duration-200"
              >
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">{market}</span>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Discover the Platform
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}