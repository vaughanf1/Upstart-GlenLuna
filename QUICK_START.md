# Quick Start: Real API Integration

## ✅ What's Working

Your application now has **real API integration** with the following results:

### Working APIs (Tested Successfully)
1. ✅ **Hacker News API** - Fully working, no auth needed
   - Found 100 stories with 29,015 engagement points
   - Completely free to use

2. ✅ **News API** - Fully working
   - Found 100 articles with 62% recency factor
   - Using your provided API key

### APIs Needing Attention
3. ⚠️ **Reddit API** - Needs `REDDIT_CLIENT_SECRET`
   - Client ID is set, but secret is missing
   - See instructions below to get the secret

4. ⚠️ **SERP API** - May need valid API key
   - Current key returning "Unauthorized"
   - May need to check quota or get new key

5. ⚠️ **Crunchbase API** - May need valid API key
   - Current RapidAPI key returning "Forbidden"
   - May need to subscribe to the API or check quota

## 🚀 How to Use Real APIs Now

### Option 1: Use What's Working (Recommended)

Keep the current setup and use:
- ✅ Hacker News for community data
- ✅ News API for news articles
- 🔄 Mock data for trends and search volume

This gives you **real data for 2 out of 5 sources** with zero additional setup!

Just set in `.env.local`:
```bash
DATA_MODE=real
```

### Option 2: Fix All APIs

#### Reddit API
1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app..."
3. Choose "script" type
4. Name: "IdeaBrowser"
5. Redirect URI: http://localhost:3000
6. Copy the **secret** (under your client ID)
7. Add to `.env.local`:
```bash
REDDIT_CLIENT_SECRET="your_secret_here"
```

#### SERP API
1. Go to https://serpapi.com/
2. Sign up or log in
3. Get your API key from dashboard
4. Replace in `.env.local`:
```bash
SERP_API_KEY="your_new_key"
```

#### Crunchbase API
1. Go to https://rapidapi.com/crunchbase/api/crunchbase-real-time-data
2. Subscribe to a plan (may have free tier)
3. Copy your RapidAPI key
4. Replace in `.env.local`:
```bash
RAPIDAPI_KEY="your_new_key"
```

## 📊 Test Your Setup

Run the test script anytime to check API status:

```bash
npm run test:apis
```

This will show you exactly which APIs are working and which need attention.

## 💡 Current Recommendation

**For immediate use**: Enable real mode with the 2 working APIs:

1. Set `DATA_MODE=real` in `.env.local`
2. The system will use:
   - ✅ Real data from Hacker News
   - ✅ Real data from News API
   - 🔄 Mock data for Reddit (fallback)
   - 🔄 Mock data for Trends (fallback)
   - 🔄 Mock data for Competition (fallback)

This gives you **real community and news signals** while gracefully falling back to mock data for others.

## 🎯 Next Steps

1. **Test the working APIs**: Set `DATA_MODE=real` and refresh an idea's score
2. **Monitor costs**: News API has 100 requests/day free limit
3. **Add Reddit secret**: Follow instructions above for full Reddit integration
4. **Optional**: Fix SERP and Crunchbase APIs if you need those data sources

## 📝 Summary

You now have:
- ✅ 5 API clients fully implemented
- ✅ 2 APIs working with real data
- ✅ Error handling and rate limiting
- ✅ Automatic fallback to mock data
- ✅ Easy toggle between mock and real modes
- ✅ Test script to verify integrations

**Status**: Ready to use with partial real data! 🎉
