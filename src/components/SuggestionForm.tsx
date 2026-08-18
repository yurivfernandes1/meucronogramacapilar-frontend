'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SuggestionForm() {
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const { data: { session } } = await supabase.auth.getSession()
    
    const { error } = await supabase.from('suggestions').insert({
      user_id: session?.user?.id || null, // Se estiver deslogado, vai como nulo ou a constraint de banco pode barrar
      content,
      status: 'new'
    })

    if (error) {
      setMessage('Erro ao enviar. Você precisa estar logado para enviar sugestões.')
    } else {
      setContent('')
      setMessage('Obrigado pela sugestão!')
      setTimeout(() => { setIsOpen(false); setMessage(''); }, 3000)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-pink-600 text-white p-4 rounded-full shadow-lg hover:bg-pink-700 transition"
      >
        💡 Sugestões?
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 bg-white p-6 rounded-lg shadow-2xl border border-gray-200 w-80 text-left z-50">
      <h4 className="font-bold text-gray-900 mb-2">Enviar Sugestão</h4>
      <p className="text-sm text-gray-600 mb-4">Tem ideia para um post ou review? Conta pra gente!</p>
      
      <form onSubmit={handleSubmit}>
        <textarea 
          required 
          rows={3} 
          className="w-full p-2 border rounded focus:ring-pink-500 focus:border-pink-500 text-gray-800" 
          placeholder="Sua sugestão..." 
          value={content} 
          onChange={e => setContent(e.target.value)} 
        />
        <div className="mt-4 flex space-x-2">
          <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded hover:bg-gray-200">
            Cancelar
          </button>
          <button type="submit" className="flex-1 bg-pink-600 text-white font-semibold py-2 rounded hover:bg-pink-700 transition">
            Enviar
          </button>
        </div>
      </form>
      {message && <p className="mt-3 text-sm text-center font-medium text-pink-600">{message}</p>}
    </div>
  )
}
