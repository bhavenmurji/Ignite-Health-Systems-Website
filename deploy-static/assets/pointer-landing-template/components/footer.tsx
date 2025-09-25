"use client"

import { useState, useEffect } from "react"
import { Mail, MapPin, Phone, ArrowRight, Heart, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const footerLinks = {
    company: [
      { name: "The Platform", href: "#platform" },
      { name: "Our Approach", href: "#approach" },
      { name: "The Founder", href: "#founder" },
      { name: "Join the Movement", href: "#join" }
    ],
    solutions: [
      { name: "Clinical Co-Pilot", href: "#clinical-copilot" },
      { name: "Practice Growth", href: "#practice-growth" },
      { name: "Universal Integration", href: "#integration" },
      { name: "HIPAA Compliance", href: "#compliance" }
    ],
    resources: [
      { name: "Clinical Innovation Council", href: "#innovation-council" },
      { name: "Documentation", href: "#docs" },
      { name: "Support", href: "#support" },
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" }
    ]
  }

  return (
    <footer className="w-full relative overflow-hidden bg-background border-t border-border/40">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/3 to-primary/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 transition-all duration-700 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Company info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Stethoscope className="w-6 h-6 text-primary" />
                </div>
                <div className="text-xl font-bold text-foreground">
                  Ignite Health Systems
                </div>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                The physician-built clinical co-pilot that automates administrative work, 
                saving you 70+ hours a month and returning focus to patient care.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>hello@ignitehealthsystems.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>New York, NY</span>
                </div>
              </div>
            </div>

            {/* Company links */}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions links */}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Solutions
              </h4>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Newsletter */}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-3 mb-6">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Newsletter signup */}
              <div className="space-y-4">
                <h5 className="text-sm font-semibold text-foreground">
                  Stay Updated
                </h5>
                <p className="text-xs text-muted-foreground">
                  Get the latest updates on our Clinical Co-Pilot development.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 text-sm rounded-md border border-border/40 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
                  />
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary-dark px-3"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/40 bg-background/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div
              className={`flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-700 delay-200 ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Ignite Health Systems. All rights reserved.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Built with</span>
                  <Heart className="w-3 h-3 text-red-500 fill-current" />
                  <span>for physicians</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}