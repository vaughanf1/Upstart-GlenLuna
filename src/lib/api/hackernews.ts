/**
 * Hacker News API Client
 * Documentation: https://hn.algolia.com/api
 * Free API, no authentication required
 */

import { APIResponse } from './types'

export interface HNStory {
  objectID: string
  title: string
  points: number
  num_comments: number
  created_at: string
  url: string
  author: string
}

export interface HNSearchResult {
  stories: HNStory[]
  totalMentions: number
  totalEngagement: number
}

export class HackerNewsClient {
  private baseURL = 'https://hn.algolia.com/api/v1'

  async search(query: string, tags: string = 'story'): Promise<APIResponse<HNSearchResult>> {
    try {
      const params = new URLSearchParams({
        query,
        tags,
        hitsPerPage: '100',
      })

      const response = await fetch(`${this.baseURL}/search?${params}`)

      if (!response.ok) {
        throw new Error(`HN search failed: ${response.statusText}`)
      }

      const data = await response.json()
      const stories: HNStory[] = data.hits.map((hit: any) => ({
        objectID: hit.objectID,
        title: hit.title,
        points: hit.points || 0,
        num_comments: hit.num_comments || 0,
        created_at: hit.created_at,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        author: hit.author,
      }))

      const totalMentions = stories.length
      const totalEngagement = stories.reduce((sum, story) => sum + story.points + story.num_comments, 0)

      return {
        success: true,
        data: {
          stories,
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

  async searchByDateRange(
    query: string,
    tags: string = 'story',
    numericFilters?: string
  ): Promise<APIResponse<HNSearchResult>> {
    try {
      const params = new URLSearchParams({
        query,
        tags,
        hitsPerPage: '100',
      })

      if (numericFilters) {
        params.append('numericFilters', numericFilters)
      }

      const response = await fetch(`${this.baseURL}/search?${params}`)

      if (!response.ok) {
        throw new Error(`HN search failed: ${response.statusText}`)
      }

      const data = await response.json()
      const stories: HNStory[] = data.hits.map((hit: any) => ({
        objectID: hit.objectID,
        title: hit.title,
        points: hit.points || 0,
        num_comments: hit.num_comments || 0,
        created_at: hit.created_at,
        url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        author: hit.author,
      }))

      const totalMentions = stories.length
      const totalEngagement = stories.reduce((sum, story) => sum + story.points + story.num_comments, 0)

      return {
        success: true,
        data: {
          stories,
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
}
