/**
 * SERP API Client for Google Trends and Search Data
 * Documentation: https://serpapi.com/
 */

import { APIResponse } from './types'

export interface TrendData {
  keyword: string
  value: number
  trend: 'up' | 'down' | 'stable'
  relatedQueries?: string[]
}

export interface SearchVolumeData {
  keyword: string
  searchVolume: number
  competition: string
  trend: number[]
}

export interface GoogleTrendsResult {
  interestOverTime: Array<{
    date: string
    value: number
  }>
  averageInterest: number
  slope: number
  relatedQueries: Array<{
    query: string
    value: number
  }>
}

export class SerpClient {
  private apiKey: string
  private baseURL = 'https://serpapi.com'

  constructor() {
    this.apiKey = process.env.SERP_API_KEY || ''
  }

  async getGoogleTrends(query: string, timeRange: string = 'today 12-m'): Promise<APIResponse<GoogleTrendsResult>> {
    try {
      const params = new URLSearchParams({
        engine: 'google_trends',
        q: query,
        data_type: 'TIMESERIES',
        date: timeRange,
        api_key: this.apiKey,
      })

      const response = await fetch(`${this.baseURL}/search?${params}`)

      if (!response.ok) {
        throw new Error(`SERP API failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Parse interest over time
      const interestOverTime = (data.interest_over_time?.timeline_data || []).map((item: any) => ({
        date: item.date,
        value: item.values?.[0]?.value || 0,
      }))

      // Calculate average interest
      const averageInterest = interestOverTime.length > 0
        ? interestOverTime.reduce((sum: number, item: any) => sum + item.value, 0) / interestOverTime.length
        : 0

      // Calculate slope (trend direction)
      const slope = this.calculateSlope(interestOverTime)

      // Parse related queries
      const relatedQueries = (data.related_queries?.rising || []).map((item: any) => ({
        query: item.query,
        value: item.value,
      }))

      return {
        success: true,
        data: {
          interestOverTime,
          averageInterest,
          slope,
          relatedQueries,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getSearchVolume(query: string): Promise<APIResponse<SearchVolumeData>> {
    try {
      // Using Google search results as a proxy for search volume
      const params = new URLSearchParams({
        engine: 'google',
        q: query,
        api_key: this.apiKey,
      })

      const response = await fetch(`${this.baseURL}/search?${params}`)

      if (!response.ok) {
        throw new Error(`SERP API failed: ${response.statusText}`)
      }

      const data = await response.json()

      // Extract search volume from search results
      const searchInformation = data.search_information || {}
      const totalResults = parseInt(searchInformation.total_results?.replace(/,/g, '') || '0')

      return {
        success: true,
        data: {
          keyword: query,
          searchVolume: totalResults,
          competition: 'medium', // Default value
          trend: [],
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private calculateSlope(data: Array<{ date: string; value: number }>): number {
    if (data.length < 2) return 0

    const n = data.length
    const values = data.map((d, i) => ({ x: i, y: d.value }))

    const sumX = values.reduce((sum, v) => sum + v.x, 0)
    const sumY = values.reduce((sum, v) => sum + v.y, 0)
    const sumXY = values.reduce((sum, v) => sum + v.x * v.y, 0)
    const sumXX = values.reduce((sum, v) => sum + v.x * v.x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)

    // Normalize to percentage
    const avgY = sumY / n
    const slopePercent = avgY !== 0 ? (slope / avgY) * 100 : 0

    return slopePercent
  }
}
