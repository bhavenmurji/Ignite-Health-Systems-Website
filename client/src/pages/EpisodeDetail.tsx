import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play, Share, Download, Calendar, Clock } from 'lucide-react'
import { Link, useParams } from 'wouter'

export default function EpisodeDetail() {
  const { id } = useParams<{ id: string }>()

  // TODO: Replace with real episode data fetching
  const episode = {
    id: 'episode-1',
    title: 'The Platform Fragmentation Crisis: Why Healthcare Technology is Failing Physicians',
    description: 'Dr. Murji explores how the current landscape of disconnected healthcare tools is driving physician burnout and fragmenting clinical care. From EMRs to AI scribes, we dissect why more technology has led to more problems.',
    date: '2024-12-01',
    duration: '45 min',
    status: 'published',
    audioUrl: '#',
    transcript: `
[00:00] Welcome to the Ignite Health Podcast. I'm Dr. Bhaven Murji, and today we're diving deep into what I call the Platform Fragmentation Crisis—the hidden epidemic that's crushing physician morale and fragmenting patient care across the healthcare system.

[00:30] Let me paint you a picture of a typical day in the life of an independent physician. You wake up, grab your coffee, and before you've even seen your first patient, you're already juggling five different applications. Your EMR for patient records, a separate AI transcription tool that can't see your chart data, UpToDate for clinical guidelines that requires you to leave your workflow entirely, research portals for deeper investigation, and board prep software that exists in a completely separate universe from your actual practice.

[01:15] This isn't efficiency—this is digital chaos. And it's costing us more than we realize. The average physician now spends 67% of their time in the EMR just navigating between screens, not synthesizing clinical information or making diagnostic decisions. We've turned our most skilled healers into data entry clerks.

[02:00] The human cost is staggering. Physician burnout rates, which briefly spiked to 62.8% during the pandemic peak, have now settled back to a "baseline" of 48%. Think about that for a moment—nearly half of all physicians are chronically burned out, and we're calling this normal. This isn't a pandemic aftereffect; this is the direct result of systemic technological failure.

[03:00] But here's what really breaks my heart: I watch brilliant colleagues—doctors who could diagnose rare conditions, manage complex cases, provide compassionate care—and they're leaving medicine not because they've lost their passion for healing, but because they can't navigate the maze of broken technology that's been imposed upon them.

[03:30] The current AI solutions aren't solving the problem; they're adding to it. DAX Copilot, for instance, is essentially a blind listener. It can transcribe what you say, but it can't see your patient's chart, so you end up narrating lab values that are right there on your screen. It's like having an assistant who can write but can't read.

[04:15] This fragmentation isn't just inconvenient—it's dangerous. When your attention is constantly switching between platforms, when critical patient information is scattered across multiple systems, when you're spending more time clicking than thinking, patient safety suffers. Clinical excellence becomes nearly impossible.

[05:00] So what's the answer? It's not another app to add to the maze. It's not another AI tool that solves one narrow problem while creating three new ones. The answer is a fundamental paradigm shift: moving from document-centric systems built in the 1990s to an AI-native clinical operating system.

[05:30] Imagine walking into your clinic and having AI that has already analyzed your entire patient schedule, identified potential care gaps, surfaced the latest relevant research, and prepared personalized clinical decision support—all before you see your first patient. Imagine ambient listening that actually understands your workflow, can access chart data in real-time, and provides clinical recommendations without you ever having to leave your conversation with the patient.

[06:15] This isn't science fiction. This is what we're building at Ignite Health Systems. A unified intelligence layer that eliminates the platform fragmentation crisis by replacing the maze with a single, coherent system that thinks the way physicians think.

[07:00] But this isn't just about efficiency—though we've validated that physicians using truly integrated AI systems can reclaim over 70 hours per month. This is about restoring the practice of medicine to what it was meant to be: a deeply human interaction between healer and patient, enhanced by technology that amplifies clinical judgment rather than fragmenting it.

[08:00] The future of independent medicine depends on solving this crisis. Because right now, only 42.2% of physicians remain in private practice—the rest have been forced into hospital employment not because they prefer it, but because they can't manage the administrative complexity of running an independent practice with broken technology.

[08:30] This is why I founded Ignite Health Systems. Not as a business venture, but as a philosophical reckoning. Healthcare technology has to serve humanity, not the other way around. We need to move from extraction to regeneration, from replacement to enhancement, from systems that profit from physician suffering to systems that create net-positive outcomes for everyone involved.

[09:15] In our next episode, we'll dive deeper into what this regenerative approach looks like in practice. We'll explore how to build technology that makes physicians superhuman rather than subhuman, and why the solution isn't patching the old system but building something entirely new.

[09:45] If this conversation resonates with you, if you're tired of being a data entry clerk when you trained to be a healer, join us. Visit ignitehealth.com and become part of the Innovation Council. Together, we're not just building better software—we're reclaiming the soul of medicine.

[10:15] Thank you for listening, and remember: the future of healthcare will be defined by those who refuse to accept broken systems. This is Dr. Bhaven Murji, and this is the Ignite Health Podcast.

[End of transcript]
    `
  }

  if (!episode) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Episode Not Found</h1>
            <Link href="/episodes">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Episodes
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Episode Header */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/episodes">
              <Button variant="ghost" className="mb-6" data-testid="button-back-episodes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Episodes
              </Button>
            </Link>

            <div className="space-y-6">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge>Episode 1</Badge>
                <Badge variant="default" className="bg-chart-2">Published</Badge>
                <Badge variant="outline">Transcript Available</Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="episode-title">
                {episode.title}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed" data-testid="episode-description">
                {episode.description}
              </p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span data-testid="episode-date">
                    {new Date(episode.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span data-testid="episode-duration">{episode.duration}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" data-testid="button-play-episode">
                  <Play className="mr-2 h-4 w-4" />
                  Play Episode
                </Button>
                <Button variant="outline" data-testid="button-share-episode">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" data-testid="button-download-episode">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Episode Transcript */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Episode Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none" data-testid="episode-transcript">
                  <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {episode.transcript}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Episodes */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl font-bold text-foreground">More Episodes</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover-elevate">
                <CardHeader>
                  <Badge className="w-fit mb-2">Episode 2</Badge>
                  <CardTitle className="text-lg">From Extraction to Regeneration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Coming December 15th - A deep dive into how healthcare technology can shift from extracting value to regenerating capacity.
                  </p>
                  <Badge variant="secondary">Coming Soon</Badge>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardHeader>
                  <Badge className="w-fit mb-2">Episode 3</Badge>
                  <CardTitle className="text-lg">The AI-Native Clinical OS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Coming January 1st - Technical architecture for tomorrow's healthcare technology.
                  </p>
                  <Badge variant="secondary">Coming Soon</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}