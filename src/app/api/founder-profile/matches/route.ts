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
  difficulty?: number
  buildType?: string
  tags?: string[]
  score?: number
  marketScore?: number
  createdAt?: string
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

  // 1. Build Type Match (25 points) - Stricter matching
  if (profile.preferredBuildTypes.length > 0 && idea.buildType) {
    if (profile.preferredBuildTypes.includes(idea.buildType)) {
      score += 25
      reasons.push(`matches your preferred ${idea.buildType} build type`)
    } else {
      // Penalize non-matches when user has preferences
      score += 5
    }
  } else {
    // No preference - neutral score
    score += 12
  }

  // 2. Tags/Interest Match (30 points) - Increased weight
  const matchingTags = idea.tags?.filter(tag =>
    profile.preferredTags.some(prefTag =>
      tag.toLowerCase().includes(prefTag.toLowerCase()) ||
      prefTag.toLowerCase().includes(tag.toLowerCase())
    )
  ) || []

  if (profile.preferredTags.length > 0) {
    const matchRatio = matchingTags.length / Math.max(profile.preferredTags.length, 1)
    const tagScore = Math.round(matchRatio * 30)
    score += tagScore

    if (matchingTags.length >= 2) {
      reasons.push(`strong match with ${matchingTags.slice(0, 2).join(' and ')}`)
    } else if (matchingTags.length === 1) {
      reasons.push(`aligns with your ${matchingTags[0]} interest`)
    }
  } else {
    // No preferences - slight neutral score
    score += 10
  }

  // 3. Skill Match (25 points) - More nuanced calculation
  // Determine relevant skills based on idea characteristics
  let relevantSkills: number[] = []

  // Technical skills always matter
  relevantSkills.push(profile.technicalSkills)

  // Add other skills based on idea type and tags
  const requiresDesign = (idea.buildType && ['Mobile App', 'Web App', 'Platform'].includes(idea.buildType)) ||
                         idea.tags?.some(t => ['Social', 'E-commerce', 'Consumer'].includes(t)) || false
  const requiresMarketing = idea.tags?.some(t => ['E-commerce', 'Consumer', 'Social'].includes(t)) || false
  const requiresSales = (idea.buildType && ['SaaS', 'API', 'Tool'].includes(idea.buildType)) ||
                        idea.tags?.some(t => ['B2B', 'Enterprise', 'SaaS'].includes(t)) || false

  if (requiresDesign) relevantSkills.push(profile.designSkills)
  if (requiresMarketing) relevantSkills.push(profile.marketingSkills)
  if (requiresSales) relevantSkills.push(profile.salesSkills)

  const avgRelevantSkills = relevantSkills.reduce((a, b) => a + b, 0) / relevantSkills.length

  // Match difficulty to skill level
  const ideaDifficulty = idea.difficulty || 3 // Default to medium if not set
  const difficultyDelta = Math.abs(ideaDifficulty - avgRelevantSkills)

  if (difficultyDelta === 0) {
    score += 25
    reasons.push('perfect difficulty match for your skill level')
  } else if (difficultyDelta <= 0.5) {
    score += 20
    reasons.push('well-suited to your skill level')
  } else if (difficultyDelta <= 1) {
    score += 15
  } else if (difficultyDelta <= 1.5) {
    score += 10
  } else if (difficultyDelta <= 2) {
    score += 5
  }
  // No points if delta > 2

  // 4. Idea Quality Score (15 points) - Use existing idea metrics
  const qualityScore = (idea.score || 5) / 10 // Normalize 0-10 to 0-1
  score += qualityScore * 15

  // 5. Time & Risk Match (5 points)
  let commitmentScore = 0
  const ideaDifficultyForCommitment = idea.difficulty || 3

  if (profile.timeCommitment === 'full-time') {
    if (ideaDifficultyForCommitment >= 4) {
      commitmentScore = 5
      reasons.push('ideal for full-time commitment')
    } else if (ideaDifficultyForCommitment >= 3) {
      commitmentScore = 3
    } else {
      commitmentScore = 2
    }
  } else {
    // part-time
    if (ideaDifficultyForCommitment <= 2) {
      commitmentScore = 5
      reasons.push('perfect for part-time work')
    } else if (ideaDifficultyForCommitment === 3) {
      commitmentScore = 3
    } else {
      commitmentScore = 1
    }
  }
  score += commitmentScore

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
