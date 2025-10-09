/**
 * Normalize various signal inputs to 0-100 scale
 */

export function normalizeTrend(slope: number, variance: number): number {
  // Normalize 12-month slope percentage and variance to 0-100
  // Positive slope is good, low variance is good
  const slopeScore = Math.max(0, Math.min(100, (slope + 50) * 2)) // -50% to +50% becomes 0-100
  const varianceScore = Math.max(0, Math.min(100, 100 - variance * 2)) // Lower variance is better
  return (slopeScore * 0.7 + varianceScore * 0.3)
}

export function normalizeSearchVolume(volume: number, growth3mo: number, growth12mo: number): number {
  // Normalize search volume and growth rates
  const volumeScore = Math.max(0, Math.min(100, Math.log10(volume + 1) * 20)) // Log scale for volume
  const growth3moScore = Math.max(0, Math.min(100, (growth3mo + 50) * 2)) // -50% to +50%
  const growth12moScore = Math.max(0, Math.min(100, (growth12mo + 50) * 2))

  return (volumeScore * 0.5 + growth3moScore * 0.3 + growth12moScore * 0.2)
}

export function normalizeCommunity(mentions: number, engagement: number): number {
  // Normalize Reddit/HN mentions and engagement
  const mentionsScore = Math.max(0, Math.min(100, Math.log10(mentions + 1) * 25))
  const engagementScore = Math.max(0, Math.min(100, Math.log10(engagement + 1) * 20))

  return (mentionsScore * 0.6 + engagementScore * 0.4)
}

export function normalizeNews(volume: number, recencyFactor: number): number {
  // Normalize news volume with recency decay
  const volumeScore = Math.max(0, Math.min(100, Math.log10(volume + 1) * 30))
  const recencyScore = Math.max(0, Math.min(100, recencyFactor * 100))

  return volumeScore * recencyScore
}

export function normalizeCompetition(competitorCount: number): number {
  // More competitors = lower score (inverted)
  // Log scale: 0 competitors = 100, many competitors approaches 0
  if (competitorCount === 0) return 100
  return Math.max(0, 100 - Math.log10(competitorCount + 1) * 50)
}

export function normalizeQuality(
  hasProblem: boolean,
  hasSolution: boolean,
  hasTargetUser: boolean,
  hasWhyNow: boolean,
  tagCount: number
): number {
  // Heuristic based on metadata completeness
  let score = 0

  if (hasProblem) score += 25
  if (hasSolution) score += 25
  if (hasTargetUser) score += 20
  if (hasWhyNow) score += 20

  // Tag bonus: 1-3 tags = good, 4+ tags = excellent
  const tagScore = Math.min(10, tagCount * 2.5)
  score += tagScore

  return Math.min(100, score)
}