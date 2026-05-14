import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function Login() {
  usePageTitle('Logi sisse')
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8 animate-fade-in-up">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/logo.png" alt="elektriliikur.ee" className="w-10 h-10" />
            <div className="leading-none">
              <span className="font-black text-primary-500 text-xl tracking-tight">elektri</span>
              <span className="font-black text-white text-xl tracking-tight">liikur.ee</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white mt-2">Logi sisse</h1>
          <p className="text-sm text-muted mt-1">Tere tulemast tagasi</p>
        </div>

        <div className="animate-fade-in-up-delay-1 bg-dark-medium border border-surface-border rounded-2xl p-7 shadow-card">
          {/* Google button first - more prominent */}
          <button onClick={handleGoogle} className="btn btn-secondary w-full gap-3 py-3 text-sm font-semibold hover:bg-dark-lighter">
            <img src="https://www.google.com/favicon.ico" alt="" className="w-5 h-5" />
            Jätka Google kontoga
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-dark-medium px-3 text-muted uppercase tracking-widest">või emailiga</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="input pl-10"
                  placeholder="sinu@email.ee"
                />
              </div>
            </div>
            <div>
              <label className="label">Parool</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
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

          <p className="text-center text-sm text-muted mt-6">
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
