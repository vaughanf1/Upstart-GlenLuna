import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import { generateMockScore } from '../src/lib/signals/mock/aggregator'

const prisma = new PrismaClient()

// Type for CSV record
interface CSVRecord {
  title?: string
  description?: string
  category?: string
  date?: string
  revenue_projection?: string
  [key: string]: string | undefined
}

// Helper to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Helper to extract revenue projection if present
function extractRevenue(title: string, description: string): string | null {
  const revenueMatch = title.match(/\$\d+M?\s*ARR/i) || description.match(/\$\d+M?\s*ARR/i)
  return revenueMatch ? revenueMatch[0] : null
}

// Helper to categorize build type from category
function categorizeBuildType(category: string | undefined): string {
  if (!category) return 'SaaS'

  const categoryMap: Record<string, string> = {
    'AI/Tech': 'SaaS',
    'Food/Restaurant': 'Marketplace',
    'Finance': 'FinTech',
    'Real Estate': 'Platform',
    'B2B Services': 'SaaS',
    'Consumer': 'Mobile App',
    'Other': 'Tool',
    'Marketing': 'SaaS'
  }

  return categoryMap[category] || 'SaaS'
}

// Helper to generate tags from category and description
function generateTags(category: string | undefined, description: string, title: string): string[] {
  const tags = new Set<string>()

  // Add category-based tags
  if (category) {
    if (category.includes('AI')) tags.add('AI')
    if (category.includes('Tech')) tags.add('Technology')
    if (category.includes('Food')) tags.add('Food')
    if (category.includes('Finance')) tags.add('FinTech')
    if (category.includes('Real Estate')) tags.add('Real Estate')
    if (category.includes('B2B')) tags.add('B2B')
    if (category.includes('Consumer')) tags.add('B2C')
  }

  // Extract tags from description
  const text = `${title} ${description}`.toLowerCase()

  if (text.includes('ai') || text.includes('artificial intelligence')) tags.add('AI')
  if (text.includes('automation') || text.includes('automate')) tags.add('Automation')
  if (text.includes('saas') || text.includes('software')) tags.add('SaaS')
  if (text.includes('mobile') || text.includes('app')) tags.add('Mobile')
  if (text.includes('platform')) tags.add('Platform')
  if (text.includes('marketplace')) tags.add('Marketplace')
  if (text.includes('analytics')) tags.add('Analytics')
  if (text.includes('productiv')) tags.add('Productivity')
  if (text.includes('e-commerce') || text.includes('ecommerce')) tags.add('E-commerce')
  if (text.includes('health')) tags.add('HealthTech')
  if (text.includes('educat') || text.includes('learning')) tags.add('EdTech')

  return Array.from(tags).slice(0, 5) // Limit to 5 tags
}

async function importCSV() {
  console.log('📥 Starting CSV import...')

  // Read CSV file
  const csvPath = path.join(process.cwd(), 'ideabrowser_complete_dataset.csv')
  const fileContent = fs.readFileSync(csvPath, 'utf-8')

  // Parse CSV
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as CSVRecord[]

  console.log(`Found ${records.length} ideas in CSV`)

  // Limit to top 100 ideas to avoid performance issues
  const MAX_IDEAS = 100
  const limitedRecords = records.slice(0, MAX_IDEAS)

  console.log(`Processing ${limitedRecords.length} ideas (limited for performance)...`)

  let imported = 0
  let skipped = 0

  for (const record of limitedRecords) {
    const title = record.title?.trim()
    const description = record.description?.trim()

    if (!title || !description) {
      skipped++
      continue
    }

    // Create slug
    const slug = createSlug(title)

    // Check if already exists
    const existing = await prisma.idea.findUnique({
      where: { slug }
    })

    if (existing) {
      console.log(`⏭️  Skipping "${title}" (already exists)`)
      skipped++
      continue
    }

    // Extract information
    const revenue = extractRevenue(title, description)
    const buildType = categorizeBuildType(record.category)
    const tags = generateTags(record.category, description, title)

    // Truncate description if too long (SQLite limitation)
    const maxLength = 1000
    const summary = description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description

    // Create problem/solution from description
    const sentences = description.split(/[.!?]+/).filter(s => s.trim())
    const problem = sentences.slice(0, 2).join('. ').trim() || summary
    const solution = sentences.slice(2, 4).join('. ').trim() || summary

    try {
      // Generate score
      const scoringResult = await generateMockScore(slug, {
        title,
        tags,
        problem,
        solution,
        targetUser: null,
        whyNow: null,
      })

      // Create idea
      await prisma.idea.create({
        data: {
          title,
          slug,
          summary,
          problem: problem || 'Market opportunity identified through data analysis.',
          solution: solution || 'Innovative solution to address market needs.',
          targetUser: 'Entrepreneurs and founders looking for validated startup opportunities',
          whyNow: 'Market signals indicate strong demand and timing',
          difficulty: Math.floor(Math.random() * 3) + 2, // 2-4
          buildType,
          tags: JSON.stringify(tags),
          score: scoringResult.score,
          scoreBreakdown: JSON.stringify(scoringResult.breakdown),
          sources: JSON.stringify(scoringResult.sources),
          lastScoredAt: new Date(),
          revenuePotential: revenue || undefined,
          opportunityScore: Math.floor(Math.random() * 3) + 7, // 7-9
          problemScore: Math.floor(Math.random() * 3) + 6, // 6-8
          feasibilityScore: Math.floor(Math.random() * 3) + 6, // 6-8
          whyNowScore: Math.floor(Math.random() * 3) + 7, // 7-9
        }
      })

      imported++
      console.log(`✅ Imported: "${title}" (Score: ${scoringResult.score})`)
    } catch (error) {
      console.error(`❌ Error importing "${title}":`, error)
      skipped++
    }
  }

  console.log('\n📊 Import Summary:')
  console.log(`✅ Successfully imported: ${imported} ideas`)
  console.log(`⏭️  Skipped: ${skipped} ideas`)
  console.log(`📝 Total in database: ${await prisma.idea.count()} ideas`)
}

importCSV()
  .catch((e) => {
    console.error('❌ Import failed:')
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
