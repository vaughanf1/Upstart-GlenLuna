import { NextResponse } from 'next/server'
import { getAllIdeas } from '@/lib/json-db'
import { createClient } from '@/lib/supabase/server'

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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's profile from Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profileData) {
      return NextResponse.json({
        matches: [],
        message: 'Please complete the founder fit quiz first'
      })
    }

    // Convert snake_case to camelCase for profile
    const profile: FounderProfile = {
      id: profileData.id,
      technicalSkills: profileData.technical_skills || 3,
      designSkills: profileData.design_skills || 3,
      marketingSkills: profileData.marketing_skills || 3,
      salesSkills: profileData.sales_skills || 3,
      industryExperience: profileData.industry_experience || [],
      yearsExperience: profileData.years_experience || 0,
      riskTolerance: profileData.risk_tolerance || 3,
      timeCommitment: profileData.time_commitment || 'part-time',
      fundingCapacity: profileData.funding_capacity || 'bootstrapped',
      preferredBuildTypes: profileData.preferred_build_types || [],
      preferredTags: profileData.preferred_tags || [],
    }

    // Get all ideas from the JSON database
    const allIdeas = getAllIdeas()

    // Calculate fit scores for all ideas
    const matchedIdeas: MatchedIdea[] = allIdeas.map(idea => {
      const { score, reason } = calculateFitScore(profile, idea)

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

    // Save top matches to Supabase
    // Delete existing matches for this user
    await supabase
      .from('matched_ideas')
      .delete()
      .eq('user_id', user.id)

    // Insert new matches
    const matchesToSave = topMatches.map(match => ({
      user_id: user.id,
      idea_slug: match.slug,
      idea_title: match.title,
      idea_description: match.description || match.summary || '',
      match_score: match.fitScore,
      match_reasons: [match.fitReason],
    }))

    if (matchesToSave.length > 0) {
      await supabase
        .from('matched_ideas')
        .insert(matchesToSave)
    }

    return NextResponse.json({
      matches: topMatches,
      total: allIdeas.length,
      profileSummary: {
        buildTypes: profile.preferredBuildTypes,
        interests: profile.preferredTags,
        skillLevel: Math.max(
          profile.technicalSkills,
          profile.designSkills,
          profile.marketingSkills
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
