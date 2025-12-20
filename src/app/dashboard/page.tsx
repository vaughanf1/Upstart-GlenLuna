import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  // Fetch user's matched ideas from Supabase
  const { data: matchedIdeas } = await supabase
    .from('matched_ideas')
    .select('*')
    .eq('user_id', user.id)
    .order('match_score', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Track your matched ideas and explore new opportunities
          </p>
        </div>

        {/* Matched Ideas Section */}
        {matchedIdeas && matchedIdeas.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Matched Ideas</h2>
                <p className="text-gray-600">
                  Based on your Founder Fit Quiz results
                </p>
              </div>
              <Link href="/founder-fit">
                <Button variant="outline">
                  Retake Quiz
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedIdeas.map((idea: any) => (
                <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">
                          {Math.round(idea.match_score)}% Match
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {idea.idea_title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {idea.idea_description}
                    </p>
                    <Link href={`/ideas/${idea.idea_slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="py-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Discover Ideas Matched to Your Skills
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Take the Founder Fit Quiz to get personalized startup ideas based on your skills, experience, and goals.
              </p>
              <Link href="/founder-fit">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Take Founder Fit Quiz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/ideas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">Browse All Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Explore our full database of validated startup ideas
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/idea-of-the-day">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Sparkles className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle className="text-lg">Idea of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Check out today&apos;s featured startup opportunity
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/submit-idea">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle className="text-lg">Analyze My Idea</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Get data-driven insights on your startup concept
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
