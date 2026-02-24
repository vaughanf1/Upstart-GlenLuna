import Image from 'next/image'
import { TrendingUp, Search, Users, Target, Sparkles, BarChart3, Lock, ArrowRight } from 'lucide-react'
import { getAllIdeas } from '@/lib/json-db'
import { ScoreBadge } from '@/components/score-badge'
import { GoogleSignUp } from '@/components/google-sign-up'

export default async function HomePage() {
  const allIdeas = getAllIdeas()
  const featuredIdeas = allIdeas
    .sort((a, b) => (b.marketScore || 0) - (a.marketScore || 0))
    .slice(0, 3)

  const totalIdeas = allIdeas.length

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

      {/* Minimal Header — Logo Only */}
      <header className="py-6 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Image
            src="/glenluna.png"
            alt="Glen Luna"
            width={140}
            height={48}
            className="h-10 sm:h-12 w-auto"
            priority
          />
        </div>
      </header>

      {/* Hero Section with Sign-Up CTA */}
      <section className="py-12 md:py-20 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-black/5 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-black/60" />
            <span className="text-sm font-medium text-black/70">Data-driven startup discovery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-[1.1] tracking-tight">
            Find your next{' '}
            <span className="relative inline-block">
              <span className="relative z-10">startup idea</span>
              <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-3 sm:h-4 bg-glenluna-yellow/60 -z-0"></span>
            </span>
            , backed by data
          </h1>

          <p className="text-lg sm:text-xl text-black/60 mb-10 max-w-xl mx-auto leading-relaxed">
            Get instant access to {totalIdeas}+ scored startup ideas, personalised founder matching, and AI-powered analysis tools.
          </p>

          <GoogleSignUp className="flex flex-col items-center" />

          <p className="text-xs text-black/40 mt-6 max-w-xs mx-auto">
            Free to join. We&apos;ll never spam you or share your data.
          </p>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-black/50 mb-4">What you get</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">
              Everything you need to start
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-black/5">
              <div className="w-12 h-12 bg-glenluna-yellow rounded-xl flex items-center justify-center mb-5">
                <BarChart3 className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{totalIdeas}+ Scored Ideas</h3>
              <p className="text-black/60 leading-relaxed">
                Every idea is ranked 0–100 using real market signals — search volume, trends, community buzz, and competitive landscape.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-black/5">
              <div className="w-12 h-12 bg-glenluna-purple rounded-xl flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Personalised Matches</h3>
              <p className="text-black/60 leading-relaxed">
                Take the Founder Fit Quiz to discover which ideas match your skills, experience, and risk appetite.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-black/5">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">AI-Powered Analysis</h3>
              <p className="text-black/60 leading-relaxed">
                Submit your own idea and get a full VC-level breakdown — market size, competition, go-to-market strategy, and financial projections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ideas Preview (Teaser) */}
      {featuredIdeas.length > 0 && (
        <section className="py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <p className="text-sm font-semibold uppercase tracking-wider text-black/50 mb-4">Sneak peek</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                Top-scored ideas this week
              </h2>
              <p className="text-lg text-black/60 max-w-lg mx-auto">
                Sign up to unlock full details, analysis, and execution plans.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-2xl p-6 border border-black/5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-4">
                    <ScoreBadge score={idea.marketScore || 0} size="sm" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-3 line-clamp-2">
                    {idea.title}
                  </h3>
                  <p className="text-black/50 text-sm line-clamp-2 mb-4">
                    {idea.description.slice(0, 80)}...
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {idea.tags?.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-black/5 text-black/60 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Locked overlay */}
                  <div className="flex items-center gap-2 text-sm text-black/40 pt-3 border-t border-black/5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sign up to view full analysis</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Proof / Stats */}
      <section className="py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-black text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-12">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">30+</h3>
              <p className="text-sm sm:text-lg text-white/70">Startups funded</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">&pound;15m+</h3>
              <p className="text-sm sm:text-lg text-white/70">Money raised</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2">14 wks</h3>
              <p className="text-sm sm:text-lg text-white/70">Avg. time to close</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-sm font-semibold uppercase tracking-wider text-black/50 mb-4">How it works</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-tight">
              From data to your next big move
            </h2>
          </div>

          <div className="space-y-8 md:space-y-10">
            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-glenluna-yellow text-black rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                  We gather real market signals
                </h3>
                <p className="text-base sm:text-lg text-black/60 leading-relaxed">
                  Google Trends, search volume, Reddit, Hacker News, news coverage, and competitive analysis — all processed daily.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-glenluna-purple text-white rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                  Every idea gets a score
                </h3>
                <p className="text-base sm:text-lg text-black/60 leading-relaxed">
                  Our algorithm weighs each signal to produce a 0–100 market score, highlighting the most promising opportunities.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-lg md:text-xl">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">
                  You get actionable insights
                </h3>
                <p className="text-base sm:text-lg text-black/60 leading-relaxed">
                  Detailed breakdowns, pricing models, execution plans, and &ldquo;why now&rdquo; analysis — everything you need to make your move.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-glenluna-yellow">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
            Ready to find your next big idea?
          </h2>
          <p className="text-lg sm:text-xl text-black/70 mb-10 font-medium">
            Join founders discovering data-driven opportunities. Free to sign up.
          </p>

          <GoogleSignUp className="flex flex-col items-center" />
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-black text-white py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image
            src="/glenluna.png"
            alt="Glen Luna"
            width={100}
            height={34}
            className="h-7 w-auto brightness-0 invert"
          />
          <p className="text-sm text-white/50">
            &copy; 2025 Glen Luna. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
