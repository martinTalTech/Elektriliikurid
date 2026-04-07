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
          <Link to="/" className="inline-flex items-center gap-1.5 font-bold text-2xl text-primary-600">
            <Zap className="w-7 h-7 fill-primary-600" /> elektriliikurid
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Logi sisse</h1>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
            <div>
              <label className="label">Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input" />
            </div>
            <div>
              <label className="label">Parool</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="input" />
            </div>
            <Link to="/unustasin-parooli" className="text-sm text-primary-600 hover:text-primary-700 block">Unustasin parooli</Link>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? 'Sisselogimine...' : 'Logi sisse'}
            </button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">või</span></div>
          </div>
          <button onClick={handleGoogle} className="btn btn-secondary w-full">
            <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4 mr-2" /> Jätka Google'iga
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Pole kontot? <Link to="/registreeru" className="text-primary-600 hover:text-primary-700 font-medium">Registreeru</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
