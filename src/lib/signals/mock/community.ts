import { getRandomFromSeed, generateVariance } from './base'

export interface CommunityData {
  redditMentions: number
  redditEngagement: number
  hnMentions: number
  hnEngagement: number
  totalMentions: number
  totalEngagement: number
}

export function getMockCommunityData(slug: string): CommunityData {
  const baseRandom = getRandomFromSeed(slug, 300)

  // Generate community engagement patterns
  const communityProfiles = [
    { reddit: 25, hn: 8, engagement: 150 },  // High community interest
    { reddit: 10, hn: 3, engagement: 60 },   // Moderate interest
    { reddit: 3, hn: 1, engagement: 20 },    // Some discussion
    { reddit: 1, hn: 0, engagement: 5 },     // Minimal mentions
    { reddit: 0, hn: 0, engagement: 0 },     // No community activity
  ]

  const profileIndex = Math.floor(baseRandom * communityProfiles.length)
  const baseProfile = communityProfiles[profileIndex]

  const redditMentions = Math.round(generateVariance(baseProfile.reddit, getRandomFromSeed(slug, 301), 0.6))
  const hnMentions = Math.round(generateVariance(baseProfile.hn, getRandomFromSeed(slug, 302), 0.7))
  const baseEngagement = generateVariance(baseProfile.engagement, getRandomFromSeed(slug, 303), 0.5)

  // Engagement is typically 3-8x the mentions
  const redditEngagement = Math.round(redditMentions * generateVariance(5, getRandomFromSeed(slug, 304), 0.4))
  const hnEngagement = Math.round(hnMentions * generateVariance(6, getRandomFromSeed(slug, 305), 0.3))

  return {
    redditMentions,
    redditEngagement,
    hnMentions,
    hnEngagement,
    totalMentions: redditMentions + hnMentions,
    totalEngagement: redditEngagement + hnEngagement,
  }
}