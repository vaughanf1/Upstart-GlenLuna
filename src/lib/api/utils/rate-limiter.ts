/**
 * Rate Limiter Utility
 * Implements token bucket algorithm for API rate limiting
 */

export interface RateLimiterConfig {
  tokensPerInterval: number
  interval: number // in milliseconds
  maxTokens?: number
}

export class RateLimiter {
  private tokens: number
  private lastRefill: number
  private config: Required<RateLimiterConfig>

  constructor(config: RateLimiterConfig) {
    this.config = {
      tokensPerInterval: config.tokensPerInterval,
      interval: config.interval,
      maxTokens: config.maxTokens || config.tokensPerInterval,
    }
    this.tokens = this.config.maxTokens
    this.lastRefill = Date.now()
  }

  private refill(): void {
    const now = Date.now()
    const timePassed = now - this.lastRefill
    const tokensToAdd = Math.floor((timePassed / this.config.interval) * this.config.tokensPerInterval)

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.config.maxTokens, this.tokens + tokensToAdd)
      this.lastRefill = now
    }
  }

  async removeTokens(count: number = 1): Promise<boolean> {
    this.refill()

    if (this.tokens >= count) {
      this.tokens -= count
      return true
    }

    // Wait for tokens to refill
    const tokensNeeded = count - this.tokens
    const waitTime = Math.ceil((tokensNeeded / this.config.tokensPerInterval) * this.config.interval)

    await new Promise(resolve => setTimeout(resolve, waitTime))

    this.refill()
    this.tokens -= count
    return true
  }

  getAvailableTokens(): number {
    this.refill()
    return this.tokens
  }
}
