import { MetadataRoute } from 'next'
import { supabase } from '../lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://meucronogramacapilar.com.br'

  // Rotas fixas
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  // Buscar posts ativos
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('blog_id', blogId)
    .eq('status', 'published')

  const postRoutes = (posts || []).map((post) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...routes, ...postRoutes]
}
