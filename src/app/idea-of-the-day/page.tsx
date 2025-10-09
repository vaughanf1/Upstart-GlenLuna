import { Suspense } from 'react'
import Link from 'next/link'
import { Calendar, ArrowLeft, Bookmark, RefreshCw } from 'lucide-react'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreBadge } from '@/components/score-badge'
import { ScoreBreakdownChart } from '@/components/score-breakdown-chart'
import { SourceList } from '@/components/source-list'
import { formatDate } from '@/lib/utils'

async function getDailyIdea() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if we have an idea for today
  let dailyIdea = await db.dailyIdea.findUnique({
    where: { date: today },
    include: {
      idea: true
    }
  })

  if (!dailyIdea) {
    // Find the highest scored idea from the last week
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const bestIdea = await db.idea.findFirst({
      where: {
        createdAt: {
          gte: oneWeekAgo
        }
      },
      orderBy: { score: 'desc' }
    })

    if (bestIdea) {
      // Create today's daily idea
      dailyIdea = await db.dailyIdea.create({
        data: {
          ideaId: bestIdea.id,
          date: today
        },
        include: {
          idea: true
        }
      })
    } else {
      // Fallback: get any idea with the highest score
      const fallbackIdea = await db.idea.findFirst({
        orderBy: { score: 'desc' }
      })

      if (fallbackIdea) {
        dailyIdea = await db.dailyIdea.create({
          data: {
            ideaId: fallbackIdea.id,
            date: today
          },
          include: {
            idea: true
          }
        })
      }
    }
  }

  return dailyIdea
}

function IdeaOfTheDayContent() {
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
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <Suspense fallback={<IdeaOfTheDaySkeleton />}>
        <IdeaOfTheDayServer />
      </Suspense>
    </div>
  )
}

async function IdeaOfTheDayServer() {
  const dailyIdea = await getDailyIdea()

  if (!dailyIdea) {
    return (
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
    )
  }

  const idea = {
    ...dailyIdea.idea,
    tags: JSON.parse(dailyIdea.idea.tags || '[]'),
    sources: dailyIdea.idea.sources ? JSON.parse(dailyIdea.idea.sources) : [],
    scoreBreakdown: dailyIdea.idea.scoreBreakdown ? JSON.parse(dailyIdea.idea.scoreBreakdown) : null,
  }
  const scoreBreakdown = idea.scoreBreakdown
  const sources = idea.sources || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Date */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center text-gray-600 mb-2">
          <Calendar className="w-5 h-5 mr-2" />
          {formatDate(dailyIdea.date)}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Idea of the Day
        </h1>
        <p className="text-lg text-gray-600">
          Our highest-scoring startup idea, updated daily
        </p>
      </div>

      {/* Main Idea Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <ScoreBadge score={idea.score} size="lg" showLabel />
                <span className="text-sm text-gray-500">
                  Last updated: {idea.lastScoredAt ? formatDate(idea.lastScoredAt) : 'Never'}
                </span>
              </div>
              <CardTitle className="text-3xl text-gray-900 mb-3">
                {idea.title}
              </CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-1" />
              Bookmark
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 mb-6">
            {idea.summary}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Problem</h3>
              <p className="text-gray-600">{idea.problem}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Solution</h3>
              <p className="text-gray-600">{idea.solution}</p>
            </div>
          </div>

          {idea.whyNow && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Why Now?</h3>
              <p className="text-gray-600">{idea.whyNow}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              <strong>Difficulty:</strong> {idea.difficulty}/5
            </span>
            <span>
              <strong>Type:</strong> {idea.buildType}
            </span>
            {idea.targetUser && (
              <span>
                <strong>Target:</strong> {idea.targetUser}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      {scoreBreakdown && (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ScoreBreakdownChart breakdown={scoreBreakdown} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <SourceList sources={sources} />
            </CardContent>
          </Card>
        </div>
      )}

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
  )
}

function IdeaOfTheDaySkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-96 mx-auto"></div>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            <div className="h-6 bg-gray-200 rounded w-4/6"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function IdeaOfTheDayPage() {
  return <IdeaOfTheDayContent />
}