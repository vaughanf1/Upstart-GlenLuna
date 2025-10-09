import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.roles?.includes('admin')) {
    redirect('/auth/signin')
  }

  return session
}

export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return session?.user?.roles?.includes('admin') || false
}