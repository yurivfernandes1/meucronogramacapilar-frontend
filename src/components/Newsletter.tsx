'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email, blog: 'meucronogramacapilar' }])

      if (error) {
        // Ignora erro de duplicidade (código do postgres para unique violation)
        if (error.code === '23505') {
          setStatus('success')
        } else {
          throw error
        }
      } else {
        setStatus('success')
      }
    } catch (err) {
      console.error('Newsletter error:', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-10 opacity-50" />
        <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3 font-serif">Inscrição Confirmada! ✨</h3>
        <p className="text-slate-600">Obrigado por se inscrever. Você receberá nossas dicas incríveis em breve.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-rose-100 p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-10 opacity-50" />
      
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-4 text-pink-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 font-serif">Clube Capilar</h3>
      </div>
      
      <p className="text-slate-600 text-sm mb-6 leading-relaxed">
        Inscreva-se para receber dicas exclusivas, cronogramas personalizados e novidades diretamente no seu e-mail.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div>
          <input
            type="email"
            placeholder="Seu melhor e-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all text-slate-700"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center shadow-lg hover:shadow-pink-500/25 transform hover:-translate-y-0.5"
        >
          {status === 'loading' ? (
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            'Quero Receber Dicas!'
          )}
        </button>
        {status === 'error' && (
          <p className="text-rose-500 text-xs text-center font-medium">Ocorreu um erro. Tente novamente mais tarde.</p>
        )}
      </form>
    </div>
  )
}
