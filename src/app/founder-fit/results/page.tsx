'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IdeaCard } from '@/components/idea-card'

interface Idea {
  id: string
  slug: string
  title: string
  summary: string
  difficulty: number
  buildType: string
  tags: string[]
  score: number
  createdAt: string
  fitScore?: number
  fitReason?: string
}

export default function FounderFitResults() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatchedIdeas()
  }, [])

  const fetchMatchedIdeas = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/founder-profile/matches')
      if (response.ok) {
        const data = await response.json()
        setIdeas(data.matches)
      } else {
        setIdeas([])
      }
    } catch (error) {
      console.error('Error fetching matches:', error)
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async (ideaId: string) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      })

      if (response.ok) {
        const result = await response.json()
        setIdeas(prev => prev.map(idea =>
          idea.id === ideaId
            ? { ...idea, isBookmarked: result.bookmarked }
            : idea
        ))
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link href="/founder-fit">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake Quiz
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personalized Matches
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Based on your skills, experience, and preferences, we've identified ideas that are the best fit for you.
            Each idea is scored based on how well it aligns with your founder profile.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg border p-6 shadow-lg">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && ideas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No matches found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any ideas matching your profile yet. Try updating your preferences or check back later.
              </p>
              <Link href="/founder-fit">
                <Button>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>
        )}

        {!loading && ideas.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="relative">
                  {idea.fitScore && (
                    <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg font-bold text-sm">
                      {idea.fitScore}% Match
                    </div>
                  )}
                  <IdeaCard
                    idea={idea}
                    showBookmark={true}
                    onBookmark={handleBookmark}
                  />
                  {idea.fitReason && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">Why it's a fit: </span>
                        {idea.fitReason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center pt-8 border-t">
              <p className="text-gray-600 mb-4">
                Want to explore more ideas beyond your matches?
              </p>
              <Link href="/ideas">
                <Button variant="outline" size="lg">
                  Browse All Ideas
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}