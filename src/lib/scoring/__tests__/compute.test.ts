import { describe, it, expect } from 'vitest'
import { computeScore, validateBreakdown, getScoreColor, getScoreLabel, DEFAULT_WEIGHTS } from '../compute'

describe('computeScore', () => {
  it('should compute score correctly with default weights', () => {
    const breakdown = {
      trend: 80,
      search: 70,
      community: 60,
      news: 50,
      competition: 40,
      quality: 90,
    }

    const score = computeScore(breakdown)

    // Manual calculation: 80*0.28 + 70*0.22 + 60*0.18 + 50*0.14 + 40*0.10 + 90*0.08
    // = 22.4 + 15.4 + 10.8 + 7 + 4 + 7.2 = 66.8
    expect(score).toBe(66.8)
  })

  it('should compute score with custom weights', () => {
    const breakdown = {
      trend: 100,
      search: 100,
      community: 100,
      news: 100,
      competition: 100,
      quality: 100,
    }

    const customWeights = {
      trend: 0.5,
      search: 0.2,
      community: 0.1,
      news: 0.1,
      competition: 0.05,
      quality: 0.05,
    }

    const score = computeScore(breakdown, customWeights)
    expect(score).toBe(100)
  })

  it('should handle zero scores', () => {
    const breakdown = {
      trend: 0,
      search: 0,
      community: 0,
      news: 0,
      competition: 0,
      quality: 0,
    }

    const score = computeScore(breakdown)
    expect(score).toBe(0)
  })

  it('should round to one decimal place', () => {
    const breakdown = {
      trend: 33.333,
      search: 33.333,
      community: 33.333,
      news: 33.333,
      competition: 33.333,
      quality: 33.333,
    }

    const score = computeScore(breakdown)
    expect(score).toBe(33.3) // Should be rounded to 1 decimal
  })
})

describe('validateBreakdown', () => {
  it('should clamp values to 0-100 range', () => {
    const invalidBreakdown = {
      trend: -10,
      search: 150,
      community: 50,
      news: -5,
      competition: 200,
      quality: 75,
    }

    const validated = validateBreakdown(invalidBreakdown)

    expect(validated).toEqual({
      trend: 0,
      search: 100,
      community: 50,
      news: 0,
      competition: 100,
      quality: 75,
    })
  })

  it('should fill missing values with zero', () => {
    const partialBreakdown = {
      trend: 80,
      search: 70,
    }

    const validated = validateBreakdown(partialBreakdown)

    expect(validated).toEqual({
      trend: 80,
      search: 70,
      community: 0,
      news: 0,
      competition: 0,
      quality: 0,
    })
  })
})

describe('getScoreColor', () => {
  it('should return correct colors for score ranges', () => {
    expect(getScoreColor(90)).toBe('text-green-600')
    expect(getScoreColor(80)).toBe('text-green-600')
    expect(getScoreColor(70)).toBe('text-blue-600')
    expect(getScoreColor(60)).toBe('text-blue-600')
    expect(getScoreColor(50)).toBe('text-yellow-600')
    expect(getScoreColor(40)).toBe('text-yellow-600')
    expect(getScoreColor(30)).toBe('text-orange-600')
    expect(getScoreColor(20)).toBe('text-orange-600')
    expect(getScoreColor(10)).toBe('text-red-600')
    expect(getScoreColor(0)).toBe('text-red-600')
  })
})

describe('getScoreLabel', () => {
  it('should return correct labels for score ranges', () => {
    expect(getScoreLabel(90)).toBe('Excellent')
    expect(getScoreLabel(80)).toBe('Excellent')
    expect(getScoreLabel(70)).toBe('Good')
    expect(getScoreLabel(60)).toBe('Good')
    expect(getScoreLabel(50)).toBe('Fair')
    expect(getScoreLabel(40)).toBe('Fair')
    expect(getScoreLabel(30)).toBe('Poor')
    expect(getScoreLabel(20)).toBe('Poor')
    expect(getScoreLabel(10)).toBe('Very Poor')
    expect(getScoreLabel(0)).toBe('Very Poor')
  })
})