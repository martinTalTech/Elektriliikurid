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
        <h2 className="text-xl font-semibold">Kontrolli oma emaili</h2>
        <p className="text-gray-500 mt-2">Saatsime kinnituslingi aadressile <strong>{form.email}</strong></p>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 font-bold text-2xl text-primary-600">
            <Zap className="w-7 h-7 fill-primary-600" /> elektriliikurid
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Loo konto</h1>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
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
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input" />
            </div>
            <div>
              <label className="label">Parool *</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8} className="input" />
              <p className="text-xs text-gray-400 mt-1">Minimaalselt 8 tähemärki</p>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
              {loading ? 'Konto loomine...' : 'Loo konto'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            On juba konto? <Link to="/logi-sisse" className="text-primary-600 hover:text-primary-700 font-medium">Logi sisse</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
