import { supabase } from '../lib/supabase'
import Link from 'next/link'

export const revalidate = 3600 // ISR: revalida a cada 1 hora

export default async function Home() {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  
  // Buscar os últimos posts publicados deste blog
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, created_at, cover_image_blob, cover_image_mime')
    .eq('blog_id', blogId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div>
      {/* Banner Principal */}
      <section className="bg-pink-50 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Descubra o Cronograma Perfeito para Seus Cabelos
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Dicas, tutoriais e reviews sinceros dos melhores produtos para hidratação, nutrição e reconstrução.
          </p>
        </div>
      </section>

      {/* Lista de Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 border-gray-200">
          Últimos Artigos
        </h3>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => {
            const imageUrl = post.cover_image_blob && post.cover_image_mime 
              ? `data:${post.cover_image_mime};base64,${post.cover_image_blob.replace('\\x', '')}`
              : 'https://via.placeholder.com/600x400?text=Blog'

            return (
              <Link key={post.id} href={`/${post.slug}`} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 w-full bg-gray-200 relative overflow-hidden">
                  <img src={imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs text-pink-600 font-semibold mb-2">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="text-pink-600 font-medium text-sm inline-flex items-center">
                    Ler artigo completo
                    <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}

          {(!posts || posts.length === 0) && (
            <p className="text-gray-500 col-span-full py-12 text-center">Nenhum artigo publicado ainda.</p>
          )}
        </div>
      </section>
    </div>
  )
}
