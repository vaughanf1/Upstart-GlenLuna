/**
 * News API Client
 * Documentation: https://newsapi.org/docs
 */

import { APIResponse } from './types'

export interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: {
    id: string | null
    name: string
  }
}

export interface NewsSearchResult {
  articles: NewsArticle[]
  totalResults: number
  volume: number
  recencyFactor: number
}

export class NewsClient {
  private apiKey: string
  private baseURL = 'https://newsapi.org/v2'

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || ''
  }

  async search(query: string, days: number = 30): Promise<APIResponse<NewsSearchResult>> {
    try {
      const fromDate = new Date()
      fromDate.setDate(fromDate.getDate() - days)

      const params = new URLSearchParams({
        q: query,
        from: fromDate.toISOString().split('T')[0],
        sortBy: 'relevancy',
        language: 'en',
        apiKey: this.apiKey,
      })

      const response = await fetch(`${this.baseURL}/everything?${params}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`News API failed: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      const articles: NewsArticle[] = data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source,
      }))

      // Calculate recency factor (0-1 based on how recent articles are)
      const recencyFactor = this.calculateRecencyFactor(articles)

      return {
        success: true,
        data: {
          articles,
          totalResults: data.totalResults,
          volume: articles.length,
          recencyFactor,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getTopHeadlines(query: string): Promise<APIResponse<NewsSearchResult>> {
    try {
      const params = new URLSearchParams({
        q: query,
        language: 'en',
        apiKey: this.apiKey,
      })

      const response = await fetch(`${this.baseURL}/top-headlines?${params}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`News API failed: ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      const articles: NewsArticle[] = data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source,
      }))

      const recencyFactor = this.calculateRecencyFactor(articles)

      return {
        success: true,
        data: {
          articles,
          totalResults: data.totalResults,
          volume: articles.length,
          recencyFactor,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private calculateRecencyFactor(articles: NewsArticle[]): number {
    if (articles.length === 0) return 0

    const now = Date.now()
    const avgAge = articles.reduce((sum, article) => {
      const age = now - new Date(article.publishedAt).getTime()
      return sum + age
    }, 0) / articles.length

    // Convert average age to days
    const avgAgeDays = avgAge / (1000 * 60 * 60 * 24)

    // Articles within 7 days = 1.0, articles 30+ days = 0.0
    const recency = Math.max(0, Math.min(1, 1 - (avgAgeDays - 7) / 23))

    return recency
  }
}
