import { getRandomFromSeed, generateVariance, hashString } from './base'

export interface CompetitionData {
  competitors: string[]
  competitorCount: number
  competitionLevel: 'low' | 'medium' | 'high' | 'very-high'
}

const COMPETITOR_NAMES = [
  'Notion', 'Airtable', 'Slack', 'Discord', 'Zoom', 'Figma', 'Canva',
  'Shopify', 'Stripe', 'Square', 'PayPal', 'Mailchimp', 'HubSpot',
  'Salesforce', 'Zendesk', 'Intercom', 'Calendly', 'Loom', 'Miro',
  'Trello', 'Asana', 'Monday.com', 'ClickUp', 'Linear', 'GitHub',
  'GitLab', 'Vercel', 'Netlify', 'AWS', 'Google Cloud', 'Azure'
]

export function getMockCompetitionData(slug: string): CompetitionData {
  const baseRandom = getRandomFromSeed(slug, 500)

  // Generate competition levels based on market maturity
  const competitionProfiles = [
    { count: 0, level: 'low' as const },      // Blue ocean
    { count: 2, level: 'low' as const },      // Emerging market
    { count: 5, level: 'medium' as const },   // Growing market
    { count: 12, level: 'high' as const },    // Competitive market
    { count: 25, level: 'very-high' as const }, // Saturated market
  ]

  const profileIndex = Math.floor(baseRandom * competitionProfiles.length)
  const baseProfile = competitionProfiles[profileIndex]

  const competitorCount = Math.round(generateVariance(baseProfile.count, getRandomFromSeed(slug, 501), 0.4))

  // Generate realistic competitor names
  const competitors: string[] = []
  const slugHash = hashString(slug)

  for (let i = 0; i < competitorCount; i++) {
    const nameIndex = (slugHash + i) % COMPETITOR_NAMES.length
    const competitorName = COMPETITOR_NAMES[nameIndex]
    if (!competitors.includes(competitorName)) {
      competitors.push(competitorName)
    }
  }

  return {
    competitors: competitors.slice(0, competitorCount),
    competitorCount,
    competitionLevel: baseProfile.level,
  }
}