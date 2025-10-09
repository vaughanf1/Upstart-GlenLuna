# Quick Start: AI Expert Agent

## 🚀 Try It Now!

Your AI-powered startup idea analyzer is **ready to use**!

### Step 1: Start the Server

```bash
npm run dev
```

Server will start on: `http://localhost:3000` (or `3001` if 3000 is busy)

### Step 2: Access the Analyzer

Navigate to: **http://localhost:3000/submit-idea**

Or click **"Analyze My Idea"** in the top navigation

### Step 3: Submit an Idea

Fill out the form:

```
Title: AI-powered fitness coach
Description: A mobile app that uses AI to create personalized workout plans based on user goals, fitness level, and available equipment. Includes form correction via camera and real-time motivation.
Target Market: B2C
Additional Context: Targeting busy professionals who want gym-quality workouts at home
```

### Step 4: Get Analysis

Click **"Get AI Analysis"** and wait ~10-15 seconds

You'll receive a comprehensive report with:
- ✅ Executive summary
- ✅ Problem & solution analysis
- ✅ 4 key scores (Opportunity, Problem, Feasibility, Why Now)
- ✅ Market gap & unfair advantage
- ✅ Execution plan with timeline
- ✅ Pricing model recommendations
- ✅ Go-to-market strategy
- ✅ Risks & next steps

## 📊 What You Get

### Scores (1-10 Rating):
- **Opportunity Score** - Market size and potential
- **Problem Score** - Severity of pain point
- **Feasibility Score** - Technical/execution viability
- **Why Now Score** - Market timing

### Detailed Analysis:
- **Problem** - What pain are you solving?
- **Solution** - How does your idea solve it?
- **Market Gap** - What opportunity exists?
- **Why Now** - Why is timing right?
- **Target User** - Who's the ideal customer?
- **Unfair Advantage** - What's your edge?

### Execution Guide:
- **Pricing Model** - Recommended pricing tiers
- **Execution Plan** - Step-by-step roadmap
- **Go-to-Market** - Distribution channels
- **Revenue Potential** - Estimated ARR
- **Trend Analysis** - Market momentum
- **Competitor Analysis** - Who you're up against

## 💡 Example Ideas to Try

### 1. SaaS Idea
```
Title: Email warm-up automation for sales teams
Description: Automatically warms up new email addresses to avoid spam folders. Gradually increases sending volume, creates engagement signals, and monitors deliverability.
Target Market: B2B
```

### 2. Consumer App
```
Title: Plant care reminder with AI diagnosis
Description: Mobile app that reminds you to water plants and uses camera to diagnose plant health issues. Gives personalized care tips.
Target Market: B2C
```

### 3. Marketplace
```
Title: Freelance CFO marketplace for startups
Description: Connect early-stage startups with part-time CFOs for financial planning, fundraising prep, and board reporting.
Target Market: B2B
```

## 🎯 What Happens After Analysis?

Currently:
- ✅ View comprehensive report
- ✅ Analyze another idea
- 🔜 Save to database (coming soon)
- 🔜 View in dashboard (coming soon)
- 🔜 Share with team (coming soon)

## 🔧 Troubleshooting

### "Failed to analyze idea"
- Check that `ANTHROPIC_API_KEY` is set in `.env.local`
- Verify API key is valid at https://console.anthropic.com
- Check server logs for detailed error

### Slow response?
- Claude analysis typically takes 10-15 seconds
- Larger/more complex ideas may take up to 30 seconds
- This is normal - Claude is thinking deeply about your idea!

### JSON parsing error?
- Rare, but Claude sometimes returns malformed JSON
- Try simplifying your idea description
- Avoid special characters in input

## 💰 Cost

Each analysis costs approximately **$0.04-0.05**:
- Input: ~1,500 tokens (~$0.005)
- Output: ~2,500 tokens (~$0.038)
- **Total**: ~$0.043 per analysis

Very affordable for expert-level analysis!

## 🎉 You're All Set!

The AI expert agent is **fully functional** and ready to analyze your startup ideas.

Try it now at: **http://localhost:3000/submit-idea**

Happy building! 🚀
