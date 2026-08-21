'use client'

import React from 'react'
import { hexToBase64 } from '../lib/utils'

export default function InlineGallery({ product }: { product: any }) {
  if (!product.product_images || product.product_images.length === 0) {
    return null
  }

  // Juntar imagem principal com as extras
  const allImages = [
    {
      url: `data:${product.image_mime};base64,${hexToBase64(product.image_blob)}`,
      mime: product.image_mime
    },
    ...[...product.product_images]
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((img: any) => ({
        url: `data:${img.image_mime};base64,${hexToBase64(img.image_blob)}`,
        mime: img.image_mime
      }))
  ]

  if (allImages.length === 0) return null

  return (
    <div className="my-8 flex gap-4 overflow-x-auto snap-x pb-4">
      {allImages.map((img, idx) => (
        <div key={idx} className="shrink-0 w-64 h-64 snap-center bg-pink-50 rounded-2xl p-4 border border-pink-100 shadow-sm flex items-center justify-center">
          <img src={img.url} alt={`${product.name} foto ${idx + 1}`} className="max-w-full max-h-full object-contain rounded-xl" />
        </div>
      ))}
    </div>
  )
}
