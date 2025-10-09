import { describe, it, expect } from 'vitest'
import {
  normalizeTrend,
  normalizeSearchVolume,
  normalizeCommunity,
  normalizeNews,
  normalizeCompetition,
  normalizeQuality,
} from '../normalize'

describe('normalizeTrend', () => {
  it('should normalize positive slope and low variance correctly', () => {
    const result = normalizeTrend(25, 10) // Good trend: positive slope, low variance
    expect(result).toBeGreaterThan(80)
  })

  it('should normalize negative slope correctly', () => {
    const result = normalizeTrend(-25, 10) // Bad trend: negative slope
    expect(result).toBeLessThan(50)
  })

  it('should handle extreme values', () => {
    const result1 = normalizeTrend(100, 0) // Perfect trend
    const result2 = normalizeTrend(-100, 100) // Worst trend

    expect(result1).toBeGreaterThan(result2)
    expect(result1).toBeLessThanOrEqual(100)
    expect(result2).toBeGreaterThanOrEqual(0)
  })
})

describe('normalizeSearchVolume', () => {
  it('should normalize high volume and growth correctly', () => {
    const result = normalizeSearchVolume(100000, 50, 100) // High volume, good growth
    expect(result).toBeGreaterThan(80)
  })

  it('should normalize low volume correctly', () => {
    const result = normalizeSearchVolume(100, 0, 0) // Low volume, no growth
    expect(result).toBeLessThan(50)
  })

  it('should handle zero volume', () => {
    const result = normalizeSearchVolume(0, 0, 0)
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(100)
  })
})

describe('normalizeCommunity', () => {
  it('should normalize high engagement correctly', () => {
    const result = normalizeCommunity(50, 500) // Many mentions, high engagement
    expect(result).toBeGreaterThan(60)
  })

  it('should normalize zero activity correctly', () => {
    const result = normalizeCommunity(0, 0)
    expect(result).toBe(0)
  })

  it('should weight mentions higher than engagement', () => {
    const result1 = normalizeCommunity(100, 0) // High mentions, no engagement
    const result2 = normalizeCommunity(0, 100) // No mentions, high engagement
    expect(result1).toBeGreaterThan(result2)
  })
})

describe('normalizeNews', () => {
  it('should normalize high recent volume correctly', () => {
    const result = normalizeNews(20, 1.0) // High volume, very recent
    expect(result).toBeGreaterThan(70)
  })

  it('should penalize old news', () => {
    const result = normalizeNews(20, 0.1) // High volume, but old
    expect(result).toBeLessThan(30)
  })

  it('should handle zero volume', () => {
    const result = normalizeNews(0, 1.0)
    expect(result).toBe(0)
  })
})

describe('normalizeCompetition', () => {
  it('should return 100 for zero competitors', () => {
    const result = normalizeCompetition(0)
    expect(result).toBe(100)
  })

  it('should decrease with more competitors', () => {
    const result1 = normalizeCompetition(1)
    const result2 = normalizeCompetition(10)
    const result3 = normalizeCompetition(100)

    expect(result1).toBeGreaterThan(result2)
    expect(result2).toBeGreaterThan(result3)
    expect(result3).toBeGreaterThanOrEqual(0)
  })
})

describe('normalizeQuality', () => {
  it('should return 100 for complete metadata', () => {
    const result = normalizeQuality(true, true, true, true, 5)
    expect(result).toBe(100)
  })

  it('should return lower scores for incomplete metadata', () => {
    const result = normalizeQuality(true, true, false, false, 2)
    expect(result).toBeLessThan(100)
    expect(result).toBeGreaterThan(0)
  })

  it('should return 0 for no metadata', () => {
    const result = normalizeQuality(false, false, false, false, 0)
    expect(result).toBe(0)
  })

  it('should bonus for more tags', () => {
    const result1 = normalizeQuality(true, true, true, true, 2)
    const result2 = normalizeQuality(true, true, true, true, 5)
    expect(result2).toBeGreaterThan(result1)
  })
})