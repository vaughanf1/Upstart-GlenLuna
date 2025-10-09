# UpStart - Complete Rebuild Specification

## Project Overview
Build a modern startup idea browser and validation platform called "UpStart" that helps entrepreneurs discover, analyze, and validate profitable startup ideas using data-driven insights.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui components
- **Language**: TypeScript
- **Deployment**: Vercel

## Core Features

### 1. Browse Startup Ideas
- Display 100+ curated startup ideas from IdeaBrowser dataset
- Each idea includes:
  - Title and description
  - Market score (0-100)
  - Difficulty rating (1-5)
  - Build type (SaaS, Platform, Marketplace, etc.)
  - Tags for categorization
  - Revenue potential estimates
  - "Why Now" analysis
  - Problem/solution breakdown
- Pagination (12 ideas per page)
- Filtering by tags, difficulty, build type, score range
- Sorting by score, date created
- Search functionality

### 2. Idea Detail Pages
- Full idea breakdown with:
  - Comprehensive description
  - Market analysis and scoring breakdown
  - Trend charts and data visualization
  - Source links (Google Trends, Reddit, News, etc.)
  - Competition analysis
  - Target market definition
  - Go-to-market strategy suggestions
- Bookmark functionality
- Share buttons

### 3. Idea of the Day
- Featured idea displayed daily
- Rotates to highest-scoring unviewed ideas
- Special hero section on homepage

### 4. Submit & Analyze Ideas
- User-submitted idea form with fields:
  - Title
  - Problem description
  - Solution description
  - Target user
  - Tags
- Mock AI analysis that provides:
  - Market score (0-100)
  - Trend analysis
  - Competition assessment
  - Market signals (search volume, community interest, news coverage)
  - "Why Now" reasoning
- No real API calls - uses intelligent mock data generation

### 5. Founder Fit Quiz
- **One question at a time flow** (critical UX requirement)
- 11-question assessment covering:
  - Technical skills (1-5 scale)
  - Design skills (1-5 scale)
  - Marketing skills (1-5 scale)
  - Sales skills (1-5 scale)
  - Industry experience (multi-select)
  - Years of experience
  - Risk tolerance (1-5 scale)
  - Time commitment (part-time/full-time)
  - Funding approach (bootstrapped/angel/VC)
  - Preferred build types (multi-select)
  - Areas of interest (tags, multi-select)
- Progress bar showing question X of 11
- Results page showing:
  - Top 12 matched ideas ranked by fit score
  - Personalized fit reasoning for each match
  - Ability to bookmark matches

### 6. User Authentication
- Sign up with email/password
- Sign in with credentials
- Session management with JWT
- Profile storage for founder fit results
- Bookmark management per user

### 7. Admin Panel (Optional)
- Create new ideas manually
- Refresh idea scores
- View analytics

## Database Schema

```prisma
// User Management
model User {
  id              String          @id @default(cuid())
  email           String          @unique
  name            String?
  passwordHash    String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  bookmarks       Bookmark[]
  founderProfile  FounderProfile?
  accounts        Account[]
  sessions        Session[]
}

// Founder Profile for Quiz Results
model FounderProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])

  technicalSkills   Int      @default(3)
  designSkills      Int      @default(3)
  marketingSkills   Int      @default(3)
  salesSkills       Int      @default(3)

  industryExperience String? // JSON array
  yearsExperience    Int      @default(0)
  riskTolerance     Int      @default(3)
  timeCommitment    String   @default("part-time")
  fundingCapacity   String   @default("bootstrapped")

  preferredBuildTypes String? // JSON array
  preferredTags      String?  // JSON array

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

// Startup Ideas
model Idea {
  id             String     @id @default(cuid())
  slug           String     @unique
  title          String
  summary        String
  problem        String
  solution       String
  targetUser     String?
  whyNow         String?
  difficulty     Int        // 1-5
  buildType      String     // 'SaaS', 'AI agent', etc.
  tags           String     // JSON string array
  sources        String?    // JSON string (links to data sources)
  score          Float      @default(0)
  scoreBreakdown String?    // JSON string (trend, search, community, etc.)
  lastScoredAt   DateTime?

  // Business Metrics
  opportunityScore    Int?
  problemScore        Int?
  feasibilityScore    Int?
  whyNowScore         Int?
  revenuePotential    String?

  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  bookmarks      Bookmark[]
  dailyIdeas     DailyIdea[]
}

// Bookmarks
model Bookmark {
  id        String   @id @default(cuid())
  userId    String
  ideaId    String
  user      User     @relation(fields: [userId], references: [id])
  idea      Idea     @relation(fields: [ideaId], references: [id])
  createdAt DateTime @default(now())

  @@unique([userId, ideaId])
}

// Daily Featured Idea
model DailyIdea {
  id     String   @id @default(cuid())
  ideaId String
  idea   Idea     @relation(fields: [ideaId], references: [id])
  date   DateTime @unique
}
```

## Visual Design (Apple-Inspired Aesthetic)

### Color Palette
- **Primary**: #0A84FF (iOS blue)
- **Background**: Gradient from blue-50 to indigo-100
- **Cards**: White with soft shadows
- **Text**: Gray-900 (headings), Gray-600 (body)
- **Borders**: Gray-200
- **Success**: Green-500
- **Warning**: Orange-500

### Typography
- **Font**: Inter (system font fallback)
- **Headings**:
  - H1: 3rem (48px), font-bold
  - H2: 2rem (32px), font-bold
  - H3: 1.5rem (24px), font-semibold
- **Body**: 1rem (16px), line-height 1.5
- **Labels**: 0.875rem (14px)

### Component Styling
- **Buttons**:
  - Rounded (rounded-lg)
  - Gradient backgrounds for primary actions
  - Shadow on hover
  - Smooth transitions (300ms)
- **Cards**:
  - White background
  - Soft shadow (shadow-lg)
  - Rounded corners (rounded-xl)
  - Hover effects (scale, shadow increase)
- **Inputs**:
  - Border-2 with gray-200
  - Focus: blue-500 border
  - Rounded-lg
  - Padding: px-4 py-3

### Layout
- **Max Width**: 7xl (1280px) for main content
- **Spacing**: Consistent 4px/8px grid
- **Sections**: py-16 for vertical spacing
- **Cards Grid**: 3 columns on desktop, 1-2 on mobile

### Navigation
- Sticky header with backdrop blur
- Logo + brand name on left
- Nav links in center
- Auth buttons on right
- Mobile: Hamburger menu

## Mock Data Generation

Since no real APIs are used, implement intelligent mock data generators:

### Score Generation
```typescript
function generateMockScore(slug: string, metadata: any) {
  // Use slug/title as seed for consistency
  // Generate realistic scores (0-100) with breakdown:
  return {
    score: 60-90, // randomized but deterministic
    breakdown: {
      trend: 70-90,      // Google Trends momentum
      search: 60-80,     // Search volume
      community: 50-90,  // Reddit/HN mentions
      news: 40-70,       // News coverage
      competition: 60-80, // Market saturation
      quality: 70-90     // Overall quality
    },
    sources: [
      { type: 'trends', url: '...', meta: {...} },
      { type: 'reddit', url: '...', meta: {...} },
      { type: 'news', url: '...', meta: {...} }
    ]
  }
}
```

### Trend Data
- Generate realistic 12-month trend curves
- Add volatility and seasonality
- Calculate growth rates and momentum

### Community Signals
- Mock Reddit mention counts (10-1000)
- Mock HackerNews engagement (5-500)
- Realistic upvote/comment ratios

### Competition Analysis
- Generate 3-5 competitor names
- Market saturation percentage
- Funding amounts for competitors

## Key Implementation Notes

### 1. Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=random-32-char-string
NEXTAUTH_URL=https://your-domain.com

# Mock Mode (no API keys needed!)
DATA_MODE=mock
SCORING_MODE=local
```

### 2. API Routes Must Be Dynamic
```typescript
// In every API route file:
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

### 3. CSV Import Script
Create a script to import the 100 IdeaBrowser ideas:
- Parse CSV with title, description, category
- Auto-generate tags from content
- Categorize build types
- Extract revenue projections
- Generate mock scores
- Limit to 100 ideas for performance

### 4. Founder Fit Algorithm
```typescript
function calculateFitScore(profile, idea) {
  let score = 0

  // Skill matching (40% weight)
  if (idea.buildType === 'SaaS') score += profile.technicalSkills * 5
  if (idea.tags.includes('Design')) score += profile.designSkills * 3

  // Tag overlap (30% weight)
  const tagOverlap = intersection(profile.preferredTags, idea.tags).length
  score += tagOverlap * 10

  // Difficulty matching (20% weight)
  const avgSkill = average([profile.technicalSkills, profile.designSkills])
  if (Math.abs(avgSkill - idea.difficulty) <= 1) score += 20

  // Build type match (10% weight)
  if (profile.preferredBuildTypes.includes(idea.buildType)) score += 10

  return Math.min(score, 100)
}
```

### 5. One-Question-at-Time Quiz Flow
```typescript
const [questionIndex, setQuestionIndex] = useState(0)
const questions = [/* all 11 questions */]
const currentQuestion = questions[questionIndex]

// Show only currentQuestion
// Progress: (questionIndex + 1) / questions.length
// Next button advances questionIndex
// Previous button decreases questionIndex
```

## Pages Structure

```
/                          - Homepage with featured ideas
/ideas                     - Browse all ideas (paginated)
/ideas/[slug]              - Individual idea detail
/idea-of-the-day           - Today's featured idea
/submit-idea               - Submit new idea for analysis
/founder-fit               - Quiz (one question at a time)
/founder-fit/results       - Matched ideas based on profile
/auth/signin               - Sign in page
/auth/signup               - Sign up page
/admin                     - Admin dashboard (optional)
/admin/ideas               - Manage ideas
/admin/ideas/new           - Create new idea
```

## API Routes

```
GET  /api/ideas            - List ideas with filters
GET  /api/ideas/[slug]     - Get single idea
POST /api/ideas/[slug]/refresh - Regenerate score
POST /api/analyze-idea     - Analyze submitted idea
GET  /api/bookmarks        - Get user bookmarks
POST /api/bookmarks        - Add bookmark
DELETE /api/bookmarks      - Remove bookmark
GET  /api/founder-profile/matches - Get matched ideas
POST /api/founder-profile  - Save quiz results
POST /api/auth/register    - Sign up
POST /api/auth/[...nextauth] - NextAuth handlers
```

## Critical Success Factors

1. **No Real APIs Needed**: Everything works with mock data
2. **Fast Performance**: Pagination, efficient queries
3. **Mobile Responsive**: Works perfectly on all devices
4. **Clean Design**: Apple-inspired aesthetic throughout
5. **One Question at a Time**: Quiz UX is crucial
6. **Deterministic Scores**: Same idea always gets same score
7. **Dynamic API Routes**: Prevent static generation errors

## Data Seed

Include a seed script that:
1. Creates admin and test users
2. Imports 100 ideas from CSV
3. Generates mock scores for all
4. Sets today's featured idea
5. Creates sample bookmarks

## Testing Checklist

- [ ] Browse ideas with filters and sorting
- [ ] View idea details with all data
- [ ] Submit new idea and see analysis
- [ ] Complete founder fit quiz (one question at a time!)
- [ ] View matched ideas on results page
- [ ] Sign up and sign in
- [ ] Bookmark ideas
- [ ] View bookmarked ideas
- [ ] Mobile responsive on all pages
- [ ] Fast load times (<2s)
- [ ] No console errors
- [ ] Works without any API keys

## Common Pitfalls to Avoid

1. **Don't try to statically generate API routes** - Use `export const dynamic = 'force-dynamic'`
2. **Don't require real API keys** - Use mock mode exclusively
3. **Don't show all quiz questions at once** - One at a time only!
4. **Don't forget to stringify JSON** - Prisma requires strings for JSON fields
5. **Don't skip the seed script** - Database needs initial data
6. **Don't use complex validation at build time** - Make env vars optional
7. **Don't forget pagination** - 100+ ideas need efficient loading

## Deployment Instructions

1. Create Vercel Postgres database
2. Add environment variables in Vercel:
   - DATABASE_URL (auto-added by Vercel Postgres)
   - NEXTAUTH_SECRET (generate with `openssl rand -base64 32`)
   - NEXTAUTH_URL (your Vercel URL)
   - DATA_MODE=mock
   - SCORING_MODE=local
3. Deploy from GitHub
4. Run migrations: `npx prisma db push`
5. Seed data: `npx tsx prisma/seed.ts`
6. Import CSV: `npx tsx scripts/import-csv-ideas.ts`

## Success Criteria

✅ Build completes without errors
✅ All pages render correctly
✅ Quiz shows one question at a time
✅ Ideas can be filtered and sorted
✅ Mock analysis provides realistic data
✅ Mobile responsive and beautiful
✅ Fast (<2s page loads)
✅ No API keys required
✅ Works perfectly on Vercel

---

**Project Goal**: Create a production-ready startup idea browser that looks premium, works flawlessly, and requires zero API costs to run. Focus on excellent UX, especially the one-question-at-a-time quiz flow, and Apple-inspired visual polish throughout.
