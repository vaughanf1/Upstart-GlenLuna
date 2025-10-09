/**
 * Signal Aggregator - Main entry point
 * Switches between mock and real data based on environment
 */

import { generateMockScore, type IdeaMetrics, type ScoringResult } from './mock/aggregator'
import { generateRealScore } from './real/aggregator'

export type { IdeaMetrics, ScoringResult }

/**
 * Generate score for an idea
 * Uses real APIs if DATA_MODE=real, otherwise uses mock data
 */
export async function generateScore(slug: string, metrics: IdeaMetrics): Promise<ScoringResult> {
  const dataMode = process.env.DATA_MODE || 'mock'

  if (dataMode === 'real') {
    console.log(`[Signals] Using real API data for: ${metrics.title}`)
    return generateRealScore(slug, metrics)
  } else {
    console.log(`[Signals] Using mock data for: ${metrics.title}`)
    return generateMockScore(slug, metrics)
  }
}
