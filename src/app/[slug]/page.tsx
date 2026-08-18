import { supabase } from '../../lib/supabase'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import TrackingWrapper from '../../components/TrackingWrapper'
import ProductCard from '../../components/ProductCard'
import CommentsSection from '../../components/CommentsSection'
import type { Metadata, ResolvingMetadata } from 'next'

export const revalidate = 3600 // ISR

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image_blob')
    .eq('slug', slug)
    .single()
 
  if (!post) return {}
 
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')
  
  return posts?.map((post) => ({
    slug: post.slug,
  })) || []
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  
  // 1. Buscar o Post
  const { data: post } = await supabase
    .from('posts')
    .select('*, post_products( product_id, display_order )')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  // 2. Buscar os Detalhes dos Produtos associados
  let products: any[] = []
  if (post.post_products && post.post_products.length > 0) {
    const productIds = post.post_products.map((pp: any) => pp.product_id)
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)
      
    if (productsData) {
      // Ordenar conforme salvo no post_products
      products = post.post_products.map((pp: any) => 
        productsData.find((p: any) => p.id === pp.product_id)
      ).filter(Boolean)
    }
  }

  const imageUrl = post.cover_image_blob && post.cover_image_mime 
    ? `data:${post.cover_image_mime};base64,${post.cover_image_blob.replace('\\x', '')}`
    : null

  return (
    <article className="max-w-4xl mx-auto bg-white shadow-xl min-h-screen">
      <TrackingWrapper postId={post.id} blogId={blogId} />
      
      {/* Header do Post */}
      <header className="pt-16 pb-8 px-6 sm:px-12 text-center border-b">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto italic">
          {post.excerpt}
        </p>
        <div className="mt-6 text-sm text-pink-600 font-semibold uppercase tracking-wider">
          {new Date(post.created_at).toLocaleDateString('pt-BR')}
        </div>
      </header>

      {/* Capa */}
      {imageUrl && (
        <div className="w-full h-64 sm:h-96 relative overflow-hidden">
          <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Conteúdo Markdown */}
      <div className="prose prose-pink prose-lg max-w-none px-6 sm:px-12 py-12">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Lista de Produtos (Cards) */}
      {products.length > 0 && (
        <div className="px-6 sm:px-12 py-8 bg-gray-50 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Produtos Recomendados neste Artigo
          </h2>
          <div className="space-y-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} postId={post.id} />
            ))}
          </div>
        </div>
      )}

      {/* Comentários */}
      <div className="px-6 sm:px-12 pb-12">
        <CommentsSection postId={post.id} />
      </div>
    </article>
  )
}
