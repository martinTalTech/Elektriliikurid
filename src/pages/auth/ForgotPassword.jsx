import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/#/reset-password' })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Unustasin parooli</h1>
        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✉️</div>
              <p className="text-gray-700">Saatsime paroolilinkiga emaili aadressile <strong>{email}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
                {loading ? 'Saatmine...' : 'Saada taastamislink'}
              </button>
            </form>
          )}
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/logi-sisse" className="text-primary-600 hover:text-primary-700">← Tagasi sisselogimisele</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
