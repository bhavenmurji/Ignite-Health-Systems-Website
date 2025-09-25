import { Card } from '@/components/ui/card'

interface StatCardProps {
  value: string
  label: string
  description: string
  trend?: 'up' | 'down' | 'neutral'
  href?: string
  onClick?: () => void
}

export function StatCard({ value, label, description, trend = 'neutral', href, onClick }: StatCardProps) {
  const trendColor = {
    up: 'text-chart-2',
    down: 'text-destructive',
    neutral: 'text-primary'
  }[trend]

  const handleClick = () => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else if (onClick) {
      onClick()
    }
  }

  const isClickable = href || onClick
  const cardClass = `p-6 hover-elevate ${isClickable ? 'cursor-pointer' : ''}`

  return (
    <Card 
      className={cardClass}
      onClick={isClickable ? handleClick : undefined}
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="space-y-2">
        <div className={`text-3xl font-bold ${trendColor}`} data-testid={`stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        <div className="text-sm font-medium text-foreground" data-testid={`stat-label-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          {label}
        </div>
        <div className="text-xs text-muted-foreground" data-testid={`stat-description-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          {description}
        </div>
      </div>
    </Card>
  )
}