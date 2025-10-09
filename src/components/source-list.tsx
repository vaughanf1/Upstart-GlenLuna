import { ExternalLink, TrendingUp, Search, MessageCircle, Newspaper, Users, Award } from 'lucide-react'

interface Source {
  type: string
  url: string
  meta?: Record<string, any>
}

interface SourceListProps {
  sources: Source[]
  limit?: number
  className?: string
}

export function SourceList({ sources, limit = 5, className }: SourceListProps) {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'trends':
        return <TrendingUp className="w-4 h-4" />
      case 'search':
        return <Search className="w-4 h-4" />
      case 'reddit':
      case 'community':
        return <MessageCircle className="w-4 h-4" />
      case 'hackernews':
        return <MessageCircle className="w-4 h-4" />
      case 'news':
        return <Newspaper className="w-4 h-4" />
      case 'competition':
        return <Users className="w-4 h-4" />
      default:
        return <Award className="w-4 h-4" />
    }
  }

  const getSourceLabel = (type: string) => {
    switch (type) {
      case 'trends':
        return 'Google Trends'
      case 'search':
        return 'Search Volume'
      case 'reddit':
        return 'Reddit'
      case 'hackernews':
        return 'Hacker News'
      case 'news':
        return 'News Articles'
      case 'competition':
        return 'Competition Analysis'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const formatMeta = (meta: Record<string, any>) => {
    if (!meta) return null

    const parts = []
    if (meta.mentions) parts.push(`${meta.mentions} mentions`)
    if (meta.engagement) parts.push(`${meta.engagement} engagement`)
    if (meta.volume) parts.push(`${meta.volume} volume`)
    if (meta.competitors) parts.push(`${meta.competitors.join(', ')}`)

    return parts.length > 0 ? parts.join(' • ') : null
  }

  const displaySources = sources.slice(0, limit)

  return (
    <div className={className}>
      <div className="space-y-3">
        {displaySources.map((source, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 mt-0.5 text-gray-600">
              {getSourceIcon(source.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-gray-900">
                  {getSourceLabel(source.type)}
                </h4>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 flex-shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              {source.meta && formatMeta(source.meta) && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatMeta(source.meta)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {sources.length > limit && (
        <p className="text-sm text-gray-500 mt-3">
          +{sources.length - limit} more sources
        </p>
      )}
    </div>
  )
}