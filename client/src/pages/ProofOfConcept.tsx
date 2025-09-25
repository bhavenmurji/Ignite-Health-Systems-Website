import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Brain, Lightbulb, Rocket } from 'lucide-react'
import { Link } from 'wouter'
import aviationAnalogy from '@assets/CoPilotAnalogy_1758754810597.png'
import currentHealthcare from '@assets/Computer_1758754810597.png'
import futureHealthcare from '@assets/CoDoctor_1758754810596.png'
import federatedArchitecture from '@assets/FederatedLocalAndCloudData_1758759175692.png'

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

      {/* Research Citations */}
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