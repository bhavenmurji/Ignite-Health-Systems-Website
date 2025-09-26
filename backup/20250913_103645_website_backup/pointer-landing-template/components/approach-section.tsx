"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Beaker, 
  Stethoscope, 
  Rocket, 
  CheckCircle2,
  Shield,
  Brain,
  Target
} from "lucide-react"

export function ApproachSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const phases = [
    {
      number: "01",
      title: "Theoretical Proof",
      subtitle: "\"The Lab Result\"",
      description: "We begin by scientifically validating our Mamba-based architecture against critical clinical problems like Acute Kidney Injury (AKI) prediction, delivering irrefutable proof of our engine's power before it ever touches a patient workflow.",
      icon: Beaker,
      color: "from-purple-500/20 to-blue-500/20",
      borderColor: "border-purple-500/30",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      metrics: ["AKI Prediction", "Clinical Validation", "Engine Proof"]
    },
    {
      number: "02",
      title: "Working Proof",
      subtitle: "\"The Clinical Trial\"",
      description: "Next, we deploy our MEDFlow OS to our Clinical Innovation Council. We prove our value with a non-AI 'painkiller' foundation, then integrate our validated AI models to deliver the '10-Minute Revolution'.",
      icon: Stethoscope,
      color: "from-blue-500/20 to-green-500/20",
      borderColor: "border-blue-500/30",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      metrics: ["MEDFlow OS", "Clinical Council", "10-Min Revolution"]
    },
    {
      number: "03",
      title: "The Vision Actualized",
      subtitle: "\"The New Standard of Care\"",
      description: "Finally, we deploy our full Synchronous Reasoning Engine, leveraging the trust and data from our beachhead market to become the indispensable OS for independent medicine.",
      icon: Rocket,
      color: "from-green-500/20 to-primary/20",
      borderColor: "border-green-500/30",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
      metrics: ["Full Deployment", "Market Trust", "Healthcare OS"]
    }
  ]

  return (
    <section className="w-full px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-green-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Our Approach</span>
          </div>

          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our Strategy: <span className="text-primary">Earning Clinical Trust</span> at Every Step
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Our mission is to build the new standard of care. To do that, we have a disciplined, 
            three-stage journey to{" "}
            <span className="font-semibold text-foreground">de-risk our technology</span>,{" "}
            <span className="font-semibold text-foreground">validate our impact</span>, and{" "}
            <span className="font-semibold text-foreground">earn your trust</span>.
          </p>
        </div>

        {/* Phases timeline */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/20 via-blue-500/20 to-green-500/20 -translate-x-1/2 hidden md:block" />

          <div className="space-y-8 md:space-y-12">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`transition-all duration-700 delay-${index * 100} ${
                  isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <div className={`flex flex-col md:flex-row gap-6 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}>
                  {/* Phase content */}
                  <div className="flex-1 relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} rounded-2xl blur-xl`} />
                    <div className={`relative bg-background/50 backdrop-blur-sm border ${phase.borderColor} rounded-2xl p-8 hover:border-primary/40 transition-all duration-300`}>
                      {/* Phase number */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`text-4xl font-bold ${phase.iconColor} opacity-50`}>
                          {phase.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-foreground mb-1">
                            {phase.title}
                          </h3>
                          <p className="text-lg font-medium text-primary">
                            {phase.subtitle}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg ${phase.iconBg}`}>
                          <phase.icon className={`w-6 h-6 ${phase.iconColor}`} />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {phase.description}
                      </p>

                      {/* Metrics */}
                      <div className="flex flex-wrap gap-2">
                        {phase.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${phase.iconBg} border ${phase.borderColor}`}
                          >
                            <CheckCircle2 className={`w-3 h-3 ${phase.iconColor}`} />
                            <span className="text-xs font-medium">{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Timeline node */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className={`relative w-16 h-16 rounded-full ${phase.iconBg} border-2 ${phase.borderColor} flex items-center justify-center`}>
                      <phase.icon className={`w-8 h-8 ${phase.iconColor}`} />
                      {/* Pulse animation */}
                      <div className={`absolute inset-0 rounded-full ${phase.iconBg} animate-ping opacity-20`} />
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 border border-primary/20">
              <Shield className="w-5 h-5 text-primary" />
              <p className="text-sm md:text-base font-medium">
                Built with physician input at every stage
              </p>
            </div>
            
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 border border-primary/20">
              <Brain className="w-5 h-5 text-primary" />
              <p className="text-sm md:text-base font-medium">
                Validated AI with clinical evidence before deployment
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`flex justify-center mt-12 transition-all duration-700 delay-600 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Join Our Clinical Innovation Council
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}