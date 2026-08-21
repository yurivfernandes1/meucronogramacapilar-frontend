'use client'

import { useEffect } from 'react'

import { supabase } from '../lib/supabase'

export default function TrackingWrapper({ postId, blogId }: { postId: string, blogId: string }) {
  useEffect(() => {
    supabase.from('page_views').insert({
      blog_id: blogId,
      post_id: postId,
      page_path: window.location.pathname,
    }).then()
  }, [postId, blogId])

  return null
}
