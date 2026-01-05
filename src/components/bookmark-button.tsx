'use client'

import { useState, useEffect, useMemo } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface BookmarkButtonProps {
  ideaId: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
}

export function BookmarkButton({
  ideaId,
  variant = 'outline',
  size = 'sm',
  className = '',
  showLabel = true
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAuthAndBookmarkStatus()
  }, [ideaId])

  async function checkAuthAndBookmarkStatus() {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setIsAuthenticated(false)
        return
      }

      setIsAuthenticated(true)

      // Fetch user's bookmarks
      const response = await fetch('/api/bookmarks')
      if (response.ok) {
        const data = await response.json()
        const bookmarked = data.bookmarks?.some((b: any) => b.ideaId === ideaId)
        setIsBookmarked(bookmarked)
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error)
    }
  }

  async function handleBookmarkClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    console.log('[Bookmark Debug] Button clicked', { ideaId, isAuthenticated, isBookmarked })

    if (!isAuthenticated) {
      console.log('[Bookmark Debug] Not authenticated, redirecting to signin')
      router.push('/auth/signin')
      return
    }

    console.log('[Bookmark Debug] User is authenticated, proceeding with bookmark action')
    setIsLoading(true)

    try {
      if (isBookmarked) {
        // Remove bookmark
        console.log('[Bookmark Debug] Removing bookmark for idea:', ideaId)
        const response = await fetch(`/api/bookmarks?ideaId=${ideaId}`, {
          method: 'DELETE',
        })

        console.log('[Bookmark Debug] Delete response status:', response.status)

        if (response.ok) {
          setIsBookmarked(false)
          console.log('[Bookmark Debug] Bookmark removed successfully')
        } else {
          const error = await response.json()
          console.error('Failed to remove bookmark:', error)
          alert(error.error || 'Failed to remove bookmark')
        }
      } else {
        // Add bookmark
        console.log('[Bookmark Debug] Adding bookmark for idea:', ideaId)
        const response = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ideaId }),
        })

        console.log('[Bookmark Debug] Add response status:', response.status)

        if (response.ok) {
          setIsBookmarked(true)
          console.log('[Bookmark Debug] Bookmark added successfully')
        } else {
          const error = await response.json()
          console.error('Failed to add bookmark:', error)
          alert(error.error || 'Failed to add bookmark')
        }
      }
    } catch (error) {
      console.error('[Bookmark Debug] Error toggling bookmark:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
      console.log('[Bookmark Debug] Finished bookmark operation')
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBookmarkClick}
      disabled={isLoading}
      className={className}
    >
      <Bookmark
        className={`w-4 h-4 ${showLabel ? 'mr-1' : ''} ${
          isBookmarked ? 'fill-blue-500 text-blue-500' : ''
        }`}
      />
      {showLabel && (isBookmarked ? 'Bookmarked' : 'Bookmark')}
    </Button>
  )
}
