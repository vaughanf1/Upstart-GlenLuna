/**
 * API Clients Barrel Export
 */

export { RedditClient } from './reddit'
export type { RedditPost, RedditSearchResult } from './reddit'

export { HackerNewsClient } from './hackernews'
export type { HNStory, HNSearchResult } from './hackernews'

export { NewsClient } from './news'
export type { NewsArticle, NewsSearchResult } from './news'

export { CrunchbaseClient } from './crunchbase'
export type { Company, CrunchbaseSearchResult } from './crunchbase'

export { SerpClient } from './serp'
export type { TrendData, SearchVolumeData, GoogleTrendsResult } from './serp'

export type { APIResponse, RateLimitInfo, APIClientConfig } from './types'
