import { useEffect, useMemo, useRef, useState } from 'react'

export default function ChatUI() {
  const [conversationId, setConversationId] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/conversation`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
        const data = await res.json()
        setConversationId(data.conversation_id)
        // fetch initial messages (persona intro)
        const res2 = await fetch(`${baseUrl}/api/messages/${data.conversation_id}`)
        const data2 = await res2.json()
        setMessages(data2.messages || [])
      } catch (e) {
        console.error(e)
      }
    }
    init()
  }, [baseUrl])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return
    const newUserMsg = { role: 'user', content: input, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, newUserMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/message`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ conversation_id: conversationId, content: newUserMsg.content }) })
      const data = await res.json()
      if (res.ok) {
        setMessages(prev => [...prev, data])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.detail || 'Something went wrong', created_at: new Date().toISOString() }])
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.', created_at: new Date().toISOString() }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="relative bg-slate-800/60 border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/70 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500" />
        <div>
          <h2 className="text-white font-semibold leading-tight">Mohini</h2>
          <p className="text-xs text-slate-300">Tasteful, flirty companion for adults</p>
        </div>
      </div>

      <div ref={listRef} className="h-[55vh] overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'} max-w-[75%] px-4 py-3 rounded-2xl whitespace-pre-wrap`}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="text-slate-300 text-sm">Mohini is typing…</div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-800/70">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Write a message…"
            className="flex-1 resize-none bg-slate-900/70 text-white placeholder-slate-400 rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button onClick={sendMessage} disabled={!input.trim() || loading} className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white font-semibold">
            Send
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2">No explicit content. Keep it respectful and 18+.</p>
      </div>
    </div>
  )
}
