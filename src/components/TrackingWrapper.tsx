'use client'
import { useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'

export default function TrackingWrapper({ postId, blogId }: { postId: string, blogId: string }) {
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    const trackKey = `${postId}-${window.location.pathname}`
    if (lastTracked.current === trackKey) return
    lastTracked.current = trackKey

    supabase.from('page_views').insert({
      blog_id: blogId,
      post_id: postId,
      page_path: window.location.pathname,
    }).then()
  }, [postId, blogId])

  return null
}
