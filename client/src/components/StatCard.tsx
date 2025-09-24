import { Card } from '@/components/ui/card'

interface StatCardProps {
  value: string
  label: string
  description: string
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ value, label, description, trend = 'neutral' }: StatCardProps) {
  const trendColor = {
    up: 'text-chart-2',
    down: 'text-destructive',
    neutral: 'text-primary'
  }[trend]

  return (
    <Card className="p-6 hover-elevate">
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