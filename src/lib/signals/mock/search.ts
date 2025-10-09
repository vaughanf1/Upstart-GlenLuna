import { getRandomFromSeed, generateVariance } from './base'

export interface SearchData {
  volume: number // Monthly search volume
  growth3mo: number // 3-month growth percentage
  growth12mo: number // 12-month growth percentage
}

export function getMockSearchData(slug: string): SearchData {
  const baseRandom = getRandomFromSeed(slug, 200)

  // Generate search volume based on idea category/type
  const volumeProfiles = [
    { base: 50000, growth3mo: 25, growth12mo: 150 }, // Viral/trending
    { base: 10000, growth3mo: 10, growth12mo: 50 },  // Growing steadily
    { base: 2000, growth3mo: 5, growth12mo: 15 },    // Niche but growing
    { base: 500, growth3mo: -5, growth12mo: -10 },   // Declining niche
    { base: 100, growth3mo: 0, growth12mo: 5 },      // Very small/new
  ]

  const profileIndex = Math.floor(baseRandom * volumeProfiles.length)
  const baseProfile = volumeProfiles[profileIndex]

  return {
    volume: Math.round(generateVariance(baseProfile.base, getRandomFromSeed(slug, 201), 0.5)),
    growth3mo: generateVariance(baseProfile.growth3mo, getRandomFromSeed(slug, 202), 0.6),
    growth12mo: generateVariance(baseProfile.growth12mo, getRandomFromSeed(slug, 203), 0.4),
  }
}