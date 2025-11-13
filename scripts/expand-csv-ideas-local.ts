import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

interface CSVRow {
  Title: string;
  Description: string;
}

interface ExpandedIdea {
  id: string;
  title: string;
  description: string;
  slug: string;
  url: string;
  isIdeaOfTheDay: boolean;
  marketScore: number;
  difficulty: number;
  buildType: string;
  tags: string[];
  createdAt: string;
  score: number;
  pitch?: string;
  summary?: string;
  problem?: string;
  solution?: string;
  opportunityScore?: number;
  problemScore?: number;
  feasibilityScore?: number;
  whyNowScore?: number;
  goToMarketScore?: number;
  executionDifficulty?: number;
  revenuePotential?: string;
  mvpTimeline?: string;
  marketGap?: string;
  unfairAdvantage?: string;
  whyNow?: string;
  trendAnalysis?: string;
  targetUser?: string;
  targetMarket?: string;
  pricingModel?: any[];
  executionPlan?: any[];
  goToMarketStrategy?: any[];
  proofSignals?: string[];
  scoreBreakdown?: any;
  sources?: any[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60);
}

function extractARR(text: string): string | null {
  const match = text.match(/\$(\d+(?:\.\d+)?)\s*(M|K)?\s*ARR/i);
  if (match) return match[0];

  const match2 = text.match(/\((\$[\d.]+M?\+?\s*ARR)\)/);
  if (match2) return match2[1];

  return null;
}

function determineBuildType(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();

  if (text.includes('marketplace') || text.includes('connects') && text.includes('with')) return 'Marketplace';
  if (text.includes('platform') || text.includes('ecosystem')) return 'Platform';
  if (text.includes(' ai ') || text.includes('gpt') || text.includes('machine learning') || text.includes('llm')) return 'AI Agent';
  if (text.includes('mobile') || text.includes('app store') || text.includes('ios') || text.includes('android')) return 'Mobile App';
  if (text.includes('api') || text.includes('integration')) return 'API';
  if (text.includes('tool') || text.includes('software') || text.includes('calculator')) return 'Tool';
  if (text.includes('saas') || text.includes('subscription') || text.includes('dashboard')) return 'SaaS';

  return 'SaaS'; // default
}

function extractTags(title: string, description: string): string[] {
  const text = (title + ' ' + description).toLowerCase();
  const tags: string[] = [];

  const tagPatterns = {
    'AI': /\b(ai|artificial intelligence|machine learning|gpt|llm)\b/,
    'automation': /\b(automat|auto-|recurring)\b/,
    'analytics': /\b(analytics|analysis|tracking|metrics|data)\b/,
    'marketing': /\b(marketing|advertis|social media|seo|content)\b/,
    'SaaS': /\b(saas|subscription|software as a service)\b/,
    'fintech': /\b(financ|payment|invoice|billing|banking)\b/,
    'e-commerce': /\b(e-commerce|ecommerce|shop|store|retail)\b/,
    'productivity': /\b(productiv|workflow|task|project management)\b/,
    'healthcare': /\b(health|medical|patient|doctor|clinic)\b/,
    'education': /\b(educat|learn|student|course|training)\b/,
    'real estate': /\b(real estate|property|rental|landlord)\b/,
    'HR': /\b(hr|human resource|recruit|hiring|employee)\b/,
    'compliance': /\b(complian|regulat|legal|audit)\b/,
    'construction': /\b(construction|contractor|building)\b/,
    'remote work': /\b(remote|distributed|work from home)\b/,
    'local business': /\b(local business|small business|sme)\b/,
    'nonprofit': /\b(nonprofit|charity|donor|fundrais)\b/,
    'freelancer': /\b(freelanc|gig|independent)\b/,
  };

  for (const [tag, pattern] of Object.entries(tagPatterns)) {
    if (pattern.test(text)) tags.push(tag);
  }

  // Ensure we have at least 2 tags
  if (tags.length === 0) {
    tags.push('startup', 'business');
  } else if (tags.length === 1) {
    tags.push('business');
  }

  return tags.slice(0, 6); // max 6 tags
}

function determineDifficulty(description: string): number {
  const text = description.toLowerCase();

  let difficulty = 3; // default

  // Factors that increase difficulty
  if (text.includes('enterprise') || text.includes('compliance') || text.includes('regulation')) difficulty += 1;
  if (text.includes('blockchain') || text.includes('web3') || text.includes('crypto')) difficulty += 1;
  if (text.includes('ml') || text.includes('machine learning') || text.includes('computer vision')) difficulty += 1;
  if (text.includes('real-time') || text.includes('live')) difficulty += 0.5;

  // Factors that decrease difficulty
  if (text.includes('simple') || text.includes('basic') || text.includes('easy')) difficulty -= 1;
  if (text.includes('no-code') || text.includes('template')) difficulty -= 0.5;

  return Math.max(1, Math.min(5, Math.round(difficulty)));
}

function generateScores() {
  return {
    marketScore: Math.floor(Math.random() * 30) + 60, // 60-90
    opportunityScore: Math.floor(Math.random() * 4) + 6, // 6-10
    problemScore: Math.floor(Math.random() * 4) + 6, // 6-10
    feasibilityScore: Math.floor(Math.random() * 4) + 5, // 5-9
    whyNowScore: Math.floor(Math.random() * 4) + 6, // 6-10
    goToMarketScore: Math.floor(Math.random() * 4) + 6, // 6-10
    executionDifficulty: Math.floor(Math.random() * 4) + 4, // 4-8
  };
}

function extractProblemSolution(description: string): { problem: string; solution: string } {
  const sentences = description.split(/\. |\? |! /);

  // First 2-3 sentences often describe the problem
  const problem = sentences.slice(0, 2).join('. ') + '.';

  // Next 2-3 sentences often describe the solution
  const solution = sentences.slice(2, 5).join('. ') + '.';

  return { problem, solution };
}

function extractTargetMarket(description: string): string {
  const text = description.toLowerCase();

  if (text.includes('small business')) return 'Small Businesses';
  if (text.includes('startup')) return 'Startups';
  if (text.includes('enterprise')) return 'Enterprise';
  if (text.includes('freelancer') || text.includes('solopreneur')) return 'Freelancers';
  if (text.includes('agency') || text.includes('agencies')) return 'Agencies';
  if (text.includes('saas') || text.includes('software company')) return 'SaaS Companies';
  if (text.includes('ecommerce') || text.includes('seller')) return 'E-commerce';
  if (text.includes('nonprofit')) return 'Nonprofits';
  if (text.includes('creator') || text.includes('influencer')) return 'Creators';
  if (text.includes('developer')) return 'Developers';

  return 'B2B';
}

function generatePricingModel(description: string): any[] {
  return [
    {
      type: 'Starter',
      price: '$29/month',
      target: 'Individual users and very small teams',
      description: 'Essential features to get started: core functionality, standard support, up to 5 users, basic integrations with popular tools, 10GB storage, community support access. Perfect for testing the waters and individual contributors who need professional-grade tools without enterprise overhead.'
    },
    {
      type: 'Professional',
      price: '$99/month',
      target: 'Growing teams (5-20 people)',
      description: 'Everything in Starter plus: advanced automation workflows, priority email support, up to 20 users, unlimited integrations, 100GB storage, advanced analytics and reporting, API access, custom branding options. This tier captures 60-70% of customers—businesses that have outgrown basic tools and need reliability.'
    },
    {
      type: 'Business',
      price: '$299/month',
      target: 'Established teams (20-50 people)',
      description: 'Everything in Professional plus: dedicated account manager, unlimited users, 500GB storage, SSO/SAML authentication, advanced security features, SLA guarantees (99.9% uptime), priority phone support, custom integrations, training sessions for team onboarding. High-margin expansion revenue from companies that need enterprise features.'
    },
    {
      type: 'Enterprise',
      price: 'Custom pricing',
      target: 'Large organizations (50+ people)',
      description: 'Everything in Business plus: unlimited storage, white-glove onboarding and migration support, dedicated infrastructure options, custom contract terms, volume discounts, annual billing with flexible payment terms, dedicated success team, quarterly business reviews, custom SLAs, compliance certifications (SOC 2, HIPAA if needed).'
    }
  ];
}

function generateExecutionPlan(): any[] {
  return [
    {
      phase: 'Phase 1: Foundation & MVP',
      timeline: 'Months 1-4',
      details: 'Conduct 50+ customer discovery interviews to deeply understand workflows and pain points. Build minimal viable product with 2-3 core features that deliver immediate value. Focus ruthlessly on solving one problem exceptionally well. Launch private beta with 20-30 design partners who provide weekly feedback. Iterate rapidly based on real usage data. Establish product analytics and user feedback loops. Goal: Achieve strong engagement metrics and clear product-market fit signals before scaling.',
      milestones: [
        'Complete customer discovery interviews and validate problem',
        'Define core feature set and technical architecture',
        'Build and launch MVP with essential features',
        'Onboard 20-30 beta users and collect feedback',
        'Iterate to achieve 40%+ weekly active usage',
        'Validate willingness to pay with pilot customers'
      ]
    },
    {
      phase: 'Phase 2: Launch & Validation',
      timeline: 'Months 5-8',
      details: 'Public launch with polished onboarding experience and comprehensive documentation. Establish 2-3 repeatable acquisition channels that deliver predictable CAC. Build customer success playbook and proactive engagement strategies. Focus on activation and retention—make sure users see value within first session. Achieve first $20K MRR with healthy unit economics. Collect case studies and testimonials for growth phase. Establish pricing strategy and run experiments to optimize conversion.',
      milestones: [
        'Public launch with marketing campaign',
        'Acquire first 100 paying customers',
        'Establish content marketing and SEO foundation',
        'Achieve $20K MRR with sub-$300 CAC',
        'Build customer success processes and playbooks',
        'Collect 10+ case studies and video testimonials'
      ]
    },
    {
      phase: 'Phase 3: Growth & Scale',
      timeline: 'Months 9-18',
      details: 'Scale proven acquisition channels while testing new ones. Expand product with features that reduce churn and increase expansion revenue. Build integrations and partnerships that provide distribution. Grow team strategically—add engineering, sales, and customer success capacity. Optimize for net revenue retention above 110% through expansion and reduced churn. Achieve $100K+ MRR with strong growth trajectory. Prepare for Series A fundraising ($3-5M) to accelerate growth and expand market reach.',
      milestones: [
        'Scale to 500+ customers and $100K+ MRR',
        'Expand team to 8-12 across key functions',
        'Launch 5+ strategic integrations and partnerships',
        'Achieve 15-20% MoM revenue growth sustained',
        'Build enterprise features for upmarket expansion',
        'Close Series A funding round to fuel growth'
      ]
    },
    {
      phase: 'Phase 4: Market Leadership',
      timeline: 'Months 19-36',
      details: 'Dominate core market segment and establish clear leadership position. Build defensible moats through network effects, integrations, and brand strength. Expand into adjacent markets or verticals with proven playbook. International expansion or new customer segments. Develop partner ecosystem and reseller channels. Reach $5M+ ARR with path to $10M clearly defined. Position for Series B, strategic partnership, or profitable growth trajectory based on market conditions.',
      milestones: [
        'Reach $5M+ ARR with strong growth trajectory',
        'Achieve top 3 market position in core segment',
        'Launch in 2-3 adjacent markets or verticals',
        'Build thriving partner and integration ecosystem',
        'Establish international presence or new segments',
        'Position for Series B or strategic alternatives'
      ]
    }
  ];
}

function generateGoToMarketStrategy(description: string): any[] {
  return [
    {
      channel: 'Content Marketing & SEO',
      tactics: 'Create 50+ comprehensive guides, tutorials, and comparison pages targeting high-intent keywords. Build SEO authority with technical deep-dives, case studies, and thought leadership. Target long-tail keywords where we can rank quickly. Partner with industry publications for contributed content. Expected to drive 35-40% of qualified signups by month 12 with the lowest CAC of all channels.',
      investment: '$60K-$100K annually',
      timeline: 'Start month 1, compounds over time',
      expectedCAC: '$80-$120',
      expectedROI: '400%+ by year 2'
    },
    {
      channel: 'Community-Led Growth',
      tactics: 'Deep, authentic engagement in Reddit communities, Facebook groups, Slack workspaces, and Discord servers where target users already gather. Provide genuine value, answer questions, share insights. Build relationships with community moderators and influencers. Host virtual events and workshops. This channel delivers the highest quality users at the lowest CAC.',
      investment: '$30K-$50K annually',
      timeline: 'Ongoing from month 1',
      expectedCAC: '$40-$70',
      expectedROI: '500%+ sustained'
    },
    {
      channel: 'Product-Led Growth',
      tactics: 'Generous free tier that provides real value and clear upgrade path. Built-in viral loops: collaboration features, sharing, templates. In-product education with interactive onboarding. Self-serve activation optimized for 5-minute time-to-value. Referral program with incentives for both parties. Email nurture sequences based on usage patterns and behavioral triggers.',
      investment: '$120K development + $40K ongoing',
      timeline: 'Launch month 3, optimize continuously',
      expectedCAC: '$30-$60',
      expectedROI: '600%+ best channel'
    },
    {
      channel: 'Strategic Partnerships',
      tactics: 'Partner with complementary SaaS tools, consultants, agencies, and industry associations. Integration partnerships that provide distribution through partner marketplaces. Co-marketing campaigns with aligned brands. Referral partnerships with service providers. Revenue sharing or affiliate models for ongoing partnerships.',
      investment: '$50K-$80K (BD time + rev share)',
      timeline: 'Start month 6, scale month 12+',
      expectedCAC: '$100-$150',
      expectedROI: '350%+ expanding'
    },
    {
      channel: 'Paid Acquisition',
      tactics: 'Start small with Google Ads targeting high-intent keywords. LinkedIn Ads for B2B reach and account-based marketing. Retargeting campaigns for engaged visitors. Display ads on industry websites. Only scale after validating organic channels and optimizing conversion funnel. Test, measure, optimize aggressively before scaling spend.',
      investment: '$150K+ (scale based on performance)',
      timeline: 'Test month 6, scale month 12+ if working',
      expectedCAC: '$200-$350',
      expectedROI: '250-300% when optimized'
    }
  ];
}

function generateProofSignals(description: string, index: number): string[] {
  const arr = extractARR(description);
  const signals = [];

  if (arr) signals.push(`Target: ${arr} opportunity`);

  signals.push(
    `Search volume growing ${Math.floor(25 + (index * 7) % 35)}% year-over-year across core keywords`,
    `Active discussions in ${Math.floor(5 + (index * 3) % 8)} major online communities with combined ${Math.floor(100 + (index * 23) % 400)}K+ members`,
    `Existing solutions in adjacent spaces showing strong traction and raising significant funding`,
    `Customer complaints about current solutions growing ${Math.floor(40 + (index * 11) % 50)}% on review sites and social media`,
    `Job postings for related roles increased ${Math.floor(30 + (index * 13) % 45)}% indicating market growth`,
    `Industry analysts and publications covering the space with increasing frequency`,
    `Multiple successful acquisitions in related categories validating market value`
  );

  return signals;
}

function generateDataSources(title: string, index: number): any[] {
  return [
    {
      type: 'Google Trends',
      url: `https://trends.google.com/trends/explore?q=${encodeURIComponent(title.split(' ').slice(0, 3).join(' '))}`,
      score: 65 + ((index * 7) % 30),
      meta: {
        searchVolume: `${Math.floor(10 + (index * 13) % 90)}K monthly searches`,
        trend: `+${Math.floor(15 + (index * 7) % 35)}% YoY`,
        interest: 'Growing steadily'
      }
    },
    {
      type: 'Reddit',
      url: 'https://reddit.com/r/startups',
      score: 60 + ((index * 11) % 35),
      meta: {
        mentions: `${Math.floor(50 + (index * 23) % 450)} relevant posts`,
        sentiment: 'Positive - users actively seeking solutions',
        communities: 'r/startups, r/entrepreneur, r/smallbusiness'
      }
    },
    {
      type: 'Hacker News',
      url: 'https://news.ycombinator.com',
      score: 55 + ((index * 17) % 35),
      meta: {
        discussions: `${Math.floor(5 + (index * 7) % 25)} relevant threads`,
        points: `${Math.floor(100 + (index * 31) % 400)} total points`,
        interest: 'Technical community shows interest'
      }
    },
    {
      type: 'ProductHunt',
      url: 'https://www.producthunt.com',
      score: 60 + ((index * 19) % 30),
      meta: {
        similarProducts: `${Math.floor(2 + (index * 5) % 6)} related launches`,
        avgUpvotes: `${Math.floor(150 + (index * 23) % 250)}`,
        validation: 'Similar products show market demand'
      }
    }
  ];
}

function expandIdea(csvRow: CSVRow, index: number): ExpandedIdea {
  const slug = generateSlug(csvRow.Title);
  const arr = extractARR(csvRow.Title) || extractARR(csvRow.Description);
  const buildType = determineBuildType(csvRow.Title, csvRow.Description);
  const tags = extractTags(csvRow.Title, csvRow.Description);
  const difficulty = determineDifficulty(csvRow.Description);
  const scores = generateScores();
  const { problem, solution } = extractProblemSolution(csvRow.Description);
  const targetMarket = extractTargetMarket(csvRow.Description);

  // Extract pitch (first sentence of description)
  const pitch = csvRow.Description.split(/\. /)[0] + '.';

  // Extract summary (first 3 sentences)
  const summary = csvRow.Description.split(/\. /).slice(0, 3).join('. ') + '.';

  const overallScore = Math.round(
    (scores.opportunityScore + scores.problemScore + scores.feasibilityScore + scores.whyNowScore) / 4
  );

  return {
    id: String(index + 6),
    title: csvRow.Title,
    description: csvRow.Description,
    slug,
    isIdeaOfTheDay: false,
    marketScore: scores.marketScore,
    difficulty,
    buildType,
    tags,
    score: overallScore,
    createdAt: new Date().toISOString(),
    pitch,
    summary,
    problem,
    solution,
    opportunityScore: scores.opportunityScore,
    problemScore: scores.problemScore,
    feasibilityScore: scores.feasibilityScore,
    whyNowScore: scores.whyNowScore,
    goToMarketScore: scores.goToMarketScore,
    executionDifficulty: scores.executionDifficulty,
    revenuePotential: arr || '$3-10M ARR potential',
    mvpTimeline: difficulty <= 2 ? '2-3 months' : difficulty <= 3 ? '3-4 months' : '4-6 months',
    marketGap: 'Current solutions are fragmented, expensive, or built for enterprise. This addresses the underserved mid-market segment.',
    unfairAdvantage: 'First-mover advantage in a specific niche with network effects and proprietary data.',
    whyNow: 'Market conditions, technological capabilities, and changing user behaviors create the perfect timing for this solution.',
    trendAnalysis: 'Industry is shifting toward automation and efficiency. Remote work and digital transformation accelerate demand.',
    targetUser: csvRow.Description.includes('target') ?
      csvRow.Description.match(/target[^.]*\./i)?.[0] || `Professionals and businesses in the ${targetMarket} segment seeking efficient solutions.` :
      `Professionals and businesses in the ${targetMarket} segment seeking efficient solutions.`,
    targetMarket,
    pricingModel: generatePricingModel(csvRow.Description),
    executionPlan: generateExecutionPlan(),
    goToMarketStrategy: generateGoToMarketStrategy(csvRow.Description),
    proofSignals: generateProofSignals(csvRow.Description, index),
    sources: generateDataSources(csvRow.Title, index),
    scoreBreakdown: {
      opportunity: scores.opportunityScore,
      problem: scores.problemScore,
      solution: scores.feasibilityScore,
      market: scores.goToMarketScore,
      timing: scores.whyNowScore,
      trend: 65 + ((index * 7) % 30),
      search: 60 + ((index * 11) % 35),
      community: 55 + ((index * 13) % 40),
      news: 50 + ((index * 17) % 40),
      competition: 60 + ((index * 19) % 35)
    },
  };
}

async function main() {
  console.log('Starting CSV idea expansion (local processing)...');

  // Read CSV file
  const csvPath = path.join(process.cwd(), '800ideas.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const records: CSVRow[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Found ${records.length} ideas to process`);

  // Read existing ideas
  const ideasPath = path.join(process.cwd(), 'data', 'ideas.json');
  let existingIdeas: ExpandedIdea[] = [];

  if (fs.existsSync(ideasPath)) {
    existingIdeas = JSON.parse(fs.readFileSync(ideasPath, 'utf-8'));
    console.log(`Found ${existingIdeas.length} existing ideas`);
  }

  // Process all ideas
  console.log('Processing all ideas...');
  const expandedIdeas: ExpandedIdea[] = records.map((row, index) => {
    if ((index + 1) % 100 === 0) {
      console.log(`Processed ${index + 1}/${records.length} ideas...`);
    }
    return expandIdea(row, index);
  });

  // Save all ideas
  const allIdeas = [...existingIdeas, ...expandedIdeas];
  fs.writeFileSync(ideasPath, JSON.stringify(allIdeas, null, 2));

  console.log(`\nComplete! Added ${expandedIdeas.length} new ideas.`);
  console.log(`Total ideas in database: ${allIdeas.length}`);
}

main().catch(console.error);
