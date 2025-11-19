import { useState } from 'react'

export default function AgeGate({ onConfirm }) {
  const [checked, setChecked] = useState(false)

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Adults Only</h2>
        <p className="text-slate-300 mb-6">This experience is designed for users 18+. It stays classy and non-explicit.</p>
        <label className="flex items-center gap-3 justify-center mb-6 text-slate-200">
          <input type="checkbox" checked={checked} onChange={(e)=>setChecked(e.target.checked)} className="w-5 h-5" />
          I confirm I am 18 years or older
        </label>
        <button
          disabled={!checked}
          onClick={onConfirm}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${checked ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-slate-600 text-slate-300 cursor-not-allowed'}`}
        >
          Enter Chat
        </button>
        <p className="text-xs text-slate-400 mt-4">Be respectful. No explicit or illegal content.</p>
      </div>
    </div>
  )
}
