'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkUser()
    loadComments()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [postId])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
  }

  const loadComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(name)')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    
    if (data) setComments(data)
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('Erro ao entrar: ' + error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name } // Trigger no banco deve puxar isso e jogar em profiles
        }
      })
      if (error) {
        setMessage('Erro ao registrar: ' + error.message)
      } else {
        // Se a confirmação de e-mail estiver desativada no Supabase, loga direto
        setMessage('Conta criada com sucesso! Você já pode comentar.')
      }
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: newComment,
      status: 'pending' // Comentários entram como pendentes
    })

    if (error) {
      setMessage('Erro ao enviar comentário.')
    } else {
      setNewComment('')
      setMessage('Comentário enviado para moderação. Aparecerá em breve!')
    }
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Comentários</h3>

      {/* Seção de Autenticação / Formulário */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        {!user ? (
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              {isLogin ? 'Entre para comentar' : 'Crie uma conta para comentar'}
            </h4>
            <form onSubmit={handleAuth} className="space-y-4 max-w-sm">
              {!isLogin && (
                <input 
                  type="text" placeholder="Seu Nome" required 
                  className="w-full p-2 border rounded" 
                  value={name} onChange={e => setName(e.target.value)} 
                />
              )}
              <input 
                type="email" placeholder="E-mail" required 
                className="w-full p-2 border rounded" 
                value={email} onChange={e => setEmail(e.target.value)} 
              />
              <input 
                type="password" placeholder="Senha" required 
                className="w-full p-2 border rounded" 
                value={password} onChange={e => setPassword(e.target.value)} 
              />
              <button type="submit" className="w-full bg-pink-600 text-white font-semibold py-2 rounded hover:bg-pink-700 transition">
                {isLogin ? 'Entrar' : 'Registrar'}
              </button>
            </form>
            <div className="mt-4 text-sm">
              <button onClick={() => setIsLogin(!isLogin)} className="text-pink-600 hover:underline">
                {isLogin ? 'Não tem conta? Registre-se' : 'Já tem conta? Entre'}
              </button>
            </div>
            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">Autenticado como <strong>{user.email}</strong></p>
              <button onClick={handleLogout} className="text-sm text-pink-600 hover:underline">Sair</button>
            </div>
            <form onSubmit={submitComment}>
              <textarea 
                required 
                rows={3} 
                className="w-full p-3 border rounded focus:ring-pink-500 focus:border-pink-500" 
                placeholder="Escreva seu comentário..." 
                value={newComment} 
                onChange={e => setNewComment(e.target.value)} 
              />
              <button type="submit" className="mt-2 bg-pink-600 text-white font-semibold py-2 px-6 rounded hover:bg-pink-700 transition">
                Enviar Comentário
              </button>
            </form>
            {message && <p className="mt-3 text-sm font-medium text-green-600 bg-green-50 p-2 rounded inline-block">{message}</p>}
          </div>
        )}
      </div>

      {/* Lista de Comentários Aprovados */}
      <div className="space-y-6">
        {comments.map(c => (
          <div key={c.id} className="bg-white p-4 border rounded shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-900">{c.profiles?.name || 'Leitor'}</span>
              <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 italic text-sm">Nenhum comentário ainda. Seja o primeiro!</p>
        )}
      </div>
    </div>
  )
}
