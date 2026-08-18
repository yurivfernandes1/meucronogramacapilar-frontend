'use client'

import { useEffect } from 'react'

export default function TrackingWrapper({ postId, blogId }: { postId: string, blogId: string }) {
  useEffect(() => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/track-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          blog_id: blogId,
          post_id: postId,
          page_path: window.location.pathname,
          referrer_url: document.referrer || '',
        })
      })
    } catch (e) {
      // Ignorar erros
    }
  }, [postId, blogId])

  return null
}
