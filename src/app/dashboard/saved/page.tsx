'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { IdeaCard } from '@/components/idea-card'
import { Bookmark, Loader2 } from 'lucide-react'

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
}

interface Bookmark {
  id: string
  ideaId: string
  userId: string
  createdAt: string
}

export default function SavedIdeasPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuthAndLoadBookmarks()
  }, [])

  async function checkAuthAndLoadBookmarks() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/signin')
        return
      }

      await loadBookmarks()
    } catch (error) {
      console.error('Error checking auth:', error)
      setError('Failed to load bookmarks')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadBookmarks() {
    try {
      // Fetch bookmarks
      const bookmarksResponse = await fetch('/api/bookmarks')
      if (!bookmarksResponse.ok) {
        throw new Error('Failed to fetch bookmarks')
      }

      const bookmarksData = await bookmarksResponse.json()
      setBookmarks(bookmarksData.bookmarks || [])

      // Fetch all ideas to match with bookmarks
      const ideasResponse = await fetch('/api/ideas')
      if (!ideasResponse.ok) {
        throw new Error('Failed to fetch ideas')
      }

      const ideasData = await ideasResponse.json()
      const allIdeas = ideasData.ideas || []

      // Filter ideas that are bookmarked
      const bookmarkedIdeaIds = new Set(
        bookmarksData.bookmarks?.map((b: Bookmark) => b.ideaId) || []
      )
      const bookmarkedIdeas = allIdeas.filter((idea: Idea) =>
        bookmarkedIdeaIds.has(idea.id)
      )

      setIdeas(bookmarkedIdeas)
    } catch (error) {
      console.error('Error loading bookmarks:', error)
      setError('Failed to load saved ideas')
    }
  }

  async function handleBookmarkToggle(ideaId: string) {
    // Refresh bookmarks after toggle
    await loadBookmarks()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadBookmarks()}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Bookmark className="w-10 h-10 text-blue-600" />
            Saved Ideas
          </h1>
          <p className="text-lg text-gray-600">
            Your bookmarked startup ideas ({ideas.length})
          </p>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No saved ideas yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start bookmarking ideas to save them for later
            </p>
            <a
              href="/ideas"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Ideas
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                showBookmark={true}
                onBookmark={handleBookmarkToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
