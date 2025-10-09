import { describe, it, expect } from 'vitest'
import { generateMockScore } from '../aggregator'

describe('generateMockScore', () => {
  const mockIdea = {
    title: 'Test Startup Idea',
    tags: ['AI', 'SaaS', 'Productivity'],
    problem: 'This is a test problem description',
    solution: 'This is a test solution description',
    targetUser: 'Test target users',
    whyNow: 'This is why now explanation',
  }

  it('should generate consistent scores for same input', async () => {
    const slug = 'test-startup-idea'

    const result1 = await generateMockScore(slug, mockIdea)
    const result2 = await generateMockScore(slug, mockIdea)

    expect(result1.score).toBe(result2.score)
    expect(result1.breakdown).toEqual(result2.breakdown)
  })

  it('should generate different scores for different slugs', async () => {
    const result1 = await generateMockScore('idea-one', mockIdea)
    const result2 = await generateMockScore('idea-two', mockIdea)

    expect(result1.score).not.toBe(result2.score)
  })

  it('should return valid score structure', async () => {
    const result = await generateMockScore('test-idea', mockIdea)

    expect(result).toHaveProperty('score')
    expect(result).toHaveProperty('breakdown')
    expect(result).toHaveProperty('sources')

    expect(typeof result.score).toBe('number')
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)

    expect(result.breakdown).toHaveProperty('trend')
    expect(result.breakdown).toHaveProperty('search')
    expect(result.breakdown).toHaveProperty('community')
    expect(result.breakdown).toHaveProperty('news')
    expect(result.breakdown).toHaveProperty('competition')
    expect(result.breakdown).toHaveProperty('quality')

    expect(Array.isArray(result.sources)).toBe(true)
    expect(result.sources.length).toBeGreaterThan(0)
  })

  it('should validate all breakdown values are in 0-100 range', async () => {
    const result = await generateMockScore('test-validation', mockIdea)

    Object.values(result.breakdown).forEach(value => {
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThanOrEqual(100)
    })
  })

  it('should include required source properties', async () => {
    const result = await generateMockScore('test-sources', mockIdea)

    result.sources.forEach(source => {
      expect(source).toHaveProperty('type')
      expect(source).toHaveProperty('url')
      expect(typeof source.type).toBe('string')
      expect(typeof source.url).toBe('string')
      expect(source.url).toMatch(/^https?:\/\//)
    })
  })

  it('should have higher quality score with complete metadata', async () => {
    const completeIdea = {
      title: 'Complete Idea',
      tags: ['AI', 'SaaS', 'Productivity', 'Analytics'],
      problem: 'Detailed problem description',
      solution: 'Detailed solution description',
      targetUser: 'Specific target users',
      whyNow: 'Clear timing explanation',
    }

    const incompleteIdea = {
      title: 'Incomplete Idea',
      tags: ['AI'],
    }

    const completeResult = await generateMockScore('complete-test', completeIdea)
    const incompleteResult = await generateMockScore('incomplete-test', incompleteIdea)

    expect(completeResult.breakdown.quality).toBeGreaterThan(incompleteResult.breakdown.quality)
  })
})