'use client'

import { useState, useEffect } from 'react'

export default function ShareFooterClient() {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(window.location.origin) // Compartilha a página inicial do blog
  }, [])

  const encodedUrl = encodeURIComponent(url)
  const title = encodeURIComponent("Confira este blog incrível!")

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${title} - ${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div>
      <h4 className="text-lg font-semibold text-white mb-4">Compartilhe o Blog</h4>
      <div className="flex space-x-4 relative">
        <button 
          onClick={copyToClipboard}
          className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-slate-400 hover:text-white" 
          title="Copiar link para o Instagram"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        </button>
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-slate-400 hover:text-white" title="Compartilhar no Facebook">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        </a>
        <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-slate-400 hover:text-white" title="Compartilhar no WhatsApp">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.031 2C6.49 2 2 6.49 2 12.031c0 1.761.458 3.473 1.332 5l-1.328 4.856 4.966-1.303A9.972 9.972 0 0012.031 22c5.54 0 10.03-4.49 10.03-10.03C22.062 6.49 17.571 2 12.031 2zm5.727 14.536c-.244.686-1.42 1.307-1.97 1.353-.518.042-1.192.176-3.81-1.077-3.15-1.507-5.187-4.733-5.342-4.94-.154-.207-1.275-1.696-1.275-3.235 0-1.54.805-2.3.109-2.656-.27-.272-.614-.28-.868-.28-.216 0-.434.004-.614.008-.184.004-.442.067-.674.32-.232.253-.884.863-.884 2.106 0 1.244.905 2.45 1.03 2.617.124.167 1.782 2.718 4.316 3.81.6.258 1.07.411 1.436.527.604.19 1.155.163 1.59.1.488-.07 1.42-.582 1.62-1.144.2-.563.2-1.045.14-1.144-.06-.1-.23-.157-.478-.28l-1.57-.79c-.218-.11-.478-.053-.614.163-.167.26-.434.614-.564.767-.13.153-.26.17-.508.046-.248-.124-1.014-.374-1.932-1.19-.714-.633-1.196-1.414-1.336-1.662-.14-.248-.014-.383.11-.507.112-.113.248-.288.372-.43.124-.144.166-.248.248-.415.084-.167.042-.313-.02-.437-.06-.124-.564-1.36-.772-1.862-.204-.492-.41-.424-.564-.432l-.48-.008z" />
          </svg>
        </a>
        <button 
          onClick={copyToClipboard}
          className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors text-slate-400 hover:text-white" 
          title="Copiar link para o TikTok"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.23-2.48.65-5 2.37-6.72 1.39-1.37 3.32-2.18 5.25-2.22 0 1.34.02 2.68-.02 4.02-1.22.04-2.43.61-3.15 1.59-.72.98-.94 2.27-.66 3.44.29 1.15 1.13 2.12 2.18 2.6.93.42 2.05.47 3.03.1.92-.35 1.63-1.12 1.92-2.05.15-.49.2-.99.2-1.51.02-4.75 0-9.51.02-14.26z" />
          </svg>
        </button>

        {copied && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Link copiado!
          </span>
        )}
      </div>
    </div>
  )
}
