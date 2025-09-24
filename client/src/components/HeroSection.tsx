import { Button } from '@/components/ui/button'
import { StatCard } from './StatCard'
import { ArrowRight, Play } from 'lucide-react'
import heroImage from '@assets/IgniteARevolution_1758739687681.png'

export function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      {/* Dark wash overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-primary/30" />
      {/* Subtle geometric accent overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(60deg, hsl(15, 85%, 45%) 25%, transparent 25%, transparent 75%, hsl(15, 85%, 45%) 75%), 
            linear-gradient(120deg, hsl(35, 80%, 50%) 25%, transparent 25%, transparent 75%, hsl(35, 80%, 50%) 75%)`,
          backgroundSize: '120px 120px',
          backgroundPosition: '0 0, 60px 60px'
        }}
      />
      {/* Subtle animated glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent animate-pulse" />
      
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Headlines */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
              The Clinical Co-pilot for{' '}
              <span className="text-primary">Independent Medicine</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 font-medium">
              plagued by click fatigue? Time to take back control of the clinic from the coders.
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