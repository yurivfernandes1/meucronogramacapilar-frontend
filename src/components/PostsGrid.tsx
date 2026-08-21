'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import Base64Image from './Base64Image'
import { hexToBase64 } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const PAGE_SIZE = 6

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  tags: string[] | null
  created_at: string
  cover_image_blob: string | null
  cover_image_mime: string | null
}

interface PostsGridProps {
  initialPosts: Post[]
  allCategories: string[]
  blogId: string
  accentColor: 'blue' | 'pink'
}

function readingTime(excerpt: string | null): string {
  if (!excerpt) return '1 min de leitura'
  const words = excerpt.trim().split(/\s+/).length
  const mins = Math.max(1, Math.ceil(words / 30)) // excerpt is short, estimate ~5-8 min full article
  return `${mins * 5} min de leitura`
}

export default function PostsGrid({ initialPosts, allCategories, blogId, accentColor }: PostsGridProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialPosts.length >= PAGE_SIZE)
  const [offset, setOffset] = useState(initialPosts.length)

  const isPink = accentColor === 'pink'

  const loadMore = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('id, title, slug, excerpt, category, tags, created_at, cover_image_blob, cover_image_mime')
      .eq('blog_id', blogId)
      .eq('status', 'published')
      .neq('slug', '')
      .order('created_at', { ascending: false })
      .range(offset + 1, offset + PAGE_SIZE) // +1 to skip hero post

    if (activeCategory) {
      query = query.eq('category', activeCategory)
    }

    const { data } = await query
    if (data) {
      setPosts(prev => [...prev, ...data])
      setOffset(prev => prev + data.length)
      setHasMore(data.length >= PAGE_SIZE)
    }
    setLoading(false)
  }, [blogId, offset, activeCategory])

  const handleCategoryChange = useCallback(async (cat: string | null) => {
    setActiveCategory(cat)
    setLoading(true)

    if (cat === null) {
      setPosts(initialPosts)
      setOffset(initialPosts.length)
      setHasMore(initialPosts.length >= PAGE_SIZE)
    } else {
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, category, tags, created_at, cover_image_blob, cover_image_mime')
        .eq('blog_id', blogId)
        .eq('status', 'published')
        .neq('slug', '')
        .eq('category', cat)
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1)

      if (data) {
        setPosts(data)
        setOffset(data.length)
        setHasMore(data.length >= PAGE_SIZE)
      }
    }
    setLoading(false)
  }, [blogId, initialPosts])

  return (
    <div>
      {/* Category Filter Pills */}
      {allCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
              activeCategory === null
                ? isPink
                  ? 'text-pink-600 border-pink-500 bg-white shadow-sm shadow-pink-100'
                  : 'text-blue-600 border-blue-500 bg-white shadow-sm shadow-blue-100'
                : 'text-slate-500 border-transparent bg-white/60 hover:border-slate-200'
            }`}
          >
            Todos
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                activeCategory === cat
                  ? isPink
                    ? 'text-pink-600 border-pink-500 bg-white shadow-sm shadow-pink-100'
                    : 'text-blue-600 border-blue-500 bg-white shadow-sm shadow-blue-100'
                  : 'text-slate-500 border-transparent bg-white/60 hover:border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Posts Grid — alternating large/small */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post, index) => {
          const isLarge = index % 7 === 0
          const base64 = post.cover_image_blob ? hexToBase64(post.cover_image_blob) : null

          return (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className={`group flex flex-col bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                isLarge ? 'sm:col-span-2' : ''
              } ${isPink ? 'border-pink-100' : 'border-slate-100'}`}
            >
              {/* Image */}
              <div className={`w-full relative overflow-hidden ${
                isLarge ? 'h-64 sm:h-[420px]' : 'h-52'
              } ${isPink ? 'bg-pink-50' : 'bg-slate-200'}`}>
                <Base64Image
                  base64={base64}
                  mime={post.cover_image_mime}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  fallback={isPink ? 'https://via.placeholder.com/800x400?text=Cronograma+Capilar' : 'https://via.placeholder.com/800x400?text=Setup+Caseiro'}
                />
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <span className={`glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                      isPink ? 'bg-white/80 text-pink-900' : 'bg-white/80 text-slate-900'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`flex flex-col flex-1 ${isLarge ? 'p-8 sm:p-10' : 'p-6'}`}>
                <div className={`text-xs font-semibold mb-3 flex items-center gap-3 ${isPink ? 'text-pink-500' : 'text-blue-500'}`}>
                  <span>
                    {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>{readingTime(post.excerpt)}</span>
                </div>
                <h3 className={`font-bold text-slate-900 mb-3 transition-colors leading-tight ${
                  isLarge ? 'text-2xl sm:text-3xl' : 'text-xl'
                } ${isPink ? 'group-hover:text-pink-600' : 'group-hover:text-blue-600'}`}>
                  {post.title}
                </h3>
                <p className="text-slate-500 line-clamp-3 mb-4 flex-1 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <span className={`font-semibold inline-flex items-center text-sm group-hover:translate-x-1 transition-transform ${
                    isPink ? 'text-pink-600' : 'text-blue-600'
                  }`}>
                    Ler artigo
                    <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty state */}
      {posts.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-400">
          <p className="text-lg">Nenhum artigo encontrado nessa categoria.</p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className={`inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg ${
              isPink
                ? 'bg-pink-600 hover:bg-pink-500'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Carregando...
              </>
            ) : (
              <>
                Carregar mais artigos
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && posts.length > PAGE_SIZE && (
        <p className="mt-10 text-center text-slate-400 text-sm">
          🎉 Você chegou ao fim! Todos os artigos foram carregados.
        </p>
      )}
    </div>
  )
}
