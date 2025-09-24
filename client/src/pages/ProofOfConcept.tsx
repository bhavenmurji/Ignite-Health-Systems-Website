import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Brain, Lightbulb, Rocket } from 'lucide-react'
import { Link } from 'wouter'
import aviationAnalogy from '@assets/CoPilotAnalogy_1758754810597.png'
import currentHealthcare from '@assets/Computer_1758754810597.png'
import futureHealthcare from '@assets/CoDoctor_1758754810596.png'
import proofOfConcept from '@assets/ProofOfConceptFinalVision_1758754810597.png'
import rocketVsCar from '@assets/RocketOnHorsevsNewCar_1758754810597.png'

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

      {/* Transformation Journey */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The Three-Stage Transformation
              </h2>
              <p className="text-lg text-muted-foreground">
                From aviation principles to healthcare evolution
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-aviation-analogy">
                  <img 
                    src={aviationAnalogy} 
                    alt="Aviation Analogy - Co-pilot Orchestrates Crew & Systems" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">1. Aviation Inspiration</h3>
                  <p className="text-sm text-muted-foreground">
                    Like aviation co-pilots orchestrate complex systems, healthcare needs unified intelligence
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-current-healthcare">
                  <img 
                    src={currentHealthcare} 
                    alt="Current Healthcare System - The Single Computer Screen Is A Fragmented Barrier" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">2. Current Crisis</h3>
                  <p className="text-sm text-muted-foreground">
                    Fragmented systems create barriers between physicians and optimal patient care
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-future-healthcare">
                  <img 
                    src={futureHealthcare} 
                    alt="Future Healthcare System - Ignite: Clinical Co-Pilot Enhances Direct Patient-Physician Relationship" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">3. Ignite Solution</h3>
                  <p className="text-sm text-muted-foreground">
                    Unified clinical co-pilot enhances the direct patient-physician relationship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evolution vs Revolution */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Stop Bolting Rockets onto Horses
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Legacy healthcare systems are trapped in the past, frantically bolting AI features onto fragmented platforms. 
                    It's like strapping a rocket to a horse—impressive engineering, but fundamentally the wrong approach.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="border-l-4 border-destructive pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">The Fragmentation Crisis</h3>
                    <p className="text-muted-foreground">
                      Current AI adds speed to broken workflows. You're still context-switching between EMRs, transcription tools, 
                      research platforms, and study apps. Even DAX can't see your chart data—you're narrating blindly across disconnected systems.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">The Evolution Imperative</h3>
                    <p className="text-muted-foreground">
                      True transformation requires evolutionary change—not incremental improvements to outdated modes of transport. 
                      Just as the automobile didn't improve the horse, next-generation healthcare AI demands a completely new foundation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative max-w-lg w-full">
                  <img 
                    src={rocketVsCar} 
                    alt="Legacy systems: Rocket on Horse vs Next-generation: Car with Robots" 
                    className="w-full h-auto rounded-lg hover-elevate bg-card/50 p-2"
                    data-testid="image-evolution-analogy"
                  />
                  <div className="absolute -bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-md">
                      Legacy vs Next-Generation Healthcare Technology
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Realization */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center order-2 lg:order-1">
                <div className="relative max-w-lg w-full">
                  <img 
                    src={proofOfConcept} 
                    alt="Proof of Concept - Ignite's Unified Healthcare Intelligence" 
                    className="w-full h-auto rounded-lg hover-elevate bg-card/50 p-2"
                    data-testid="image-proof-concept"
                  />
                  <div className="absolute -bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-md">
                      The Future of Unified Healthcare Intelligence
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    One Unified Intelligence Layer
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Imagine walking into patient rooms with complete context already synthesized. 
                    AI captures ambient conversation while accessing full chart history, providing real-time evidence 
                    and clinical guidelines contextually.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Zero Clicking:</strong> No more cognitive fragmentation across 7+ platforms
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Invisible Documentation:</strong> Happens seamlessly while you focus on patients
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Personalized Learning:</strong> AI analyzes daily decisions against evidence-based guidelines
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Badge variant="outline" className="text-accent border-accent">
                    Supercharged Human Doctor
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-muted/30">
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
              <Link href="/platform">
                <Button variant="outline" size="lg" data-testid="button-explore-platform">
                  Explore Platform
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