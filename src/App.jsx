import { useState } from 'react'
import AgeGate from './components/AgeGate'
import ChatUI from './components/ChatUI'

function App() {
  const [adult, setAdult] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,114,182,0.05),transparent_50%)]"></div>

      {!adult && <AgeGate onConfirm={() => setAdult(true)} />}

      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Mohini</h1>
            <p className="text-pink-200">A tasteful, flirty companion for adults (18+)</p>
          </div>

          <ChatUI />

          <div className="text-center mt-6">
            <p className="text-sm text-pink-200/60">Be kind. No explicit, illegal, or harmful content.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App