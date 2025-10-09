import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { env } from '@/lib/env'
import { generateScore } from '@/lib/signals/aggregator'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user?.roles?.includes('admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const idea = await db.idea.findUnique({
      where: { slug: params.slug }
    })

    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      )
    }

    if (env.SCORING_MODE === 'n8n') {
      // Call n8n webhook
      if (!env.N8N_WEBHOOK_URL) {
        return NextResponse.json(
          { error: 'N8N webhook URL not configured' },
          { status: 500 }
        )
      }

      const payload = {
        ideaId: idea.id,
        slug: idea.slug,
        title: idea.title,
        tags: idea.tags,
      }

      const response = await fetch(env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`N8N webhook failed: ${response.status}`)
      }

      return NextResponse.json({
        message: 'Score refresh initiated via n8n',
        ideaId: idea.id,
      })

    } else {
      // Use local scoring (mock or real based on DATA_MODE env var)
      const scoringResult = await generateScore(idea.slug, {
        title: idea.title,
        tags: JSON.parse(idea.tags as string) as string[],
        problem: idea.problem,
        solution: idea.solution,
        targetUser: idea.targetUser || undefined,
        whyNow: idea.whyNow || undefined,
      })

      // Update the idea with new score
      const updatedIdea = await db.idea.update({
        where: { id: idea.id },
        data: {
          score: scoringResult.score,
          scoreBreakdown: JSON.stringify(scoringResult.breakdown),
          sources: JSON.stringify(scoringResult.sources),
          lastScoredAt: new Date(),
        },
      })

      // Log the scoring event
      await db.log.create({
        data: {
          level: 'info',
          message: `Score refreshed for idea: ${idea.title}`,
          data: JSON.stringify({
            ideaId: idea.id,
            oldScore: idea.score,
            newScore: scoringResult.score,
            method: process.env.DATA_MODE === 'real' ? 'local-real' : 'local-mock',
          }),
        },
      })

      return NextResponse.json({
        message: 'Score refreshed successfully',
        idea: updatedIdea,
        breakdown: scoringResult.breakdown,
      })
    }

  } catch (error) {
    console.error('Error refreshing score:', error)
    return NextResponse.json(
      { error: 'Failed to refresh score' },
      { status: 500 }
    )
  }
}