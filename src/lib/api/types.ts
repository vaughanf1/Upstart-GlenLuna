/**
 * Common types for API clients
 */

export interface APIResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface RateLimitInfo {
  remaining: number
  reset: number
  limit: number
}

export interface APIClientConfig {
  baseURL?: string
  apiKey?: string
  timeout?: number
  retries?: number
}
