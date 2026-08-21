import { supabase } from '../../lib/supabase'
import { hexToBase64 } from '../../lib/utils'
import ProductsClient from './ProductsClient'

export const revalidate = 3600 // ISR: revalida a cada 1 hora

export default async function ProdutosPage() {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  
  // Buscar os IDs dos posts publicados neste blog
  const { data: posts } = await supabase
    .from('posts')
    .select('id')
    .eq('blog_id', blogId)
    .eq('status', 'published')

  const postIds = posts?.map(p => p.id) || []

  // Buscar os produtos vinculados a esses posts
  const { data: postProducts } = await supabase
    .from('post_products')
    .select(`
      product_id,
      products (
        id, name, description, shopee_url, price_range, category, image_blob, image_mime, is_active
      )
    `)
    .in('post_id', postIds)

  // Extrair produtos únicos e ativos
  const productsMap = new Map<string, any>()
  if (postProducts) {
    postProducts.forEach(pp => {
      const prod = pp.products as any
      if (prod && prod.is_active && !productsMap.has(prod.id)) {
        productsMap.set(prod.id, prod)
      }
    })
  }

  // Pre-calculate base64 images on the server to pass to the client component
  const initialProducts = Array.from(productsMap.values()).map(p => ({
    ...p,
    base64Image: p.image_blob ? hexToBase64(p.image_blob) : null,
    // Remover o image_blob gigante para não trafegar para o client side
    image_blob: undefined 
  }))

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Nossas Recomendações
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Os melhores produtos testados e aprovados para o seu cronograma capilar.
          </p>
        </div>

        <ProductsClient initialProducts={initialProducts} />
        
      </div>
    </div>
  )
}
