import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-black text-white text-center mb-6">Unustasin parooli</h1>

        <div className="bg-dark-medium border border-surface-border rounded-2xl p-7">
          {sent ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600/10 border border-primary-600/20 mb-4">
                <Mail className="w-7 h-7 text-primary-500" />
              </div>
              <p className="text-muted-light">Saatsime paroolilinkiga emaili aadressile{' '}
                <strong className="text-white">{email}</strong>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted mb-2">
                Sisesta oma emaili aadress ja saadame sulle parooli taastamislingi.
              </p>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="sinu@email.ee"
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full font-bold">
                {loading ? 'Saatmine...' : 'Saada taastamislink'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-muted mt-5">
            <Link to="/logi-sisse" className="text-primary-500 hover:text-primary-400 transition-colors">
              ← Tagasi sisselogimisele
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
