# Vercel Deployment Guide

## 🔒 Security Check Complete

✅ All API keys are properly secured in `.env.local` (gitignored)
✅ No sensitive data in committed files
✅ `.env.example` ready as template

## 📋 Required Environment Variables for Vercel

You **must** add these environment variables in your Vercel project settings:

### 1. Database (Required)
```
DATABASE_URL=postgresql://username:password@host:5432/database
```
**For Vercel deployment**, you need to set up a production database. Options:
- **Vercel Postgres** (recommended) - https://vercel.com/docs/storage/vercel-postgres
- **Neon** - https://neon.tech (free tier available)
- **Supabase** - https://supabase.com (free tier available)
- **Railway** - https://railway.app

⚠️ **Important**: SQLite (`file:./dev.db`) won't work on Vercel. You must use PostgreSQL.

### 2. Authentication (Required)
```
NEXTAUTH_SECRET=your-production-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app
```
Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Anthropic API (Required for AI Analysis)
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```
This is **essential** for the "Analyze My Idea" feature to work.

### 4. Data Mode (Optional)
```
DATA_MODE=mock
SCORING_MODE=local
```
Set `DATA_MODE=real` only if you want to use live APIs (requires API keys below).

### 5. API Keys (Optional - for real data)
Only add these if you set `DATA_MODE=real`:

```
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=IdeaBrowser/1.0

SERP_API_KEY=your_serp_api_key
GOOGLE_TRENDS_API_KEY=your_google_trends_api_key

NEWS_API_KEY=your_news_api_key

RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=crunchbase-real-time-data.p.rapidapi.com
```

## 🚀 Deployment Steps

### Step 1: Set up Database

1. Create a PostgreSQL database (recommended: Vercel Postgres)
2. Get the connection string
3. Add `DATABASE_URL` to Vercel environment variables

### Step 2: Update Prisma for PostgreSQL

If you're using Vercel Postgres, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional: for migrations
}
```

### Step 3: Run Database Migrations

After deploying, run migrations:

```bash
# If using Vercel Postgres
npx prisma db push

# Or generate and apply migrations
npx prisma migrate deploy
```

### Step 4: Add Environment Variables to Vercel

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add all required variables from above
4. Set them for **Production**, **Preview**, and **Development** environments

### Step 5: Deploy

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

Or push to GitHub and Vercel will auto-deploy.

## 🔧 Post-Deployment Tasks

### 1. Seed the Database (Optional)

If you want to import scraped IdeaBrowser ideas:

```bash
# Run the scraper
npm run scrape:ideas

# Import to database
npm run import:ideas
```

### 2. Test the AI Analysis Feature

1. Navigate to `https://your-app.vercel.app/submit-idea`
2. Fill out the form
3. Verify the AI analysis works

### 3. Check API Routes

Test these endpoints:
- `/api/analyze-idea` - AI expert agent
- Any other API routes you're using

## ⚠️ Important Notes

### API Route Timeouts
- Free Vercel plans have a **10-second timeout** for API routes
- Pro plans have **60 seconds** (required for AI analysis)
- The AI analysis takes ~20-30 seconds

**Solution**: Upgrade to Vercel Pro ($20/mo) if you want the AI analysis feature.

**Alternative**: Use background jobs or Edge Functions for longer operations.

### Database Connection Pooling

For production, use connection pooling:

1. Add Prisma Accelerate or use Vercel Postgres (has built-in pooling)
2. Update your Prisma client:

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### Environment-Specific Settings

Consider different configs for dev/prod:

```bash
# Development (.env.local)
DATA_MODE=mock
DATABASE_URL=file:./dev.db

# Production (Vercel)
DATA_MODE=mock
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-app.vercel.app
```

## 🎯 Minimal Deployment (Just AI Analysis)

If you only want the AI analysis feature to work:

**Required Environment Variables:**
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=random-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
ANTHROPIC_API_KEY=sk-ant-api03-...
DATA_MODE=mock
SCORING_MODE=local
```

This will:
✅ Allow users to submit ideas and get AI analysis
✅ Browse scraped IdeaBrowser ideas (if you import them)
✅ Use mock data for scoring (no API costs)

## 📊 Cost Considerations

### Vercel
- **Free**: 10s timeout (AI analysis won't work)
- **Pro**: $20/mo with 60s timeout (AI analysis works)

### Anthropic API
- ~$0.04-0.05 per analysis
- Very affordable for moderate usage

### Database
- **Vercel Postgres**: Free tier available
- **Neon**: Free tier with 0.5GB storage
- **Supabase**: Free tier with 500MB storage

## 🔍 Troubleshooting

### "API route timed out"
- Upgrade to Vercel Pro for 60s timeout
- Or optimize the AI prompt to respond faster

### "Database connection failed"
- Verify `DATABASE_URL` is correct
- Check if database accepts connections from Vercel
- Enable connection pooling

### "ANTHROPIC_API_KEY is not defined"
- Add the env var in Vercel settings
- Redeploy after adding

### "Ideas not showing on homepage"
- Run database migrations: `npx prisma db push`
- Import ideas: `npm run import:ideas`

## ✅ Pre-Deployment Checklist

- [ ] Database created and `DATABASE_URL` added to Vercel
- [ ] All required environment variables added to Vercel
- [ ] `.env.local` is in `.gitignore` (already done ✅)
- [ ] No API keys in committed files (already done ✅)
- [ ] Prisma schema updated for PostgreSQL (if needed)
- [ ] Vercel Pro plan if using AI analysis feature
- [ ] Test locally with production-like settings

## 🎉 Ready to Deploy!

Your app is secure and ready for Vercel deployment. Just:

1. Set up PostgreSQL database
2. Add environment variables to Vercel
3. Push to GitHub or run `vercel --prod`

Good luck! 🚀
