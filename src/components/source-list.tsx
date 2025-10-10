import { ExternalLink, TrendingUp, Search, MessageCircle, Newspaper, Users, Award } from 'lucide-react'

interface Source {
  type: string
  url: string
  score?: number
  meta?: Record<string, any>
}

interface SourceListProps {
  sources: Source[]
  limit?: number
  className?: string
}

export function SourceList({ sources, limit = 8, className }: SourceListProps) {
  const getSourceIcon = (type: string) => {
    const iconClass = "w-5 h-5"
    const lowerType = type.toLowerCase()

    if (lowerType.includes('google') || lowerType.includes('trends')) {
      return <TrendingUp className={iconClass} />
    }
    if (lowerType.includes('search')) {
      return <Search className={iconClass} />
    }
    if (lowerType.includes('reddit') || lowerType.includes('community')) {
      return <MessageCircle className={iconClass} />
    }
    if (lowerType.includes('hacker') || lowerType.includes('news')) {
      return <Newspaper className={iconClass} />
    }
    if (lowerType.includes('product')) {
      return <Award className={iconClass} />
    }
    if (lowerType.includes('competition')) {
      return <Users className={iconClass} />
    }
    return <Award className={iconClass} />
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-300'
    if (score >= 65) return 'bg-blue-100 text-blue-700 border-blue-300'
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    return 'bg-gray-100 text-gray-700 border-gray-300'
  }

  const displaySources = sources.slice(0, limit)

  return (
    <div className={className}>
      <div className="space-y-3">
        {displaySources.map((source, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-gray-600">
                  {getSourceIcon(source.type)}
                </div>
                <h4 className="font-semibold text-gray-900">
                  {source.type}
                </h4>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                  title="View source"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              {source.score !== undefined && (
                <div className={`px-3 py-1 rounded-full border-2 font-bold text-sm ${getScoreColor(source.score)}`}>
                  {source.score}
                </div>
              )}
            </div>

            {source.meta && Object.keys(source.meta).length > 0 && (
              <div className="space-y-1 text-sm">
                {Object.entries(source.meta).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-gray-600 font-medium min-w-[100px]">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="text-gray-700 flex-1">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {sources.length > limit && (
        <p className="text-sm text-gray-500 mt-3">
          +{sources.length - limit} more sources available
        </p>
      )}
    </div>
  )
}