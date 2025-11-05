import Link from 'next/link'
import { Calendar, ArrowLeft, Bookmark } from 'lucide-react'
import { getAllIdeas } from '@/lib/json-db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreBadge } from '@/components/score-badge'

function getDailyIdea() {
  const allIdeas = getAllIdeas()

  if (!allIdeas || allIdeas.length === 0) {
    return null
  }

  // Use current date as seed for deterministic random selection
  // This ensures the same idea shows all day, but changes daily
  const today = new Date()
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

  // Simple hash function to convert date to a number
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use the hash to select an idea index
  const index = Math.abs(hash) % allIdeas.length

  return allIdeas[index]
}

export default function IdeaOfTheDayPage() {
  const idea = getDailyIdea()

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              <Link href="/ideas">
                <Button variant="outline">Browse All Ideas</Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No Idea Available Today
              </h2>
              <p className="text-gray-600 mb-6">
                We don't have any ideas in our database yet. Check back soon!
              </p>
              <Link href="/ideas">
                <Button>Browse Ideas</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/ideas">
                <Button variant="outline">Browse All Ideas</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Date */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center text-gray-600 mb-2">
            <Calendar className="w-5 h-5 mr-2" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Idea of the Day
          </h1>
          <p className="text-lg text-gray-600">
            A fresh startup idea from our catalog, automatically selected daily
          </p>
        </div>

        {/* Main Idea Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <ScoreBadge score={idea.marketScore || 0} size="lg" showLabel />
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-3">
                  {idea.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 mb-6">
              {idea.description}
            </p>

            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-600">
              {idea.difficulty && (
                <span>
                  <strong>Difficulty:</strong> {idea.difficulty}/5
                </span>
              )}
              {idea.buildType && (
                <span>
                  <strong>Type:</strong> {idea.buildType}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Link href={`/ideas/${idea.slug}`}>
            <Button size="lg">
              View Full Details
            </Button>
          </Link>
          <Link href="/ideas">
            <Button variant="outline" size="lg">
              Browse More Ideas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
