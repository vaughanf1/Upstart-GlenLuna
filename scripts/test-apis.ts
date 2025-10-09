/**
 * Test script for API integrations
 * Run with: npx tsx scripts/test-apis.ts
 */

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import { RedditClient } from '../src/lib/api/reddit'
import { HackerNewsClient } from '../src/lib/api/hackernews'
import { NewsClient } from '../src/lib/api/news'
import { SerpClient } from '../src/lib/api/serp'
import { CrunchbaseClient } from '../src/lib/api/crunchbase'

async function testReddit() {
  console.log('\n🔴 Testing Reddit API...')
  const client = new RedditClient()
  const result = await client.search('artificial intelligence', 'month')

  if (result.success && result.data) {
    console.log(`✅ Reddit: Found ${result.data.totalMentions} mentions, ${result.data.totalEngagement} engagement`)
    if (result.data.posts.length > 0) {
      console.log(`   Top post: "${result.data.posts[0].title}" (${result.data.posts[0].score} score)`)
    }
  } else {
    console.log(`❌ Reddit: ${result.error}`)
  }
}

async function testHackerNews() {
  console.log('\n🟠 Testing Hacker News API...')
  const client = new HackerNewsClient()
  const result = await client.search('startup ideas')

  if (result.success && result.data) {
    console.log(`✅ HackerNews: Found ${result.data.totalMentions} stories, ${result.data.totalEngagement} engagement`)
    if (result.data.stories.length > 0) {
      console.log(`   Top story: "${result.data.stories[0].title}" (${result.data.stories[0].points} points)`)
    }
  } else {
    console.log(`❌ HackerNews: ${result.error}`)
  }
}

async function testNews() {
  console.log('\n📰 Testing News API...')
  const client = new NewsClient()
  const result = await client.search('artificial intelligence', 30)

  if (result.success && result.data) {
    console.log(`✅ News: Found ${result.data.volume} articles, recency factor: ${result.data.recencyFactor.toFixed(2)}`)
    if (result.data.articles.length > 0) {
      console.log(`   Latest: "${result.data.articles[0].title}"`)
    }
  } else {
    console.log(`❌ News: ${result.error}`)
  }
}

async function testSerp() {
  console.log('\n📊 Testing SERP API...')
  const client = new SerpClient()

  // Test Google Trends
  const trendsResult = await client.getGoogleTrends('artificial intelligence')
  if (trendsResult.success && trendsResult.data) {
    console.log(`✅ Google Trends: Average interest ${trendsResult.data.averageInterest.toFixed(2)}, slope ${trendsResult.data.slope.toFixed(2)}%`)
    console.log(`   Related queries: ${trendsResult.data.relatedQueries.slice(0, 3).map(q => q.query).join(', ')}`)
  } else {
    console.log(`❌ Google Trends: ${trendsResult.error}`)
  }

  // Test Search Volume
  const volumeResult = await client.getSearchVolume('AI tools')
  if (volumeResult.success && volumeResult.data) {
    console.log(`✅ Search Volume: ${volumeResult.data.searchVolume.toLocaleString()} results for "AI tools"`)
  } else {
    console.log(`❌ Search Volume: ${volumeResult.error}`)
  }
}

async function testCrunchbase() {
  console.log('\n💼 Testing Crunchbase API...')
  const client = new CrunchbaseClient()

  // First do health check
  const healthResult = await client.healthCheck()
  if (healthResult.success) {
    console.log(`✅ Crunchbase health check passed`)
  } else {
    console.log(`❌ Crunchbase health check failed: ${healthResult.error}`)
    return
  }

  const result = await client.search('fintech')
  if (result.success && result.data) {
    console.log(`✅ Crunchbase: Found ${result.data.totalCount} companies`)
    if (result.data.companies.length > 0) {
      console.log(`   Top company: ${result.data.companies[0].name}`)
    }
  } else {
    console.log(`❌ Crunchbase: ${result.error}`)
  }
}

async function main() {
  console.log('🚀 Starting API Integration Tests...')
  console.log('=' .repeat(60))

  // Check if we're in real mode
  if (process.env.DATA_MODE !== 'real') {
    console.log('\n⚠️  Warning: DATA_MODE is not set to "real"')
    console.log('   Set DATA_MODE=real in .env.local to test real APIs')
    console.log('   Running tests anyway...\n')
  }

  // Check for required API keys
  const requiredVars = [
    'REDDIT_CLIENT_ID',
    'NEWS_API_KEY',
    'SERP_API_KEY',
    'RAPIDAPI_KEY',
  ]

  const missing = requiredVars.filter(v => !process.env[v])
  if (missing.length > 0) {
    console.log('\n⚠️  Missing API keys:')
    missing.forEach(v => console.log(`   - ${v}`))
    console.log('\n   Some tests may fail. Check .env.local\n')
  }

  try {
    // Run tests sequentially to avoid rate limits
    await testHackerNews() // Free, no auth needed
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (process.env.REDDIT_CLIENT_ID) {
      await testReddit()
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if (process.env.NEWS_API_KEY) {
      await testNews()
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if (process.env.SERP_API_KEY) {
      await testSerp()
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    if (process.env.RAPIDAPI_KEY) {
      await testCrunchbase()
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:', error)
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ API Integration Tests Complete!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
