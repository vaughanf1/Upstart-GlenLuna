/**
 * Real Signal Aggregator
 * Fetches actual data from Reddit, HackerNews, News API, SERP API, and Crunchbase
 */

import { RedditClient } from '../../api/reddit'
import { HackerNewsClient } from '../../api/hackernews'
import { NewsClient } from '../../api/news'
import { SerpClient } from '../../api/serp'
import { CrunchbaseClient } from '../../api/crunchbase'
import {
  normalizeTrend,
  normalizeSearchVolume,
  normalizeCommunity,
  normalizeNews,
  normalizeCompetition,
  normalizeQuality
} from '../normalize'
import { computeScore, type ScoreBreakdown } from '../../scoring/compute'
import type { IdeaMetrics, ScoringResult } from '../mock/aggregator'

export interface RealDataOptions {
  useCache?: boolean
  timeout?: number
}

export class RealSignalAggregator {
  private redditClient: RedditClient
  private hnClient: HackerNewsClient
  private newsClient: NewsClient
  private serpClient: SerpClient
  private crunchbaseClient: CrunchbaseClient

  constructor() {
    this.redditClient = new RedditClient()
    this.hnClient = new HackerNewsClient()
    this.newsClient = new NewsClient()
    this.serpClient = new SerpClient()
    this.crunchbaseClient = new CrunchbaseClient()
  }

  async generateScore(slug: string, metrics: IdeaMetrics, options?: RealDataOptions): Promise<ScoringResult> {
    const query = metrics.title

    // Fetch all data in parallel for better performance
    const [
      trendsResult,
      searchResult,
      redditResult,
      hnResult,
      newsResult,
      competitionResult,
    ] = await Promise.allSettled([
      this.serpClient.getGoogleTrends(query),
      this.serpClient.getSearchVolume(query),
      this.redditClient.search(query),
      this.hnClient.search(query),
      this.newsClient.search(query, 90), // Last 90 days
      this.crunchbaseClient.search(query),
    ])

    // Extract data with fallbacks
    const trendsData = trendsResult.status === 'fulfilled' && trendsResult.value.success
      ? trendsResult.value.data
      : { slope: 0, averageInterest: 0, interestOverTime: [] }

    const searchData = searchResult.status === 'fulfilled' && searchResult.value.success
      ? searchResult.value.data
      : { searchVolume: 0 }

    const redditData = redditResult.status === 'fulfilled' && redditResult.value.success
      ? redditResult.value.data
      : { totalMentions: 0, totalEngagement: 0, posts: [] }

    const hnData = hnResult.status === 'fulfilled' && hnResult.value.success
      ? hnResult.value.data
      : { totalMentions: 0, totalEngagement: 0, stories: [] }

    const newsData = newsResult.status === 'fulfilled' && newsResult.value.success
      ? newsResult.value.data
      : { volume: 0, recencyFactor: 0, articles: [] }

    const competitionData = competitionResult.status === 'fulfilled' && competitionResult.value.success
      ? competitionResult.value.data
      : { companies: [], totalCount: 0 }

    // Calculate growth from trends data
    const growth3mo = this.calculateGrowth(trendsData.interestOverTime || [], 3)
    const growth12mo = this.calculateGrowth(trendsData.interestOverTime || [], 12)

    // Normalize all metrics to 0-100 scale
    const trend = normalizeTrend(trendsData?.slope || 0, 20) // variance set to 20 as default
    const search = normalizeSearchVolume(searchData?.searchVolume || 0, growth3mo, growth12mo)
    const community = normalizeCommunity(
      (redditData?.totalMentions || 0) + (hnData?.totalMentions || 0),
      (redditData?.totalEngagement || 0) + (hnData?.totalEngagement || 0)
    )
    const news = normalizeNews(newsData?.volume || 0, newsData?.recencyFactor || 0)
    const competition = normalizeCompetition(competitionData?.totalCount || 0)
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

    // Generate sources from real data
    const sources = []

    // Trends source
    sources.push({
      type: 'trends',
      url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(query)}`,
      meta: {
        slope: trendsData?.slope || 0,
        averageInterest: trendsData?.averageInterest || 0
      }
    })

    // Search volume source
    if (searchData && searchData.searchVolume > 0) {
      sources.push({
        type: 'search',
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        meta: {
          volume: searchData.searchVolume,
          growth3mo,
          growth12mo
        }
      })
    }

    // Reddit source
    if (redditData && redditData.totalMentions > 0) {
      sources.push({
        type: 'reddit',
        url: `https://reddit.com/search?q=${encodeURIComponent(query)}`,
        meta: {
          mentions: redditData.totalMentions,
          engagement: redditData.totalEngagement,
          topPosts: redditData.posts?.slice(0, 3).map((p: any) => ({
            title: p.title,
            score: p.score,
            subreddit: p.subreddit
          })) || []
        }
      })
    }

    // HackerNews source
    if (hnData && hnData.totalMentions > 0) {
      sources.push({
        type: 'hackernews',
        url: `https://hn.algolia.com/?q=${encodeURIComponent(query)}`,
        meta: {
          mentions: hnData.totalMentions,
          engagement: hnData.totalEngagement,
          topStories: hnData.stories?.slice(0, 3).map((s: any) => ({
            title: s.title,
            points: s.points
          })) || []
        }
      })
    }

    // News source
    if (newsData && newsData.volume > 0) {
      sources.push({
        type: 'news',
        url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
        meta: {
          volume: newsData.volume,
          recency: newsData.recencyFactor,
          topArticles: newsData.articles?.slice(0, 3).map((a: any) => ({
            title: a.title,
            source: a.source.name,
            publishedAt: a.publishedAt
          })) || []
        }
      })
    }

    // Competition source
    if (competitionData && competitionData.totalCount > 0) {
      sources.push({
        type: 'competition',
        url: `https://www.crunchbase.com/discover/organization.companies`,
        meta: {
          competitors: competitionData.companies?.slice(0, 5).map((c: any) => c.name) || [],
          total: competitionData.totalCount
        }
      })
    }

    return {
      score,
      breakdown,
      sources,
    }
  }

  private calculateGrowth(data: Array<{ date: string; value: number }>, months: number): number {
    if (data.length === 0) return 0

    // Get the most recent value and compare with value from N months ago
    const recent = data[data.length - 1]?.value || 0
    const monthsAgoIndex = Math.max(0, data.length - months)
    const old = data[monthsAgoIndex]?.value || 0

    if (old === 0) return 0

    return ((recent - old) / old) * 100
  }
}

/**
 * Main function to generate score using real APIs
 */
export async function generateRealScore(slug: string, metrics: IdeaMetrics): Promise<ScoringResult> {
  const aggregator = new RealSignalAggregator()
  return aggregator.generateScore(slug, metrics)
}
