import { Link, useNavigate } from 'react-router-dom'
import { Zap, Menu, X, User, LogOut, Plus } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-1.5 font-bold text-xl text-primary-600">
            <Zap className="w-6 h-6 fill-primary-600" />
            <span>elektriliikur</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/kuulutused" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Müügi kuulutused
            </Link>
            <Link to="/meist" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
              Meist
            </Link>
            <Link to="/kkk" className="text-gray-600 hover:text-primary-600 transition-colors text-sm font-medium">
              KKK
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profiil" className="btn btn-secondary text-sm">
                  <User className="w-4 h-4 mr-1.5" /> Profiil
                </Link>
                <Link to="/lisa-kuulutus" className="btn btn-primary text-sm">
                  <Plus className="w-4 h-4 mr-1.5" /> Lisa kuulutus
                </Link>
                <button onClick={handleSignOut} className="text-gray-500 hover:text-gray-700">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/logi-sisse" className="btn btn-secondary text-sm">Logi sisse</Link>
                <Link to="/lisa-kuulutus" className="btn btn-primary text-sm">
                  <Plus className="w-4 h-4 mr-1.5" /> Lisa kuulutus
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/kuulutused" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Kuulutused</Link>
          <Link to="/meist" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Meist</Link>
          <Link to="/kkk" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>KKK</Link>
          <hr className="border-gray-100" />
          {user ? (
            <>
              <Link to="/profiil" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Profiil</Link>
              <button onClick={() => { handleSignOut(); setMobileOpen(false) }} className="block py-2 text-gray-700 w-full text-left">Logi välja</button>
            </>
          ) : (
            <Link to="/logi-sisse" className="block py-2 text-gray-700" onClick={() => setMobileOpen(false)}>Logi sisse</Link>
          )}
          <Link to="/lisa-kuulutus" className="btn btn-primary w-full mt-2" onClick={() => setMobileOpen(false)}>
            <Plus className="w-4 h-4 mr-1.5" /> Lisa kuulutus
          </Link>
        </div>
      )}
    </nav>
  )
}
