/**
 * DEPRECATED: Legacy script for scraping ideas from external sources
 * Run with: npx tsx scripts/scrape-ideabrowser.ts
 */

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

interface ScrapedIdea {
  title: string
  description: string
  slug: string
  releaseDate?: string
  isIdeaOfTheDay?: boolean
}

// Hardcoded list of ideas from the first page that we saw via Playwright
const KNOWN_IDEAS: Partial<ScrapedIdea>[] = [
  {
    slug: 'sora-2-agentkit-weekly-promo-machine-for-local-biz',
    title: 'Sora 2 + AgentKit | Automated Video Marketing Platform for Local Businesses ($5M ARR)',
    isIdeaOfTheDay: true
  },
  {
    slug: 'ai-baking-recipe-scaler-for-pros',
    title: 'Recipe scaling tool that eliminates batch calculation errors for professional bakers ($5M ARR)'
  },
  {
    slug: 'hard-to-insure-homeowner-binder-builder',
    title: 'Insurance readiness kit that helps homeowners get approved for coverage in high-risk areas ($5M ARR)'
  },
  {
    slug: 'real-estate-photos-listing-writer-compliance-checker',
    title: 'Compliance automation platform that prevents fair housing violations for real estate agents ($5M ARR)'
  },
  {
    slug: 'rebate-paperwork-robot-for-homeowners',
    title: 'Rebate automation platform that handles eco-upgrade paperwork for green homeowners ($5M ARR)',
    isIdeaOfTheDay: true
  },
  {
    slug: 'ai-utility-bill-auditor-for-facilities',
    title: 'Billing auditor that catches costly utility errors for big companies ($50M ARR)'
  },
  {
    slug: 'high-intent-b2b-lead-miner-from-public-filings',
    title: 'Lead intelligence platform that spots buying signals in real-time for B2B sales teams ($5M ARR)'
  },
  {
    slug: 'local-appliance-recycling-pickup-service',
    title: 'App that turns old appliances into cash using smart pickup and sorting ($5M ARR)'
  },
  {
    slug: 'scope-creep-guard-for-freelancers',
    title: 'Freelance scope tracker that detects scope creep and turns it into upsells ($1M+ ARR)',
    isIdeaOfTheDay: true
  },
  {
    slug: 'food-truck-permit-and-compliance-ai-consultant',
    title: 'Compliance tool that automates permits and regulations for food truck owners ($5M ARR)'
  },
  {
    slug: 'brand-licensing-opportunity-finder',
    title: 'Matchmaking platform that connects unused IP with niche brands ($5M ARR)'
  },
  {
    slug: 'electric-bike-battery-swap-and-tune-up-service',
    title: 'Mobile battery swap service that keeps e-bikes charged for urban commuters ($5M+ ARR)'
  }
]

async function scrapeIdeaBrowser(maxIdeas: number = 20): Promise<ScrapedIdea[]> {
  console.log('🔍 Scraping IdeaBrowser database...')

  const ideas: ScrapedIdea[] = []

  try {
    // For each known idea, fetch the detailed page
    let count = 0
    const ideaList = KNOWN_IDEAS.slice(0, Math.min(maxIdeas, KNOWN_IDEAS.length))

    for (const knownIdea of ideaList) {
      try {
        const slug = knownIdea.slug!
        console.log(`Processing idea ${count + 1}/${ideaList.length}: ${slug}`)

        // Note: External URL fetching removed
        const ideaHtml = ''

        // Extract title (use known title or parse from page)
        let title = knownIdea.title || ''
        if (!title) {
          const titleMatch = ideaHtml.match(/<title>([^<]+)<\/title>/)
          title = titleMatch ? titleMatch[1].trim() : slug
        }

        // Extract description from meta tag or first paragraph
        const descMatch = ideaHtml.match(/<meta name="description" content="([^"]+)"/)
        let description = descMatch ? descMatch[1] : ''

        if (!description) {
          // Try to find the main description paragraph
          const paraMatch = ideaHtml.match(/<p[^>]*>([^<]{200,1000})<\/p>/)
          description = paraMatch ? paraMatch[1].substring(0, 500) : 'Innovative startup idea'
        }

        ideas.push({
          title,
          description,
          slug,
          isIdeaOfTheDay: knownIdea.isIdeaOfTheDay || false
        })

        count++

        // Add delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 800))

      } catch (error) {
        console.error(`Error fetching ${knownIdea.slug}:`, error)
      }
    }

    console.log(`✅ Successfully scraped ${ideas.length} ideas`)
    return ideas

  } catch (error) {
    console.error('Error scraping IdeaBrowser:', error)
    throw error
  }
}

async function saveToJson(ideas: ScrapedIdea[]) {
  const fs = await import('fs/promises')
  const outputPath = path.join(__dirname, '../data/scraped-ideas.json')

  // Create data directory if it doesn't exist
  await fs.mkdir(path.join(__dirname, '../data'), { recursive: true })

  await fs.writeFile(outputPath, JSON.stringify(ideas, null, 2))
  console.log(`💾 Saved ${ideas.length} ideas to ${outputPath}`)
}

async function main() {
  console.log('🚀 Starting IdeaBrowser Scraper...')
  console.log('=' .repeat(60))

  try {
    const ideas = await scrapeIdeaBrowser(5)
    await saveToJson(ideas)

    console.log('\n📊 Scraping Summary:')
    console.log(`- Total ideas scraped: ${ideas.length}`)
    console.log(`- Ideas of the Day: ${ideas.filter(i => i.isIdeaOfTheDay).length}`)

    console.log('\n✅ Scraping complete!')
    console.log('Next step: Run `npm run import:ideas` to import into database')

  } catch (error) {
    console.error('❌ Scraping failed:', error)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
