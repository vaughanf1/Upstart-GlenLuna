import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const IDEAS_FILE = path.join(DATA_DIR, 'ideas.json');
const BOOKMARKS_FILE = path.join(DATA_DIR, 'bookmarks.json');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(IDEAS_FILE)) {
  fs.writeFileSync(IDEAS_FILE, JSON.stringify([]), 'utf8');
}
if (!fs.existsSync(BOOKMARKS_FILE)) {
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify([]), 'utf8');
}
if (!fs.existsSync(PROFILES_FILE)) {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify([]), 'utf8');
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  summary?: string;
  slug: string;
  url?: string;
  isIdeaOfTheDay?: boolean;
  marketScore?: number;
  score?: number; // Alias for marketScore
  difficulty?: number;
  buildType?: string;
  tags?: string[];
  revenuePotential?: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  pitch?: string;
  whyNow?: string;
  targetUser?: string;
  unfairAdvantage?: string;
  marketGap?: string;
  trendAnalysis?: string;
  opportunityScore?: number;
  problemScore?: number;
  feasibilityScore?: number;
  whyNowScore?: number;
  goToMarketScore?: number;
  executionDifficulty?: number;
  mvpTimeline?: string;
  pricingModel?: any;
  executionPlan?: any;
  goToMarketStrategy?: any;
  proofSignals?: any;
  sources?: any;
  scoreBreakdown?: any;
  createdAt?: string;
}

export interface Bookmark {
  id: string;
  ideaId: string;
  userId: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  skills?: string[];
  experience?: string;
  interests?: string[];
  createdAt: string;
}

// CSV Parsing for ideas
function parseCSVIdeas(): Idea[] {
  try {
    const csvPath = path.join(process.cwd(), 'ideabrowser_complete_dataset.csv');
    if (!fs.existsSync(csvPath)) {
      console.log('CSV file not found, returning empty array');
      return [];
    }

    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    // Skip header
    const dataLines = lines.slice(1);

    const ideas: Idea[] = dataLines.map((line, index) => {
      // Simple CSV parsing (handles quoted fields with commas)
      const fields: string[] = [];
      let currentField = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(currentField.trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }
      fields.push(currentField.trim()); // Push the last field

      const title = fields[0]?.replace(/^"|"$/g, '') || `Idea ${index + 1}`;
      const fullDescription = fields[1]?.replace(/^"|"$/g, '') || '';
      const category = fields[4]?.replace(/^"|"$/g, '') || 'Other';
      const revenueProjection = fields[3]?.replace(/^"|"$/g, '') || '';

      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);

      // Extract tags from category and description
      const tags: string[] = [];
      if (category && category !== 'Other') {
        tags.push(category);
      }
      if (fullDescription.toLowerCase().includes('ai')) tags.push('AI');
      if (fullDescription.toLowerCase().includes('saas')) tags.push('SaaS');
      if (fullDescription.toLowerCase().includes('automation')) tags.push('automation');
      if (fullDescription.toLowerCase().includes('marketing')) tags.push('marketing');

      // Determine build type from category and description
      let buildType = 'Web App';
      if (category.includes('AI') || fullDescription.toLowerCase().includes(' ai ')) buildType = 'AI Agent';
      else if (fullDescription.toLowerCase().includes('platform')) buildType = 'Platform';
      else if (fullDescription.toLowerCase().includes('marketplace')) buildType = 'Marketplace';
      else if (fullDescription.toLowerCase().includes('saas')) buildType = 'SaaS';
      else if (fullDescription.toLowerCase().includes('mobile') || fullDescription.toLowerCase().includes('app')) buildType = 'Mobile App';

      // Generate a market score (60-95 range) - deterministic based on index
      const marketScore = 60 + ((index * 7) % 36);

      // Generate difficulty (1-5) - deterministic based on index
      const difficulty = 1 + ((index * 3) % 5);

      // Create a summary (first sentence or first 200 chars)
      const summary = fullDescription.split('.')[0] + '.';

      // Full description for detail page
      const description = fullDescription;

      // Extract more detailed problem and solution
      const sentences = fullDescription.split('.').filter(s => s.trim());
      const problem = sentences.slice(0, 3).join('. ').trim() + '.';
      const solution = sentences.slice(3, 6).join('. ').trim() + '.';

      // Generate detailed pitch
      const pitch = sentences[0] + '. ' + (sentences[1] || '') + '.';

      // Generate Key Metrics scores (deterministic)
      const opportunityScore = 6 + ((index * 5) % 4); // 6-9
      const problemScore = 6 + ((index * 7) % 4); // 6-9
      const feasibilityScore = 5 + ((index * 3) % 5); // 5-9
      const whyNowScore = 7 + ((index * 11) % 3); // 7-9
      const goToMarketScore = 5 + ((index * 13) % 5); // 5-9
      const executionDifficulty = 4 + ((index * 17) % 6); // 4-9

      // Define target market
      const targetMarket = 'B2B';

      // Generate detailed market analysis
      const marketGap = `Current solutions in this space are either too expensive for small businesses or lack the specific features needed for ${category.toLowerCase()} operations. This creates a significant gap for mid-market companies looking for affordable, purpose-built solutions. The market has matured enough that customers understand the value proposition, but existing vendors have moved upmarket, leaving an underserved segment willing to pay for the right solution.`;

      const whyNow = `The timing is optimal for several converging reasons: (1) Recent technological advances in AI and cloud infrastructure make this solution economically viable at scale. (2) The ${category.toLowerCase()} market has reached critical mass with digital adoption accelerating 3-5 years ahead of schedule. (3) Regulatory changes and market shifts have created new pain points that incumbents are slow to address. (4) Remote work and distributed teams have intensified the need for better tools in this category. (5) Customers are actively budgeting for solutions after experiencing significant pain over the past 18-24 months.`;

      const trendGrowth = Math.floor(40 + (index * 7) % 50);
      const redditGrowth = Math.floor(60 + (index * 11) % 70);
      const jobGrowth = Math.floor(35 + (index * 13) % 45);
      const trendAnalysis = `Google Trends data shows ${trendGrowth}% growth in search volume over the past 18 months for related terms. Reddit discussions have increased ${redditGrowth}% year-over-year across relevant communities. LinkedIn job postings mentioning related skills are up ${jobGrowth}%, indicating growing industry investment. The market is entering the early majority adoption phase - perfect timing for a well-executed product launch.`;

      let targetUserPrimary = '';
      let targetUserSecondary = '';
      if (targetMarket === 'B2B') {
        targetUserPrimary = 'Operations managers and team leads at companies with 10-200 employees who are drowning in manual processes and ready to invest in automation';
        targetUserSecondary = 'Department heads at mid-market companies (200-1000 employees) seeking specialized solutions their enterprise systems do not provide';
      } else {
        targetUserPrimary = 'Professionals and small teams frustrated with consumer-grade tools and ready to pay for professional features';
        targetUserSecondary = 'Power users and consultants who need reliable, feature-rich tools';
      }
      const targetUser = `Primary: ${targetUserPrimary}. Secondary: ${targetUserSecondary}. These users are technically savvy enough to evaluate solutions but lack resources to build custom tools. They have budget authority or strong influence on purchasing decisions.`;

      const unfairAdvantage = `Deep understanding of the ${category.toLowerCase()} workflow from first-hand experience, enabling us to build features that truly matter. Strong network in the target market for initial customer acquisition and feedback. Technical expertise to build efficiently using modern stack and AI capabilities. Clear positioning between basic consumer tools and complex enterprise systems - a sweet spot competitors have abandoned. Ability to move fast and iterate based on customer feedback while incumbents are slowed by legacy architecture and organizational complexity.`;

      // Generate detailed pricing model
      const pricingModel = [
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

      // Generate detailed execution plan
      const executionPlan = [
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

      // Generate go-to-market strategy
      const goToMarketStrategy = [
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

      // Generate proof signals
      const proofSignals = [
        `Search volume growing ${Math.floor(25 + (index * 7) % 35)}% year-over-year across core keywords`,
        `Active discussions in ${Math.floor(5 + (index * 3) % 8)} major online communities with combined ${Math.floor(100 + (index * 23) % 400)}K+ members`,
        `Existing solutions in adjacent spaces showing strong traction and raising significant funding`,
        `Customer complaints about current solutions growing ${Math.floor(40 + (index * 11) % 50)}% on review sites and social media`,
        `Job postings for related roles increased ${Math.floor(30 + (index * 13) % 45)}% indicating market growth`,
        `Industry analysts and publications covering the space with increasing frequency`,
        `Multiple successful acquisitions in related categories validating market value`
      ];

      // Generate mock data sources
      const sources = [
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

      // Generate score breakdown
      const scoreBreakdown = {
        trend: 65 + ((index * 7) % 30),
        search: 60 + ((index * 11) % 35),
        community: 55 + ((index * 13) % 40),
        news: 50 + ((index * 17) % 40),
        competition: 60 + ((index * 19) % 35)
      };

      return {
        id: `idea-${index + 1}`,
        title: title.length > 150 ? title.substring(0, 150) + '...' : title,
        summary: summary.length > 200 ? summary.substring(0, 197) + '...' : summary,
        description: description,
        slug: slug || `idea-${index + 1}`,
        marketScore,
        score: marketScore, // Alias for compatibility
        difficulty,
        buildType,
        tags: [...new Set(tags)], // Remove duplicates
        revenuePotential: revenueProjection,
        problem: problem || fullDescription.split('.').slice(0, 2).join('.') + '.',
        solution: solution || fullDescription.split('.').slice(2, 4).join('.') + '.',
        pitch,
        targetMarket: 'B2B',
        // Detailed Analysis Fields
        marketGap,
        whyNow,
        trendAnalysis,
        targetUser,
        unfairAdvantage,
        // Key Metrics
        opportunityScore,
        problemScore,
        feasibilityScore,
        whyNowScore,
        goToMarketScore,
        executionDifficulty,
        // Data Sources
        sources,
        scoreBreakdown,
        // Strategic Plans
        pricingModel,
        executionPlan,
        goToMarketStrategy,
        proofSignals,
        // Additional fields
        mvpTimeline: `${Math.floor(2 + (index * 3) % 4)}-${Math.floor(4 + (index * 5) % 4)} months`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }).filter(idea => idea.title && idea.title.length > 10); // Filter out invalid entries

    console.log(`Loaded ${ideas.length} ideas from CSV`);
    return ideas;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
}

// Ideas CRUD
export function getAllIdeas(): Idea[] {
  // Try to get ideas from CSV first, fallback to JSON file
  const csvIdeas = parseCSVIdeas();
  if (csvIdeas.length > 0) {
    return csvIdeas;
  }

  // Fallback to JSON file
  try {
    const data = fs.readFileSync(IDEAS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading ideas file:', error);
    return [];
  }
}

export function getIdeaBySlug(slug: string): Idea | undefined {
  const ideas = getAllIdeas();
  return ideas.find((idea) => idea.slug === slug);
}

export function getIdeaById(id: string): Idea | undefined {
  const ideas = getAllIdeas();
  return ideas.find((idea) => idea.id === id);
}

export function createIdea(idea: Omit<Idea, 'id' | 'createdAt'>): Idea {
  const ideas = getAllIdeas();
  const newIdea: Idea = {
    ...idea,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  ideas.push(newIdea);
  fs.writeFileSync(IDEAS_FILE, JSON.stringify(ideas, null, 2), 'utf8');
  return newIdea;
}

export function updateIdea(id: string, updates: Partial<Idea>): Idea | null {
  const ideas = getAllIdeas();
  const index = ideas.findIndex((idea) => idea.id === id);

  if (index === -1) return null;

  ideas[index] = { ...ideas[index], ...updates };
  fs.writeFileSync(IDEAS_FILE, JSON.stringify(ideas, null, 2), 'utf8');
  return ideas[index];
}

// Bookmarks CRUD
export function getAllBookmarks(): Bookmark[] {
  const data = fs.readFileSync(BOOKMARKS_FILE, 'utf8');
  return JSON.parse(data);
}

export function getBookmarksByUserId(userId: string): Bookmark[] {
  const bookmarks = getAllBookmarks();
  return bookmarks.filter((bookmark) => bookmark.userId === userId);
}

export function createBookmark(ideaId: string, userId: string): Bookmark {
  const bookmarks = getAllBookmarks();
  const newBookmark: Bookmark = {
    id: Date.now().toString(),
    ideaId,
    userId,
    createdAt: new Date().toISOString(),
  };
  bookmarks.push(newBookmark);
  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2), 'utf8');
  return newBookmark;
}

export function deleteBookmark(id: string): boolean {
  const bookmarks = getAllBookmarks();
  const filtered = bookmarks.filter((bookmark) => bookmark.id !== id);

  if (filtered.length === bookmarks.length) return false;

  fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
  return true;
}

// Profiles CRUD
export function getAllProfiles(): Profile[] {
  const data = fs.readFileSync(PROFILES_FILE, 'utf8');
  return JSON.parse(data);
}

export function getProfileById(id: string): Profile | undefined {
  const profiles = getAllProfiles();
  return profiles.find((profile) => profile.id === id);
}

export function createProfile(profile: Omit<Profile, 'id' | 'createdAt'>): Profile {
  const profiles = getAllProfiles();
  const newProfile: Profile = {
    ...profile,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  profiles.push(newProfile);
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf8');
  return newProfile;
}

export function updateProfile(id: string, updates: Partial<Profile>): Profile | null {
  const profiles = getAllProfiles();
  const index = profiles.findIndex((profile) => profile.id === id);

  if (index === -1) return null;

  profiles[index] = { ...profiles[index], ...updates };
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf8');
  return profiles[index];
}
