import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { createIdeaSchema } from '@/lib/validations/idea'
import { slugify } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createIdeaSchema.parse(body)

    // Generate slug if not provided
    const slug = body.slug || slugify(data.title)

    // Check if slug already exists
    const existingIdea = await db.idea.findUnique({
      where: { slug }
    })

    if (existingIdea) {
      return NextResponse.json(
        { error: 'An idea with this title already exists' },
        { status: 400 }
      )
    }

    // Create the idea
    const idea = await db.idea.create({
      data: {
        ...data,
        slug,
        tags: JSON.stringify(data.tags),
      }
    })

    // Log the creation
    await db.log.create({
      data: {
        level: 'info',
        message: `New idea created: ${idea.title}`,
        data: JSON.stringify({
          ideaId: idea.id,
          userId: session.user.id,
          action: 'create_idea',
        }),
      },
    })

    return NextResponse.json(idea, { status: 201 })

  } catch (error) {
    console.error('Error creating idea:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 20
    const search = searchParams.get('search')
    const filter = searchParams.get('filter')

    const skip = (page - 1) * limit
    const where: any = {}

    // Apply search
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    // Apply filters
    if (filter === 'needs-scoring') {
      where.OR = [
        { lastScoredAt: null },
        { score: 0 },
      ]
    }

    const [ideas, total] = await Promise.all([
      db.idea.findMany({
        where,
        include: {
          _count: {
            select: { bookmarks: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.idea.count({ where })
    ])

    return NextResponse.json({
      ideas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })

  } catch (error) {
    console.error('Error fetching admin ideas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}