/**
 * Reddit API Client
 * Documentation: https://www.reddit.com/dev/api/
 */

import { APIResponse } from './types'
import { withRetry, isRetryableError } from './utils/retry'
import { RateLimiter } from './utils/rate-limiter'

export interface RedditPost {
  id: string
  title: string
  score: number
  num_comments: number
  created_utc: number
  subreddit: string
  url: string
}

export interface RedditSearchResult {
  posts: RedditPost[]
  totalMentions: number
  totalEngagement: number
}

export class RedditClient {
  private clientId: string
  private clientSecret: string
  private userAgent: string
  private accessToken?: string
  private tokenExpiry?: number
  private rateLimiter: RateLimiter

  constructor() {
    this.clientId = process.env.REDDIT_CLIENT_ID || ''
    this.clientSecret = process.env.REDDIT_CLIENT_SECRET || ''
    this.userAgent = process.env.REDDIT_USER_AGENT || 'IdeaBrowser/1.0'
    // Reddit rate limit: 60 requests per minute
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: 60,
      interval: 60000, // 1 minute
    })
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')

    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.userAgent,
      },
      body: 'grant_type=client_credentials',
    })

    if (!response.ok) {
      throw new Error(`Reddit auth failed: ${response.statusText}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in * 1000)

    return this.accessToken
  }

  async search(query: string, timeRange: 'day' | 'week' | 'month' | 'year' | 'all' = 'year'): Promise<APIResponse<RedditSearchResult>> {
    try {
      await this.rateLimiter.removeTokens(1)

      const result = await withRetry(
        async () => {
          const token = await this.getAccessToken()

          const params = new URLSearchParams({
            q: query,
            t: timeRange,
            limit: '100',
            sort: 'relevance',
          })

          const response = await fetch(`https://oauth.reddit.com/search?${params}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-Agent': this.userAgent,
            },
          })

          if (!response.ok) {
            throw new Error(`Reddit search failed: ${response.statusText}`)
          }

          return response.json()
        },
        {
          maxRetries: 3,
          retryOn: isRetryableError,
        }
      )

      const posts: RedditPost[] = result.data.children.map((child: any) => ({
        id: child.data.id,
        title: child.data.title,
        score: child.data.score,
        num_comments: child.data.num_comments,
        created_utc: child.data.created_utc,
        subreddit: child.data.subreddit,
        url: child.data.url,
      }))

      const totalMentions = posts.length
      const totalEngagement = posts.reduce((sum, post) => sum + post.score + post.num_comments, 0)

      return {
        success: true,
        data: {
          posts,
          totalMentions,
          totalEngagement,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getSubredditStats(query: string): Promise<APIResponse<{ subscribers: number; activeUsers: number }>> {
    try {
      const token = await this.getAccessToken()

      // Try to find relevant subreddit
      const response = await fetch(`https://oauth.reddit.com/subreddits/search?q=${encodeURIComponent(query)}&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': this.userAgent,
        },
      })

      if (!response.ok) {
        throw new Error(`Reddit subreddit search failed: ${response.statusText}`)
      }

      const data = await response.json()
      const subreddit = data.data.children[0]?.data

      if (!subreddit) {
        return {
          success: true,
          data: { subscribers: 0, activeUsers: 0 },
        }
      }

      return {
        success: true,
        data: {
          subscribers: subreddit.subscribers || 0,
          activeUsers: subreddit.active_user_count || 0,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
