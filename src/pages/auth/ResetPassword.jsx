import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Check, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'

const getPasswordStrength = (pw) => {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  return score
}

const strengthLabels = ['', 'Nõrk', 'Keskmine', 'Hea', 'Tugev']
const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
const strengthTextColors = ['', 'text-red-400', 'text-yellow-400', 'text-blue-400', 'text-green-400']

export default function ResetPassword() {
  usePageTitle('Uus parool')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const strength = getPasswordStrength(password)
  const hasLength = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const allMet = hasLength && hasUpper && hasLower && hasNumber
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  useEffect(() => {
    // Supabase puts the token in the URL hash for HashRouter
    // The auth state change will be handled automatically by onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User arrived via password reset link — ready to set new password
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allMet) return
    if (!passwordsMatch) {
      setError('Paroolid ei kattu')
      return
    }
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => navigate('/logi-sisse'), 3000)
    }
  }

  const PasswordCheck = ({ met, label }) => (
    <div className="flex items-center gap-1.5 text-xs">
      {met ? <Check className="w-3.5 h-3.5 text-green-400" /> : <X className="w-3.5 h-3.5 text-muted" />}
      <span className={met ? 'text-green-400' : 'text-muted'}>{label}</span>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-black text-white text-center mb-6">Uus parool</h1>

        <div className="bg-dark-medium border border-surface-border rounded-2xl p-7">
          {success ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/10 border border-green-600/20 mb-4">
                <Check className="w-7 h-7 text-green-500" />
              </div>
              <p className="text-muted-light mb-2">Parool edukalt muudetud!</p>
              <p className="text-sm text-muted">Suuname sind sisselogimisele...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
              )}

              <div>
                <label className="label">Uus parool *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <>
                    <div className="flex gap-1 mt-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : 'bg-dark-lighter'}`} />
                      ))}
                    </div>
                    <p className={`text-xs font-medium mt-1 ${strengthTextColors[strength]}`}>{strengthLabels[strength]}</p>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <PasswordCheck met={hasLength} label="Vähemalt 8 tähemärki" />
                      <PasswordCheck met={hasUpper} label="Suur täht (A-Z)" />
                      <PasswordCheck met={hasLower} label="Väike täht (a-z)" />
                      <PasswordCheck met={hasNumber} label="Number (0-9)" />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="label">Korda parooli *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                    {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-400 mt-1">Paroolid ei kattu</p>
                )}
                {passwordsMatch && (
                  <p className="text-xs text-green-400 mt-1">Paroolid kattuvad</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !allMet || !passwordsMatch}
                className="btn btn-primary btn-lg w-full font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvestamine...' : 'Salvesta uus parool'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
