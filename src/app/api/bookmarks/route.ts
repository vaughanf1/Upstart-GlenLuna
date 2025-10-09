import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const bookmarkSchema = z.object({
  ideaId: z.string().cuid(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { ideaId } = bookmarkSchema.parse(body)

    // Check if idea exists
    const idea = await db.idea.findUnique({
      where: { id: ideaId }
    })

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      )
    }

    // Create or toggle bookmark
    const existingBookmark = await db.bookmark.findUnique({
      where: {
        userId_ideaId: {
          userId: session.user.id,
          ideaId: ideaId,
        }
      }
    })

    if (existingBookmark) {
      // Remove bookmark
      await db.bookmark.delete({
        where: { id: existingBookmark.id }
      })

      return NextResponse.json({
        message: 'Bookmark removed',
        bookmarked: false,
      })
    } else {
      // Add bookmark
      await db.bookmark.create({
        data: {
          userId: session.user.id,
          ideaId: ideaId,
        }
      })

      return NextResponse.json({
        message: 'Bookmark added',
        bookmarked: true,
      })
    }

  } catch (error) {
    console.error('Error managing bookmark:', error)
    return NextResponse.json(
      { error: 'Failed to manage bookmark' },
      { status: 500 }
    )
  }
}