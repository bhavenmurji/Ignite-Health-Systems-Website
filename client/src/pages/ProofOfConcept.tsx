import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Brain, Lightbulb, Rocket } from 'lucide-react'
import { Link } from 'wouter'
import oldSystemImage from '@assets/OldHospitalITArchitecture_1758739687681.png'
import dashboardImage from '@assets/ProofOfConceptFinalVision_1758739687681.png'
import neuralNetworkImage from '@assets/NeuralNetwork_1758739687681.png'

export default function ProofOfConcept() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-accent border-accent">
                <Brain className="w-4 h-4 mr-2" />
                Proof of Concept
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                The Future of Healthcare
                <span className="text-primary block">Intelligence</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Witness the transformation from fragmented healthcare systems to unified intelligence. 
                This is how we move from clicking between platforms to seamless clinical reasoning.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" data-testid="button-join-innovation">
                  <Rocket className="mr-2 h-4 w-4" />
                  Join Innovation Council
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" data-testid="button-watch-demo">
                <Lightbulb className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Images Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Platform Architecture & Design
              </h2>
              <p className="text-lg text-muted-foreground">
                Visual demonstration of our AI-native healthcare platform
              </p>
            </div>
            
            {/* Platform Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={oldSystemImage}
                    alt="Legacy Healthcare IT Architecture"
                    className="rounded-lg shadow-lg w-full hover-elevate"
                    data-testid="img-legacy-architecture"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="text-sm">Legacy Architecture</Badge>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Current Hospital IT Systems</h3>
                <p className="text-sm text-muted-foreground">
                  Fragmented, document-centric systems built for billing compliance rather than clinical excellence.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={dashboardImage}
                    alt="Ignite AI-Native Platform Dashboard"
                    className="rounded-lg shadow-lg w-full hover-elevate"
                    data-testid="img-ignite-dashboard"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="text-sm">AI-Native Platform</Badge>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Ignite Clinical Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Unified intelligence interface providing real-time insights and seamless workflow integration.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <img 
                    src={neuralNetworkImage}
                    alt="Neural Network Architecture"
                    className="rounded-lg shadow-lg w-full hover-elevate"
                    data-testid="img-neural-architecture"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-primary-foreground text-sm">Mamba AI</Badge>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Neural Network Foundation</h3>
                <p className="text-sm text-muted-foreground">
                  Revolutionary Mamba architecture understanding medical context and complexity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Stop Clicking, Start Healing
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This isn't about replacing doctors—it's about freeing us from the digital busy-work that prevents great medicine. 
              Join the movement to restore autonomy to physicians and put humanity back at the center of healthcare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" data-testid="button-join-movement">
                  Join the Movement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" data-testid="button-explore-philosophy">
                  Explore Philosophy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}