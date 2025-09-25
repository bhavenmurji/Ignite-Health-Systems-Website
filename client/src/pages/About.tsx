import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Award, Globe, BookOpen, CheckCircle, XCircle, Monitor, Smartphone, Cloud, Zap } from 'lucide-react'
import { Doctor } from 'healthicons-react/outline'
import { Link } from 'wouter'
import drMurjiImage from '@assets/ProStock_1758758416506.png'
import coFounderSearch from '@assets/image_1758758549058.png'
import oldSystemImage from '@assets/OldHospitalITArchitecture_1758739687681.png'
import dashboardImage from '@assets/ProofOfConceptFinalVision_1758739687681.png'
import neuralNetworkImage from '@assets/NeuralNetwork_1758739687681.png'
import aviationAnalogy from '@assets/CoPilotAnalogy_1758754810597.png'
import currentHealthcare from '@assets/Computer_1758754810597.png'
import futureHealthcare from '@assets/CoDoctor_1758754810596.png'
import federatedArchitecture from '@assets/FederatedLocalAndCloudData_1758759175692.png'

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
                    The Transition: Rebuilding from First Principles
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    When the pandemic disrupted his UK medical career path, Dr. Murji found himself starting over in Philadelphia. This transition period required rebuilding his medical credentials while adapting to a new healthcare system.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    The experience of navigating different healthcare systems and rebuilding his career reinforced a core philosophy: when existing systems fail to serve their purpose, meaningful change comes from those willing to rebuild from first principles rather than accepting broken status quo.
                  </p>
                </div>

                {/* Timeline Cards */}
                <div className="space-y-4">
                  <Card className="hover-elevate">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Badge>2021</Badge>
                        Career Transition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Relocated to Philadelphia, completed medical licensing requirements for US practice
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
                        Medical residency training with involvement in medical education initiatives
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
                        Founded Ignite Health Systems to address healthcare technology challenges
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
                  <Doctor className="h-8 w-8 text-primary mx-auto mb-4" />
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

      {/* Seeking Technical Co-Founder */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Seeking Technical Co-Founder
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join Dr. Murji in building revolutionary Mamba-based clinical AI that understands the context and complexity of medical decision-making. Help create the future of healthcare intelligence.
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
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">Revolutionary AI Architecture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Content - From Document-Centric to AI-Native */}
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

      {/* Three-Stage Transformation */}
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
                    src={federatedArchitecture} 
                    alt="Federated Architecture - Local Patient Data with Cloud-based Agentic Services for Research, Learning, and Clinical Decision Support" 
                    className="w-full h-auto rounded-lg hover-elevate bg-card/50 p-2"
                    data-testid="image-federated-architecture"
                  />
                  <div className="absolute -bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-md">
                      Federated Local & Cloud Data Architecture
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Federated Architecture: Privacy Meets Intelligence
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Patient identifying information stays secure in local storage while cloud-based agentic services 
                    provide research, physician learning, and clinical decision support. This federated approach 
                    delivers real-time intelligence while maintaining complete data privacy and control.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Local Data Control:</strong> Patient information never leaves your secure environment
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Cloud Intelligence:</strong> Agentic services enhance research and clinical decisions
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Real-time Learning:</strong> Continuous enhancement of physician knowledge and patient care
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

      {/* Evidence-Based Foundation */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Evidence-Based Foundation
              </h2>
              <p className="text-lg text-muted-foreground">
                Our approach is grounded in peer-reviewed research and breakthrough AI developments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Documentation Burden Studies */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground">Healthcare Documentation Crisis</h3>
                
                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">National EHR Time/Documentation Burden</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>5.8 hours per 8 scheduled patient hours | 2.3 hours documentation</strong>
                    </p>
                    <a 
                      href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11534958/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      National Comparison of Ambulatory Physician Electronic Health Record Use (2024)
                    </a>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">AMIA Task Force Documentation/Burnout</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>75% of healthcare professionals: documentation impedes care</strong>
                    </p>
                    <a 
                      href="https://amia.org/education-events/amia-25x5-task-force-documentation-burden-reduction" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      AMIA 25x5 Task Force (2024) Executive Summary
                    </a>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Unstructured Healthcare Data</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>80% of Healthcare Data is Unstructured</strong>
                    </p>
                    <a 
                      href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8961402/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Medical Documentation Burden Among US Office-Based Physicians (2022)
                    </a>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Physician Burnout Impact</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Annual cost of $4.6 billion</strong>
                    </p>
                    <div className="space-y-2">
                      <a 
                        href="https://jamanetwork.com/journals/jama/fullarticle/2684994" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        Physician Burnout and the Electronic Health Record (JAMA 2018)
                      </a>
                      <a 
                        href="https://www.acpjournals.org/doi/10.7326/M18-1422" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        Harvard study: Annual cost analysis (Annals of Internal Medicine)
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Breakthrough AI Research */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground">Breakthrough AI Research</h3>
                
                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">COMET – Microsoft/Epic Foundation Model</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Largest event-level medical foundation model</strong>
                    </p>
                    <a 
                      href="https://arxiv.org/abs/2508.12104" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      COMET: Generative Medical Event Models (Epic & Microsoft, 2025)
                    </a>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Mamba/EHRMamba – Long-sequence Medical AI</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>EHRMamba scaling + ClinicalMamba</strong>
                    </p>
                    <div className="space-y-2">
                      <a 
                        href="https://arxiv.org/pdf/2312.00752.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        Mamba: Linear-Time Sequence Modeling (Gu et al. 2024)
                      </a>
                      <a 
                        href="https://arxiv.org/pdf/2405.14567.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        EHRMamba: Scalable Foundation Models (ML4H 2024)
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Jet-Nemotron & PostNAS</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>53.6x Speedup</strong>
                    </p>
                    <a 
                      href="https://arxiv.org/pdf/2508.15884.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Jet-Nemotron: Efficient Language Model (NVIDIA)
                    </a>
                  </CardContent>
                </Card>

                <Card className="hover-elevate">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-foreground mb-2">Advanced Medical AI Frameworks</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">Uncertainty-Aware Contrastive Decoding</p>
                        <a 
                          href="https://arxiv.org/abs/2403.04369" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          UCD Research (2024)
                        </a>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Ontology-Grounded RAG for Medicine</p>
                        <a 
                          href="https://arxiv.org/abs/2402.10423" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          OG-RAG: Medical Advice (Microsoft)
                        </a>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Synthetic EHR Generation for Privacy</p>
                        <a 
                          href="https://arxiv.org/abs/1910.06888" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Yuan Zhong et al. - Synthetic EHRs
                        </a>
                      </div>
                    </div>
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