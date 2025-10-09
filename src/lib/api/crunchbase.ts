/**
 * Crunchbase API Client (via RapidAPI)
 * Documentation: https://rapidapi.com/crunchbase/api/crunchbase-real-time-data
 */

import { APIResponse } from './types'

export interface Company {
  name: string
  description: string
  website: string
  foundedDate: string
  funding: string
  employeeCount: string
}

export interface CrunchbaseSearchResult {
  companies: Company[]
  totalCount: number
}

export class CrunchbaseClient {
  private apiKey: string
  private apiHost: string
  private baseURL = 'https://crunchbase-real-time-data.p.rapidapi.com/v1'

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || ''
    this.apiHost = process.env.RAPIDAPI_HOST || 'crunchbase-real-time-data.p.rapidapi.com'
  }

  async search(query: string): Promise<APIResponse<CrunchbaseSearchResult>> {
    try {
      const response = await fetch(`${this.baseURL}/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'x-rapidapi-host': this.apiHost,
          'x-rapidapi-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Crunchbase search failed: ${response.statusText}`)
      }

      const data = await response.json()
      const companies: Company[] = (data.results || []).map((company: any) => ({
        name: company.name || '',
        description: company.description || '',
        website: company.website || '',
        foundedDate: company.founded_date || '',
        funding: company.funding_total || '',
        employeeCount: company.num_employees || '',
      }))

      return {
        success: true,
        data: {
          companies,
          totalCount: companies.length,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getCompanyDetails(organizationId: string): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/organization/${organizationId}`, {
        headers: {
          'x-rapidapi-host': this.apiHost,
          'x-rapidapi-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Crunchbase company details failed: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async healthCheck(): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/health-check`, {
        headers: {
          'x-rapidapi-host': this.apiHost,
          'x-rapidapi-key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Crunchbase health check failed: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
