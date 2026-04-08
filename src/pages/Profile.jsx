import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatPrice, formatDate } from '../utils/format'
import { Plus, Trash2, ClipboardList } from 'lucide-react'
import VehicleIcon from '../components/VehicleIcon'

export default function Profile() {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Minu profiil</h1>
        <Link to="/lisa-kuulutus" className="btn btn-primary text-sm">
          <Plus className="w-4 h-4 mr-1.5" /> Lisa kuulutus
        </Link>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="font-medium">{user.email}</div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: 'active', label: 'Aktiivsed' },
          { key: 'expired', label: 'Aegunud' },
          { key: 'all', label: 'Kõik' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.key ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.label} ({listings.filter(l => t.key === 'all' ? true : l.status === t.key).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
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
              <div key={l.id} className="card flex items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted"><VehicleIcon type={l.vehicle_type || 'scooter'} className="w-8 h-8" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/kuulutused/${l.id}`} className="font-medium text-gray-900 hover:text-primary-600 truncate block">{l.title}</Link>
                  <div className="text-sm text-primary-600 font-semibold">{formatPrice(l.price)}</div>
                  <div className="text-xs text-gray-400">{formatDate(l.created_at)} • {l.views_count || 0} vaatamist</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    l.status === 'active' ? 'bg-green-100 text-green-700' :
                    l.status === 'pending_payment' ? 'bg-yellow-100 text-yellow-700' :
                    l.status === 'expired' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {l.status === 'active' ? 'Aktiivne' : l.status === 'pending_payment' ? 'Ootab makset' : l.status === 'expired' ? 'Aegunud' : 'Müüdud'}
                  </span>
                  <button onClick={() => handleDelete(l.id)} className="text-red-400 hover:text-red-600 p-1">
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
