import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { rankIdeasByFit } from '@/lib/founder-fit/matching'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get founder profile
    const profile = await db.founderProfile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete the founder fit quiz first.' },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const profileData = {
      technicalSkills: profile.technicalSkills,
      designSkills: profile.designSkills,
      marketingSkills: profile.marketingSkills,
      salesSkills: profile.salesSkills,
      industryExperience: profile.industryExperience
        ? JSON.parse(profile.industryExperience)
        : [],
      yearsExperience: profile.yearsExperience,
      riskTolerance: profile.riskTolerance,
      timeCommitment: profile.timeCommitment as 'part-time' | 'full-time',
      fundingCapacity: profile.fundingCapacity as 'bootstrapped' | 'angel' | 'vc',
      preferredBuildTypes: profile.preferredBuildTypes
        ? JSON.parse(profile.preferredBuildTypes)
        : [],
      preferredTags: profile.preferredTags
        ? JSON.parse(profile.preferredTags)
        : [],
    }

    // Get all ideas
    const ideas = await db.idea.findMany({
      orderBy: { score: 'desc' },
      take: 50 // Get top 50 ideas to rank
    })

    // Parse and rank ideas
    const parsedIdeas = ideas.map(idea => ({
      ...idea,
      tags: JSON.parse(idea.tags) as string[],
    }))

    const rankedIdeas = rankIdeasByFit(profileData, parsedIdeas)

    // Get user's bookmarks
    const bookmarks = await db.bookmark.findMany({
      where: { userId: session.user.id },
      select: { ideaId: true }
    })
    const bookmarkedIds = new Set(bookmarks.map(b => b.ideaId))

    // Return top 12 matches with fit scores
    const matches = rankedIdeas.slice(0, 12).map((ideaMatch: any) => ({
      id: ideaMatch.id,
      slug: ideaMatch.slug,
      title: ideaMatch.title,
      summary: ideaMatch.summary,
      difficulty: ideaMatch.difficulty,
      buildType: ideaMatch.buildType,
      tags: ideaMatch.tags,
      score: ideaMatch.score,
      createdAt: ideaMatch.createdAt.toISOString(),
      fitScore: ideaMatch.fitScore,
      fitReason: ideaMatch.fitReason,
      isBookmarked: bookmarkedIds.has(ideaMatch.id),
    }))

    return NextResponse.json({ matches })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}