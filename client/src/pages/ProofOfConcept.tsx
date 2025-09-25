import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

      {/* Healthcare Documentation Crisis - Section with Legacy System Image */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Healthcare Documentation Crisis
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Current healthcare systems are fundamentally broken, forcing physicians to spend more time on documentation than patient care. The evidence is overwhelming and the cost is staggering.
                  </p>
                </div>

                <div className="space-y-6">
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
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative max-w-lg w-full">
                  <img 
                    src={oldSystemImage}
                    alt="Legacy Healthcare IT Systems - The Problem"
                    className="rounded-lg shadow-lg w-full hover-elevate"
                    data-testid="img-legacy-crisis"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="text-sm">Legacy Crisis</Badge>
                  </div>
                  <div className="absolute -bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-md">
                      Document-Centric Systems Built for Billing, Not Care
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Native Solution - Section with Dashboard Image */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center order-2 lg:order-1">
                <div className="relative max-w-lg w-full">
                  <img 
                    src={dashboardImage}
                    alt="Ignite AI-Native Clinical Platform - The Solution"
                    className="rounded-lg shadow-lg w-full hover-elevate"
                    data-testid="img-ignite-solution"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="text-sm">AI-Native Solution</Badge>
                  </div>
                  <div className="absolute -bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-md">
                      Unified Clinical Intelligence Interface
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    From Document-Centric to AI-Native
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Ignite transforms healthcare with a unified clinical intelligence layer that enhances human judgment while eliminating the digital busy-work that burns out physicians.
                  </p>
                </div>

                <div className="space-y-6">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breakthrough AI Research - Section with Neural Network Image */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    Breakthrough AI Research
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our approach is powered by the latest advances in medical AI, from foundational models to revolutionary architectures designed specifically for healthcare complexity.
                  </p>
                </div>

                <div className="space-y-6">
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
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative max-w-lg w-full">
                  <img 
                    src={neuralNetworkImage}
                    alt="Neural Network Architecture - Mamba-Based Clinical AI"
                    className="rounded-lg shadow-lg w-full hover-elevate"
                    data-testid="img-mamba-architecture"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary/90 text-primary-foreground text-sm">Mamba AI</Badge>
                  </div>
                  <div className="absolute -bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-md">
                      Revolutionary Mamba Architecture for Medical AI
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Research & Performance */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Advanced Medical AI Frameworks
              </h2>
              <p className="text-lg text-muted-foreground">
                Built on cutting-edge research in uncertainty-aware AI and medical reasoning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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