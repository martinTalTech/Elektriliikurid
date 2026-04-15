import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = (type) => {
    localStorage.setItem('cookie-consent', type)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in-up">
      <div className="max-w-4xl mx-auto bg-dark-medium border border-surface-border rounded-2xl shadow-2xl shadow-black/40 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-primary-600/10 border border-primary-600/20 flex-shrink-0 mt-0.5">
            <Cookie className="w-5 h-5 text-primary-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">Küpsiste kasutamine</h3>
            <p className="text-muted-light text-xs leading-relaxed">
              Kasutame vajalikke küpsiseid veebilehe toimimiseks (sisselogimine, seaded) ja analüütika küpsiseid
              kasutuskogemuse parandamiseks. Loe lähemalt meie{' '}
              <Link to="/privaatsus" className="text-primary-400 hover:text-primary-300 underline">privaatsuspoliitikast</Link>.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => accept('all')}
                className="btn btn-primary text-xs px-4 py-2"
              >
                Nõustun kõigiga
              </button>
              <button
                onClick={() => accept('necessary')}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                Ainult vajalikud
              </button>
            </div>
          </div>
          <button
            onClick={() => accept('necessary')}
            className="text-muted hover:text-white transition-colors flex-shrink-0"
            title="Sulge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
