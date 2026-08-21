import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Instagram, Facebook, MessageCircle, Video } from "lucide-react"
import SuggestionForm from "../components/SuggestionForm"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: '%s | Meu Cronograma Capilar',
    default: 'Meu Cronograma Capilar - Dicas e Rotinas para seus Cabelos',
  },
  description: "Aprenda a montar seu cronograma capilar em casa. Avaliações de produtos, cronogramas para crescimento, hidratação e muito mais.",
  keywords: ['cronograma capilar', 'cabelo', 'hidratação', 'nutrição', 'reconstrução', 'cuidados capilares', 'rotina capilar'],
  authors: [{ name: 'Meu Cronograma Capilar', url: 'https://meucronogramacapilar.com.br' }],
  creator: 'Meu Cronograma Capilar',
  metadataBase: new URL('https://meucronogramacapilar.com.br'),
  openGraph: {
    title: 'Meu Cronograma Capilar — Cuide dos seus Fios',
    description: 'Dicas, guias completos e produtos recomendados para o seu cronograma capilar perfeito. Hidratação, nutrição e reconstrução em casa.',
    url: 'https://meucronogramacapilar.com.br',
    siteName: 'Meu Cronograma Capilar',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Meu Cronograma Capilar — Cuide dos seus Fios',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meu Cronograma Capilar — Cuide dos seus Fios',
    description: 'Dicas e rotinas para o seu cronograma capilar perfeito.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm text-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              <a href="/" className="hover:text-pink-600 transition-colors">Meu Cronograma Capilar</a>
            </h1>
            <nav className="space-x-8 text-sm font-semibold tracking-wide">
              <a href="/" className="text-slate-600 hover:text-pink-600 transition-colors">Início</a>
              <a href="/produtos" className="text-slate-600 hover:text-pink-600 transition-colors">Produtos</a>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Meu Cronograma Capilar</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Transforme seus fios com rotinas de cuidado, resenhas honestas e dicas diárias de hidratação, nutrição e reconstrução.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-pink-400 transition-colors">Início</a></li>
                <li><a href="/produtos" className="hover:text-pink-400 transition-colors">Nossas Recomendações</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-slate-400 hover:text-white" title="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-slate-400 hover:text-white" title="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-slate-400 hover:text-white" title="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-slate-400 hover:text-white" title="TikTok">
                  {/* Ícone genérico de vídeo para o TikTok ou um SVG custom */}
                  <Video className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Meu Cronograma Capilar. Todos os direitos reservados.</p>
          </div>
        </footer>
        <SuggestionForm />
      </body>
    </html>
  )
}
