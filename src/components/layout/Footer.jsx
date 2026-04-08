import { Link } from 'react-router-dom'
import { Zap, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-darkest border-t border-surface-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary-600 rounded-lg p-1.5">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="leading-none">
                <span className="font-black text-white text-lg tracking-tight">elektri</span>
                <span className="font-black text-primary-500 text-lg tracking-tight">liikur</span>
                <span className="font-black text-muted text-lg tracking-tight">.ee</span>
              </div>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Eesti suurim kasutatud elektriliikurite turg. Leia endale sobilik tõukeratas, elektri krossikas, mopeed või jalgratas.
            </p>
            <div className="space-y-1 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <span>info@elektriliikur.ee</span>
              </div>
            </div>
          </div>

          {/* Müük */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">Müügi kuulutused</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/kuulutused?type=scooter">Tõukerattad</FooterLink>
              <FooterLink to="/kuulutused?type=cross">Elektri krossikad</FooterLink>
              <FooterLink to="/kuulutused?type=mopeed">Elektri mopeedid</FooterLink>
              <FooterLink to="/kuulutused?type=jalgratas">Elektri jalgrattad</FooterLink>
              <FooterLink to="/lisa-kuulutus">Lisa müügi kuulutus</FooterLink>
            </ul>
          </div>

          {/* Rent */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">Rendi kuulutused</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/kuulutused?type=scooter">Tõukerattad</FooterLink>
              <FooterLink to="/kuulutused?type=cross">Elektri krossikad</FooterLink>
              <FooterLink to="/kuulutused?type=mopeed">Elektri mopeedid</FooterLink>
              <FooterLink to="/kuulutused?type=jalgratas">Elektri jalgrattad</FooterLink>
              <FooterLink to="/lisa-kuulutus">Lisa rendi kuulutus</FooterLink>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">Info</h3>
            <ul className="space-y-2 text-sm">
              <FooterLink to="/meist">Meist</FooterLink>
              <FooterLink to="/kkk">KKK</FooterLink>
              <FooterLink to="/tingimused">Kasutustingimused</FooterLink>
              <FooterLink to="/privaatsus">Privaatsuspoliitika</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-border py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>© {new Date().getFullYear()} elektriliikurid.ee — Kõik õigused kaitstud</span>
          <div className="flex gap-4">
            <Link to="/tingimused" className="hover:text-white transition-colors">Tingimused</Link>
            <Link to="/privaatsus" className="hover:text-white transition-colors">Privaatsus</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="text-muted hover:text-primary-400 transition-colors">
        {children}
      </Link>
    </li>
  )
}
