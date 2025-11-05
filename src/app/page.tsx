import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, Search, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllIdeas } from '@/lib/json-db'
import { ScoreBadge } from '@/components/score-badge'
import { Header } from '@/components/header'

export default async function HomePage() {
  // Fetch featured ideas (top 3 by score)
  const allIdeas = getAllIdeas()
  const featuredIdeas = allIdeas
    .sort((a, b) => (b.marketScore || 0) - (a.marketScore || 0))
    .slice(0, 3)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Glen Luna Gradient Background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: 'radial-gradient(101.4% 61.3% at 12.4% 100%, rgba(247, 228, 15, 0.92), rgb(189, 204, 255) 86.2929%, rgb(235, 239, 255))',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-white/40" />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-black mb-6 md:mb-8 leading-tight tracking-tight">
            Discover profitable startup ideas{' '}
            <span className="relative inline-block">
              <span className="relative z-10">powered by data</span>
              <span className="absolute bottom-2 left-0 right-0 h-4 bg-glenluna-yellow/50 -z-0"></span>
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-black/70 mb-8 md:mb-10 max-w-2xl mx-auto font-medium">
            Get ideas for profitable startups, trending keywords, and go-to-market tactics,
            all validated with real-time market signals and scoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/idea-of-the-day">
              <Button size="lg" className="bg-black text-white hover:bg-black/90 rounded-xl px-8 py-6 text-lg font-semibold">
                View Today's Idea
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/ideas">
              <Button size="lg" variant="outline" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl px-8 py-6 text-lg font-semibold">
                Browse All Ideas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Black Background */}
      <section className="py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold mb-2">30+</h3>
              <p className="text-xl text-white/80">Startups funded</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold mb-2">£15m+</h3>
              <p className="text-xl text-white/80">Money raised</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold mb-2">14 weeks</h3>
              <p className="text-xl text-white/80">Average time to close</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-black/60 mb-4">Focus on what really counts</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-tight max-w-3xl mx-auto">
              Data-Driven Idea Discovery Powered by Real Market Signals
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            <Card className="border-2 border-black/10 hover:border-black/30 transition-all rounded-2xl">
              <CardHeader>
                <div className="w-14 h-14 bg-glenluna-yellow rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-7 h-7 text-black" />
                </div>
                <CardTitle className="text-2xl font-bold text-black">Market Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/70 text-base leading-relaxed">
                  Track 12-month trend slopes and volatility to identify emerging opportunities
                  before they become saturated.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 hover:border-black/30 transition-all rounded-2xl">
              <CardHeader>
                <div className="w-14 h-14 bg-glenluna-purple rounded-2xl flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-black">Search Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/70 text-base leading-relaxed">
                  Analyze search volume, growth rates, and keyword opportunities to validate
                  market demand and size.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-black/10 hover:border-black/30 transition-all rounded-2xl">
              <CardHeader>
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-black">Community Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-black/70 text-base leading-relaxed">
                  Monitor Reddit, Hacker News, and other communities to gauge real user
                  interest and engagement levels.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Ideas */}
      {featuredIdeas.length > 0 && (
        <section className="py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider text-black/60 mb-4">What we're tracking</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                Featured Startup Ideas
              </h2>
              <p className="text-lg sm:text-xl text-black/70 max-w-2xl mx-auto">
                Curated ideas ranked by market potential
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {featuredIdeas.map((idea) => (
                <Card key={idea.id} className="border-2 border-black/10 hover:border-black/30 transition-all rounded-2xl bg-white">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <ScoreBadge score={idea.marketScore || 0} size="sm" />
                    </div>
                    <CardTitle className="text-xl font-bold text-black line-clamp-2">
                      {idea.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black/70 text-base line-clamp-3 mb-4">
                      {idea.description.slice(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link href={`/ideas/${idea.slug}`}>
                      <Button variant="outline" size="sm" className="w-full border-2 border-black text-black hover:bg-black hover:text-white rounded-xl font-semibold">
                        View Details
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/ideas">
                <Button variant="outline" size="lg" className="border-2 border-black text-black hover:bg-black hover:text-white rounded-xl px-8 py-6 text-lg font-semibold">
                  Browse All Ideas
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-black/60 mb-4">How it works</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
              Our scoring algorithm analyzes multiple data sources
            </h2>
          </div>

          <div className="space-y-8 md:space-y-10">
            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-glenluna-yellow text-black rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 md:mb-3">
                  Data Collection
                </h3>
                <p className="text-base sm:text-lg text-black/70 leading-relaxed">
                  We gather signals from Google Trends, search volume data, community discussions,
                  news coverage, and competitive analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-glenluna-purple text-white rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 md:mb-3">
                  Smart Scoring
                </h3>
                <p className="text-base sm:text-lg text-black/70 leading-relaxed">
                  Each signal is normalized and weighted to create a comprehensive score from 0-100,
                  highlighting the most promising opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 md:mb-3">
                  Actionable Insights
                </h3>
                <p className="text-base sm:text-lg text-black/70 leading-relaxed">
                  Get detailed breakdowns, source links, and "why now" analysis to help you
                  make informed decisions about your next project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Yellow Background */}
      <section className="py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-glenluna-yellow">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
            Ready to find your next big idea?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-black/80 mb-8 md:mb-10 font-medium">
            Join thousands of entrepreneurs discovering data-driven opportunities.
          </p>
          <Link href="/idea-of-the-day">
            <Button size="lg" className="bg-black text-white hover:bg-black/90 rounded-xl px-8 py-6 text-lg font-semibold">
              Start with Today's Idea
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12">
            <div>
              <div className="mb-6">
                <Image
                  src="/glenluna.png"
                  alt="Glen Luna"
                  width={140}
                  height={48}
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-white/70 leading-relaxed">
                Discover profitable startup ideas powered by real-time market data.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Explore</h4>
              <ul className="space-y-3 text-white/70">
                <li><Link href="/idea-of-the-day" className="hover:text-white transition-colors">Idea of the Day</Link></li>
                <li><Link href="/ideas" className="hover:text-white transition-colors">Browse Ideas</Link></li>
                <li><Link href="/founder-fit" className="hover:text-white transition-colors">Founder Fit Quiz</Link></li>
                <li><Link href="/ideas?sortBy=marketScore" className="hover:text-white transition-colors">Top Scored</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-3 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-white/60">
            <p>&copy; 2025 Glen Luna. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
