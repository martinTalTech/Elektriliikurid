import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDate } from '../utils/format'
import { Plus, Trash2, ClipboardList, User, Mail, Calendar, Settings, LogOut } from 'lucide-react'
import VehicleIcon from '../components/VehicleIcon'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Profile() {
  usePageTitle('Minu profiil')
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('active')

  useEffect(() => {
    if (!user) return
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('listings')
        .select('*, listing_images(url, is_primary)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setListings(data || [])
      setLoading(false)
    }
    load()
  }, [user])

  if (!user) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-semibold mb-2">Logi sisse profiili vaatamiseks</h2>
      <Link to="/logi-sisse" className="btn btn-primary mt-4 inline-flex">Logi sisse</Link>
    </div>
  )

  const filtered = listings.filter(l => {
    if (tab === 'active') return l.status === 'active'
    if (tab === 'expired') return l.status === 'expired'
    return true
  })

  const handleDelete = async (id) => {
    if (!confirm('Kustuta kuulutus?')) return
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
  }

  const displayName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0]
  const initials = displayName ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  const memberSince = user.created_at ? new Date(user.created_at).toLocaleDateString('et-EE', { year: 'numeric', month: 'long' }) : ''

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.hash = '#/'
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile header */}
      <div className="bg-dark-medium border border-surface-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">{displayName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-muted flex-shrink-0" />
              <span className="text-muted-light text-sm">{user.email}</span>
            </div>
            {memberSince && (
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-muted flex-shrink-0" />
                <span className="text-muted text-sm">Liitunud {memberSince}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/lisa-kuulutus" className="btn btn-primary text-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Lisa kuulutus
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary text-sm gap-1.5" title="Logi välja">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-surface-border">
        {[
          { key: 'active', label: 'Aktiivsed' },
          { key: 'expired', label: 'Aegunud' },
          { key: 'all', label: 'Kõik' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.key ? 'border-primary-500 text-primary-400' : 'border-transparent text-muted hover:text-muted-light'}`}
          >
            {t.label} ({listings.filter(l => t.key === 'all' ? true : l.status === t.key).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-dark-light rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-light border border-surface-border mb-4">
            <ClipboardList className="w-7 h-7 text-muted" />
          </div>
          <p className="text-muted">Kuulutusi ei leitud</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(l => {
            const img = l.listing_images?.find(i => i.is_primary)?.url
            return (
              <div key={l.id} className="bg-dark-medium border border-surface-border rounded-xl flex items-center gap-4 p-4 hover:border-primary-500/30 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-light flex-shrink-0">
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted"><VehicleIcon type={l.vehicle_type || 'scooter'} className="w-8 h-8" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/kuulutused/${l.id}`} className="font-medium text-white hover:text-primary-400 truncate block">{l.title}</Link>
                  <div className="text-sm text-primary-400 font-semibold">{formatPrice(l.price)}</div>
                  <div className="text-xs text-muted">{formatDate(l.created_at)} • {l.views_count || 0} vaatamist</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    l.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    l.status === 'pending_payment' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                    l.status === 'expired' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {l.status === 'active' ? 'Aktiivne' : l.status === 'pending_payment' ? 'Ootab makset' : l.status === 'expired' ? 'Aegunud' : 'Müüdud'}
                  </span>
                  <button onClick={() => handleDelete(l.id)} className="text-red-400 hover:text-red-300 p-1 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
