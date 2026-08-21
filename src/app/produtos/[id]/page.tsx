import { supabase } from '../../../lib/supabase'
import { hexToBase64 } from '../../../lib/utils'
import { notFound } from 'next/navigation'
import { ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react'
import TrackingWrapper from '../../../components/TrackingWrapper'

export const revalidate = 3600 // ISR

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID || 'dummy-blog-id'
  
  // 1. Buscar o Produto
  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_images(image_blob, image_mime, display_order)')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const base64Image = product.image_blob ? hexToBase64(product.image_blob) : null
  const mainImageUrl = base64Image && product.image_mime 
    ? `data:${product.image_mime};base64,${base64Image}`
    : 'https://via.placeholder.com/600x600?text=Sem+Foto'

  // Montar array com todas as imagens (a principal + as extras)
  let allImages = [{ url: mainImageUrl, mime: product.image_mime }]
  
  if (product.product_images && product.product_images.length > 0) {
    // Ordenar as imagens extras e adicioná-las
    const extraImages = [...product.product_images]
      .sort((a, b) => a.display_order - b.display_order)
      .map((img: any) => ({
        url: `data:${img.image_mime};base64,${hexToBase64(img.image_blob)}`,
        mime: img.image_mime
      }))
    allImages = [...allImages, ...extraImages]
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <TrackingWrapper postId="product-page" blogId={blogId} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <a href="/" className="inline-flex items-center text-slate-500 hover:text-pink-600 transition-colors mb-8 font-semibold">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para o Início
        </a>

        <div className="bg-white rounded-3xl shadow-xl shadow-pink-200/50 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 p-8 lg:p-12">
            
            {/* Coluna da Esquerda: Galeria de Imagens */}
            <div className="space-y-6">
              <div className="aspect-square bg-pink-50 rounded-2xl flex items-center justify-center p-8 border border-pink-100 shadow-inner relative overflow-hidden group">
                <img src={mainImageUrl} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              
              {/* Miniaturas da Galeria */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {allImages.map((img, index) => (
                    <div key={index} className="aspect-square bg-pink-50 rounded-xl flex items-center justify-center p-2 border border-pink-100 hover:border-pink-500 cursor-pointer transition-colors">
                      <img src={img.url} alt={`Thumbnail ${index + 1}`} className="max-w-full max-h-full object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coluna da Direita: Informações do Produto */}
            <div className="flex flex-col justify-center mt-10 lg:mt-0">
              {product.category && (
                <span className="text-pink-600 font-bold tracking-wider uppercase text-sm mb-4 block">
                  {product.category}
                </span>
              )}
              <h1 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-2 mb-8">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-5 h-5 fill-current" />)}
                </div>
                <span className="text-slate-500 font-medium ml-2">(Produto Recomendado)</span>
              </div>

              <div className="mb-8 pb-8 border-b border-pink-100">
                <p className="text-slate-500 text-lg mb-2 font-medium">Preço médio a partir de</p>
                <p className="text-5xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
                  {product.price_range}
                </p>
              </div>

              <div className="space-y-6 mb-10 text-slate-700 leading-relaxed text-lg">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center text-slate-600 bg-pink-50 p-4 rounded-xl border border-pink-100">
                  <ShieldCheck className="w-6 h-6 text-green-500 mr-3" />
                  <span className="font-semibold text-sm">Compra Segura Shopee</span>
                </div>
                <div className="flex items-center text-slate-600 bg-pink-50 p-4 rounded-xl border border-pink-100">
                  <Truck className="w-6 h-6 text-pink-500 mr-3" />
                  <span className="font-semibold text-sm">Entrega Garantida</span>
                </div>
              </div>

              <a
                href={product.shopee_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center bg-pink-600 hover:bg-pink-500 !text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/30 text-xl !no-underline"
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                Comprar Agora na Shopee
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
