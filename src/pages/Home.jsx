import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Zap, TrendingUp, ShieldCheck } from 'lucide-react'
import { useListings } from '../hooks/useListings'
import ListingGrid from '../components/listings/ListingGrid'
import { COUNTIES } from '../constants/counties'

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState({ type: '', price_to: '', county: '' })
  const { listings, loading } = useListings({ limit: 8 })

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search.type) params.set('type', search.type)
    if (search.price_to) params.set('price_to', search.price_to)
    if (search.county) params.set('county', search.county)
    navigate(`/kuulutused?${params}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-10 h-10 fill-white" />
            <h1 className="text-4xl md:text-5xl font-extrabold">elektriliikurid.ee</h1>
          </div>
          <p className="text-xl text-primary-100 mb-8">
            Eesti suurim kasutatud elektriliikurite turg
          </p>
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="label text-gray-700">Sõiduki tüüp</label>
                <select value={search.type} onChange={e => setSearch(s => ({ ...s, type: e.target.value }))} className="input">
                  <option value="">Kõik tüübid</option>
                  <option value="scooter">🛴 Tõukeratas</option>
                  <option value="cross">🏍️ Elektri krossikas</option>
                  <option value="mopeed">🛵 Elektri mopeed</option>
                  <option value="jalgratas">🚲 Elektri jalgratas</option>
                </select>
              </div>
              <div>
                <label className="label text-gray-700">Hind kuni (€)</label>
                <input type="number" placeholder="nt. 1500" value={search.price_to} onChange={e => setSearch(s => ({ ...s, price_to: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="label text-gray-700">Asukoht</label>
                <select value={search.county} onChange={e => setSearch(s => ({ ...s, county: e.target.value }))} className="input">
                  <option value="">Kõik maakonnad</option>
                  {COUNTIES.map(c => <option key={c} value={c}>{c} maakond</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-full mt-4 text-base">
              <Search className="w-5 h-5 mr-2" /> Detailsem otsing
            </button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-8 h-8 text-primary-600" />, title: 'Ainult elektriliikurid', desc: 'Fokuseeritud platvorm — leia täpselt see, mida otsid' },
              { icon: <ShieldCheck className="w-8 h-8 text-primary-600" />, title: 'Turvaline tehing', desc: 'Registreeritud kasutajad, läbipaistev ajalugu' },
              { icon: <TrendingUp className="w-8 h-8 text-primary-600" />, title: 'Kasvav kogukond', desc: 'Kuulutused üle Eesti' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-xl p-6 flex gap-4 items-start border border-gray-100">
                {f.icon}
                <div>
                  <h3 className="font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest listings */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Viimati lisatud</h2>
          <a href="#/kuulutused" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Vaata kõiki →
          </a>
        </div>
        <ListingGrid listings={listings} loading={loading} />
      </section>
    </div>
  )
}
