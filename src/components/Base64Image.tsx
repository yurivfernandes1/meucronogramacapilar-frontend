'use client'

import { useState, useEffect } from 'react'

interface Props {
  base64: string | null
  mime: string | null
  alt: string
  className?: string
  fallback?: string
}

export default function Base64Image({ base64, mime, alt, className, fallback = 'https://via.placeholder.com/600x400?text=Carregando...' }: Props) {
  const [src, setSrc] = useState(fallback)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (base64 && mime) {
      setSrc(`data:${mime};base64,${base64}`)
    } else if (base64) {
      setSrc(base64) // Caso seja apenas uma URL
    } else {
      setSrc('https://via.placeholder.com/600x400?text=Sem+Foto')
    }
  }, [base64, mime])

  // SSR renders fallback to avoid huge base64 src attribute breaking Cloudflare HTML Minifier
  return <img src={mounted ? src : fallback} alt={alt} className={className} />
}
