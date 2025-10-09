import { getRandomFromSeed, generateVariance } from './base'

export interface TrendData {
  slope: number // 12-month slope percentage
  variance: number // Trend variance/volatility
  volume: number // Relative search volume
}

export function getMockTrendData(slug: string): TrendData {
  const baseRandom = getRandomFromSeed(slug, 100)

  // Generate realistic trend patterns
  const trendCategories = [
    { slope: 15, variance: 20, volume: 80 }, // Strong uptrend
    { slope: 5, variance: 15, volume: 60 },  // Moderate uptrend
    { slope: -5, variance: 25, volume: 40 }, // Slight downtrend
    { slope: -15, variance: 35, volume: 30 }, // Strong downtrend
    { slope: 0, variance: 10, volume: 70 },   // Stable/sideways
  ]

  const categoryIndex = Math.floor(baseRandom * trendCategories.length)
  const baseCategory = trendCategories[categoryIndex]

  return {
    slope: generateVariance(baseCategory.slope, getRandomFromSeed(slug, 101), 0.4),
    variance: generateVariance(baseCategory.variance, getRandomFromSeed(slug, 102), 0.3),
    volume: generateVariance(baseCategory.volume, getRandomFromSeed(slug, 103), 0.2),
  }
}