import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Play, Calendar, Clock, Users } from 'lucide-react'
import { Link } from 'wouter'
import enhancedLogo from '@assets/IgniteLogoEnhanced_1758759175692.png'

interface Episode {
  id: string
  title: string
  description: string
  date: string
  duration: string
  status: 'published' | 'coming-soon'
  transcript?: string
}

// TODO: Replace with real episode data
const episodes: Episode[] = [
  {
    id: 'episode-1',
    title: 'The Platform Fragmentation Crisis: Why Healthcare Technology is Failing Physicians',
    description: 'Dr. Murji explores how the current landscape of disconnected healthcare tools is driving physician burnout and fragmenting clinical care. From EMRs to AI scribes, we dissect why more technology has led to more problems.',
    date: '2024-12-01',
    duration: '45 min',
    status: 'published',
    transcript: 'Available'
  },
  {
    id: 'episode-2',
    title: 'From Extraction to Regeneration: Reimagining Healthcare Economics',
    description: 'A deep dive into how healthcare technology can shift from extracting value from physicians to regenerating their capacity to heal. We discuss the philosophical foundations behind Ignite Health Systems.',
    date: '2024-12-15',
    duration: '50 min',
    status: 'coming-soon'
  },
  {
    id: 'episode-3',
    title: 'The AI-Native Clinical OS: Technical Architecture for Tomorrow',
    description: 'Dr. Murji breaks down the technical vision behind Ignite—how Mamba-based architecture and unified intelligence layers can eliminate the maze of healthcare applications.',
    date: '2025-01-01',
    duration: '42 min',
    status: 'coming-soon'
  }
]

export default function Episodes() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Enhanced Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src={enhancedLogo} 
                alt="Ignite Health Systems Enhanced Logo with Medical Symbol" 
                className="h-32 md:h-40 w-auto object-contain"
                data-testid="img-enhanced-logo"
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              The Ignite Health Systems Podcast
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Deep conversations about the future of healthcare technology, physician autonomy, and the movement to restore humanity to medicine.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" data-testid="button-subscribe">
                <Users className="mr-2 h-4 w-4" />
                Subscribe to Updates
              </Button>
              <Button variant="outline" size="lg" data-testid="button-newsletter">
                Join Newsletter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Episode Archive
              </h2>
              <p className="text-lg text-muted-foreground">
                Exploring the intersection of technology, medicine, and human-centered care
              </p>
            </div>

            <div className="space-y-8">
              {episodes.map((episode, index) => (
                <Card key={episode.id} className="hover-elevate">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={episode.status === 'published' ? 'default' : 'secondary'}>
                            Episode {index + 1}
                          </Badge>
                          {episode.status === 'published' ? (
                            <Badge variant="default" className="bg-chart-2">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Coming Soon</Badge>
                          )}
                          {episode.transcript && (
                            <Badge variant="outline">Transcript Available</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl" data-testid={`episode-title-${episode.id}`}>
                          {episode.title}
                        </CardTitle>
                        <CardDescription className="text-base" data-testid={`episode-description-${episode.id}`}>
                          {episode.description}
                        </CardDescription>
                      </div>
                      
                      {episode.status === 'published' && (
                        <Button className="shrink-0" data-testid={`button-play-${episode.id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Listen Now
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span data-testid={`episode-date-${episode.id}`}>
                          {new Date(episode.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span data-testid={`episode-duration-${episode.id}`}>{episode.duration}</span>
                      </div>
                    </div>
                    
                    {episode.status === 'published' && (
                      <div className="flex gap-2 mt-4">
                        <Link href={`/episodes/${episode.id}`}>
                          <Button variant="outline" size="sm" data-testid={`button-transcript-${episode.id}`}>
                            Read Transcript
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" data-testid={`button-share-${episode.id}`}>
                          Share Episode
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Never Miss an Episode</CardTitle>
                <CardDescription className="text-lg">
                  Get notified when new episodes are released and join the conversation about the future of healthcare technology.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" data-testid="button-join-innovation-council">
                      Join Innovation Council
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" data-testid="button-rss-feed">
                    <Play className="mr-2 h-4 w-4" />
                    RSS Feed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}