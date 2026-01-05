'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  title: string
  description?: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
  label?: string
  copiedLabel?: string
}

export function ShareButton({
  title,
  description,
  variant = 'outline',
  size = 'sm',
  className = '',
  showLabel = true,
  label = 'Share',
  copiedLabel = 'Copied!',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href

    try {
      // Try to use the Web Share API if available (mobile)
      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url: url,
        })
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      // If all else fails, try clipboard
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to share:', err)
      }
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
    >
      {copied ? (
        <>
          <Check className={`w-4 h-4 ${showLabel && size === 'lg' ? 'mr-2' : showLabel ? 'mr-1' : ''}`} />
          {showLabel && copiedLabel}
        </>
      ) : (
        <>
          <Share2 className={`w-4 h-4 ${showLabel && size === 'lg' ? 'mr-2' : showLabel ? 'mr-1' : ''}`} />
          {showLabel && label}
        </>
      )}
    </Button>
  )
}
