import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { ideaFiltersSchema } from '@/lib/validations/idea'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const filters = ideaFiltersSchema.parse({
      tags: searchParams.get('tags')?.split(',').filter(Boolean),
      difficulty: searchParams.get('difficulty')?.split(',').map(Number).filter(Boolean),
      buildType: searchParams.get('buildType')?.split(',').filter(Boolean),
      minScore: searchParams.get('minScore') ? Number(searchParams.get('minScore')) : undefined,
      maxScore: searchParams.get('maxScore') ? Number(searchParams.get('maxScore')) : undefined,
      bookmarked: searchParams.get('bookmarked') === 'true',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      sortBy: searchParams.get('sortBy') as any || 'score',
      sortOrder: searchParams.get('sortOrder') as any || 'desc',
    })

    const session = await getServerSession(authOptions)
    const skip = (filters.page - 1) * filters.limit

    const where: any = {}

    // Apply filters
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasSome: filters.tags }
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      where.difficulty = { in: filters.difficulty }
    }

    if (filters.buildType && filters.buildType.length > 0) {
      where.buildType = { in: filters.buildType }
    }

    if (filters.minScore !== undefined || filters.maxScore !== undefined) {
      where.score = {}
      if (filters.minScore !== undefined) where.score.gte = filters.minScore
      if (filters.maxScore !== undefined) where.score.lte = filters.maxScore
    }

    // Bookmarked filter (requires authentication)
    if (filters.bookmarked && session?.user?.id) {
      where.bookmarks = {
        some: {
          userId: session.user.id
        }
      }
    }

    const [ideas, total] = await Promise.all([
      db.idea.findMany({
        where,
        include: {
          bookmarks: session?.user?.id ? {
            where: { userId: session.user.id }
          } : false,
          _count: {
            select: { bookmarks: true }
          }
        },
        orderBy: { [filters.sortBy]: filters.sortOrder },
        skip,
        take: filters.limit,
      }),
      db.idea.count({ where })
    ])

    const ideasWithBookmarkStatus = ideas.map(idea => ({
      ...idea,
      tags: JSON.parse(idea.tags || '[]'),
      sources: idea.sources ? JSON.parse(idea.sources) : null,
      scoreBreakdown: idea.scoreBreakdown ? JSON.parse(idea.scoreBreakdown) : null,
      isBookmarked: session?.user?.id ? idea.bookmarks.length > 0 : false,
      bookmarkCount: idea._count.bookmarks,
      bookmarks: undefined, // Remove from response
      _count: undefined,
    }))

    return NextResponse.json({
      ideas: ideasWithBookmarkStatus,
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    })

  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}