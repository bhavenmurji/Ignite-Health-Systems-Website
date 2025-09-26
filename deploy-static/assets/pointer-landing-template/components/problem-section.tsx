"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Clock, TrendingDown, Users } from "lucide-react"

export function ProblemSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const stats = [
    {
      icon: Clock,
      value: "36.2",
      unit: "minutes",
      description: "on EHR for every 30-minute visit",
    },
    {
      icon: Users,
      value: "71%",
      unit: "of physicians",
      description: "blame their EHR for burnout",
    },
    {
      icon: TrendingDown,
      value: "2+ hours",
      unit: "daily",
      description: "of unpaid administrative work",
    },
  ]

  return (
    <section className="w-full px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Section badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-foreground">The Hidden Crisis</span>
          </div>

          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            The Physician Tax Is <span className="text-red-500">Real</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your EHR was designed for billing, not for you. This 'physician tax' forces you to spend{" "}
            <span className="font-semibold text-foreground">36.2 minutes on the EHR for every 30-minute visit</span>. 
            This isn't just inefficient; it's a systemic crisis driving burnout, with{" "}
            <span className="font-semibold text-foreground">71% of physicians</span> blaming their EHR.
          </p>
        </div>

        {/* Stats grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-background/50 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-red-500/10">
                    <stat.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                      <span className="text-sm text-muted-foreground">{stat.unit}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact statement */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-400 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <p className="text-sm md:text-base font-medium">
              This administrative burden isn't just stealing your time—it's stealing your purpose.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}