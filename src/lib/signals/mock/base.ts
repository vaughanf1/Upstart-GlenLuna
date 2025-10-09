/**
 * Base utilities for mock signal generation
 * Generates deterministic but realistic data based on idea slug hash
 */

export function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

export function seededRandom(seed: number, min: number = 0, max: number = 1): number {
  const a = 1664525
  const c = 1013904223
  const m = Math.pow(2, 32)
  seed = (a * seed + c) % m
  return min + (seed / m) * (max - min)
}

export function getRandomFromSeed(slug: string, offset: number = 0): number {
  return seededRandom(hashString(slug) + offset)
}

export function generateVariance(baseValue: number, seed: number, variancePercent: number = 0.3): number {
  const variance = baseValue * variancePercent
  const random = seededRandom(seed, -variance, variance)
  return Math.max(0, baseValue + random)
}