import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword(form)
    if (error) {
      setError('Vale email või parool')
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/#/' } })
  }

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
          <h1 className="text-2xl font-black text-white mt-2">Logi sisse</h1>
          <p className="text-sm text-muted mt-1">Tere tulemast tagasi</p>
        </div>

        <div className="bg-dark-medium border border-surface-border rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="input"
                placeholder="sinu@email.ee"
              />
            </div>
            <div>
              <label className="label">Parool</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>
            <div className="text-right">
              <Link to="/unustasin-parooli" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">
                Unustasin parooli
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full font-bold">
              {loading ? 'Sisselogimine...' : 'Logi sisse'}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-dark-medium px-3 text-muted uppercase tracking-widest">või</span>
            </div>
          </div>

          <button onClick={handleGoogle} className="btn btn-secondary w-full gap-2">
            <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
            Jätka Google'iga
          </button>

          <p className="text-center text-sm text-muted mt-5">
            Pole kontot?{' '}
            <Link to="/registreeru" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
              Registreeru
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
