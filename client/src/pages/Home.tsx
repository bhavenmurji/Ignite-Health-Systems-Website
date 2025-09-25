import { HeroSection } from '@/components/HeroSection'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Clock, Shield, Target, Users, Zap } from 'lucide-react'
import { Stethoscope, Doctor } from 'healthicons-react/outline'
import { Neurology } from 'healthicons-react'
import { Link } from 'wouter'
import doctorPortrait from '@assets/BhavenMurjiNeedsACoFounder_1758739687681.png'
import rocketVsCar from '@assets/RocketOnHorsevsNewCar_1758754490209.png'
import computerImage from '@assets/Computer_1758754810597.png'
import coDoctorImage from '@assets/CoDoctor_1758754810596.png'
import coPilotAnalogy from '@assets/CoPilotAnalogy_1758754810597.png'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* The Crisis We Solve */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The Great Unraveling of Private Practice
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The tools meant to serve you have become your greatest burden. Your focus is shattered across a half-dozen disconnected platforms: an EMR built for billing, a separate transcription AI, clinical guideline websites, research portals, and board prep software. This is the Platform Fragmentation Crisis, and it's forcing the most dedicated healers to become data entry clerks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-destructive" />
                    The Burnout Epidemic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      This system failure has a deeply human cost. The administrative burden is the primary driver of a chronic burnout crisis that plagues medicine globally.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pre-pandemic (2019)</span>
                        <Badge variant="destructive">~44%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pandemic Peak (2021)</span>
                        <Badge variant="destructive">62.8%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Post-pandemic (2024)</span>
                        <Badge variant="destructive">~48%</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Why This Must Be Solved Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <strong>Fundamentally Flawed:</strong> Current EMRs are broken by design, with 67% of time wasted on navigation
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <strong>Universal Crisis:</strong> Primary driver behind physician burnout rates chronically hovering near 48%
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <strong>Accelerating Collapse:</strong> Physicians fleeing private practice reduces patient choice and autonomy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* The Ignite Solution */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                A Unified Intelligence Layer, Built for{' '}
                <span className="text-primary">Clinical Excellence</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ignite is not another app. It's an AI-native operating system for your practice, built on a revolutionary Mamba-based architecture that understands medicine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Neurology className="h-6 w-6 text-primary" />
                    <CardTitle>Chart-Aware</CardTitle>
                  </div>
                  <CardDescription>
                    Instantly synthesizes a patient's entire longitudinal history, surfacing what's critical.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <CardTitle>Evidence-Integrated</CardTitle>
                  </div>
                  <CardDescription>
                    Bakes clinical guidelines and research directly into your workflow, eliminating platform switching.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Doctor className="h-6 w-6 text-primary" />
                    <CardTitle>Lifelong Learning Partner</CardTitle>
                  </div>
                  <CardDescription>
                    Transforms your daily cases into personalized, adaptive learning modules for continuous improvement.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    <CardTitle>Autonomous Administrative Agent</CardTitle>
                  </div>
                  <CardDescription>
                    Handles scheduling, billing, and membership management, liberating you from back-office tasks.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Link href="/platform">
                <Button size="lg" data-testid="button-explore-platform">
                  Explore the Platform
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Three-Stage Transformation */}
      <section className="py-24 bg-muted/30">
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
                        src={computerImage} 
                        alt="Current Healthcare System - The Fragmented Barrier" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">The Fragmentation Crisis: Lost in the Digital Maze</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 order-1 lg:order-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">Before AI: The Fragmented Healthcare Maze</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Current healthcare AI adds speed to broken workflows, forcing physicians to frantically click between fragmented systems. This isn't just inefficient; it's a barrier that steals precious time from patients and critical thinking from doctors. We're trapped in a digital maze, where essential insights are scattered across platforms, preventing seamless care and burning out dedicated professionals.
                  </p>
                  <div className="space-y-4">
                    <div className="border-l-4 border-destructive pl-6">
                      <h4 className="font-semibold text-foreground mb-2">Learning happened here:</h4>
                      <p className="text-sm text-muted-foreground">Medical journals, UpToDate.com, and OpenEvidence - completely isolated from actual practice</p>
                    </div>
                    <div className="border-l-4 border-destructive pl-6">
                      <h4 className="font-semibold text-foreground mb-2">Practice happened here:</h4>
                      <p className="text-sm text-muted-foreground">EMR systems with zero clinical decision support, endless clicking between tabs and screens</p>
                    </div>
                    <div className="border-l-4 border-destructive pl-6">
                      <h4 className="font-semibold text-foreground mb-2">Testing happened here:</h4>
                      <p className="text-sm text-muted-foreground">AAFP, ABFM, AMBOSS, UWorld - completely disconnected from real cases</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current AI Reality */}
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">Current AI: Still Fragmented, Just Faster</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Even with today's AI tools, physicians are still context-switching across multiple platforms. DAX can't see chart data, forcing doctors to narrate blindly. The fundamental problem persists: cognitive fragmentation across 7+ platforms that breaks clinical thinking.
                  </p>
                  <div className="space-y-4">
                    <div className="border-l-4 border-yellow-500 pl-6">
                      <h4 className="font-semibold text-foreground mb-2">5:30 AM - Precharting with DAX:</h4>
                      <p className="text-sm text-muted-foreground">Wake up early, click through charts, read everything aloud - DAX can't see the data</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-6">
                      <h4 className="font-semibold text-foreground mb-2">Patient Care:</h4>
                      <p className="text-sm text-muted-foreground">Second recording per patient, step out to dictate what DAX missed, manual lab narration</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-6">
                      <h4 className="font-semibold text-foreground mb-2">Evening Study:</h4>
                      <p className="text-sm text-muted-foreground">Separate platforms from clinical work, no connection between performance and learning</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative max-w-lg w-full">
                    <Badge variant="outline" className="absolute top-4 left-4 z-10 bg-yellow-100 text-yellow-800 border-yellow-300">
                      Still Fragmented
                    </Badge>
                    <p className="text-center text-lg text-muted-foreground mt-8">
                      Current AI tools still require context-switching between multiple disconnected platforms
                    </p>
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
                        src={coPilotAnalogy} 
                        alt="Aviation Analogy - Co-pilot Orchestrates Crew & Systems" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">Aviation Inspiration: Orchestrated Command, Unburdened Care</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ignite Solution: Keep as image above text */}
              <div className="flex flex-col items-center space-y-6 order-2">
                <div className="max-w-sm w-full">
                  <div className="aspect-square rounded-lg overflow-visible bg-card border hover-elevate" data-testid="image-future-healthcare">
                    <img 
                      src={coDoctorImage} 
                      alt="Future Healthcare System - Ignite: Clinical Co-Pilot Enhances Direct Patient-Physician Relationship" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">Ignite Solution: One Unified Intelligence Layer</p>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">The Ignite Future: One Unified Intelligence</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Imagine a future where you walk into patient rooms with complete context already synthesized. Ignite: Clinical Co-Pilot eliminates cognitive fragmentation, seamlessly connecting all vital information—from EHR to evidence-based guidelines—into one intuitive layer. This isn't about replacing doctors; it's about freeing them from digital busy-work, making them supercharged human doctors who can truly focus on healing.
                  </p>
                  <div className="space-y-3">
                    <div className="border-l-4 border-primary pl-6 text-left">
                      <h4 className="font-semibold text-foreground mb-1">5:30 AM - Intelligent Precharting:</h4>
                      <p className="text-sm text-muted-foreground">AI analyzes schedules and histories, one conversation per patient where AI sees everything</p>
                    </div>
                    <div className="border-l-4 border-primary pl-6 text-left">
                      <h4 className="font-semibold text-foreground mb-1">7:00 AM - Supercharged Patient Care:</h4>
                      <p className="text-sm text-muted-foreground">Complete context synthesized, ambient conversation capture, real-time evidence integration</p>
                    </div>
                    <div className="border-l-4 border-primary pl-6 text-left">
                      <h4 className="font-semibold text-foreground mb-1">6:00 PM - Personalized Learning:</h4>
                      <p className="text-sm text-muted-foreground">AI analyzes clinical decisions, generates targeted questions based on actual cases</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              It's Time for a Reckoning
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The future of medicine will be defined by those who refuse to accept broken systems. This is more than a product; it's a movement to restore autonomy to physicians and put humanity back at the center of healthcare.
            </p>
            <Link href="/signup">
              <Button size="lg" data-testid="button-join-movement">
                Join the Movement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}