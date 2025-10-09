# API Integration Summary

## Overview

Your UpStart2 application now supports **real API data** in addition to mock data! The system can seamlessly switch between mock and real data sources using the `DATA_MODE` environment variable.

## What's Been Implemented

### 1. API Clients (`src/lib/api/`)

Five new API clients have been created:

- **Reddit API** - Community discussions and engagement
- **Hacker News API** - Tech community stories and discussions
- **News API** - Recent news articles from various sources
- **SERP API** - Google Trends and search volume data
- **Crunchbase API** - Company and competition data

### 2. Error Handling & Rate Limiting

- **Retry Logic**: Automatic retries with exponential backoff for transient errors
- **Rate Limiting**: Token bucket algorithm to respect API limits
- **Graceful Degradation**: Falls back to empty data instead of crashing

### 3. Dual Mode System

The application can now operate in two modes:

#### Mock Mode (Default)
```bash
DATA_MODE=mock
```
- Uses deterministic mock data based on idea slug
- Fast and free
- Perfect for development and testing
- No API keys required

#### Real Mode
```bash
DATA_MODE=real
```
- Fetches actual data from external APIs
- More accurate scores
- Requires API keys
- Subject to rate limits and costs

## Getting Started

### Step 1: Add API Keys

Add your API keys to `.env.local`:

```bash
# Add your API keys to .env.local
REDDIT_CLIENT_ID="your_reddit_client_id"
REDDIT_CLIENT_SECRET="your_reddit_client_secret"
SERP_API_KEY="your_serp_api_key"
GOOGLE_TRENDS_API_KEY="your_google_trends_api_key"
NEWS_API_KEY="your_news_api_key"
RAPIDAPI_KEY="your_rapidapi_key"
```

### Step 2: Enable Real Data Mode

Set this in `.env.local`:

```bash
DATA_MODE=real  # Change from "mock" to "real"
```

### Step 3: Test the Integration

Run the test script:

```bash
npm run test:apis
```

This will test all API integrations and show you what's working.

### Step 4: Use Real Data in the App

1. Start the dev server: `npm run dev`
2. Log in as admin: `admin@upstart.com` / `admin123`
3. Navigate to an idea page
4. Click "Refresh Score" to trigger real API calls
5. Check the console logs to see API responses

## API Documentation

### Reddit API
- **Rate Limit**: 60 requests/minute
- **Cost**: Free
- **Docs**: https://www.reddit.com/dev/api/
- **Note**: You need to set up `REDDIT_CLIENT_SECRET`

### Hacker News API
- **Rate Limit**: No official limit (be respectful)
- **Cost**: Free
- **Docs**: https://hn.algolia.com/api
- **Note**: No authentication needed!

### News API
- **Rate Limit**: 100 requests/day (free tier)
- **Cost**: Free tier available, then paid
- **Docs**: https://newsapi.org/docs

### SERP API
- **Rate Limit**: Depends on plan
- **Cost**: Pay per request
- **Docs**: https://serpapi.com/

### Crunchbase API (via RapidAPI)
- **Rate Limit**: Depends on plan
- **Cost**: Pay per request
- **Docs**: https://rapidapi.com/crunchbase/api/crunchbase-real-time-data

## File Structure

```
src/lib/
├── api/
│   ├── README.md              # API documentation
│   ├── index.ts               # Barrel exports
│   ├── types.ts               # Common types
│   ├── reddit.ts              # Reddit client
│   ├── hackernews.ts          # Hacker News client
│   ├── news.ts                # News API client
│   ├── serp.ts                # SERP/Trends client
│   ├── crunchbase.ts          # Crunchbase client
│   └── utils/
│       ├── rate-limiter.ts    # Rate limiting utility
│       └── retry.ts           # Retry logic with backoff
│
└── signals/
    ├── aggregator.ts          # Main entry point (switches modes)
    ├── mock/
    │   └── aggregator.ts      # Mock data generator
    └── real/
        └── aggregator.ts      # Real API aggregator
```

## Cost Considerations

⚠️ **Important**: Most APIs have free tiers, but be aware of limits:

- **Hacker News**: Completely free
- **Reddit**: Free with rate limits
- **News API**: 100 requests/day free, then ~$449/month
- **SERP API**: ~$50/1000 searches
- **Crunchbase**: Varies by RapidAPI plan

**Recommendation**: Start with mock mode for development, use real mode sparingly for production or when you need actual data.

## Monitoring Usage

To avoid unexpected costs:

1. Start with `DATA_MODE=mock` by default
2. Only enable `DATA_MODE=real` when testing or scoring new ideas
3. Monitor your API dashboards for usage
4. Set up alerts on your API provider dashboards

## Next Steps

### Missing: Reddit Client Secret

You need to get a Reddit API client secret:

1. Go to https://www.reddit.com/prefs/apps
2. Create a new app (script type)
3. Copy the secret and add to `.env.local` as `REDDIT_CLIENT_SECRET`

### Optional: Search Volume APIs

For accurate search volume data, you may want to integrate:
- **Ahrefs API** (paid)
- **SEMrush API** (paid)

These would replace or supplement the SERP API for better search volume accuracy.

### Optional: Brightdata

If you need advanced web scraping:
```bash
BRIGHTDATA_WSS="wss://brd-customer-hl_f1f38374-zone-scraping_browser1:u8ct3laee20u@brd.superproxy.io:9222"
BRIGHTDATA_HTTPS="https://brd-customer-hl_f1f38374-zone-scraping_browser1:u8ct3laee20u@brd.superproxy.io:9515"
```

## Testing

Run the test script to verify everything works:

```bash
npm run test:apis
```

This will:
- Check for required API keys
- Test each API client
- Show sample results
- Identify any issues

## Support

For detailed API client documentation, see: `src/lib/api/README.md`

For questions about specific APIs, check their official documentation linked above.

---

**Status**: ✅ All API clients implemented and ready to use!
