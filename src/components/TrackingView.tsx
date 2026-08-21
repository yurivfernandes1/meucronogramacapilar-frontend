'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

interface TrackingViewProps {
  blogId: string
  postId?: string
  pagePath: string
}

export function TrackingView({ blogId, postId, pagePath }: TrackingViewProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    const trackView = async () => {
      try {
        await supabase.from('page_views').insert({
          blog_id: blogId,
          post_id: postId || null,
          page_path: pagePath,
        })
      } catch (err) {
        console.error('Failed to track view', err)
      }
    }

    trackView()
  }, [blogId, postId, pagePath])

  return null // Renderiza nada, apenas faz o tracking
}
