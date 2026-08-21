import { supabase } from '../lib/supabase'
import { hexToBase64 } from '../lib/utils'
import Link from 'next/link'
import Newsletter from '../components/Newsletter'
import Base64Image from '../components/Base64Image'
import PostsGrid from '../components/PostsGrid'

export const revalidate = 3600 // ISR: revalida a cada 1 hora

const PAGE_SIZE = 6

function estimateReadingTime(excerpt: string | null): string {
  if (!excerpt) return '5 min de leitura'
  const words = excerpt.trim().split(/\s+/).length
  const mins = Math.max(3, words * 5)
  return `${Math.min(mins, 15)} min de leitura`
}

export default async function Home() {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, category, tags, created_at, cover_image_blob, cover_image_mime')
    .eq('blog_id', blogId)
    .eq('status', 'published')
    .neq('slug', '')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE + 1)

  const heroPost = posts?.[0]
  const initialPosts = posts?.slice(1) || []

  const { data: allPostsMeta } = await supabase
    .from('posts')
    .select('category, tags')
    .eq('blog_id', blogId)
    .eq('status', 'published')
    .neq('slug', '')

  const categories = Array.from(new Set(allPostsMeta?.map(p => p.category).filter(Boolean) as string[]))
  const allTags = allPostsMeta?.flatMap(p => p.tags || []) || []
  const topTags = Array.from(new Set(allTags)).slice(0, 8)

  return (
    <div className="min-h-screen bg-pink-50/30">
      {/* Premium Hero Section */}
      {heroPost && (
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden">
          <div className="absolute inset-0 bg-fuchsia-950">
            {heroPost.cover_image_blob && (
              <Base64Image
                base64={hexToBase64(heroPost.cover_image_blob)}
                mime={heroPost.cover_image_mime}
                alt={heroPost.title}
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-950 via-fuchsia-950/60 to-transparent" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {heroPost.category && (
              <span className="inline-block px-4 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm font-semibold tracking-wider uppercase mb-6 glass-dark border border-pink-400/30">
                {heroPost.category}
              </span>
            )}
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-md max-w-4xl mx-auto leading-tight">
              {heroPost.title}
            </h1>
            {/* Meta */}
            <div className="mt-5 flex items-center justify-center gap-3 text-pink-300/70 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{new Date(heroPost.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span className="text-pink-900">•</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{estimateReadingTime(heroPost.excerpt)}</span>
            </div>
            <p className="mt-4 text-xl text-pink-200 max-w-2xl mx-auto font-light">
              {heroPost.excerpt}
            </p>
            <div className="mt-10">
              <Link
                href={`/${heroPost.slug}`}
                className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-pink-600 hover:bg-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25"
              >
                Ler Artigo Completo
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* Posts Grid */}
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            <span className="bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent">Últimos Artigos</span>
          </h2>
          
          <PostsGrid
            initialPosts={initialPosts}
            allCategories={categories}
            blogId={blogId}
            accentColor="pink"
          />
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
                <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
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
