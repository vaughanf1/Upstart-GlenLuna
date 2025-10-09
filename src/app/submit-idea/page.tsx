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
          <div className="space-y-6">
            {/* Success Header */}
            <Card className="shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-green-900">Analysis Complete!</h2>
                </div>
                <p className="text-green-700">
                  Your idea has been analyzed by our AI expert. Review the comprehensive report below.
                </p>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
              </CardContent>
            </Card>

            {/* Scores Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {analysis.opportunityScore && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Opportunity</p>
                      <p className="text-4xl font-bold text-blue-600">{analysis.opportunityScore}/10</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {analysis.problemScore && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Problem</p>
                      <p className="text-4xl font-bold text-red-600">{analysis.problemScore}/10</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {analysis.feasibilityScore && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Feasibility</p>
                      <p className="text-4xl font-bold text-green-600">{analysis.feasibilityScore}/10</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {analysis.whyNowScore && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Why Now</p>
                      <p className="text-4xl font-bold text-purple-600">{analysis.whyNowScore}/10</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Problem & Solution */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-red-600">Problem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.problem}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-green-600">Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.solution}</p>
                </CardContent>
              </Card>
            </div>

            {/* Market Analysis */}
            {analysis.marketGap && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Market Gap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{analysis.marketGap}</p>
                </CardContent>
              </Card>
            )}

            {/* Why Now */}
            {analysis.whyNow && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Why Now?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">{analysis.whyNow}</p>
                  {analysis.trendAnalysis && (
                    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-amber-900 mb-2">Trend Analysis</h4>
                      <p className="text-amber-800">{analysis.trendAnalysis}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Execution Plan */}
            {analysis.executionPlan && Array.isArray(analysis.executionPlan) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Execution Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.executionPlan.map((step: any, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{step.phase}</h4>
                          {step.timeline && <p className="text-sm text-gray-600 mb-1">{step.timeline}</p>}
                          <p className="text-gray-700 text-sm">{step.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pricing Model */}
            {analysis.pricingModel && Array.isArray(analysis.pricingModel) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Pricing Model</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.pricingModel.map((tier: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <div className="flex items-baseline gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{tier.type}</h4>
                          {tier.price && (
                            <span className="text-sm text-gray-600">({tier.price})</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{tier.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {analysis.recommendations && Array.isArray(analysis.recommendations) && (
              <Card className="shadow-lg bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-900">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
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
