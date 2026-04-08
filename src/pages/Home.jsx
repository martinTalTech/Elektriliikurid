import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Zap, TrendingUp, ShieldCheck, ArrowRight, X } from 'lucide-react'
import { useListings } from '../hooks/useListings'
import ListingGrid from '../components/listings/ListingGrid'
import { COUNTIES } from '../constants/counties'
import { VEHICLE_TYPES } from '../constants/brands'

// Category cards with gradient backgrounds
const CATEGORIES = [
  { value: 'scooter',   label: 'Tõukerattad',        icon: '🛴', bg: 'from-emerald-900 to-emerald-800',  count: null },
  { value: 'jalgratas', label: 'Elektri jalgrattad',  icon: '🚲', bg: 'from-teal-900 to-teal-800',       count: null },
  { value: 'mopeed',    label: 'Elektri mopeedid',    icon: '🛵', bg: 'from-blue-900 to-blue-800',        count: null },
  { value: 'cross',     label: 'Elektri krossikad',   icon: '🏍️', bg: 'from-orange-900 to-orange-800',   count: null },
  { value: 'rula',      label: 'Elektri rulad',       icon: '🛹', bg: 'from-purple-900 to-purple-800',    count: null },
  { value: 'monoratas', label: 'Monorattad',           icon: '🔵', bg: 'from-yellow-900 to-yellow-800',   count: null },
]

export default function Home() {
  const navigate = useNavigate()
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedCounties, setSelectedCounties] = useState([])
  const [price_to, setPriceTo] = useState('')
  const [countyOpen, setCountyOpen] = useState(false)
  const { listings, loading } = useListings({ limit: 8 })

  const toggleType = (val) =>
    setSelectedTypes(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])

  const toggleCounty = (val) =>
    setSelectedCounties(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    selectedTypes.forEach(t => params.append('type', t))
    selectedCounties.forEach(c => params.append('county', c))
    if (price_to) params.set('price_to', price_to)
    navigate(`/kuulutused?${params}`)
  }

  const countyLabel = selectedCounties.length === 0
    ? 'Kõik maakonnad'
    : selectedCounties.length === 1
    ? selectedCounties[0]
    : `${selectedCounties.length} maakonda`

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-dark-medium">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-dark-darkest pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-600/20 text-primary-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            OST, MÜÜK, RENT JA OKSJON
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Osta ja müü<br />
            <span className="text-primary-500">elektriliikureid</span>
          </h1>
          <p className="text-lg text-muted-light mb-10 max-w-xl mx-auto">
            Tõukerattad, rulad, krossikad, mopeedid, jalgrattad ja monorattad — kõik ühes kohas üle Eesti.
          </p>

          {/* Search form */}
          <div className="bg-dark-light border border-surface-border rounded-2xl p-4 md:p-5 shadow-card-hover text-left">
            <form onSubmit={handleSearch}>

              {/* Vehicle type multi-select */}
              <div className="mb-4">
                <label className="label">Sõiduki tüüp <span className="normal-case font-normal text-muted">(vali üks või mitu)</span></label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {VEHICLE_TYPES.map(t => {
                    const active = selectedTypes.includes(t.value)
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => toggleType(t.value)}
                        className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 text-center transition-all ${
                          active
                            ? 'border-primary-500 bg-primary-600/15 text-primary-400'
                            : 'border-surface-border hover:border-muted text-muted-light'
                        }`}
                      >
                        <span className="text-xl leading-none">{t.icon}</span>
                        <span className="text-xs font-semibold leading-tight">{t.label.split(' ').pop()}</span>
                      </button>
                    )
                  })}
                </div>
                {selectedTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedTypes.map(v => {
                      const t = VEHICLE_TYPES.find(x => x.value === v)
                      return (
                        <span key={v} className="inline-flex items-center gap-1 bg-primary-600/20 text-primary-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                          {t?.icon} {t?.label}
                          <button type="button" onClick={() => toggleType(v)} className="hover:text-white"><X className="w-3 h-3" /></button>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Price */}
                <div>
                  <label className="label">Hind kuni (€)</label>
                  <input
                    type="number"
                    placeholder="nt. 1500"
                    value={price_to}
                    onChange={e => setPriceTo(e.target.value)}
                    className="input"
                  />
                </div>

                {/* County multi-select */}
                <div className="relative">
                  <label className="label">Asukoht <span className="normal-case font-normal text-muted">(vali mitu)</span></label>
                  <button
                    type="button"
                    onClick={() => setCountyOpen(o => !o)}
                    className="input text-left flex items-center justify-between"
                  >
                    <span className={selectedCounties.length ? 'text-white' : 'text-muted'}>{countyLabel}</span>
                    <span className="text-muted text-xs">{countyOpen ? '▲' : '▼'}</span>
                  </button>
                  {countyOpen && (
                    <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-dark-medium border border-surface-border rounded-xl shadow-card-hover max-h-56 overflow-y-auto">
                      {COUNTIES.map(c => (
                        <label key={c} className="flex items-center gap-2.5 px-3 py-2 hover:bg-dark-light cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCounties.includes(c)}
                            onChange={() => toggleCounty(c)}
                          />
                          <span className="text-sm text-muted-light">{c}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full mt-4 text-base font-bold gap-2">
                <Search className="w-5 h-5" /> Otsi kuulutusi
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Category cards with images */}
      <section className="bg-dark-darkest border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black text-white">Sirvi kategooria järgi</h2>
            <Link to="/kuulutused" className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1">
              Kõik kuulutused <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.value}
                to={`/kuulutused?type=${cat.value}`}
                className="group relative overflow-hidden rounded-xl border border-surface-border hover:border-primary-600/40 transition-all"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-4 flex flex-col items-center text-center gap-2 min-h-[96px] justify-center">
                  <span className="text-4xl leading-none drop-shadow-lg">{cat.icon}</span>
                  <span className="text-xs font-bold text-white leading-tight">{cat.label}</span>
                </div>
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
              { icon: <Zap className="w-6 h-6 text-primary-500" />, title: 'Ainult elektriliikurid', desc: 'Fokuseeritud platvorm — leia täpselt see, mida otsid, ilma mürata.' },
              { icon: <ShieldCheck className="w-6 h-6 text-primary-500" />, title: 'Turvaline tehing', desc: 'Registreeritud kasutajad ja läbipaistev kuulutuste ajalugu.' },
              { icon: <TrendingUp className="w-6 h-6 text-primary-500" />, title: 'Kasvav kogukond', desc: 'Kuulutused üle kogu Eesti — müüjad ja ostjad samas kohas.' },
            ].map(f => (
              <div key={f.title} className="flex gap-4 items-start bg-dark-medium border border-surface-border rounded-xl p-5 hover:border-primary-600/30 transition-colors">
                <div className="bg-primary-600/10 rounded-lg p-2.5 flex-shrink-0">{f.icon}</div>
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
          <Link to="/kuulutused" className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-400 transition-colors">
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
