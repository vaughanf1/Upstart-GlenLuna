/**
 * Compute final idea score from normalized metrics
 */

export interface ScoreBreakdown {
  trend: number
  search: number
  community: number
  news: number
  competition: number
  quality: number
}

export interface ScoreWeights {
  trend: number
  search: number
  community: number
  news: number
  competition: number
  quality: number
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  trend: 0.28,
  search: 0.22,
  community: 0.18,
  news: 0.14,
  competition: 0.10,
  quality: 0.08,
}

export function computeScore(
  breakdown: ScoreBreakdown,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): number {
  const score =
    breakdown.trend * weights.trend +
    breakdown.search * weights.search +
    breakdown.community * weights.community +
    breakdown.news * weights.news +
    breakdown.competition * weights.competition +
    breakdown.quality * weights.quality

  return Math.round(score * 10) / 10 // Round to 1 decimal place
}

export function validateBreakdown(breakdown: Partial<ScoreBreakdown>): ScoreBreakdown {
  return {
    trend: Math.max(0, Math.min(100, breakdown.trend || 0)),
    search: Math.max(0, Math.min(100, breakdown.search || 0)),
    community: Math.max(0, Math.min(100, breakdown.community || 0)),
    news: Math.max(0, Math.min(100, breakdown.news || 0)),
    competition: Math.max(0, Math.min(100, breakdown.competition || 0)),
    quality: Math.max(0, Math.min(100, breakdown.quality || 0)),
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
  if (score >= 20) return 'text-orange-600'
  return 'text-red-600'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  if (score >= 20) return 'Poor'
  return 'Very Poor'
}