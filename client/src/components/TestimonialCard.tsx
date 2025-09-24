import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Quote } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  author: string
  title: string
  avatar?: string
}

export function TestimonialCard({ quote, author, title, avatar }: TestimonialCardProps) {
  const initials = author.split(' ').map(n => n[0]).join('')

  return (
    <Card className="p-6 hover-elevate">
      <div className="space-y-4">
        <Quote className="h-8 w-8 text-primary opacity-80" />
        
        <blockquote className="text-muted-foreground leading-relaxed" data-testid={`testimonial-quote-${author.toLowerCase().replace(/\s+/g, '-')}`}>
          {quote}
        </blockquote>
        
        <div className="flex items-center gap-3 pt-4">
          <Avatar className="h-10 w-10">
            {avatar && <AvatarImage src={avatar} alt={author} />}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-foreground" data-testid={`testimonial-author-${author.toLowerCase().replace(/\s+/g, '-')}`}>
              {author}
            </div>
            <div className="text-sm text-muted-foreground" data-testid={`testimonial-title-${author.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}