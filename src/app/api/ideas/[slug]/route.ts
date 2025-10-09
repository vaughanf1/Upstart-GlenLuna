import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    const idea = await db.idea.findUnique({
      where: { slug: params.slug },
      include: {
        bookmarks: session?.user?.id ? {
          where: { userId: session.user.id }
        } : false,
        _count: {
          select: { bookmarks: true }
        }
      }
    })

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      )
    }

    const ideaWithBookmarkStatus = {
      ...idea,
      tags: JSON.parse(idea.tags || '[]'),
      sources: idea.sources ? JSON.parse(idea.sources) : null,
      scoreBreakdown: idea.scoreBreakdown ? JSON.parse(idea.scoreBreakdown) : null,
      isBookmarked: session?.user?.id ? idea.bookmarks.length > 0 : false,
      bookmarkCount: idea._count.bookmarks,
      bookmarks: undefined,
      _count: undefined,
    }

    return NextResponse.json(ideaWithBookmarkStatus)

  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
      { status: 500 }
    )
  }
}