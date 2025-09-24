import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, XCircle, Monitor, Smartphone, Cloud, Zap } from 'lucide-react'
import { Stethoscope } from 'healthicons-react/outline'
import { Link } from 'wouter'
import dashboardImage from '@assets/ProofOfConceptFinalVision_1758739687681.png'
import oldSystemImage from '@assets/OldHospitalITArchitecture_1758739687681.png'
import neuralNetworkImage from '@assets/NeuralNetwork_1758739687681.png'

export default function Platform() {
  return (
    <div className="min-h-screen">
      {/* Hero Quote */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <blockquote className="text-2xl md:text-3xl font-serif text-muted-foreground leading-relaxed">
              "My dream is Ignite—AI that eliminates the endless clicking between screens so I can be a supercharged human doctor. Instead of fragmenting my attention across multiple platforms, I get one unified intelligence layer that makes me brilliant at the bedside, not just busy at the computer."
            </blockquote>
            <cite className="text-lg font-semibold text-primary">
              – Dr. Bhaven Murji, Founder
            </cite>
          </div>
        </div>
      </section>

      {/* From Document-Centric to AI-Native */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                From a Document-Centric Past to an{' '}
                <span className="text-primary">AI-Native Future</span>
              </h2>
            </div>
            
            {/* Comparison Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={oldSystemImage}
                    alt="Legacy Healthcare IT Systems"
                    className="rounded-lg shadow-lg w-full opacity-75"
                    data-testid="img-old-system"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="text-sm">Legacy Systems</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">The Old Way</h3>
                  <p className="text-muted-foreground">
                    Document-centric EMRs built in the 1990s for billing and compliance. Fragmented, slow, and forcing physicians into endless clicking through disconnected systems.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src={dashboardImage}
                    alt="Ignite AI-Native Clinical Platform"
                    className="rounded-lg shadow-lg w-full"
                    data-testid="img-platform-dashboard"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="text-sm">AI-Native Platform</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground">The Ignite Way</h3>
                  <p className="text-muted-foreground">
                    Unified clinical intelligence layer that enhances human judgment with real-time AI insights, ambient listening, and seamless workflow integration.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Architecture Visual */}
            <div className="text-center">
              <div className="relative inline-block">
                <img 
                  src={neuralNetworkImage}
                  alt="Neural Network Architecture"
                  className="rounded-lg shadow-lg max-w-md mx-auto"
                  data-testid="img-neural-network"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary/90 text-primary-foreground">
                    Mamba-Based Clinical AI
                  </Badge>
                </div>
              </div>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                Built on revolutionary Mamba architecture that understands the context and complexity of medical decision-making
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current AI Reality vs Ignite Future */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Current AI Reality vs. The Ignite Future
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Current Reality */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-5 w-5" />
                    The "Current AI" Reality: The Maze of Fragmentation
                  </CardTitle>
                  <CardDescription>
                    Even with the latest AI scribes, your day is a constant, exhausting context-switch between disconnected systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive" className="mt-1">EMR</Badge>
                        <p className="text-sm text-muted-foreground">
                          Epic/Cerner: A digital filing cabinet where you spend 67% of your time just searching for information
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive" className="mt-1">AI</Badge>
                        <p className="text-sm text-muted-foreground">
                          DAX Copilot: A "blind" listener that can't see chart data, forcing you to narrate lab results
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive" className="mt-1">Guidelines</Badge>
                        <p className="text-sm text-muted-foreground">
                          UpToDate: A separate library requiring you to leave your workflow and manually copy-paste
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive" className="mt-1">Research</Badge>
                        <p className="text-sm text-muted-foreground">
                          PubMed/OpenEvidence: Another disconnected silo for deeper investigation
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive" className="mt-1">Board Prep</Badge>
                        <p className="text-sm text-muted-foreground">
                          AAFP/UWorld: Completely separate universe with zero connection to your clinical practice
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ignite Future */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    The Ignite Future: A Unified Clinical OS
                  </CardTitle>
                  <CardDescription>
                    Ignite replaces the maze with a single, unified intelligence layer—a true Clinical Operating System
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Badge className="mt-1">Intelligent</Badge>
                        <p className="text-sm text-muted-foreground">
                          <strong>Precharting:</strong> Multi-agent system analyzes schedules and histories, surfaces trends and care gaps
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge className="mt-1">Supercharged</Badge>
                        <p className="text-sm text-muted-foreground">
                          <strong>Patient Care:</strong> Ambient listening with real-time clinical decision support and chart integration
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge className="mt-1">Autonomous</Badge>
                        <p className="text-sm text-muted-foreground">
                          <strong>Practice Management:</strong> Automates membership management, renewals, and billing for DPC practices
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge className="mt-1">Integrated</Badge>
                        <p className="text-sm text-muted-foreground">
                          <strong>Lifelong Learning:</strong> Transforms practice into personalized board prep and learning modules
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tangible Impact */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              The Tangible Impact: Reclaiming Your Practice
            </h2>
            <p className="text-xl opacity-90">
              This is a revolution in your workday, with a validated ROI of $3.20 for every $1 invested in AI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              <div className="space-y-2">
                <div className="text-3xl font-bold">70+</div>
                <div className="text-sm opacity-80">Hours Reclaimed Per Month</div>
                <div className="text-xs opacity-70">Eradicate "pajama time" charting</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm opacity-80">Minutes Saved Per Encounter</div>
                <div className="text-xs opacity-70">Stop clicking and start thinking</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">90%</div>
                <div className="text-sm opacity-80">Documentation Time Reduction</div>
                <div className="text-xs opacity-70">Move to real-time review</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-80">Clinical Excellence Boost</div>
                <div className="text-xs opacity-70">Large system efficiency, independent autonomy</div>
              </div>
            </div>

            <div className="pt-8">
              <Link href="/signup">
                <Button variant="outline" size="lg" className="text-primary border-primary-foreground hover:bg-primary-foreground" data-testid="button-get-started">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Platform Features
              </h2>
              <p className="text-lg text-muted-foreground">
                Built for the modern healthcare professional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover-elevate text-center">
                <CardHeader>
                  <Monitor className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle>Cross-Platform</CardTitle>
                  <CardDescription>
                    Works seamlessly across desktop, tablet, and mobile devices
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate text-center">
                <CardHeader>
                  <Cloud className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle>Cloud-Native</CardTitle>
                  <CardDescription>
                    Secure, scalable infrastructure with 99.9% uptime guarantee
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate text-center">
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle>Real-Time AI</CardTitle>
                  <CardDescription>
                    Instant insights and recommendations powered by advanced machine learning
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}