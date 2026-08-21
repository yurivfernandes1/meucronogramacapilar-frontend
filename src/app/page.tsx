import { supabase } from '../lib/supabase'
import { hexToBase64 } from '../lib/utils'
import Link from 'next/link'
import Newsletter from '../components/Newsletter'

export const revalidate = 3600 // ISR: revalida a cada 1 hora

export default async function Home() {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, category, tags, created_at, cover_image_blob, cover_image_mime')
    .eq('blog_id', blogId)
    .eq('status', 'published')
    .neq('slug', '')
    .order('created_at', { ascending: false })
    .limit(10)

  const heroPost = posts?.[0]
  const recentPosts = posts?.slice(1) || []

  // Extract unique categories and tags
  const categories = Array.from(new Set(posts?.map(p => p.category).filter(Boolean) as string[]))
  const allTags = posts?.flatMap(p => p.tags || []) || []
  const topTags = Array.from(new Set(allTags)).slice(0, 8)

  return (
    <div className="min-h-screen bg-pink-50/30">
      {/* Premium Hero Section */}
      {heroPost && (
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          <div className="absolute inset-0 bg-fuchsia-950">
            {heroPost.cover_image_blob && heroPost.cover_image_mime && (
              <img 
                src={`data:${heroPost.cover_image_mime};base64,${hexToBase64(heroPost.cover_image_blob)}`} 
                alt={heroPost.title}
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-950 via-fuchsia-950/60 to-transparent" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {heroPost.category && (
              <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm font-semibold tracking-wider uppercase mb-6 glass-dark border-pink-400/30">
                {heroPost.category}
              </span>
            )}
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md max-w-4xl mx-auto leading-tight">
              {heroPost.title}
            </h1>
            <p className="mt-6 text-xl text-pink-200 max-w-2xl mx-auto font-light">
              {heroPost.excerpt}
            </p>
            <div className="mt-10">
              <Link href={`/${heroPost.slug}`} className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-pink-600 hover:bg-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25">
                Ler Artigo Completo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Category Navbar */}
      {categories.length > 0 && (
        <div className="sticky top-0 z-50 glass border-b border-pink-200/50 backdrop-blur-xl bg-white/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 overflow-x-auto py-4 scrollbar-hide">
              <button className="text-pink-600 font-semibold whitespace-nowrap border-b-2 border-pink-600 px-1 pb-1">Todos</button>
              {categories.map(cat => (
                <button key={cat} className="text-slate-500 hover:text-slate-900 font-medium whitespace-nowrap transition-colors px-1 pb-1">{cat}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Posts Grid */}
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 flex items-center">
            <span className="bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent">Últimos Artigos</span>
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-2">
            {recentPosts.map((post) => {
              const base64Image = hexToBase64(post.cover_image_blob)
              const imageUrl = base64Image && post.cover_image_mime 
                ? `data:${post.cover_image_mime};base64,${base64Image}`
                : 'https://via.placeholder.com/600x400?text=Cronograma+Capilar'

              return (
                <Link key={post.id} href={`/${post.slug}`} className="group flex flex-col bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                  <div className="h-56 w-full bg-pink-50 relative overflow-hidden">
                    <img src={imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    {post.category && (
                      <div className="absolute top-4 left-4">
                        <span className="glass bg-white/80 text-pink-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="text-sm text-pink-500 font-semibold mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-pink-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-3 mb-6 flex-1 text-base leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto">
                      <span className="text-pink-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                        Ler artigo 
                        <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-10">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Sobre o Cronograma</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              O seu guia definitivo para cuidar da saúde dos seus fios. Dicas de hidratação, nutrição e reconstrução.
            </p>
            <div className="w-full h-1 bg-gradient-to-r from-pink-100 to-transparent rounded-full" />
          </div>

          <Newsletter />

          {topTags.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                Tags Populares
              </h3>
              <div className="flex flex-wrap gap-2">
                {topTags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-pink-50 border border-pink-200 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-100 hover:text-pink-800 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

      </div>
    </div>
  )
}
