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

      {/* Revolution vs Evolution Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Stop Bolting Rockets onto Horses
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Legacy healthcare systems are trapped in the past, frantically bolting AI features onto fragmented platforms. It's like strapping a rocket to a horse—impressive engineering, but fundamentally the wrong approach.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="border-l-4 border-destructive pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">The Fragmentation Crisis</h3>
                    <p className="text-muted-foreground">
                      Current AI adds speed to broken workflows. You're still context-switching between EMRs, transcription tools, research platforms, and study apps. Even DAX can't see your chart data—you're narrating blindly across disconnected systems.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">The Evolution Imperative</h3>
                    <p className="text-muted-foreground">
                      True transformation requires evolutionary change—not incremental improvements to outdated modes of transport. Just as the automobile didn't improve the horse, next-generation healthcare AI demands a completely new foundation.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Badge variant="outline" className="text-accent border-accent">
                    One Unified Intelligence Layer
                  </Badge>
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