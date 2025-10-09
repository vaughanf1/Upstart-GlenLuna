import { Badge } from '@/components/ui/badge'
import { getScoreColor, getScoreLabel } from '@/lib/scoring/compute'
import { cn } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function ScoreBadge({ score, size = 'md', showLabel = false, className }: ScoreBadgeProps) {
  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  }

  const colorClasses = {
    'text-green-600': 'bg-green-50 text-green-700 border-green-200',
    'text-blue-600': 'bg-blue-50 text-blue-700 border-blue-200',
    'text-yellow-600': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'text-orange-600': 'bg-orange-50 text-orange-700 border-orange-200',
    'text-red-600': 'bg-red-50 text-red-700 border-red-200',
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        sizeClasses[size],
        colorClasses[scoreColor as keyof typeof colorClasses],
        'font-semibold',
        className
      )}
    >
      {Math.round(score)}
      {showLabel && (
        <>
          <span className="mx-1">•</span>
          {scoreLabel}
        </>
      )}
    </Badge>
  )
}