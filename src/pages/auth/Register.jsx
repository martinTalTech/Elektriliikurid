import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, phone: form.phone } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">✉️</div>
        <h2 className="text-xl font-bold text-white">Kontrolli oma emaili</h2>
        <p className="text-muted mt-2">Saatsime kinnituslingi aadressile <strong className="text-white">{form.email}</strong></p>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary-600 rounded-lg p-1.5">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="leading-none">
              <span className="font-black text-white text-xl tracking-tight">elektri</span>
              <span className="font-black text-primary-500 text-xl tracking-tight">liikur</span>
              <span className="font-black text-muted text-xl tracking-tight">.ee</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white mt-2">Loo konto</h1>
          <p className="text-sm text-muted mt-1">Liitu elektriliikurite kogukonnaga</p>
        </div>

        <div className="bg-dark-medium border border-surface-border rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="label">Nimi</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Sinu nimi" className="input" />
            </div>
            <div>
              <label className="label">Telefon</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+372..." className="input" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input" placeholder="sinu@email.ee" />
            </div>
            <div>
              <label className="label">Parool *</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} className="input" placeholder="••••••••" />
              <p className="text-xs text-muted mt-1">Minimaalselt 8 tähemärki</p>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full font-bold">
              {loading ? 'Konto loomine...' : 'Loo konto'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-5">
            On juba konto?{' '}
            <Link to="/logi-sisse" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
              Logi sisse
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
