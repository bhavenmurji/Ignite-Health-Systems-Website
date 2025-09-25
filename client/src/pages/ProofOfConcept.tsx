import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Brain, Lightbulb, Rocket } from 'lucide-react'
import { Link } from 'wouter'
import aviationAnalogy from '@assets/CoPilotAnalogy_1758754810597.png'
import currentHealthcare from '@assets/Computer_1758754810597.png'
import futureHealthcare from '@assets/CoDoctor_1758754810596.png'
import proofOfConcept from '@assets/ProofOfConceptFinalVision_1758754810597.png'
import coFounderSearch from '@assets/image_1758758549058.png'

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

      {/* Transformation Journey - Triangular Arrangement */}
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

            {/* Current Crisis: Image left, Text right */}
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex justify-center order-2 lg:order-1">
                  <div className="max-w-lg w-full">
                    <div className="aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-current-healthcare">
                      <img 
                        src={currentHealthcare} 
                        alt="Current Healthcare System - The Single Computer Screen Is A Fragmented Barrier" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">The Fragmentation Crisis: Lost in the Digital Maze</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Current healthcare AI adds speed to broken workflows, forcing physicians to frantically click between fragmented systems. This isn't just inefficient; it's a barrier that steals precious time from patients and critical thinking from doctors. We're trapped in a digital maze, where essential insights are scattered across platforms, preventing seamless care and burning out dedicated professionals.
                  </p>
                </div>
              </div>
            </div>

            {/* Old Way vs Ignite Way */}
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* The Old Way */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">The Old Way</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Document-centric EMRs built in the 1990s for billing and compliance. Fragmented, slow, and forcing physicians into endless clicking through disconnected systems.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="max-w-sm w-full">
                      <div className="aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-old-way">
                        <img 
                          src={currentHealthcare} 
                          alt="Document-centric EMRs built in the 1990s - The Fragmented Barrier" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm text-muted-foreground">Document-Centric EMR Workflow</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The Ignite Way */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">The Ignite Way</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Unified clinical intelligence layer that enhances human judgment with real-time AI insights, ambient listening, and seamless workflow integration.
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="max-w-sm w-full">
                      <div className="aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-ignite-way">
                        <img 
                          src={futureHealthcare} 
                          alt="AI-Native Platform - Unified clinical intelligence layer" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm text-muted-foreground">Neural Network Architecture</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mamba-Based Clinical AI Section */}
              <div className="mt-12 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">Mamba-Based Clinical AI</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Built on revolutionary Mamba architecture that understands the context and complexity of medical decision-making.
                  </p>
                  <div className="flex justify-center">
                    <div className="max-w-md w-full">
                      <div className="rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-cofounder-search">
                        <img 
                          src={coFounderSearch} 
                          alt="Co-founder Search - Revolutionary AI Architecture" 
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm text-muted-foreground">Seeking Technical Co-Founder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aviation Inspiration & Ignite Solution */}
            <div className="flex flex-col md:grid md:grid-cols-2 gap-12">
              {/* Aviation: Text above image */}
              <div className="flex flex-col space-y-6 order-1">
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">Aviation Inspiration: Orchestrated Command, Unburdened Care</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Just as an aviation co-pilot expertly manages complex systems and crew, allowing the captain to command the flight, healthcare needs unified intelligence. This analogy underscores our vision: to offload the administrative and informational burden from physicians, empowering them to deliver exceptional patient care with seamless support, clarity, and restored autonomy.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="max-w-sm w-full">
                    <div className="aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-aviation-analogy">
                      <img 
                        src={aviationAnalogy} 
                        alt="Aviation Analogy - Co-pilot Orchestrates Crew & Systems" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ignite Solution: Keep as image above text */}
              <div className="flex flex-col items-center space-y-6 order-2">
                <div className="max-w-sm w-full">
                  <div className="aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-future-healthcare">
                    <img 
                      src={futureHealthcare} 
                      alt="Future Healthcare System - Ignite: Clinical Co-Pilot Enhances Direct Patient-Physician Relationship" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">Ignite Solution: One Unified Intelligence Layer</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Imagine a future where you walk into patient rooms with complete context already synthesized. Ignite: Clinical Co-Pilot eliminates cognitive fragmentation, seamlessly connecting all vital information—from EHR to evidence-based guidelines—into one intuitive layer. This isn't about replacing doctors; it's about freeing them from digital busy-work, making them supercharged human doctors who can truly focus on healing.
                  </p>
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