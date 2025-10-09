'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IdeaCard } from '@/components/idea-card'
import { FiltersBar, FilterState } from '@/components/filters-bar'

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
  isBookmarked?: boolean
  bookmarkCount?: number
}

interface IdeasResponse {
  ideas: Idea[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function IdeasPage() {
  const searchParams = useSearchParams()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock data for available filters
  const [availableTags] = useState([
    'AI', 'SaaS', 'E-commerce', 'FinTech', 'EdTech', 'HealthTech', 'Productivity',
    'Social', 'Analytics', 'Automation', 'Mobile', 'Web3', 'Gaming', 'Creator Economy'
  ])
  const [availableBuildTypes] = useState([
    'SaaS', 'AI Agent', 'Mobile App', 'Web App', 'API', 'Tool', 'Platform', 'Marketplace'
  ])

  const [filters, setFilters] = useState<FilterState>({
    tags: [],
    difficulty: [],
    buildType: [],
    search: searchParams.get('search') || undefined,
  })

  const fetchIdeas = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.tags.length > 0) params.set('tags', filters.tags.join(','))
      if (filters.difficulty.length > 0) params.set('difficulty', filters.difficulty.join(','))
      if (filters.buildType.length > 0) params.set('buildType', filters.buildType.join(','))
      if (filters.minScore !== undefined) params.set('minScore', filters.minScore.toString())
      if (filters.maxScore !== undefined) params.set('maxScore', filters.maxScore.toString())
      if (filters.search) params.set('search', filters.search)
      params.set('page', currentPage.toString())
      params.set('limit', '12')

      const response = await fetch(`/api/ideas?${params}`)
      if (response.ok) {
        const data: IdeasResponse = await response.json()
        setIdeas(data.ideas)
        setTotalPages(data.totalPages)
      } else {
        // Fallback to empty state
        setIdeas([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching ideas:', error)
      setIdeas([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIdeas()
  }, [filters, currentPage])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Link href="/auth/signin">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Startup Ideas Catalog
          </h1>
          <p className="text-lg text-gray-600">
            Discover and explore data-driven startup opportunities
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FiltersBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            availableTags={availableTags}
            availableBuildTypes={availableBuildTypes}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg border p-6">
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

        {/* Empty State */}
        {!loading && ideas.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No ideas found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms to find more ideas.
              </p>
              <Button onClick={() => handleFiltersChange({
                tags: [],
                difficulty: [],
                buildType: [],
              })}>
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Ideas Grid */}
        {!loading && ideas.length > 0 && (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}>
              {ideas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  showBookmark={true}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}