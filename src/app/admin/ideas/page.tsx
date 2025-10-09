import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Search, RefreshCw, Edit, Trash2 } from 'lucide-react'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScoreBadge } from '@/components/score-badge'
import { formatDate } from '@/lib/utils'

async function getIdeas(searchParams: { search?: string; filter?: string }) {
  const where: any = {}

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { summary: { contains: searchParams.search, mode: 'insensitive' } },
      { tags: { has: searchParams.search } },
    ]
  }

  if (searchParams.filter === 'needs-scoring') {
    where.OR = [
      { lastScoredAt: null },
      { score: 0 },
    ]
  }

  const ideas = await db.idea.findMany({
    where,
    include: {
      _count: {
        select: { bookmarks: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return ideas
}

async function IdeasTable({ searchParams }: { searchParams: { search?: string; filter?: string } }) {
  const rawIdeas = await getIdeas(searchParams)
  const ideas = rawIdeas.map(idea => ({
    ...idea,
    tags: JSON.parse(idea.tags as string) as string[]
  }))

  if (ideas.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600 mb-4">
            {searchParams.search
              ? 'Try adjusting your search terms.'
              : 'Get started by creating your first idea.'}
          </p>
          <Link href="/admin/ideas/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Idea
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ideas ({ideas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Last Scored</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Bookmarks</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr key={idea.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <Link
                        href={`/ideas/${idea.slug}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {idea.title}
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-1">
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
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <ScoreBadge score={idea.score} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{idea.buildType}</Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(idea.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {idea.lastScoredAt ? formatDate(idea.lastScoredAt) : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {idea._count.bookmarks}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <form action={`/api/ideas/${idea.slug}/refresh`} method="post">
                        <Button type="submit" variant="ghost" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </form>
                      <Link href={`/admin/ideas/${idea.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function IdeasTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-32"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AdminIdeasPage({
  searchParams,
}: {
  searchParams: { search?: string; filter?: string }
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-xl font-semibold text-gray-900">Ideas</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/ideas/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Idea
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search ideas..."
                    defaultValue={searchParams.search}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <select
                name="filter"
                defaultValue={searchParams.filter}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Ideas</option>
                <option value="needs-scoring">Needs Scoring</option>
              </select>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Ideas Table */}
        <Suspense fallback={<IdeasTableSkeleton />}>
          <IdeasTable searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}