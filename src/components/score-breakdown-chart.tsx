import { ScoreBreakdown } from '@/lib/scoring/compute'

interface ScoreBreakdownChartProps {
  breakdown: ScoreBreakdown
  className?: string
}

export function ScoreBreakdownChart({ breakdown, className }: ScoreBreakdownChartProps) {
  const metrics = [
    { key: 'trend', label: 'Trend', value: breakdown.trend, weight: 28 },
    { key: 'search', label: 'Search', value: breakdown.search, weight: 22 },
    { key: 'community', label: 'Community', value: breakdown.community, weight: 18 },
    { key: 'news', label: 'News', value: breakdown.news, weight: 14 },
    { key: 'competition', label: 'Competition', value: breakdown.competition, weight: 10 },
    { key: 'quality', label: 'Quality', value: breakdown.quality, weight: 8 },
  ]

  const getBarColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-blue-500'
    if (value >= 40) return 'bg-yellow-500'
    if (value >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.key} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">
                {metric.label}
                <span className="text-gray-500 ml-1">({metric.weight}%)</span>
              </span>
              <span className="font-semibold text-gray-900">
                {Math.round(metric.value)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getBarColor(metric.value)}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}