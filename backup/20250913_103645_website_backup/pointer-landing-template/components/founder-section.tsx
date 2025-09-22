"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  User, 
  Award, 
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  Users,
  Star,
  Building
} from "lucide-react"

export function FounderSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const credentials = [
    {
      icon: GraduationCap,
      title: "MD, MSci",
      description: "Medical Degree & Master of Science"
    },
    {
      icon: Award,
      title: "Chief Resident",
      description: "Virtua Health Leadership"
    },
    {
      icon: Building,
      title: "Epic EMR Committee",
      description: "Optimization Committee Member"
    },
    {
      icon: Heart,
      title: "Family Medicine",
      description: "US & UK Healthcare Systems"
    }
  ]

  return (
    <section className="w-full px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/5 to-primary/10 rounded-full blur-3xl" />
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
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">The Founder</span>
          </div>

          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            A Physician's Mission to <span className="text-primary">Heal Healthcare</span>
          </h2>
        </div>

        {/* Founder content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Story */}
          <div
            className={`space-y-6 transition-all duration-700 delay-200 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Trial by Fire section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl blur-xl" />
              <div className="relative bg-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  A Trial by Fire
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  My medical career was forged in the trial-by-fire of the COVID-19 pandemic. 
                  In May 2020, I felt a duty to graduate early and join the front lines. 
                  That experience exposed the profound disconnect between the ideals of medicine 
                  and the administrative reality we are forced to navigate. I saw how the 
                  "physician tax"—the endless clicks, the chaotic inboxes, the hours of pajama 
                  time—was not just an inefficiency, but a direct cause of the burnout and 
                  moral injury decimating my profession. I founded Ignite Health Systems 
                  because I refuse to accept this as our future.
                </p>
              </div>
            </div>

            {/* About section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">
                About Dr. Bhaven Murji, MD, MSci
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Dr. Bhaven Murji is a technology-forward Family Medicine physician with 
                extensive front-line experience in both the US and UK healthcare systems. 
                His background includes leadership roles as <span className="font-semibold text-foreground">Chief Resident</span> at 
                Virtua Health, where he also served on the <span className="font-semibold text-foreground">Epic EMR Optimization Committee</span>. 
                A dedicated clinical researcher, he is building Ignite not just as a CEO, 
                but as its most demanding first user.
              </p>
            </div>
          </div>

          {/* Right column - Credentials & Team */}
          <div
            className={`space-y-6 transition-all duration-700 delay-300 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Credentials grid */}
            <div className="grid grid-cols-2 gap-4">
              {credentials.map((credential, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl blur group-hover:blur-lg transition-all duration-300" />
                  <div className="relative bg-background/50 backdrop-blur-sm border border-primary/20 rounded-xl p-4 hover:border-primary/40 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <credential.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-sm">
                          {credential.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {credential.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Building the Team section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-primary/10 rounded-2xl blur-xl" />
              <div className="relative bg-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Building the Team
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A mission this critical cannot be achieved alone. We are actively building 
                  a world-class team of engineers, designers, and product leaders who share 
                  our passion for solving healthcare's most fundamental problems.
                </p>
                
                {/* Team stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">10+</div>
                    <div className="text-xs text-muted-foreground">Engineers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">5+</div>
                    <div className="text-xs text-muted-foreground">Designers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">15+</div>
                    <div className="text-xs text-muted-foreground">Advisors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent - Mission statement */}
        <div
          className={`mt-12 text-center transition-all duration-700 delay-400 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-primary/10 to-blue-500/10 rounded-2xl blur-xl" />
              <div className="relative bg-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8">
                <Star className="w-8 h-8 text-primary mx-auto mb-4" />
                <p className="text-lg md:text-xl font-semibold text-foreground italic">
                  "I'm building Ignite not just as a CEO, but as its most demanding first user. 
                  Every feature, every click saved, every minute returned to patient care—it all 
                  matters because I've lived this problem."
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  — Dr. Bhaven Murji, MD, MSci
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={`flex justify-center mt-8 transition-all duration-700 delay-500 ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary-dark px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Join Our Mission
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}