import type { Metadata } from "next"
import { Inter } from "next/font/google"
import SuggestionForm from "../components/SuggestionForm"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: '%s | Meu Cronograma Capilar',
    default: 'Meu Cronograma Capilar - Dicas e Rotinas para seus Cabelos',
  },
  description: "Aprenda a montar seu cronograma capilar em casa. Avaliações de produtos, cronogramas para crescimento, hidratação e muito mais.",
  openGraph: {
    title: 'Meu Cronograma Capilar',
    description: 'Dicas, guias completos e produtos recomendados para o seu cronograma capilar perfeito.',
    url: 'https://meucronogramacapilar.com.br',
    siteName: 'Meu Cronograma Capilar',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <header className="bg-pink-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Meu Cronograma Capilar</h1>
            <nav className="space-x-4 text-sm font-medium">
              <a href="/" className="hover:text-pink-200">Início</a>
              <a href="#produtos" className="hover:text-pink-200">Produtos</a>
            </nav>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50 pb-12">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-8 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Meu Cronograma Capilar. Todos os direitos reservados.</p>
        </footer>
        <SuggestionForm />
      </body>
    </html>
  )
}
