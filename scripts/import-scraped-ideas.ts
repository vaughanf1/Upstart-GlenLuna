/**
 * Import scraped ideas from IdeaBrowser into database
 * Run with: npx tsx scripts/import-scraped-ideas.ts
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs/promises'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

import { PrismaClient } from '@prisma/client'
import { generateScore } from '../src/lib/signals/aggregator'

const prisma = new PrismaClient()

interface ScrapedIdea {
  title: string
  description: string
  url: string
  slug: string
  releaseDate?: string
  isIdeaOfTheDay?: boolean
}

function generateSlug(title: string, originalSlug: string): string {
  // Use original slug if available, otherwise create from title
  if (originalSlug && originalSlug.length > 0) {
    return `ideabrowser-${originalSlug}`
  }

  return `ideabrowser-${title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)}`
}

function extractTagsFromTitle(title: string): string[] {
  const tags: string[] = []

  // Extract ARR if mentioned
  if (title.match(/\$\d+M ARR/i)) {
    tags.push('High Revenue Potential')
  }

  // Common category keywords
  const categoryMap: Record<string, string> = {
    'AI': 'AI',
    'automation': 'Automation',
    'platform': 'Platform',
    'marketplace': 'Marketplace',
    'SaaS': 'SaaS',
    'app': 'Mobile App',
    'service': 'Service',
    'tool': 'Tool',
    'compliance': 'Compliance',
    'B2B': 'B2B',
    'homeowner': 'PropTech',
    'home': 'PropTech',
    'insurance': 'InsurTech',
    'food': 'Food & Beverage',
    'freelance': 'Freelance',
    'real estate': 'Real Estate',
  }

  Object.entries(categoryMap).forEach(([keyword, tag]) => {
    if (title.toLowerCase().includes(keyword.toLowerCase())) {
      tags.push(tag)
    }
  })

  return tags.length > 0 ? tags : ['Startup Idea', 'IdeaBrowser']
}

async function importIdeas() {
  console.log('📥 Importing scraped ideas into database...')

  try {
    // Read scraped ideas from JSON file
    const dataPath = path.join(__dirname, '../data/scraped-ideas.json')
    const rawData = await fs.readFile(dataPath, 'utf-8')
    const scrapedIdeas: ScrapedIdea[] = JSON.parse(rawData)

    console.log(`Found ${scrapedIdeas.length} ideas to import`)

    let imported = 0
    let skipped = 0

    for (const scrapedIdea of scrapedIdeas) {
      try {
        const slug = generateSlug(scrapedIdea.title, scrapedIdea.slug)

        // Check if idea already exists
        const existing = await prisma.idea.findUnique({
          where: { slug }
        })

        if (existing) {
          console.log(`⏭️  Skipping "${scrapedIdea.title}" (already exists)`)
          skipped++
          continue
        }

        // Extract metadata
        const tags = extractTagsFromTitle(scrapedIdea.title)

        // Generate score for this idea
        console.log(`📊 Generating score for: ${scrapedIdea.title}`)
        const scoringResult = await generateScore(slug, {
          title: scrapedIdea.title,
          tags,
          problem: undefined,
          solution: scrapedIdea.description.substring(0, 500),
          targetUser: undefined,
          whyNow: undefined,
        })

        // Create the idea
        const idea = await prisma.idea.create({
          data: {
            title: scrapedIdea.title,
            slug,
            summary: scrapedIdea.description,
            problem: '',
            solution: scrapedIdea.description,
            targetUser: 'Extracted from IdeaBrowser database',
            whyNow: '',
            difficulty: 3,
            buildType: 'SaaS',
            tags: JSON.stringify(tags),
            score: scoringResult.score,
            scoreBreakdown: JSON.stringify(scoringResult.breakdown),
            sources: JSON.stringify([
              ...scoringResult.sources,
              {
                type: 'ideabrowser',
                url: scrapedIdea.url,
                meta: {
                  originalSlug: scrapedIdea.slug,
                  isIdeaOfTheDay: scrapedIdea.isIdeaOfTheDay || false
                }
              }
            ]),
            lastScoredAt: new Date(),
          }
        })

        console.log(`✅ Imported: "${idea.title}" (score: ${idea.score})`)
        imported++

        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 500))

      } catch (error) {
        console.error(`Error importing "${scrapedIdea.title}":`, error)
      }
    }

    console.log('\n📊 Import Summary:')
    console.log(`- Total scraped: ${scrapedIdeas.length}`)
    console.log(`- Successfully imported: ${imported}`)
    console.log(`- Skipped (duplicates): ${skipped}`)

  } catch (error) {
    console.error('❌ Import failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function main() {
  console.log('🚀 Starting IdeaBrowser Import...')
  console.log('='.repeat(60))

  try {
    await importIdeas()
    console.log('\n✅ Import complete!')
  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
