import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { scoreUpdateSchema } from '@/lib/validations/idea'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = scoreUpdateSchema.parse(body)

    // Find the idea
    const idea = await db.idea.findUnique({
      where: { id: data.ideaId }
    })

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      )
    }

    // Update the idea with new score data
    const updatedIdea = await db.idea.update({
      where: { id: data.ideaId },
      data: {
        score: data.score,
        scoreBreakdown: JSON.stringify(data.breakdown),
        sources: JSON.stringify(data.sources || []),
        lastScoredAt: new Date(),
      },
    })

    // Log the score update
    await db.log.create({
      data: {
        level: 'info',
        message: `Score updated via webhook for idea: ${idea.title}`,
        data: JSON.stringify({
          ideaId: data.ideaId,
          oldScore: idea.score,
          newScore: data.score,
          method: 'n8n-webhook',
          breakdown: data.breakdown,
        }),
      },
    })

    return NextResponse.json({
      message: 'Score updated successfully',
      ideaId: data.ideaId,
      score: data.score,
    })

  } catch (error) {
    console.error('Error updating score via webhook:', error)

    // Log the error
    await db.log.create({
      data: {
        level: 'error',
        message: 'Failed to update score via webhook',
        data: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
    }).catch(() => {}) // Ignore if logging fails

    return NextResponse.json(
      { error: 'Failed to update score' },
      { status: 500 }
    )
  }
}