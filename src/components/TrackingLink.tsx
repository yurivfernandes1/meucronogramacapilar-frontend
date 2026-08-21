'use client'

import { supabase } from '../lib/supabase'

interface TrackingLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  blogId: string
  postId?: string
  productId?: string
}

export function TrackingLink({ blogId, postId, productId, onClick, href, ...props }: TrackingLinkProps) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      // Registrar o clique assincronamente (sem bloquear a navegação)
      supabase.from('link_clicks').insert({
        blog_id: blogId,
        post_id: postId || null,
        product_id: productId || null,
      }).then()
    } catch (err) {
      console.error('Failed to track click', err)
    }

    if (onClick) {
      onClick(e)
    }
  }

  return (
    <a href={href} onClick={handleClick} {...props} />
  )
}
