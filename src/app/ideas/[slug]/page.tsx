import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Calendar, RefreshCw, Star, Share2, TrendingUp, DollarSign, Target, Zap, Users, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react'
import { getIdeaBySlug } from '@/lib/json-db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScoreBadge } from '@/components/score-badge'
import { ScoreBreakdownChart } from '@/components/score-breakdown-chart'
import { SourceList } from '@/components/source-list'
import { formatDate } from '@/lib/utils'

function getIdea(slug: string) {
  const idea = getIdeaBySlug(slug)

  if (!idea) {
    notFound()
  }

  return idea
}

function IdeaDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function IdeaDetailContent({ slug }: { slug: string }) {
  const rawIdea = await getIdea(slug)
  const idea = {
    ...rawIdea,
    tags: Array.isArray(rawIdea.tags) ? rawIdea.tags : (typeof rawIdea.tags === 'string' ? JSON.parse(rawIdea.tags || '[]') : []),
    sources: rawIdea.sources ? (typeof rawIdea.sources === 'string' ? JSON.parse(rawIdea.sources) : rawIdea.sources) : [],
    scoreBreakdown: rawIdea.scoreBreakdown ? (typeof rawIdea.scoreBreakdown === 'string' ? JSON.parse(rawIdea.scoreBreakdown) : rawIdea.scoreBreakdown) : null,
    pricingModel: rawIdea.pricingModel ? (typeof rawIdea.pricingModel === 'string' ? JSON.parse(rawIdea.pricingModel) : rawIdea.pricingModel) : null,
    executionPlan: rawIdea.executionPlan ? (typeof rawIdea.executionPlan === 'string' ? JSON.parse(rawIdea.executionPlan) : rawIdea.executionPlan) : null,
    goToMarketStrategy: rawIdea.goToMarketStrategy ? (typeof rawIdea.goToMarketStrategy === 'string' ? JSON.parse(rawIdea.goToMarketStrategy) : rawIdea.goToMarketStrategy) : null,
    proofSignals: rawIdea.proofSignals ? (typeof rawIdea.proofSignals === 'string' ? JSON.parse(rawIdea.proofSignals) : rawIdea.proofSignals) : null,
  }

  const getDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < difficulty ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Exceptional'
    if (score >= 8) return 'High Pain'
    if (score >= 7) return 'Strong'
    if (score >= 6) return 'Challenging'
    if (score >= 5) return 'Moderate'
    return 'Low'
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (score >= 7) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50 w-full">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
          <div className="flex items-center justify-between h-14 sm:h-16 w-full">
            <Link href="/ideas" className="flex items-center text-gray-600 hover:text-gray-900 text-xs sm:text-sm md:text-base flex-shrink-0">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Back to </span>Ideas
            </Link>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs sm:text-sm">
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs sm:text-sm">
                <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                Bookmark
              </Button>
              {/* Mobile - Icon only */}
              <Button variant="outline" size="sm" className="sm:hidden px-1.5 h-8">
                <Share2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="sm:hidden px-1.5 h-8">
                <Bookmark className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Hero Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 md:mb-4">
            <ScoreBadge score={idea.score} size="lg" showLabel />
            <div className="flex items-center gap-1">
              {getDifficultyStars(idea.difficulty)}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
            {idea.title}
          </h1>

          {idea.pitch && (
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-4 md:mb-6 leading-relaxed font-medium">
              {idea.pitch}
            </p>
          )}

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 md:mb-6 leading-relaxed">
            {idea.summary}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {idea.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {formatDate(idea.createdAt)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Key Metrics */}
            <Card className="shadow-lg border-2">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {idea.opportunityScore && (
                    <div className={`p-4 rounded-lg border-2 ${getScoreColor(idea.opportunityScore)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Opportunity</h3>
                        <Target className="w-5 h-5" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{idea.opportunityScore}</span>
                        <span className="text-sm">{getScoreLabel(idea.opportunityScore)}</span>
                      </div>
                    </div>
                  )}

                  {idea.problemScore && (
                    <div className={`p-4 rounded-lg border-2 ${getScoreColor(idea.problemScore)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Problem</h3>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{idea.problemScore}</span>
                        <span className="text-sm">{getScoreLabel(idea.problemScore)}</span>
                      </div>
                    </div>
                  )}

                  {idea.feasibilityScore && (
                    <div className={`p-4 rounded-lg border-2 ${getScoreColor(idea.feasibilityScore)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Feasibility</h3>
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{idea.feasibilityScore}</span>
                        <span className="text-sm">{getScoreLabel(idea.feasibilityScore)}</span>
                      </div>
                    </div>
                  )}

                  {idea.whyNowScore && (
                    <div className={`p-4 rounded-lg border-2 ${getScoreColor(idea.whyNowScore)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Why Now</h3>
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{idea.whyNowScore}</span>
                        <span className="text-sm">{getScoreLabel(idea.whyNowScore)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Fit */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Business Fit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {idea.revenuePotential && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-6 h-6 text-green-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 mb-1">Revenue Potential</h3>
                        <p className="text-green-800">{idea.revenuePotential}</p>
                      </div>
                      <Badge variant="outline" className="bg-white text-green-700 border-green-300">$$$</Badge>
                    </div>
                  </div>
                )}

                {idea.executionDifficulty && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-6 h-6 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-1">Execution Difficulty</h3>
                        <p className="text-blue-800">{idea.mvpTimeline ? `${idea.mvpTimeline} MVP timeline` : 'Moderate complexity with integrations'}</p>
                      </div>
                      <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">{idea.executionDifficulty}/10</Badge>
                    </div>
                  </div>
                )}

                {idea.goToMarketScore && (
                  <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Target className="w-6 h-6 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-900 mb-1">Go-To-Market</h3>
                        <p className="text-purple-800">{getScoreLabel(idea.goToMarketScore)} potential with strong market demand</p>
                      </div>
                      <Badge variant="outline" className="bg-white text-purple-700 border-purple-300">{idea.goToMarketScore}/10</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Problem & Solution */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Problem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {idea.problem}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {idea.solution}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Market Gap */}
            {idea.marketGap && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    <Target className="w-5 h-5 md:w-6 md:h-6" />
                    The Market Gap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{idea.marketGap}</p>
                  {idea.unfairAdvantage && (
                    <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Unfair Advantage
                      </h4>
                      <p className="text-indigo-800">{idea.unfairAdvantage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Why Now */}
            {idea.whyNow && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                    Why Now?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{idea.whyNow}</p>
                  {idea.trendAnalysis && (
                    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-amber-900 mb-2">Trend Analysis</h4>
                      <p className="text-amber-800">{idea.trendAnalysis}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pricing Model */}
            {idea.pricingModel && idea.pricingModel.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                    Pricing & Offer Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {idea.pricingModel.map((tier: any, idx: number) => (
                      <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{tier.type || tier.name}</h4>
                            {tier.price && (
                              <span className="text-sm text-gray-600">({tier.price})</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{tier.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Execution Plan */}
            {idea.executionPlan && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                    Execution Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(idea.executionPlan) ? (
                    <div className="space-y-3">
                      {idea.executionPlan.map((step: any, idx: number) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1 pt-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{step.title || step.phase}</h4>
                            <p className="text-gray-700 text-sm">{step.description || step.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{idea.executionPlan}</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Go-To-Market Strategy */}
            {idea.goToMarketStrategy && idea.goToMarketStrategy.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    <Target className="w-5 h-5 md:w-6 md:h-6" />
                    Go-To-Market Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {idea.goToMarketStrategy.map((channel: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                          {channel.channel}
                        </h4>
                        <p className="text-sm text-blue-800 mb-3">{channel.tactics}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {channel.investment && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-green-600" />
                              <span className="text-gray-700">{channel.investment}</span>
                            </div>
                          )}
                          {channel.expectedCAC && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3 text-purple-600" />
                              <span className="text-gray-700">CAC: {channel.expectedCAC}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Target Market */}
            {idea.targetUser && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                    <Users className="w-5 h-5 md:w-6 md:h-6" />
                    Target Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{idea.targetUser}</p>
                  {idea.targetMarket && (
                    <Badge variant="outline" className="text-base px-4 py-2">
                      {idea.targetMarket}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Build Type & Difficulty */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Categorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Type</p>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {idea.buildType}
                  </Badge>
                </div>
                {idea.targetMarket && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Market</p>
                    <p className="font-medium text-gray-900">{idea.targetMarket}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Difficulty</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {getDifficultyStars(idea.difficulty)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({idea.difficulty}/5)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            {idea.scoreBreakdown && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreBreakdownChart breakdown={idea.scoreBreakdown} />
                </CardContent>
              </Card>
            )}

            {/* Proof & Signals */}
            {idea.proofSignals && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Proof & Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  {typeof idea.proofSignals === 'string' ? (
                    <p className="text-sm text-gray-700 leading-relaxed">{idea.proofSignals}</p>
                  ) : (
                    <ul className="space-y-2">
                      {idea.proofSignals.map((signal: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Data Sources */}
            {idea.sources && idea.sources.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <SourceList sources={idea.sources} limit={8} />
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 hidden lg:block">
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                <Bookmark className="w-5 h-5 mr-2" />
                Bookmark This Idea
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Share2 className="w-5 h-5 mr-2" />
                Share Idea
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 md:mt-12 text-center">
          <Link href="/ideas">
            <Button variant="outline" size="lg">
              Browse More Ideas
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function IdeaDetailPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<IdeaDetailSkeleton />}>
      <IdeaDetailContent slug={params.slug} />
    </Suspense>
  )
}