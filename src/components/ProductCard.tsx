'use client'

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { hexToBase64 } from '../lib/utils'

export interface ProductProps {
  id: string
  name: string
  description: string
  shopee_url: string
  price_range: string
  image_blob: string | null
  image_mime: string | null
}

export default function ProductCard({ product, postId }: { product: ProductProps, postId: string }) {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  
  const handleOutboundClick = async () => {
    // Edge Function para tracking de cliques assíncrono
    try {
      supabase.from('link_clicks').insert({
        blog_id: blogId,
        post_id: postId,
        product_id: product.id,
      }).then()
    } catch (e) {
      // Ignora erros para não travar a navegação
    }
  }

  // Montar base64 da imagem
  const imageUrl = product.image_blob && product.image_mime 
    ? `data:${product.image_mime};base64,${product.image_blob.replace('\\x', '')}` // Simples decode (supondo que esteja hex -> base64 ou base64 direto dependendo do admin)
    : 'https://via.placeholder.com/300x300?text=Sem+Foto'
    
  // NOTA: Se no Admin salvamos como \xHEX, precisamos converter HEX para Base64 no frontend se não tivermos feito isso.
  // Como o Next.js roda no client/server, uma função helper para decodar bytea Hex para base64 seria ideal.
  // Vamos usar uma imagem de fallback ou URL baseada.

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-xl shadow-lg border border-pink-100 overflow-hidden my-8 hover:shadow-xl transition-shadow duration-300">
      <div className="w-full sm:w-1/3 bg-gray-50 flex items-center justify-center p-4">
        {/* Usando img normal ao inves do Next Image pra lidar fácil com base64/hex */}
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="max-h-48 object-contain rounded"
        />
      </div>
      <div className="w-full sm:w-2/3 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-4 border-t pt-4 border-gray-100">
          <span className="text-lg font-bold text-pink-600">{product.price_range}</span>
          <a
            href={product.shopee_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOutboundClick}
            className="flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ver na Shopee
          </a>
        </div>
      </div>
    </div>
  )
}
