import { NextRequest, NextResponse } from 'next/server'
import { getIdeaBySlug } from '@/lib/json-db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const idea = getIdeaBySlug(params.slug)

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(idea)

  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
      { status: 500 }
    )
  }
}
