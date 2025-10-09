interface FounderProfile {
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
  difficulty: number
  buildType: string
  tags: string[]
  score: number
}

interface IdeaMatch {
  fitScore: number
  fitReason: string
}

/**
 * Calculate how well an idea matches a founder's profile
 * Returns a score from 0-100 and a reason explaining the match
 */
export function calculateFounderFit(
  profile: FounderProfile,
  idea: Idea
): IdeaMatch {
  let totalScore = 0
  const reasons: string[] = []

  // 1. Skills match (30% weight)
  const skillsScore = calculateSkillsMatch(profile, idea)
  totalScore += skillsScore * 0.3
  if (skillsScore > 70) {
    reasons.push('Your skill set aligns well with this project')
  }

  // 2. Difficulty match (20% weight)
  const difficultyScore = calculateDifficultyMatch(profile, idea)
  totalScore += difficultyScore * 0.2
  if (difficultyScore > 70) {
    reasons.push('The difficulty level matches your experience')
  }

  // 3. Build type preference (20% weight)
  const buildTypeScore = calculateBuildTypeMatch(profile, idea)
  totalScore += buildTypeScore * 0.2
  if (buildTypeScore === 100) {
    reasons.push('This is exactly the type of project you prefer to build')
  }

  // 4. Industry/Tag alignment (20% weight)
  const tagScore = calculateTagMatch(profile, idea)
  totalScore += tagScore * 0.2
  if (tagScore > 70) {
    reasons.push('This aligns with your areas of interest')
  }

  // 5. Time/Risk compatibility (10% weight)
  const commitmentScore = calculateCommitmentMatch(profile, idea)
  totalScore += commitmentScore * 0.1

  // Generate final reason
  let fitReason = reasons.length > 0
    ? reasons.join(', ')
    : 'This idea could be a good opportunity based on your profile'

  return {
    fitScore: Math.round(totalScore),
    fitReason
  }
}

function calculateSkillsMatch(profile: FounderProfile, idea: Idea): number {
  // Map idea difficulty to required skill levels
  const requiredSkillLevel = idea.difficulty

  // Calculate average relevant skills
  let relevantSkills = [profile.technicalSkills]

  // Add design skills if it's a consumer-facing product
  const consumerTags = ['E-commerce', 'Social', 'Mobile', 'Consumer']
  if (idea.tags.some(tag => consumerTags.includes(tag))) {
    relevantSkills.push(profile.designSkills)
  }

  // Add marketing/sales for B2C products
  if (idea.tags.includes('E-commerce') || idea.tags.includes('Consumer')) {
    relevantSkills.push(profile.marketingSkills)
  }

  // Add sales for B2B/Enterprise
  if (idea.tags.includes('SaaS') || idea.tags.includes('Enterprise')) {
    relevantSkills.push(profile.salesSkills)
  }

  const avgSkills = relevantSkills.reduce((a, b) => a + b, 0) / relevantSkills.length

  // Score based on how well skills match difficulty
  const skillGap = Math.abs(avgSkills - requiredSkillLevel)
  return Math.max(0, 100 - (skillGap * 20))
}

function calculateDifficultyMatch(profile: FounderProfile, idea: Idea): number {
  // Map years of experience to comfortable difficulty range
  let comfortableRange: [number, number]

  if (profile.yearsExperience >= 10) {
    comfortableRange = [3, 5]
  } else if (profile.yearsExperience >= 5) {
    comfortableRange = [2, 4]
  } else if (profile.yearsExperience >= 2) {
    comfortableRange = [1, 3]
  } else {
    comfortableRange = [1, 2]
  }

  const [min, max] = comfortableRange

  if (idea.difficulty >= min && idea.difficulty <= max) {
    return 100
  } else if (idea.difficulty === min - 1 || idea.difficulty === max + 1) {
    return 70
  } else {
    return 40
  }
}

function calculateBuildTypeMatch(profile: FounderProfile, idea: Idea): number {
  if (profile.preferredBuildTypes.length === 0) {
    return 70 // Neutral if no preference specified
  }

  return profile.preferredBuildTypes.includes(idea.buildType) ? 100 : 30
}

function calculateTagMatch(profile: FounderProfile, idea: Idea): number {
  if (profile.preferredTags.length === 0 && profile.industryExperience.length === 0) {
    return 70 // Neutral if no preferences
  }

  // Check overlap between preferred tags and idea tags
  const preferredOverlap = profile.preferredTags.filter(tag =>
    idea.tags.includes(tag)
  ).length

  // Check overlap with industry experience
  const industryOverlap = profile.industryExperience.filter(industry =>
    idea.tags.some(tag => tag.includes(industry) || industry.includes(tag))
  ).length

  const totalPreferences = profile.preferredTags.length + profile.industryExperience.length
  const totalOverlap = preferredOverlap + industryOverlap

  if (totalPreferences === 0) return 70

  const overlapPercentage = (totalOverlap / Math.min(totalPreferences, 3)) * 100
  return Math.min(100, overlapPercentage)
}

function calculateCommitmentMatch(profile: FounderProfile, idea: Idea): number {
  let score = 70 // Base score

  // High difficulty ideas need full-time commitment
  if (idea.difficulty >= 4 && profile.timeCommitment === 'full-time') {
    score = 100
  } else if (idea.difficulty >= 4 && profile.timeCommitment === 'part-time') {
    score = 40
  }

  // Low difficulty ideas are fine for part-time
  if (idea.difficulty <= 2 && profile.timeCommitment === 'part-time') {
    score = 100
  }

  // Risk tolerance affects high-difficulty projects
  if (idea.difficulty >= 4 && profile.riskTolerance >= 4) {
    score = Math.min(100, score + 10)
  } else if (idea.difficulty >= 4 && profile.riskTolerance <= 2) {
    score = Math.max(0, score - 20)
  }

  return score
}

/**
 * Sort ideas by fit score in descending order
 */
export function rankIdeasByFit(
  profile: FounderProfile,
  ideas: Idea[]
): Array<Idea & IdeaMatch> {
  return ideas
    .map(idea => ({
      ...idea,
      ...calculateFounderFit(profile, idea)
    }))
    .sort((a, b) => b.fitScore - a.fitScore)
}