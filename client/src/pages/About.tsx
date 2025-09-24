import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Award, Globe, Users, BookOpen } from 'lucide-react'
import { Link } from 'wouter'
import drMurjiImage from '@assets/BhavenMurjiNeedsACoFounder_1758739687681.png'

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              A Mission Forged in the Crucible
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Dr. Bhaven Murji's quest to build Ignite Health Systems is not a business venture; it is a philosophical reckoning forged through profound personal struggle, frontline clinical experience across three continents, and an unwavering belief that technology must serve humanity.
            </p>
          </div>
        </div>
      </section>

      {/* Dr. Murji's Story */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    The Crucible Year: Rebuilding from Nothing
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    In 2021, his UK medical career path erased by the pandemic, Dr. Murji arrived in Philadelphia with nothing but a suitcase. In a single, grueling year, he passed all three USMLE licensing exams while simultaneously training for and completing Ironman Maryland.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To pay his rent, he worked early morning shifts at Starbucks and sold government-subsidized phones on street corners. This period of intense hardship became his crucible, cementing a core philosophy: when systems fail, true change emerges from those willing to rebuild from first principles.
                  </p>
                </div>

                {/* Timeline Cards */}
                <div className="space-y-4">
                  <Card className="hover-elevate">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Badge>2021</Badge>
                        The Crucible Year
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Arrived in Philadelphia with nothing, passed all USMLE exams, completed Ironman Maryland
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Badge>2022-2024</Badge>
                        Medical Residency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Chief Resident at Virtua Health, Assistant Vice Chair of Graduate Medical Education Committee
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Badge>2024</Badge>
                        Founding Ignite
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Founded Ignite Health Systems to revolutionize healthcare technology and eliminate administrative burden
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="relative">
                <img 
                  src={drMurjiImage}
                  alt="Dr. Bhaven Murji"
                  className="rounded-lg shadow-lg w-full max-w-md mx-auto"
                  data-testid="img-dr-murji-portrait"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Perspective */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                A Global, Frontline Perspective
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="hover-elevate text-center">
                <CardHeader>
                  <Globe className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">Global Training</CardTitle>
                  <CardDescription>
                    Trained at St. George's University of London with international perspective
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate text-center">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">COVID Frontlines</CardTitle>
                  <CardDescription>
                    Served on the front lines during the COVID-19 pandemic in the UK
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate text-center">
                <CardHeader>
                  <Award className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">Rural Medicine</CardTitle>
                  <CardDescription>
                    Locum physician in rural Wales, providing care in resource-scarce environments
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover-elevate text-center">
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">Research Impact</CardTitle>
                  <CardDescription>
                    Published 5 papers with 387 citations, secured grant funding for healthcare innovation
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Confronting the System */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Confronting a Broken System
              </h2>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Dr. Murji matched into a Family Medicine residency at Virtua Health, where his leadership was immediately recognized. He was appointed Chief Resident, served as Assistant Vice Chair of the Graduate Medical Education Committee, and led key initiatives in EMR optimization.
              </p>
              
              <p className="text-lg leading-relaxed">
                It was here that he confronted the American healthcare technology crisis head-on, living the daily nightmare of the Platform Fragmentation Crisis and watching brilliant colleagues get crushed by digital paperwork. He witnessed firsthand how the tools meant to help physicians had become their greatest burden.
              </p>

              <div className="my-8 p-6 bg-primary/10 rounded-lg border-l-4 border-primary">
                <blockquote className="text-lg font-medium text-foreground italic">
                  "I realized the solution wasn't a patch for the old system, but a complete paradigm shift. Healthcare technology needed to be rebuilt from the ground up, with physicians at the center, not as an afterthought."
                </blockquote>
                <cite className="text-sm font-semibold text-primary mt-2 block">
                  – Dr. Bhaven Murji
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision for Ignite */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                The Vision for Ignite: A New Architecture
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                This frustration became the catalyst for a new mission. Dr. Murji channeled his energy into research, publishing five papers that have garnered 387 citations and securing grant funding. He realized the solution wasn't a patch for the old system, but a complete paradigm shift.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ignite Health Systems is the culmination of this journey—a mission born from real-world pain, informed by rigorous research, and driven by the relentless spirit of someone who knows what it takes to face down impossible odds and emerge victorious.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-primary">From Extraction</CardTitle>
                    <CardDescription>
                      To Regeneration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Moving away from systems that extract value from physicians towards technology that regenerates their capacity to heal.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-primary">From Replacement</CardTitle>
                    <CardDescription>
                      To Enhancement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Technology that enhances human clinical judgment rather than attempting to replace physician expertise.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardHeader>
                    <CardTitle className="text-primary">From Harm-as-Profit</CardTitle>
                    <CardDescription>
                      To Net-Positive Outcomes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Aligning technology incentives with patient outcomes and physician well-being, not administrative complexity.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Join Dr. Murji's Mission
            </h2>
            <p className="text-xl opacity-90">
              Help us build the future of healthcare technology—one that serves physicians and patients, not bureaucracy.
            </p>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="text-primary border-primary-foreground hover:bg-primary-foreground" data-testid="button-join-mission">
                Join the Innovation Council
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}