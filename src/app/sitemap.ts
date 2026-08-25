import { MetadataRoute } from 'next'
import { supabase } from '../lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://meucronogramacapilar.com.br'
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'

  // Rotas fixas
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/produtos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Buscar posts ativos
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('blog_id', blogId)
    .eq('status', 'published')

  const postRoutes: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Buscar produtos ativos
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('blog_id', blogId)
    .eq('active', true)

  const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${baseUrl}/produtos/${p.id}`,
    lastModified: new Date(p.updated_at || new Date()),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...routes, ...postRoutes, ...productRoutes]
}
