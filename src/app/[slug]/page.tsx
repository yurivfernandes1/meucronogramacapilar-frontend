import { supabase } from '../../lib/supabase'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TrackingWrapper from '../../components/TrackingWrapper'
import { TrackingLink } from '../../components/TrackingLink'
import ProductCard from '../../components/ProductCard'
import CommentsSection from '../../components/CommentsSection'
import ShareButtons from '../../components/ShareButtons'
import Newsletter from '../../components/Newsletter'
import type { Metadata, ResolvingMetadata } from 'next'

import { hexToBase64 } from '../../lib/utils'

export const revalidate = 3600 // ISR

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image_blob')
    .eq('slug', slug)
    .single()
 
  if (!post) return {}
 
  const baseUrl = 'https://meucronogramacapilar.com.br'
 
  return {
    title: `${post.title} | Meu Cronograma Capilar`,
    description: post.excerpt,
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/${slug}`,
      type: 'article',
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

export default async function PostPage({ params, searchParams }: Props) {
  const { slug } = await params
  const resolvedSearchParams = (await searchParams) || {}
  const preview = resolvedSearchParams.preview
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  
  const decodedSlug = decodeURIComponent(slug)
  
  // 1. Buscar o Post
  let query = supabase
    .from('posts')
    .select('*, post_products( product_id, display_order )')
    .eq('slug', decodedSlug)

  if (preview !== 'true') {
    query = query.eq('status', 'published')
  }

  const { data: post, error } = await query.single()

  if (!post || error) notFound()

  // 2. Buscar os Detalhes dos Produtos associados
  let products: any[] = []
  if (post.post_products && post.post_products.length > 0) {
    const productIds = post.post_products.map((pp: any) => pp.product_id)
    const { data: productsData } = await supabase
      .from('products')
      .select('*, product_images(image_blob, image_mime, display_order)')
      .in('id', productIds)
      
    if (productsData) {
      // Ordenar conforme salvo no post_products
      products = post.post_products.map((pp: any) => 
        productsData.find((p: any) => p.id === pp.product_id)
      ).filter(Boolean)
    }
  }

  // 3. Buscar Artigos Recentes para a Sidebar
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('title, slug, created_at')
    .eq('status', 'published')
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const base64Image = hexToBase64(post.cover_image_blob)
  const imageUrl = base64Image && post.cover_image_mime 
    ? `data:${post.cover_image_mime};base64,${base64Image}`
    : 'https://via.placeholder.com/1920x1080?text=Cronograma+Capilar'

  const baseUrl = 'https://meucronogramacapilar.com.br'

  // Otimização SEO Avançada: Schema Markup (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': post.category === 'Review' ? 'Review' : 'Article',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: 'Scarllet Morais',
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: 'Meu Cronograma Capilar',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    datePublished: post.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${decodedSlug}`
    }
  }

  return (
    <article className="min-h-screen bg-pink-50/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackingWrapper postId={post.id} blogId={blogId} />
      
      {/* Premium Hero / Banner */}
      <div className="relative w-full h-auto min-h-[50vh] flex items-center justify-center pt-40 pb-20">
        <div className="absolute inset-0 bg-fuchsia-950">
          <img src={imageUrl} alt={post.title} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-950 via-fuchsia-950/40 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-12 text-center">
          {post.category && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-sm font-bold tracking-wider uppercase mb-6 glass-dark border-pink-400/30">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg mb-6">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-300 font-medium glass-dark rounded-full px-6 py-2 inline-flex border-white/10">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-slate-500">•</span>
            <span className="flex items-center text-pink-400">
              <svg className="w-5 h-5 mr-1.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {Math.max(3, Math.ceil((post.content?.length || 0) / 1000))} min de leitura
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-8 relative z-20 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-16">
            
            {(() => {
              // Pré-calcula quais produtos foram mencionados no post
              const mentionedProducts = products.length === 1 ? products : products.filter(p => {
                const titleStr = post.content?.toLowerCase() || '';
                const words = p.name.toLowerCase().split(/[\s-]+/).filter((w: string) => w.length > 2);
                let matchCount = 0;
                for (const w of words) {
                  if (titleStr.includes(w)) matchCount++;
                }
                return matchCount >= 2;
              });

              // Estado de renderização para espalhar imagens ao longo do texto
              const renderState = {
                activeProductId: null as string | null,
                pendingImages: [] as any[],
                pCount: 0,
                inFaq: false,
                renderedProductIds: new Set<string>()
              };

              const flushPendingImages = () => {
                if (renderState.pendingImages.length > 0) {
                  const imagesToFlush = [...renderState.pendingImages];
                  renderState.pendingImages = [];
                  return (
                    <>
                      {imagesToFlush.map((img, idx) => (
                        <div key={`flush-${idx}`} className="my-10 text-center">
                          <img src={img.url} alt={img.alt} className="w-full sm:w-3/4 mx-auto rounded-3xl shadow-xl border border-slate-100 object-cover max-h-[500px]" />
                        </div>
                      ))}
                    </>
                  );
                }
                return null;
              };

              const setProductAsActive = (matchedProduct: any) => {
                if (renderState.renderedProductIds.has(matchedProduct.id)) return null;
                
                const flushed = flushPendingImages(); // flush do produto anterior se houver
                
                renderState.activeProductId = matchedProduct.id;
                renderState.renderedProductIds.add(matchedProduct.id);
                renderState.pCount = 0;
                
                const allImages = [];
                
                if (matchedProduct.image_blob !== post.cover_image_blob) {
                  allImages.push({
                    url: `data:${matchedProduct.image_mime};base64,${hexToBase64(matchedProduct.image_blob)}`,
                    alt: `${matchedProduct.name} - Imagem Principal`
                  });
                }
                
                if (matchedProduct.product_images) {
                  const extras = [...matchedProduct.product_images]
                    .sort((a: any, b: any) => a.display_order - b.display_order)
                    .map((img: any, idx: number) => ({
                      url: `data:${img.image_mime};base64,${hexToBase64(img.image_blob)}`,
                      alt: `${matchedProduct.name} - Detalhe ${idx + 1}`
                    }));
                  allImages.push(...extras);
                }
                
                renderState.pendingImages = allImages;
                return flushed;
              };

              const checkHeadingForProduct = (children: any) => {
                if (renderState.inFaq) return null;
                
                // Se for um post de 1 único produto, o primeiro H2 (que não for FAQ) ativa ele!
                if (products.length === 1) {
                  return setProductAsActive(products[0]);
                }
                
                const titleStr = String(children).toLowerCase();
                let matchedProduct = null;
                let maxMatchCount = 0;
                
                for (const p of products) {
                  const words = p.name.toLowerCase().split(/[\s-]+/).filter((w: string) => w.length > 2);
                  let matchCount = 0;
                  for (const w of words) {
                    if (titleStr.includes(w)) matchCount++;
                  }
                  
                  if (matchCount > maxMatchCount && matchCount >= 2) {
                    maxMatchCount = matchCount;
                    matchedProduct = p;
                  }
                }

                if (matchedProduct) {
                  return setProductAsActive(matchedProduct);
                }
                return null;
              };

              return (
                <>
                  {/* Excerpt Exclusivo */}
                  <div className="p-8 sm:p-12 pb-0">
                    <p className="text-xl sm:text-2xl text-slate-600 font-light leading-relaxed italic border-l-4 border-pink-500 pl-6 mb-8">
                      "{post.excerpt}"
                    </p>
                    <ShareButtons title={post.title} text={post.excerpt || ''} products={mentionedProducts} />
                  </div>

                  {/* Foto Principal do Post */}
                  {post.cover_image_blob && post.cover_image_mime && (
                    <div className="px-8 sm:px-12 mt-8">
                      <img 
                        src={`data:${post.cover_image_mime};base64,${hexToBase64(post.cover_image_blob)}`}
                        alt={post.title}
                        className="w-full rounded-2xl shadow-lg object-cover max-h-[600px]"
                      />
                    </div>
                  )}

                  {/* Conteúdo Markdown com Tailwind Typography */}
                  <div className="p-8 sm:p-12 prose prose-lg prose-slate prose-headings:text-slate-900 prose-a:text-pink-600 hover:prose-a:text-pink-500 prose-img:rounded-2xl prose-img:shadow-md max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({node, children, ...props}) => {
                          const titleStr = String(children).toLowerCase();
                          if (titleStr.includes('faq') || titleStr.includes('perguntas')) {
                            const flushed = flushPendingImages();
                            renderState.inFaq = true;
                            renderState.activeProductId = null;
                            return <>{flushed}<h2 {...props}>{children}</h2></>;
                          } else {
                            const flushed = checkHeadingForProduct(children);
                            return <>{flushed}<h2 {...props}>{children}</h2></>;
                          }
                        },
                        h3: ({node, children, ...props}) => {
                          const flushed = checkHeadingForProduct(children);
                          return <>{flushed}<h3 {...props}>{children}</h3></>;
                        },
                        p: ({node, children, ...props}) => {
                          let injectedImage = null;
                          let injectedCta = null;
                          
                          if (renderState.activeProductId) {
                            renderState.pCount++;
                            
                            if (renderState.pCount === 1) {
                              const activeProd = products.find((p: any) => p.id === renderState.activeProductId);
                              if (activeProd) {
                                injectedCta = (
                                  <div className="my-8 flex justify-center w-full">
                                    <TrackingLink 
                                      href={activeProd.shopee_url}
                                      blogId={blogId}
                                      postId={post.id}
                                      productId={activeProd.id}
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 !text-white font-extrabold text-lg rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105 no-underline"
                                    >
                                      🔥 Conferir Preço com Desconto
                                    </TrackingLink>
                                  </div>
                                );
                              }
                            }

                            if (renderState.pCount % 2 !== 0 && renderState.pendingImages.length > 0) {
                              const img = renderState.pendingImages.shift();
                              injectedImage = (
                                <div className="my-10 text-center">
                                  <img src={img.url} alt={img.alt} className="w-full sm:w-3/4 mx-auto rounded-3xl shadow-xl border border-slate-100 object-cover max-h-[500px]" />
                                </div>
                              );
                            }
                          }
                          
                          return (
                            <>
                              <p className="text-slate-600 leading-relaxed my-6 text-lg" {...props}>{children}</p>
                              {injectedImage}
                              {injectedCta}
                            </>
                          );
                        },
                        blockquote: ({node, children, ...props}) => (
                          <div className="bg-pink-50 border-l-4 border-pink-500 p-5 my-8 rounded-r-xl shadow-sm">
                            <div className="text-pink-900 text-base font-medium leading-relaxed [&>p]:m-0">
                              {children}
                            </div>
                          </div>
                        ),
                        table: ({node, children, ...props}) => (
                          <div className="overflow-x-auto my-10 rounded-xl shadow-sm border border-slate-200">
                            <table className="w-full text-sm text-left text-slate-600 bg-white" {...props}>
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({node, children, ...props}) => (
                          <thead className="bg-slate-50 text-slate-900 uppercase font-semibold text-xs" {...props}>{children}</thead>
                        ),
                        th: ({node, children, ...props}) => (
                          <th className="px-6 py-4 border-b border-slate-200" {...props}>{children}</th>
                        ),
                        td: ({node, children, ...props}) => (
                          <td className="px-6 py-4 border-b border-slate-100" {...props}>{children}</td>
                        ),
                        tr: ({node, children, ...props}) => (
                          <tr className="hover:bg-slate-50/50 transition-colors" {...props}>{children}</tr>
                        )
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>

                    {/* Flush final caso o texto acabe e ainda tenham imagens pendentes */}
                    {flushPendingImages()}
                  </div>
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="px-8 sm:px-12 pb-12">
                      <div className="flex items-center flex-wrap gap-2 pt-8 border-t border-slate-100">
                        <span className="text-slate-500 text-sm font-semibold mr-2 uppercase tracking-wider">Tags:</span>
                        {post.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-sm font-medium hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share no fim do post */}
                  <div className="px-8 sm:px-12 pb-12">
                    <ShareButtons title={post.title} text={post.excerpt || ''} products={mentionedProducts} />
                  </div>
                </>
              )
            })()}
          </div>

          {/* Lista de Produtos (Cards Premium) */}
          {products.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-slate-900">
                  Produtos Recomendados
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="transform hover:-translate-y-1 transition-transform duration-300">
                    <ProductCard product={product} postId={post.id} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comentários */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12 mb-16">
            <CommentsSection postId={post.id} />
          </div>
        </div>

        {/* Sidebar Estilo WordPress */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Widget: Pesquisa (Placeholder) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Pesquisar</h3>
            <div className="flex">
              <input type="text" placeholder="Buscar artigos..." className="w-full px-4 py-2 border border-slate-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
              <button className="bg-pink-600 text-white px-4 py-2 rounded-r-lg hover:bg-pink-700">Ir</button>
            </div>
          </div>

          {/* Widget: Sobre o Autor */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-pink-500 to-rose-300 rounded-full mb-4 shadow-md flex items-center justify-center text-white font-bold text-2xl">
              MC
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Meu Cronograma</h3>
            <p className="text-slate-600 text-sm">Somos apaixonados por cabelos saúdaveis. Testamos e avaliamos os melhores produtos para transformar os seus fios.</p>
          </div>

          <Newsletter />

          {/* Widget: Artigos Recentes */}
          {recentPosts && recentPosts.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Artigos Recentes</h3>
              <ul className="space-y-4">
                {recentPosts.map((rp: any) => (
                  <li key={rp.slug}>
                    <a href={`/${rp.slug}`} className="text-slate-700 font-medium hover:text-pink-600 transition-colors line-clamp-2">
                      {rp.title}
                    </a>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {new Date(rp.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Widget: Categorias/Tags (Reaproveitando tags do post) */}
          {post.tags && post.tags.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Tópicos Populares</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <a href={`/?tag=${tag}`} key={tag} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-md text-xs font-semibold hover:bg-pink-50 hover:text-pink-600 transition-colors">
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  )
}
