'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function SubmitIdeaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetMarket: 'B2C',
    additionalContext: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze idea')
      }

      setAnalysis(data.analysis)
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing your idea')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveIdea = async () => {
    // TODO: Implement save to database
    alert('Save to database functionality coming soon!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Analyze Your Startup Idea
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get a comprehensive analysis from our AI-powered expert agent. Receive detailed insights on market opportunity, execution strategy, and more.
          </p>
        </div>

        {!analysis ? (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Tell us about your idea</CardTitle>
              <CardDescription>
                Provide as much detail as possible for a more comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Idea Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., AI-powered code review assistant"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your idea, the problem it solves, and how it works..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Market
                  </label>
                  <select
                    id="targetMarket"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  >
                    <option value="B2B">B2B (Business to Business)</option>
                    <option value="B2C">B2C (Business to Consumer)</option>
                    <option value="B2B2C">B2B2C (Business to Business to Consumer)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="additionalContext" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    id="additionalContext"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any specific aspects you'd like us to focus on? Target users, technical approach, etc."
                    value={formData.additionalContext}
                    onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing your idea...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Get AI Analysis
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Success Header */}
            <Card className="shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-green-900">Comprehensive Analysis Complete!</h2>
                </div>
                <p className="text-green-700">
                  Your idea has been analyzed across 8+ data sources with detailed VC-level insights. Review the comprehensive report below.
                </p>
              </CardContent>
            </Card>

            {/* Overall Score */}
            {analysis.overallMarketScore && (
              <Card className="shadow-xl border-2 border-blue-300">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-2">Overall Market Score</p>
                    <p className="text-6xl font-bold text-blue-600 mb-2">{analysis.overallMarketScore}<span className="text-3xl text-gray-500">/100</span></p>
                    <p className="text-sm text-gray-600">Composite score from 8+ data sources</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Executive Summary */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{analysis.summary}</p>
              </CardContent>
            </Card>

            {/* Data Sources Section */}
            {analysis.dataSources && Array.isArray(analysis.dataSources) && (
              <Card className="shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-900">📊 Data Sources & Market Validation</CardTitle>
                  <CardDescription className="text-purple-700">Real-time signals from multiple platforms validating market demand</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {analysis.dataSources.map((source: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-6 border-2 border-purple-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900">{source.source}</h3>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-3xl font-bold text-purple-600">{source.score}</p>
                              <p className="text-xs text-gray-500">Score</p>
                            </div>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              source.score >= 80 ? 'bg-green-100' : source.score >= 60 ? 'bg-yellow-100' : 'bg-gray-100'
                            }`}>
                              <span className={`text-2xl ${
                                source.score >= 80 ? 'text-green-600' : source.score >= 60 ? 'text-yellow-600' : 'text-gray-600'
                              }`}>
                                {source.score >= 80 ? '🔥' : source.score >= 60 ? '📈' : '📊'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid md:grid-cols-2 gap-3 mb-4">
                          {Object.entries(source.metrics || {}).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-sm font-medium text-gray-900">{String(value)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Insights */}
                        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                          <p className="text-sm font-semibold text-purple-900 mb-1">💡 Key Insights</p>
                          <p className="text-sm text-purple-800">{source.insights}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Scores Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Opportunity</p>
                    <p className="text-4xl font-bold text-blue-600">{analysis.opportunityScore}/10</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Problem Severity</p>
                    <p className="text-4xl font-bold text-red-600">{analysis.problemScore}/10</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Feasibility</p>
                    <p className="text-4xl font-bold text-green-600">{analysis.feasibilityScore}/10</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Why Now</p>
                    <p className="text-4xl font-bold text-purple-600">{analysis.whyNowScore}/10</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Go-to-Market</p>
                    <p className="text-4xl font-bold text-orange-600">{analysis.goToMarketScore}/10</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Team Fit</p>
                    <p className="text-4xl font-bold text-indigo-600">{analysis.teamFitScore}/10</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Problem & Solution */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg border-l-4 border-red-500">
                <CardHeader>
                  <CardTitle className="text-red-600">🔴 Problem Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.problem}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-l-4 border-green-500">
                <CardHeader>
                  <CardTitle className="text-green-600">✅ Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.solution}</p>
                </CardContent>
              </Card>
            </div>

            {/* Market Opportunity (TAM/SAM/SOM) */}
            {analysis.marketOpportunity && (
              <Card className="shadow-xl bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-900">💰 Market Opportunity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-6 border-2 border-green-200 text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-2">TAM</p>
                        <p className="text-2xl font-bold text-green-700 mb-1">{analysis.marketOpportunity.tam?.split(' ')[0]}</p>
                        <p className="text-xs text-gray-600">Total Addressable Market</p>
                      </div>
                      <div className="bg-white rounded-lg p-6 border-2 border-blue-200 text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-2">SAM</p>
                        <p className="text-2xl font-bold text-blue-700 mb-1">{analysis.marketOpportunity.sam?.split(' ')[0]}</p>
                        <p className="text-xs text-gray-600">Serviceable Addressable Market</p>
                      </div>
                      <div className="bg-white rounded-lg p-6 border-2 border-purple-200 text-center">
                        <p className="text-sm font-semibold text-gray-600 mb-2">SOM</p>
                        <p className="text-2xl font-bold text-purple-700 mb-1">{analysis.marketOpportunity.som?.split(' ')[0]}</p>
                        <p className="text-xs text-gray-600">Serviceable Obtainable Market</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">📈 Market Growth Rate: {analysis.marketOpportunity.marketGrowthRate}</p>
                      <p className="text-gray-700 leading-relaxed">{analysis.marketOpportunity.analysis}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Why Now */}
            {analysis.whyNow && (
              <Card className="shadow-lg border-l-4 border-purple-500">
                <CardHeader>
                  <CardTitle className="text-purple-600">⏰ Why Now?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{analysis.whyNow}</p>
                  {analysis.trendAnalysis && (
                    <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">📊 Trend Analysis</h4>
                      <p className="text-purple-800 leading-relaxed">{analysis.trendAnalysis}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Competitive Analysis */}
            {analysis.competitorAnalysis && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">⚔️ Competitive Landscape</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Direct Competitors */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Direct Competitors</h3>
                      <div className="space-y-3">
                        {analysis.competitorAnalysis.directCompetitors?.map((comp: any, idx: number) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                            <div className="flex items-baseline gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{comp.name}</h4>
                              <span className="text-sm text-gray-600">({comp.marketShare} market share)</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium text-green-700">Strengths:</span>
                                <span className="text-gray-700"> {comp.strengths}</span>
                              </div>
                              <div>
                                <span className="font-medium text-red-700">Weaknesses:</span>
                                <span className="text-gray-700"> {comp.weaknesses}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Competitive Advantages */}
                    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-900 mb-3">🎯 Our Competitive Advantages</h3>
                      <ul className="space-y-2">
                        {analysis.competitorAnalysis.competitiveAdvantages?.map((adv: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span className="text-green-900">{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Market Positioning */}
                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">📍 Market Positioning</h4>
                      <p className="text-blue-800">{analysis.competitorAnalysis.marketPositioning}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Segments */}
            {analysis.customerSegments && Array.isArray(analysis.customerSegments) && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">👥 Target Customer Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {analysis.customerSegments.map((segment: any, idx: number) => (
                      <div key={idx} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">{segment.segment}</h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Market Size:</span>
                            <span className="text-gray-900 ml-2">{segment.size}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Pain Point:</span>
                            <p className="text-gray-900 mt-1">{segment.pain}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Willingness to Pay:</span>
                            <span className="text-gray-900 ml-2">{segment.willingness}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Acquisition Strategy:</span>
                            <p className="text-gray-900 mt-1">{segment.acquisition}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unit Economics */}
            {analysis.unitEconomics && (
              <Card className="shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-900">💵 Unit Economics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border-2 border-yellow-200 text-center">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Avg Revenue/User</p>
                      <p className="text-2xl font-bold text-green-700">{analysis.unitEconomics.avgRevenuePerUser}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-yellow-200 text-center">
                      <p className="text-xs font-semibold text-gray-600 mb-1">CAC</p>
                      <p className="text-2xl font-bold text-red-700">{analysis.unitEconomics.customerAcquisitionCost}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-yellow-200 text-center">
                      <p className="text-xs font-semibold text-gray-600 mb-1">LTV</p>
                      <p className="text-2xl font-bold text-green-700">{analysis.unitEconomics.lifetimeValue}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-yellow-200 text-center">
                      <p className="text-xs font-semibold text-gray-600 mb-1">LTV:CAC</p>
                      <p className="text-2xl font-bold text-blue-700">{analysis.unitEconomics.ltvCacRatio}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border-2 border-gray-200 text-center">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Gross Margin</p>
                      <p className="text-xl font-bold text-green-700">{analysis.unitEconomics.grossMargin}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-gray-200 text-center">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Monthly Churn</p>
                      <p className="text-xl font-bold text-orange-700">{analysis.unitEconomics.churnRate}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border-2 border-gray-200 text-center">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Payback Period</p>
                      <p className="text-xl font-bold text-blue-700">{analysis.unitEconomics.paybackPeriod}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border-2 border-yellow-200">
                    <p className="text-gray-700 leading-relaxed">{analysis.unitEconomics.analysis}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Projections */}
            {analysis.financialProjections && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">📈 Financial Projections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-3 text-left">Year</th>
                          <th className="border p-3 text-left">Revenue</th>
                          <th className="border p-3 text-left">Customers</th>
                          <th className="border p-3 text-left">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border p-3 font-semibold">Year 1</td>
                          <td className="border p-3">{analysis.financialProjections.year1?.revenue}</td>
                          <td className="border p-3">{analysis.financialProjections.year1?.customers}</td>
                          <td className="border p-3 text-sm">Burn: {analysis.financialProjections.year1?.burn}</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border p-3 font-semibold">Year 2</td>
                          <td className="border p-3">{analysis.financialProjections.year2?.revenue}</td>
                          <td className="border p-3">{analysis.financialProjections.year2?.customers}</td>
                          <td className="border p-3 text-sm">Burn: {analysis.financialProjections.year2?.burn}</td>
                        </tr>
                        <tr>
                          <td className="border p-3 font-semibold">Year 3</td>
                          <td className="border p-3">{analysis.financialProjections.year3?.revenue}</td>
                          <td className="border p-3">{analysis.financialProjections.year3?.customers}</td>
                          <td className="border p-3 text-sm">{analysis.financialProjections.year3?.profitability}</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border p-3 font-semibold">Year 5</td>
                          <td className="border p-3 font-bold text-green-700">{analysis.financialProjections.year5?.revenue}</td>
                          <td className="border p-3 font-bold">{analysis.financialProjections.year5?.customers}</td>
                          <td className="border p-3 text-sm font-semibold text-green-700">{analysis.financialProjections.year5?.profitability}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-blue-900"><strong>Assumptions:</strong> {analysis.financialProjections.assumptions}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Go-to-Market Strategy */}
            {analysis.goToMarketStrategy && Array.isArray(analysis.goToMarketStrategy) && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">🚀 Go-to-Market Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.goToMarketStrategy.map((channel: any, idx: number) => (
                      <div key={idx} className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-blue-900">{channel.channel}</h3>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Expected CAC</p>
                            <p className="text-lg font-bold text-blue-700">{channel.expectedCAC}</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-3 mb-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Investment:</span>
                            <span className="text-gray-900 ml-2">{channel.investment}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Timeline:</span>
                            <span className="text-gray-900 ml-2">{channel.timeline}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Expected ROI:</span>
                            <span className="text-green-700 font-semibold ml-2">{channel.expectedROI}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white rounded border-l-4 border-blue-400">
                          <p className="text-sm text-gray-700">{channel.tactics}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technology Stack */}
            {analysis.technologyStack && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">💻 Technology & Feasibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Frontend</p>
                      <p className="text-gray-900">{analysis.technologyStack.frontend}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Backend</p>
                      <p className="text-gray-900">{analysis.technologyStack.backend}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Infrastructure</p>
                      <p className="text-gray-900">{analysis.technologyStack.infrastructure}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">AI/ML</p>
                      <p className="text-gray-900">{analysis.technologyStack.ai}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                      <p className="text-sm"><span className="font-semibold">Complexity:</span> {analysis.technologyStack.complexity}</p>
                    </div>
                    <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                      <p className="text-sm"><span className="font-semibold">Time to MVP:</span> {analysis.technologyStack.timeToMVP}</p>
                    </div>
                    <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                      <p className="text-sm"><span className="font-semibold">Technical Risks:</span> {analysis.technologyStack.technicalRisks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Team Requirements */}
            {analysis.teamRequirements && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">👨‍💼 Team Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">Founding Team</h4>
                      <p className="text-blue-800">{analysis.teamRequirements.foundingTeam}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Initial Hires</h4>
                      <div className="space-y-3">
                        {analysis.teamRequirements.initialHires?.map((hire: any, idx: number) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">{hire.role}</span>
                              <span className="text-sm text-gray-600">{hire.timing}</span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{hire.cost}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <p className="text-sm text-yellow-900"><strong>Skill Gaps:</strong> {analysis.teamRequirements.skillGaps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Execution Roadmap */}
            {analysis.executionPlan && Array.isArray(analysis.executionPlan) && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">🗺️ Execution Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analysis.executionPlan.map((phase: any, idx: number) => (
                      <div key={idx} className="relative">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                              {idx + 1}
                            </div>
                            {idx < analysis.executionPlan.length - 1 && (
                              <div className="w-0.5 h-16 bg-blue-300 mx-auto mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <h4 className="font-bold text-gray-900 text-lg mb-2">{phase.phase}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span>⏱️ {phase.timeline}</span>
                              <span>💰 {phase.investment}</span>
                            </div>
                            <p className="text-gray-700 mb-3">{phase.details}</p>
                            {phase.milestones && Array.isArray(phase.milestones) && (
                              <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                                <p className="font-semibold text-gray-700 mb-2">Key Milestones:</p>
                                <ul className="space-y-1">
                                  {phase.milestones.map((milestone: string, mIdx: number) => (
                                    <li key={mIdx} className="text-sm text-gray-700 flex items-start gap-2">
                                      <span className="text-blue-600 mt-0.5">•</span>
                                      <span>{milestone}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing Strategy */}
            {analysis.pricingModel && Array.isArray(analysis.pricingModel) && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">💳 Pricing Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {analysis.pricingModel.map((tier: any, idx: number) => (
                      <div key={idx} className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="mb-3">
                          <h4 className="font-bold text-gray-900 text-lg">{tier.type}</h4>
                          <p className="text-2xl font-bold text-blue-600 mt-1">{tier.price}</p>
                        </div>
                        {tier.target && (
                          <p className="text-sm font-semibold text-gray-700 mb-2">Target: {tier.target}</p>
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed">{tier.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Metrics */}
            {analysis.successMetrics && (
              <Card className="shadow-xl bg-gradient-to-br from-green-50 to-teal-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-900">🎯 Key Success Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {analysis.successMetrics.productMarketFit && (
                      <div>
                        <h4 className="font-semibold text-green-900 mb-3">Product-Market Fit Indicators</h4>
                        <ul className="space-y-2">
                          {analysis.successMetrics.productMarketFit.map((metric: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span className="text-green-900">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.successMetrics.businessHealth && (
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-3">Business Health Metrics</h4>
                        <ul className="space-y-2">
                          {analysis.successMetrics.businessHealth.map((metric: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-blue-600 mt-0.5">✓</span>
                              <span className="text-blue-900">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.successMetrics.growth && (
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-3">Growth Targets</h4>
                        <ul className="space-y-2">
                          {analysis.successMetrics.growth.map((metric: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-purple-600 mt-0.5">✓</span>
                              <span className="text-purple-900">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Unfair Advantages */}
            {analysis.unfairAdvantage && (
              <Card className="shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-yellow-900">🏆 Unfair Advantages & Moats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(analysis.unfairAdvantage).map(([key, value]) => (
                      <div key={key} className="p-4 bg-white rounded-lg border-2 border-yellow-200">
                        <h4 className="font-semibold text-yellow-900 capitalize mb-2">{key}</h4>
                        <p className="text-sm text-gray-700">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risks & Mitigation */}
            {analysis.risks && Array.isArray(analysis.risks) && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">⚠️ Risks & Mitigation Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.risks.map((risk: any, idx: number) => (
                      <div key={idx} className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 flex-1">{risk.risk || risk}</h4>
                          {risk.probability && risk.impact && (
                            <div className="flex gap-2 text-xs">
                              <span className={`px-2 py-1 rounded ${
                                risk.probability === 'High' ? 'bg-red-100 text-red-700' :
                                risk.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {risk.probability} Probability
                              </span>
                              <span className={`px-2 py-1 rounded ${
                                risk.impact === 'High' ? 'bg-red-100 text-red-700' :
                                risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {risk.impact} Impact
                              </span>
                            </div>
                          )}
                        </div>
                        {risk.mitigation && (
                          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <p className="text-sm font-semibold text-blue-900 mb-1">Mitigation Strategy:</p>
                            <p className="text-sm text-blue-800">{risk.mitigation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Final Recommendations */}
            {analysis.recommendations && Array.isArray(analysis.recommendations) && (
              <Card className="shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">🎯 Strategic Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border-2 border-blue-100">
                        <CheckCircle2 className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-900 leading-relaxed">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => {
                  setAnalysis(null)
                  setFormData({ title: '', description: '', targetMarket: 'B2C', additionalContext: '' })
                }}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Analyze Another Idea
              </Button>
              <Button
                onClick={handleSaveIdea}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Save to My Ideas
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
