import Link from 'next/link'
import { TrendingUp, Search, Users, Lightbulb, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllIdeas } from '@/lib/json-db'
import { ScoreBadge } from '@/components/score-badge'

export default async function HomePage() {
  // Fetch featured ideas (top 3 by score)
  const allIdeas = getAllIdeas()
  const featuredIdeas = allIdeas
    .sort((a, b) => (b.marketScore || 0) - (a.marketScore || 0))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">UpStart</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/idea-of-the-day">
                <Button variant="ghost">Idea of the Day</Button>
              </Link>
              <Link href="/ideas">
                <Button variant="ghost">Browse Ideas</Button>
              </Link>
              <Link href="/submit-idea">
                <Button variant="ghost">Analyze My Idea</Button>
              </Link>
              <Link href="/founder-fit">
                <Button variant="ghost">Founder Fit Quiz</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover profitable startup ideas{' '}
            <span className="text-blue-600">powered by data</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get ideas for profitable startups, trending keywords, and go-to-market tactics,
            all validated with real-time market signals and scoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/idea-of-the-day">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                View Today's Idea
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/ideas">
              <Button size="lg" variant="outline">
                Browse All Ideas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Data-Driven Idea Discovery
            </h2>
            <p className="text-lg text-gray-600">
              Every idea is scored using multiple market signals and real-time data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Market Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track 12-month trend slopes and volatility to identify emerging opportunities
                  before they become saturated.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Search Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Analyze search volume, growth rates, and keyword opportunities to validate
                  market demand and size.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Community Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
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
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Startup Ideas
              </h2>
              <p className="text-lg text-gray-600">
                Curated ideas ranked by market potential
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {featuredIdeas.map((idea) => (
                <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <ScoreBadge score={idea.marketScore || 0} size="sm" />
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {idea.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {idea.description.slice(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link href={`/ideas/${idea.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
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
                <Button variant="outline" size="lg">
                  Browse All Ideas
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Our scoring algorithm analyzes multiple data sources to rank startup ideas
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Data Collection
                </h3>
                <p className="text-gray-600">
                  We gather signals from Google Trends, search volume data, community discussions,
                  news coverage, and competitive analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Smart Scoring
                </h3>
                <p className="text-gray-600">
                  Each signal is normalized and weighted to create a comprehensive score from 0-100,
                  highlighting the most promising opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Actionable Insights
                </h3>
                <p className="text-gray-600">
                  Get detailed breakdowns, source links, and "why now" analysis to help you
                  make informed decisions about your next project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find your next big idea?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of entrepreneurs discovering data-driven opportunities.
          </p>
          <Link href="/idea-of-the-day">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start with Today's Idea
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-6 h-6 text-blue-400" />
                <span className="text-lg font-bold">UpStart</span>
              </div>
              <p className="text-gray-400">
                Discover profitable startup ideas powered by real-time market data.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/idea-of-the-day" className="hover:text-white">Idea of the Day</Link></li>
                <li><Link href="/ideas" className="hover:text-white">Browse Ideas</Link></li>
                <li><Link href="/founder-fit" className="hover:text-white">Founder Fit Quiz</Link></li>
                <li><Link href="/ideas?sortBy=marketScore" className="hover:text-white">Top Scored</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 UpStart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
