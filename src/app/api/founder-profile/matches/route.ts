import { NextResponse } from 'next/server'
import { getAllProfiles, getAllIdeas } from '@/lib/json-db'

// For simplicity, we'll use a default profile ID
// In a real app with auth, this would be the user's ID
const DEFAULT_PROFILE_ID = '1'

interface FounderProfile {
  id: string
  technicalSkills: number
  designSkills: number
  marketingSkills: number
  salesSkills: number
  industryExperience: string[]
  yearsExperience: number
  riskTolerance: number
  timeCommitment: 'part-time' | 'full-time'
  fundingCapacity: 'bootstrapped' | 'angel' | 'vc'
  preferredBuildTypes: string[]
  preferredTags: string[]
}

interface Idea {
  id: string
  slug: string
  title: string
  description: string
  summary?: string
  difficulty: number
  buildType: string
  tags: string[]
  score: number
  marketScore: number
  createdAt: string
  pitch?: string
  problem?: string
  solution?: string
}

interface MatchedIdea extends Idea {
  fitScore: number
  fitReason: string
}

function calculateFitScore(profile: FounderProfile, idea: Idea): { score: number; reason: string } {
  let score = 0
  let reasons: string[] = []

  // 1. Build Type Match (30 points)
  if (profile.preferredBuildTypes.includes(idea.buildType)) {
    score += 30
    reasons.push(`matches your preferred ${idea.buildType} build type`)
  } else if (profile.preferredBuildTypes.length === 0) {
    score += 15 // Partial credit if no preference specified
  }

  // 2. Tags/Interest Match (25 points)
  const matchingTags = idea.tags?.filter(tag =>
    profile.preferredTags.some(prefTag =>
      tag.toLowerCase().includes(prefTag.toLowerCase()) ||
      prefTag.toLowerCase().includes(tag.toLowerCase())
    )
  ) || []

  if (matchingTags.length > 0) {
    const tagScore = Math.min(25, matchingTags.length * 8)
    score += tagScore
    if (matchingTags.length > 1) {
      reasons.push(`aligns with your interests in ${matchingTags.slice(0, 2).join(' and ')}`)
    } else {
      reasons.push(`matches your ${matchingTags[0]} interest`)
    }
  }

  // 3. Difficulty vs Technical Skills Match (20 points)
  const skillLevel = Math.max(
    profile.technicalSkills,
    profile.designSkills,
    profile.marketingSkills
  )

  // Ideal difficulty is close to skill level
  const difficultyDelta = Math.abs(idea.difficulty - skillLevel)

  if (difficultyDelta === 0) {
    score += 20
    reasons.push('perfect difficulty match for your skill level')
  } else if (difficultyDelta === 1) {
    score += 15
    reasons.push('well-suited to your experience level')
  } else if (difficultyDelta === 2) {
    score += 10
  }

  // 4. Market Score (15 points) - Higher market scores are better opportunities
  const marketScoreNormalized = (idea.marketScore || 50) / 100
  score += marketScoreNormalized * 15

  // 5. Time Commitment Match (10 points)
  if (profile.timeCommitment === 'full-time') {
    if (idea.difficulty >= 3) {
      score += 10
      reasons.push('requires the full-time commitment you can provide')
    } else {
      score += 5
    }
  } else {
    // part-time
    if (idea.difficulty <= 3) {
      score += 10
      reasons.push('manageable with part-time commitment')
    } else {
      score += 3
    }
  }

  // Build reason string
  const reasonText = reasons.length > 0
    ? reasons.slice(0, 2).join(', and ')
    : 'has potential based on your profile'

  return {
    score: Math.round(score),
    reason: `This idea ${reasonText}.`
  }
}

export async function GET() {
  try {
    const profiles = getAllProfiles()
    // Get the most recent profile (last one in the array)
    const profile = profiles.length > 0 ? profiles[profiles.length - 1] : null

    if (!profile) {
      return NextResponse.json({
        matches: [],
        message: 'Please complete the founder fit quiz first'
      })
    }

    // Get all ideas from the database
    const allIdeas = getAllIdeas()

    // Calculate fit scores for all ideas
    const matchedIdeas: MatchedIdea[] = allIdeas.map(idea => {
      const { score, reason } = calculateFitScore(profile as FounderProfile, idea)

      return {
        ...idea,
        fitScore: score,
        fitReason: reason
      }
    })

    // Sort by fit score (highest first) and take top 12
    const topMatches = matchedIdeas
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 12)

    return NextResponse.json({
      matches: topMatches,
      total: allIdeas.length,
      profileSummary: {
        buildTypes: profile.preferredBuildTypes,
        interests: profile.preferredTags,
        skillLevel: Math.max(
          profile.technicalSkills || 3,
          profile.designSkills || 3,
          profile.marketingSkills || 3
        )
      }
    })
  } catch (error) {
    console.error('Error fetching founder profile matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
