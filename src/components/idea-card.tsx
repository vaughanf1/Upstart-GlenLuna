import Link from 'next/link'
import { Heart, Bookmark, Calendar, Star } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScoreBadge } from '@/components/score-badge'
import { formatDate } from '@/lib/utils'

interface IdeaCardProps {
  idea: {
    id: string
    slug: string
    title: string
    summary: string
    difficulty: number
    buildType: string
    tags: string[]
    score: number
    createdAt: string
    isBookmarked?: boolean
    bookmarkCount?: number
  }
  showBookmark?: boolean
  onBookmark?: (ideaId: string) => void
}

export function IdeaCard({ idea, showBookmark = false, onBookmark }: IdeaCardProps) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onBookmark?.(idea.id)
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-600 bg-green-50 border-green-200'
    if (difficulty <= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy'
    if (difficulty <= 3) return 'Medium'
    return 'Hard'
  }

  return (
    <Link href={`/ideas/${idea.slug}`}>
      <Card className="h-full hover:shadow-soft-lg transition-all duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <ScoreBadge score={idea.score} size="sm" />
                <Badge
                  variant="outline"
                  className={`text-xs ${getDifficultyColor(idea.difficulty)}`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  {getDifficultyLabel(idea.difficulty)}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-2">
                {idea.title}
              </h3>
            </div>
            {showBookmark && (
              <button
                onClick={handleBookmarkClick}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    idea.isBookmarked
                      ? 'fill-blue-500 text-blue-500'
                      : 'text-gray-400 hover:text-blue-500'
                  }`}
                />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {idea.summary}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {idea.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {idea.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{idea.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(idea.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 font-medium">
                {idea.buildType}
              </span>
            </div>
          </div>

          {typeof idea.bookmarkCount === 'number' && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Heart className="w-3 h-3" />
              {idea.bookmarkCount} bookmarks
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}