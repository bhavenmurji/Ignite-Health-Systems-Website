import { HeroSection } from '@/components/HeroSection'
import { TestimonialCard } from '@/components/TestimonialCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Zap, Users, Shield, Brain, Clock, Target } from 'lucide-react'
import { Link } from 'wouter'
import doctorPortrait from '@assets/generated_images/Doctor_portrait_professional_7c0d58c3.png'

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
                    <Brain className="h-6 w-6 text-primary" />
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
                    <Users className="h-6 w-6 text-primary" />
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

      {/* Testimonials Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                From the Front Lines of Medicine
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                quote="Ignite is the only platform that understands that my biggest challenge isn't just documentation—it's the cognitive load of juggling five different systems. It gives me back my focus."
                author="Dr. Sarah Chen"
                title="Physician, Direct Primary Care"
                avatar={doctorPortrait}
              />
              <TestimonialCard
                quote="The idea of an AI that helps me with board prep based on the patients I actually saw this week... that's not just a time-saver, it makes me a fundamentally better doctor. It's a game-changer."
                author="Dr. Michael Rodriguez"
                title="Physician, Internal Medicine"
              />
              <TestimonialCard
                quote="We saw an immediate impact. Our physicians are finishing notes in real-time and our administrative overhead has been cut in half. We're a more sustainable practice because of Ignite."
                author="Dr. Jennifer Walsh"
                title="Clinic Director, Independent Practice"
              />
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