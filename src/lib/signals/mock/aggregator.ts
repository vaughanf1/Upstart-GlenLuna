import { getMockTrendData } from './trends'
import { getMockSearchData } from './search'
import { getMockCommunityData } from './community'
import { getMockNewsData } from './news'
import { getMockCompetitionData } from './competition'
import {
  normalizeTrend,
  normalizeSearchVolume,
  normalizeCommunity,
  normalizeNews,
  normalizeCompetition,
  normalizeQuality
} from '../normalize'
import { computeScore, type ScoreBreakdown } from '../../scoring/compute'

export interface IdeaMetrics {
  title: string
  tags: string[]
  problem?: string
  solution?: string
  targetUser?: string
  whyNow?: string
}

export interface ScoringResult {
  score: number
  breakdown: ScoreBreakdown
  sources: Array<{
    type: string
    url: string
    meta?: Record<string, any>
  }>
}

export async function generateMockScore(slug: string, metrics: IdeaMetrics): Promise<ScoringResult> {
  // Get mock data from all adapters
  const trendData = getMockTrendData(slug)
  const searchData = getMockSearchData(slug)
  const communityData = getMockCommunityData(slug)
  const newsData = getMockNewsData(slug)
  const competitionData = getMockCompetitionData(slug)

  // Normalize all metrics to 0-100 scale
  const trend = normalizeTrend(trendData.slope, trendData.variance)
  const search = normalizeSearchVolume(searchData.volume, searchData.growth3mo, searchData.growth12mo)
  const community = normalizeCommunity(communityData.totalMentions, communityData.totalEngagement)
  const news = normalizeNews(newsData.volume, newsData.recencyFactor)
  const competition = normalizeCompetition(competitionData.competitorCount)
  const quality = normalizeQuality(
    !!metrics.problem,
    !!metrics.solution,
    !!metrics.targetUser,
    !!metrics.whyNow,
    metrics.tags.length
  )

  const breakdown: ScoreBreakdown = {
    trend,
    search,
    community,
    news,
    competition,
    quality,
  }

  const score = computeScore(breakdown)

  // Generate mock sources
  const sources = [
    {
      type: 'trends',
      url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(metrics.title)}`,
      meta: { slope: trendData.slope, volume: trendData.volume }
    },
    {
      type: 'search',
      url: `https://ahrefs.com/keywords-explorer?keyword=${encodeURIComponent(metrics.title)}`,
      meta: { volume: searchData.volume, growth: searchData.growth12mo }
    }
  ]

  if (communityData.totalMentions > 0) {
    sources.push({
      type: 'reddit',
      url: `https://reddit.com/search?q=${encodeURIComponent(metrics.title)}`,
      meta: { mentions: communityData.redditMentions, engagement: communityData.redditEngagement }
    })
  }

  if (communityData.hnMentions > 0) {
    sources.push({
      type: 'hackernews',
      url: `https://hn.algolia.com/?q=${encodeURIComponent(metrics.title)}`,
      meta: { mentions: communityData.hnMentions, engagement: communityData.hnEngagement }
    })
  }

  if (newsData.volume > 0) {
    sources.push({
      type: 'news',
      url: `https://news.google.com/search?q=${encodeURIComponent(metrics.title)}`,
      meta: { volume: newsData.volume, recency: newsData.recencyFactor }
    })
  }

  if (competitionData.competitors.length > 0) {
    sources.push({
      type: 'competition',
      url: `https://www.crunchbase.com/discover/organization.companies/field/categories/name/${encodeURIComponent(metrics.title)}`,
      meta: { competitors: competitionData.competitors.slice(0, 3), total: competitionData.competitorCount }
    })
  }

  return {
    score,
    breakdown,
    sources,
  }
}