import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User, Phone, Eye, EyeOff, Check, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'

function getPasswordStrength(pw) {
  const checks = {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
  }
  const passed = Object.values(checks).filter(Boolean).length
  const label = passed <= 1 ? 'Nõrk' : passed <= 2 ? 'Keskmine' : passed <= 3 ? 'Hea' : 'Tugev'
  const color = passed <= 1 ? 'text-red-400' : passed <= 2 ? 'text-orange-400' : passed <= 3 ? 'text-yellow-400' : 'text-primary-400'
  const barColor = passed <= 1 ? 'bg-red-500' : passed <= 2 ? 'bg-orange-500' : passed <= 3 ? 'bg-yellow-500' : 'bg-primary-500'
  return { checks, passed, label, color, barColor }
}

function isValidPhone(phone) {
  if (!phone) return true
  return /^\+?[0-9]*$/.test(phone)
}

export default function Register() {
  usePageTitle('Registreeru')
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const pw = getPasswordStrength(form.password)
  const passwordValid = pw.checks.length && pw.checks.upper && pw.checks.lower && pw.checks.number

  const handlePhoneChange = (e) => {
    const val = e.target.value
    if (val && !isValidPhone(val)) {
      setPhoneError('Ainult + ja numbrid 0-9')
    } else {
      setPhoneError('')
    }
    setForm(f => ({ ...f, phone: val.replace(/[^+0-9]/g, '') }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!passwordValid) {
      setError('Parool peab sisaldama vähemalt 8 tähemärki, suurt ja väikest tähte ning numbrit')
      return
    }
    if (form.phone && !isValidPhone(form.phone)) {
      setError('Telefoninumber tohib sisaldada ainult + ja numbreid')
      return
    }
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, phone: form.phone },
        emailRedirectTo: `${window.location.origin}/#/logi-sisse`,
      }
    })
    if (error) {
      // Ära näita Supabase sisemisi veateateid kasutajale
      if (error.message?.toLowerCase().includes('already registered') || error.message?.toLowerCase().includes('already exists')) {
        setError('See e-posti aadress on juba registreeritud. Proovi sisse logida.')
      } else if (error.message?.toLowerCase().includes('rate limit')) {
        setError('Liiga palju katseid. Proovi paari minuti pärast uuesti.')
      } else {
        setError('Registreerimine ebaõnnestus. Kontrolli andmeid ja proovi uuesti.')
      }
      setLoading(false)
    } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
      // Supabase turvameede: tagastab "eduka" vastuse kui email on juba olemas.
      // Tuvastame selle identities massiivi järgi.
      setError('See e-posti aadress on juba registreeritud. Proovi sisse logida.')
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-600/10 border border-primary-600/20 mb-5">
          <Mail className="w-8 h-8 text-primary-500" />
        </div>
        <h2 className="text-xl font-bold text-white">Kontrolli oma emaili</h2>
        <p className="text-muted mt-2">Saatsime kinnituslingi aadressile <strong className="text-white">{form.email}</strong></p>
      </div>
    </div>
  )

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
          <h1 className="text-2xl font-black text-white mt-2">Loo konto</h1>
          <p className="text-sm text-muted mt-1">Liitu elektriliikurite kogukonnaga</p>
        </div>

        <div className="animate-fade-in-up-delay-1 bg-dark-medium border border-surface-border rounded-2xl p-7 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="label">Nimi</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Sinu nimi" className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="+372..."
                  className={`input pl-10 ${phoneError ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {phoneError && <p className="text-xs text-red-400 mt-1">{phoneError}</p>}
            </div>
            <div>
              <label className="label">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="input pl-10" placeholder="sinu@email.ee" />
              </div>
            </div>
            <div>
              <label className="label">Parool *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="input pl-10 pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors">
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              {form.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= pw.passed ? pw.barColor : 'bg-dark-lighter'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-semibold ${pw.color}`}>{pw.label}</p>
                  <div className="grid grid-cols-2 gap-1">
                    <PasswordCheck ok={pw.checks.length} label="Vähemalt 8 tähemärki" />
                    <PasswordCheck ok={pw.checks.upper} label="Suur täht (A-Z)" />
                    <PasswordCheck ok={pw.checks.lower} label="Väike täht (a-z)" />
                    <PasswordCheck ok={pw.checks.number} label="Number (0-9)" />
                  </div>
                </div>
              )}
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-surface-border bg-dark-light text-primary-500 focus:ring-primary-500"
              />
              <span className="text-xs text-muted-light leading-relaxed">
                Nõustun{' '}
                <Link to="/tingimused" className="text-primary-400 hover:text-primary-300 underline" target="_blank">kasutustingimuste</Link>
                {' '}ja{' '}
                <Link to="/privaatsus" className="text-primary-400 hover:text-primary-300 underline" target="_blank">privaatsuspoliitikaga</Link>
              </span>
            </label>
            <button type="submit" disabled={loading || !agreed || (form.password && !passwordValid)} className="btn btn-primary btn-lg w-full font-bold">
              {loading ? 'Konto loomine...' : 'Loo konto'}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
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

function PasswordCheck({ ok, label }) {
  return (
    <div className="flex items-center gap-1.5">
      {ok ? <Check className="w-3 h-3 text-primary-400" /> : <X className="w-3 h-3 text-muted" />}
      <span className={`text-xs ${ok ? 'text-primary-400' : 'text-muted'}`}>{label}</span>
    </div>
  )
}
