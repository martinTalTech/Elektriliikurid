import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Zap, Menu, X, User, LogOut, Plus, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-dark-medium border-b border-surface-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-primary-600 rounded-lg p-1.5 group-hover:bg-primary-500 transition-colors">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="leading-none">
              <span className="font-black text-white text-lg tracking-tight">elektri</span>
              <span className="font-black text-primary-500 text-lg tracking-tight">liikur</span>
              <span className="font-black text-muted text-lg tracking-tight">.ee</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/kuulutused" active={isActive('/kuulutused')}>
              Müügi kuulutused
            </NavLink>
            <NavLink to="/kuulutused?tüüp=rent" active={false}>
              Rendi kuulutused
            </NavLink>
            <NavLink to="/meist" active={isActive('/meist')}>
              Meist
            </NavLink>
            <NavLink to="/kkk" active={isActive('/kkk')}>
              KKK
            </NavLink>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/profiil" className="btn btn-secondary text-sm gap-1.5">
                  <User className="w-4 h-4" /> Profiil
                </Link>
                <Link to="/lisa-kuulutus" className="btn btn-primary text-sm gap-1.5">
                  <Plus className="w-4 h-4" /> Lisa kuulutus
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-dark-light transition-colors"
                  title="Logi välja"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/logi-sisse" className="btn btn-secondary text-sm">
                  Logi sisse
                </Link>
                <Link to="/lisa-kuulutus" className="btn btn-primary text-sm gap-1.5">
                  <Plus className="w-4 h-4" /> Lisa kuulutus
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-dark-light transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-border bg-dark-dark">
          <div className="px-4 py-3 space-y-1">
            <MobileLink to="/kuulutused" onClick={() => setMobileOpen(false)}>Müügi kuulutused</MobileLink>
            <MobileLink to="/kuulutused?tüüp=rent" onClick={() => setMobileOpen(false)}>Rendi kuulutused</MobileLink>
            <MobileLink to="/meist" onClick={() => setMobileOpen(false)}>Meist</MobileLink>
            <MobileLink to="/kkk" onClick={() => setMobileOpen(false)}>KKK</MobileLink>
          </div>
          <div className="px-4 py-3 border-t border-surface-border space-y-2">
            {user ? (
              <>
                <Link to="/profiil" className="btn btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                  <User className="w-4 h-4 mr-1.5" /> Profiil
                </Link>
                <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="btn btn-secondary w-full text-red-400 border-red-900">
                  <LogOut className="w-4 h-4 mr-1.5" /> Logi välja
                </button>
              </>
            ) : (
              <Link to="/logi-sisse" className="btn btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                Logi sisse
              </Link>
            )}
            <Link to="/lisa-kuulutus" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>
              <Plus className="w-4 h-4 mr-1.5" /> Lisa kuulutus
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-dark-light text-white'
          : 'text-muted-light hover:text-white hover:bg-dark-light'
      }`}
    >
      {children}
    </Link>
  )
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-light hover:text-white hover:bg-dark-light transition-colors"
    >
      {children}
    </Link>
  )
}
