import { NextRequest, NextResponse } from 'next/server'
import { getAllIdeas, createIdea } from '@/lib/json-db'
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
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      sortBy: searchParams.get('sortBy') as any || 'marketScore',
      sortOrder: searchParams.get('sortOrder') as any || 'desc',
    })

    let ideas = getAllIdeas()

    // Apply filters
    if (filters.tags && filters.tags.length > 0) {
      ideas = ideas.filter(idea =>
        idea.tags?.some(tag => filters.tags!.includes(tag))
      )
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      ideas = ideas.filter(idea =>
        idea.difficulty && filters.difficulty!.includes(idea.difficulty)
      )
    }

    if (filters.buildType && filters.buildType.length > 0) {
      ideas = ideas.filter(idea =>
        idea.buildType && filters.buildType!.includes(idea.buildType)
      )
    }

    if (filters.minScore !== undefined) {
      ideas = ideas.filter(idea =>
        (idea.marketScore || 0) >= filters.minScore!
      )
    }

    if (filters.maxScore !== undefined) {
      ideas = ideas.filter(idea =>
        (idea.marketScore || 0) <= filters.maxScore!
      )
    }

    // Sorting
    ideas.sort((a, b) => {
      const sortKey = filters.sortBy as keyof typeof a
      const aVal = a[sortKey] || 0
      const bVal = b[sortKey] || 0

      if (filters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    // Pagination
    const total = ideas.length
    const skip = (filters.page - 1) * filters.limit
    const paginatedIdeas = ideas.slice(skip, skip + filters.limit)

    return NextResponse.json({
      ideas: paginatedIdeas,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const idea = createIdea(body)

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}
