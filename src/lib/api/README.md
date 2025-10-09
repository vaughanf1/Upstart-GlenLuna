# API Clients

This directory contains real API clients for fetching data from external services.

## Overview

The application can operate in two modes:
- **Mock Mode** (default): Uses deterministic mock data based on idea slug
- **Real Mode**: Fetches actual data from external APIs

Set `DATA_MODE=real` in your `.env.local` file to use real APIs.

## API Clients

### 1. Reddit API (`reddit.ts`)
Fetches community discussions and engagement data from Reddit.

**Required Environment Variables:**
```bash
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
REDDIT_USER_AGENT=IdeaBrowser/1.0
```

**Rate Limit:** 60 requests per minute

**Usage:**
```typescript
const client = new RedditClient()
const result = await client.search('AI tools', 'year')
```

### 2. Hacker News API (`hackernews.ts`)
Searches Hacker News for discussions and stories.

**Required Environment Variables:** None (free API)

**Rate Limit:** No official limit, but be respectful

**Usage:**
```typescript
const client = new HackerNewsClient()
const result = await client.search('startup ideas')
```

### 3. News API (`news.ts`)
Fetches recent news articles from various sources.

**Required Environment Variables:**
```bash
NEWS_API_KEY=your_api_key
```

**Rate Limit:** Depends on your plan (free tier: 100 requests/day)

**Usage:**
```typescript
const client = new NewsClient()
const result = await client.search('artificial intelligence', 30)
```

### 4. SERP API (`serp.ts`)
Gets Google Trends data and search volume information.

**Required Environment Variables:**
```bash
SERP_API_KEY=your_api_key
GOOGLE_TRENDS_API_KEY=your_trends_api_key
```

**Usage:**
```typescript
const client = new SerpClient()
const trends = await client.getGoogleTrends('web3')
const volume = await client.getSearchVolume('blockchain')
```

### 5. Crunchbase API (`crunchbase.ts`)
Searches for companies and competition data via RapidAPI.

**Required Environment Variables:**
```bash
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=crunchbase-real-time-data.p.rapidapi.com
```

**Usage:**
```typescript
const client = new CrunchbaseClient()
const result = await client.search('fintech startups')
```

## Error Handling

All API clients implement:

1. **Retry Logic**: Automatic retries with exponential backoff for transient errors
2. **Rate Limiting**: Token bucket algorithm to respect API limits
3. **Graceful Degradation**: Returns empty/fallback data on failure instead of crashing

## Rate Limiting

Each client has built-in rate limiting based on the API's limits:

- Reddit: 60 req/min
- News API: 100 req/day (free tier)
- Others: As specified by their terms

## Testing

To test API integrations:

1. Set up your API keys in `.env.local`
2. Set `DATA_MODE=real`
3. Create or refresh an idea to trigger API calls
4. Check the console logs for API responses

## Cost Considerations

Most APIs have free tiers, but be aware of limits:

- **News API**: 100 requests/day free, then paid
- **SERP API**: Pay per request
- **RapidAPI (Crunchbase)**: Pay per request
- **Reddit**: Free but rate-limited
- **Hacker News**: Free

Monitor your usage to avoid unexpected costs.

## Brightdata Scraping Browser (Optional)

For advanced web scraping needs, Brightdata credentials are available:

```bash
BRIGHTDATA_WSS=wss://...
BRIGHTDATA_HTTPS=https://...
```

This is optional and not currently used by default clients.
