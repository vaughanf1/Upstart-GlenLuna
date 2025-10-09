import { getRandomFromSeed, generateVariance } from './base'

export interface NewsData {
  volume: number // Number of relevant articles
  recencyFactor: number // 0-1, how recent the news is
  relevanceScore: number // 0-1, how relevant to the idea
}

export function getMockNewsData(slug: string): NewsData {
  const baseRandom = getRandomFromSeed(slug, 400)

  // Generate news coverage patterns
  const newsProfiles = [
    { volume: 15, recency: 0.9, relevance: 0.8 }, // Hot topic, recent coverage
    { volume: 8, recency: 0.7, relevance: 0.7 },  // Moderate recent coverage
    { volume: 3, recency: 0.5, relevance: 0.6 },  // Some older coverage
    { volume: 1, recency: 0.3, relevance: 0.5 },  // Minimal/old coverage
    { volume: 0, recency: 0, relevance: 0 },      // No news coverage
  ]

  const profileIndex = Math.floor(baseRandom * newsProfiles.length)
  const baseProfile = newsProfiles[profileIndex]

  return {
    volume: Math.round(generateVariance(baseProfile.volume, getRandomFromSeed(slug, 401), 0.5)),
    recencyFactor: Math.max(0, Math.min(1, generateVariance(baseProfile.recency, getRandomFromSeed(slug, 402), 0.3))),
    relevanceScore: Math.max(0, Math.min(1, generateVariance(baseProfile.relevance, getRandomFromSeed(slug, 403), 0.2))),
  }
}