import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Zap, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react'
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
      <section className="relative overflow-hidden bg-dark-medium">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-dark-darkest pointer-events-none" />
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-600/20 text-primary-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            Eesti nr. 1 elektriliikurite turg
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Osta ja müü<br />
            <span className="text-primary-500">elektriliikureid</span>
          </h1>
          <p className="text-lg text-muted-light mb-10 max-w-xl mx-auto">
            Tõukerattad, elektri krossikad, mopeedid ja jalgratttad — kõik ühes kohas üle Eesti.
          </p>

          {/* Search form */}
          <div className="bg-dark-light border border-surface-border rounded-2xl p-4 md:p-5 shadow-card-hover text-left">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="label">Sõiduki tüüp</label>
                  <select
                    value={search.type}
                    onChange={e => setSearch(s => ({ ...s, type: e.target.value }))}
                    className="input"
                  >
                    <option value="">Kõik tüübid</option>
                    <option value="scooter">🛴 Tõukeratas</option>
                    <option value="cross">🏍️ Elektri krossikas</option>
                    <option value="mopeed">🛵 Elektri mopeed</option>
                    <option value="jalgratas">🚲 Elektri jalgratas</option>
                  </select>
                </div>
                <div>
                  <label className="label">Hind kuni (€)</label>
                  <input
                    type="number"
                    placeholder="nt. 1500"
                    value={search.price_to}
                    onChange={e => setSearch(s => ({ ...s, price_to: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Asukoht</label>
                  <select
                    value={search.county}
                    onChange={e => setSearch(s => ({ ...s, county: e.target.value }))}
                    className="input"
                  >
                    <option value="">Kõik maakonnad</option>
                    {COUNTIES.map(c => <option key={c} value={c}>{c} maakond</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full mt-3 text-base font-bold gap-2">
                <Search className="w-5 h-5" /> Otsi kuulutusi
              </button>
            </form>
          </div>
        </div>

        {/* Category quick links */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { emoji: '🛴', label: 'Tõukerattad', value: 'scooter' },
              { emoji: '🏍️', label: 'Krossikad', value: 'cross' },
              { emoji: '🛵', label: 'Mopeedid', value: 'mopeed' },
              { emoji: '🚲', label: 'Jalgrattad', value: 'jalgratas' },
            ].map(cat => (
              <Link
                key={cat.value}
                to={`/kuulutused?type=${cat.value}`}
                className="flex items-center gap-3 bg-dark-darkest border border-surface-border rounded-xl px-4 py-3 hover:border-primary-600/50 hover:bg-dark-light transition-all group"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="border-b border-surface-border bg-dark-darkest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Zap className="w-6 h-6 text-primary-500" />,
                title: 'Ainult elektriliikurid',
                desc: 'Fokuseeritud platvorm — leia täpselt see, mida otsid, ilma mürata.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-primary-500" />,
                title: 'Turvaline tehing',
                desc: 'Registreeritud kasutajad ja läbipaistev kuulutuste ajalugu.',
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-primary-500" />,
                title: 'Kasvav kogukond',
                desc: 'Kuulutused üle kogu Eesti — müüjad ja ostjad samas kohas.',
              },
            ].map(f => (
              <div key={f.title} className="flex gap-4 items-start bg-dark-medium border border-surface-border rounded-xl p-5 hover:border-primary-600/30 transition-colors">
                <div className="bg-primary-600/10 rounded-lg p-2.5 flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Viimati lisatud</h2>
            <p className="text-sm text-muted mt-1">Värskeimad kuulutused platvormil</p>
          </div>
          <Link
            to="/kuulutused"
            className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors"
          >
            Vaata kõiki <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <ListingGrid listings={listings} loading={loading} />
      </section>

      {/* CTA */}
      <section className="bg-dark-medium border-t border-surface-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-3xl font-black text-white mb-3">
            Soovid oma elektriliikuri <span className="text-primary-500">müüa?</span>
          </h2>
          <p className="text-muted-light mb-8 max-w-md mx-auto">
            Lisa kuulutus tasuta ja jõua tuhande huvitatud ostjani üle Eesti.
          </p>
          <Link to="/lisa-kuulutus" className="btn btn-primary btn-lg gap-2 text-base font-bold">
            <Zap className="w-5 h-5" /> Lisa kuulutus tasuta
          </Link>
        </div>
      </section>
    </div>
  )
}
