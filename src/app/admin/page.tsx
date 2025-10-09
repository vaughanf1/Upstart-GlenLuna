import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, RefreshCw, Calendar, FileText, Users } from 'lucide-react'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

async function getAdminStats() {
  const [totalIdeas, totalUsers, recentIdeas, todayIdea] = await Promise.all([
    db.idea.count(),
    db.user.count(),
    db.idea.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
    db.dailyIdea.findFirst({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      include: {
        idea: true,
      },
    }),
  ])

  return {
    totalIdeas,
    totalUsers,
    recentIdeas,
    todayIdea,
  }
}

async function AdminDashboard() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalIdeas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ideas This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.recentIdeas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Idea</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-900">
              {stats.todayIdea ? (
                <Link
                  href={`/ideas/${stats.todayIdea.idea.slug}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {stats.todayIdea.idea.title}
                </Link>
              ) : (
                'Not set'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/ideas/new">
              <Button className="w-full h-20 flex-col gap-2">
                <Plus className="w-6 h-6" />
                Add New Idea
              </Button>
            </Link>

            <form action="/admin/actions/refresh-all-scores" method="post">
              <Button type="submit" variant="outline" className="w-full h-20 flex-col gap-2">
                <RefreshCw className="w-6 h-6" />
                Refresh All Scores
              </Button>
            </form>

            <form action="/admin/actions/set-daily-idea" method="post">
              <Button type="submit" variant="outline" className="w-full h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                Set Today's Idea
              </Button>
            </form>

            <Link href="/admin/logs">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                View Logs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Management Links */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Idea Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/ideas">
              <Button variant="outline" className="w-full justify-start">
                Manage All Ideas
              </Button>
            </Link>
            <Link href="/admin/ideas/new">
              <Button variant="outline" className="w-full justify-start">
                Create New Idea
              </Button>
            </Link>
            <Link href="/admin/ideas?filter=needs-scoring">
              <Button variant="outline" className="w-full justify-start">
                Ideas Needing Scores
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              System Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/daily-ideas">
              <Button variant="outline" className="w-full justify-start">
                Daily Ideas History
              </Button>
            </Link>
            <Link href="/admin/logs">
              <Button variant="outline" className="w-full justify-start">
                System Logs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg border p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="animate-pulse">
        <div className="bg-white rounded-lg border p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function AdminPage() {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/idea-of-the-day">
                <Button variant="outline">View Site</Button>
              </Link>
              <Link href="/auth/signout">
                <Button variant="ghost">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<AdminDashboardSkeleton />}>
          <AdminDashboard />
        </Suspense>
      </div>
    </div>
  )
}