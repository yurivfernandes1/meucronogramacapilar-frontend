'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import Base64Image from '@/components/Base64Image'

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const itemsPerPage = 12

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = new Set<string>()
    initialProducts.forEach(p => cats.add(p.category || 'Outros'))
    return Array.from(cats).sort()
  }, [initialProducts])

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory ? (p.category || 'Outros') === selectedCategory : true
      
      return matchesSearch && matchesCategory
    })
  }, [initialProducts, searchTerm, selectedCategory])

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset page on filter change
  useMemo(() => setCurrentPage(1), [searchTerm, selectedCategory])

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* Botão Mobile para Filtros */}
      <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <span className="font-semibold text-slate-700">Filtros & Categorias</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar de Filtros */}
      <aside className={`lg:w-1/4 space-y-8 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
        
        {/* Barra de Pesquisa */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Buscar</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Ex: Máscara capilar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {/* Categorias */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Categorias</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => { setSelectedCategory(null); setIsMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex justify-between items-center ${
                  selectedCategory === null 
                    ? 'bg-pink-50 text-pink-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Todas as Categorias</span>
                <span className="bg-slate-100 text-slate-500 text-xs py-0.5 px-2 rounded-full">{initialProducts.length}</span>
              </button>
            </li>
            {categories.map(cat => {
              const count = initialProducts.filter(p => (p.category || 'Outros') === cat).length
              return (
                <li key={cat}>
                  <button
                    onClick={() => { setSelectedCategory(cat); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex justify-between items-center ${
                      selectedCategory === cat 
                        ? 'bg-pink-50 text-pink-700 font-semibold' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="bg-slate-100 text-slate-500 text-xs py-0.5 px-2 rounded-full">{count}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Grid de Produtos */}
      <div className="lg:w-3/4 flex flex-col">
        
        {/* Header do Grid */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedCategory ? selectedCategory : 'Todos os Produtos'}
          </h2>
          <span className="text-slate-500 text-sm">{filteredProducts.length} produtos encontrados</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center flex flex-col items-center justify-center flex-1">
            <Search className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum produto encontrado</h3>
            <p className="text-slate-500">Tente ajustar seus filtros ou termo de pesquisa.</p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
              className="mt-6 px-6 py-2 bg-pink-50 text-pink-600 font-semibold rounded-lg hover:bg-pink-100 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedProducts.map(product => {
                return (
                  <a 
                    key={product.id} 
                    href={product.shopee_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center p-6">
                      <Base64Image 
                        base64={product.base64Image}
                        mime={product.image_mime}
                        alt={product.name} 
                        className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                        fallback="https://via.placeholder.com/400?text=Sem+Foto"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-xs font-semibold text-pink-500 uppercase tracking-wider mb-2">
                        {product.category || 'Outros'}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="font-extrabold text-slate-900 text-lg">
                          {product.price_range || 'Ver Preço'}
                        </span>
                        <span className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg group-hover:bg-pink-600 transition-colors shadow-sm">
                          Comprar
                        </span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-auto">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors \${
                      currentPage === i + 1 
                        ? 'bg-pink-600 text-white shadow-md' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
