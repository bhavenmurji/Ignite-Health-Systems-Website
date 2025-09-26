import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Shield, Zap, Users, BarChart3, LucideIcon } from "lucide-react"

interface BentoCardProps {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
}

const BentoCard = ({ title, description, icon: Icon, gradient }: BentoCardProps) => (
  <Card className={`relative overflow-hidden border-border/50 bg-gradient-to-br ${gradient}`}>
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
    <CardHeader className="relative z-10">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="relative z-10 pt-0">
      <div className="h-32 flex items-center justify-center">
        <div className="w-full h-20 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center">
          <Icon className="w-12 h-12 text-primary/30" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export function BentoSectionHealth() {
  const cards = [
    {
      title: "AI Clinical Assistant",
      description: "Voice-enabled platform that reduces clicks and cognitive load with personalized workflows.",
      icon: Brain,
      gradient: "from-blue-500/10 to-purple-500/10",
    },
    {
      title: "Save 70+ Hours Monthly",
      description: "Automated documentation and administrative tasks free up your time for patient care.",
      icon: Clock,
      gradient: "from-green-500/10 to-blue-500/10",
    },
    {
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with end-to-end encryption and audit trails.",
      icon: Shield,
      gradient: "from-red-500/10 to-orange-500/10",
    },
    {
      title: "Real-time Analytics",
      description: "Live insights into practice performance and patient outcomes.",
      icon: BarChart3,
      gradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Instant Deployment",
      description: "Go live in 24 hours with our cloud-first architecture and automated setup.",
      icon: Zap,
      gradient: "from-yellow-500/10 to-red-500/10",
    },
    {
      title: "Team Collaboration",
      description: "Multiple providers working simultaneously with real-time collaboration tools.",
      icon: Users,
      gradient: "from-cyan-500/10 to-blue-500/10",
    },
  ]

  return (
    <section className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-transparent">
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-4">
            <h2 className="w-full max-w-[655px] text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
              Transform Your Practice with AI
            </h2>
            <p className="w-full max-w-[600px] text-center text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              Empower your clinical workflow with AI that understands healthcare. 
              From documentation to diagnosis support, we've got you covered.
            </p>
          </div>
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}