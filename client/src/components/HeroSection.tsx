import { Button } from '@/components/ui/button'
import { StatCard } from './StatCard'
import { ArrowRight, Play } from 'lucide-react'
import heroImage from '@assets/generated_images/Healthcare_team_collaboration_d0ca4e12.png'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.05)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Headlines */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
              The Clinical Co-pilot for{' '}
              <span className="text-primary">Independent Medicine</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              The system is broken. Your time is invaluable. Stop the busy-work and get back to healing.
            </p>
          </div>

          {/* Description */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Healthcare technology has failed physicians. Instead of facilitating care, it has created a crisis of documentation, burnout, and fragmentation. Ignite Health Systems is the answer. We are a physician-founded company delivering a revolutionary AI co-pilot that unifies your workflow, eliminates 60% of administrative overhead, and restores the vital time needed for clinical thought and patient connection.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" data-testid="button-join-innovation-council" className="text-base px-8">
              Join the Innovation Council
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" data-testid="button-watch-demo" className="text-base px-8">
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <StatCard
              value="42.2%"
              label="Physicians in Private Practice"
              description="A stark decline driven by administrative and financial pressures"
              trend="down"
            />
            <StatCard
              value="15.4"
              label="Hours/Week on Paperwork"
              description="Time stolen directly from patient care and well-being"
              trend="down"
            />
            <StatCard
              value="$100,000+"
              label="Annual Revenue Lost"
              description="Per physician due to EMR inefficiencies and documentation burden"
              trend="down"
            />
          </div>
        </div>
      </div>
    </div>
  )
}