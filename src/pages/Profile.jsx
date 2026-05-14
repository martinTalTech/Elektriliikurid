import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDate } from '../utils/format'
import { Plus, Trash2, Eye, ClipboardList, User, Mail, Calendar, Settings, LogOut } from 'lucide-react'
import VehicleIcon from '../components/VehicleIcon'
import { usePageTitle } from '../hooks/usePageTitle'
import { VEHICLE_TYPES } from '../constants/brands'

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
      <h2 className="text-xl font-bold text-white mb-2">Logi sisse profiili vaatamiseks</h2>
      <Link to="/logi-sisse" className="btn btn-primary mt-4 inline-flex">Logi sisse</Link>
    </div>
  )

  const TABS = [
    { key: 'active',  label: 'Aktiivsed' },
    { key: 'pending_payment', label: 'Ootab makset' },
    { key: 'expired', label: 'Aegunud' },
    { key: 'all',     label: 'Kõik' },
  ]

  const filtered = listings.filter(l => {
    if (tab === 'all') return true
    return l.status === tab
  })

  const handleDelete = async (id) => {
    if (!confirm('Kustuta kuulutus?')) return
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
  }

  const statusConfig = {
    active:          { label: 'Aktiivne',      cls: 'bg-green-900/40 text-green-400 border border-green-800' },
    pending_payment: { label: 'Ootab makset',  cls: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800' },
    expired:         { label: 'Aegunud',       cls: 'bg-surface text-muted border border-surface-border' },
    sold:            { label: 'Müüdud',        cls: 'bg-blue-900/40 text-blue-400 border border-blue-800' },
    draft:           { label: 'Mustand',       cls: 'bg-surface text-muted border border-surface-border' },
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-white">Minu profiil</h1>
        <Link to="/lisa-kuulutus" className="btn btn-primary text-sm gap-1.5">
          <Plus className="w-4 h-4" /> Lisa kuulutus
        </Link>
      </div>

      {/* User info */}
      <div className="bg-dark-medium border border-surface-border rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-600/20 border border-primary-600/30 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary-400" />
        </div>
        <div>
          <div className="font-semibold text-white text-sm">{user.user_metadata?.name || 'Kasutaja'}</div>
          <div className="text-xs text-muted">{user.email}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-black text-white">{listings.length}</div>
          <div className="text-xs text-muted">kuulutust kokku</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-surface-border">
        {TABS.map(t => {
          const count = t.key === 'all' ? listings.length : listings.filter(l => l.status === t.key).length
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                tab === t.key
                  ? 'border-primary-500 text-primary-400'
                  : 'border-transparent text-muted hover:text-white'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-primary-600/20 text-primary-400' : 'bg-dark-light text-muted'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Listings */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-dark-light rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-muted">Kuulutusi ei leitud</p>
          <Link to="/lisa-kuulutus" className="btn btn-primary mt-4 inline-flex gap-1.5">
            <Plus className="w-4 h-4" /> Lisa esimene kuulutus
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(l => {
            const img = l.listing_images?.find(i => i.is_primary)?.url
            const vt = VEHICLE_TYPES.find(v => v.value === l.vehicle_type)
            const st = statusConfig[l.status] || statusConfig.draft
            return (
              <div key={l.id} className="bg-dark-medium border border-surface-border rounded-xl flex items-center gap-4 p-3 hover:border-muted transition-colors">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-dark-light flex-shrink-0">
                  {img
                    ? <img src={img} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">{vt?.icon || '🛴'}</div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link to={`/kuulutused/${l.id}`} className="font-semibold text-white hover:text-primary-400 truncate block text-sm transition-colors">
                    {l.title}
                  </Link>
                  <div className="text-sm font-black text-primary-500 mt-0.5">{formatPrice(l.price)}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                    <span>{formatDate(l.created_at)}</span>
                    <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{l.views_count || 0}</span>
                  </div>
                </div>

                {/* Status + actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${st.cls}`}>
                    {st.label}
                  </span>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    title="Kustuta"
                  >
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
