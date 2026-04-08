import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Zap, TrendingUp, ShieldCheck, ArrowRight, X, ClipboardList, Handshake } from 'lucide-react'
import { useListings } from '../hooks/useListings'
import ListingGrid from '../components/listings/ListingGrid'
import VehicleIcon from '../components/VehicleIcon'
import { COUNTIES } from '../constants/counties'
import { VEHICLE_TYPES } from '../constants/brands'

const CATEGORIES = [
  { value: 'scooter',   label: 'Elektri tõukerattad', bg: 'from-emerald-600/20 to-emerald-800/30', border: 'border-emerald-600/30 hover:border-emerald-500/60', color: 'text-emerald-400' },
  { value: 'jalgratas', label: 'Elektri jalgrattad',  bg: 'from-teal-600/20 to-teal-800/30',    border: 'border-teal-600/30 hover:border-teal-500/60', color: 'text-teal-400' },
  { value: 'mopeed',    label: 'Elektri mopeedid',    bg: 'from-blue-600/20 to-blue-800/30',     border: 'border-blue-600/30 hover:border-blue-500/60', color: 'text-blue-400' },
  { value: 'cross',     label: 'Elektri krossikad',   bg: 'from-orange-600/20 to-orange-800/30', border: 'border-orange-600/30 hover:border-orange-500/60', color: 'text-orange-400' },
  { value: 'rula',      label: 'Elektri rulad',       bg: 'from-purple-600/20 to-purple-800/30',  border: 'border-purple-600/30 hover:border-purple-500/60', color: 'text-purple-400' },
  { value: 'monoratas', label: 'Monorattad',           bg: 'from-yellow-600/20 to-yellow-800/30', border: 'border-yellow-600/30 hover:border-yellow-500/60', color: 'text-yellow-400' },
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
      <section className="relative bg-dark-medium">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-transparent to-dark-darkest pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary-600/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-10 text-center">
          <div className="animate-fade-in-up inline-flex items-center gap-2 bg-primary-600/10 border border-primary-600/20 text-primary-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            OST, MÜÜK, RENT JA OKSJON
          </div>

          <h1 className="animate-fade-in-up-delay-1 text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
            Osta ja müü{' '}
            <span className="text-primary-500">elektriliikureid</span>
          </h1>
          <p className="animate-fade-in-up-delay-2 text-base sm:text-lg text-muted-light mb-8 max-w-xl mx-auto">
            Elektri tõukerattad, rulad, krossikad, mopeedid, jalgrattad ja monorattad — kõik ühes kohas üle Eesti.
          </p>

          {/* Search form */}
          <div className="animate-fade-in-up-delay-3 bg-dark-light/80 backdrop-blur-sm border border-surface-border rounded-2xl p-4 md:p-5 shadow-card-hover text-left overflow-visible">
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
                        className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border-2 text-center transition-all duration-200 ${
                          active
                            ? 'border-primary-500 bg-primary-600/15 text-primary-400 shadow-lg shadow-primary-600/10'
                            : 'border-surface-border hover:border-muted hover:bg-dark-lighter text-muted-light'
                        }`}
                      >
                        <VehicleIcon type={t.value} className="w-7 h-7" />
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
                        <span key={v} className="inline-flex items-center gap-1.5 bg-primary-600/20 text-primary-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                          <VehicleIcon type={v} className="w-3.5 h-3.5" />
                          {t?.label}
                          <button type="button" onClick={() => toggleType(v)} className="hover:text-white ml-0.5"><X className="w-3 h-3" /></button>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Price + County + Button */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
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
                    <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-dark-medium border border-surface-border rounded-xl shadow-card-hover max-h-56 overflow-y-auto">
                      {COUNTIES.map(c => (
                        <label key={c} className="flex items-center gap-2.5 px-3 py-2 hover:bg-dark-light cursor-pointer transition-colors">
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

                <button type="submit" className="btn btn-primary btn-lg font-bold gap-2 sm:px-8">
                  <Search className="w-5 h-5" /> Otsi
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="bg-dark-darkest border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white">Sirvi kategooria järgi</h2>
            <Link to="/kuulutused" className="text-sm text-primary-500 hover:text-primary-400 transition-colors flex items-center gap-1 font-semibold">
              Kõik kuulutused <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.value}
                to={`/kuulutused?type=${cat.value}`}
                className={`group relative overflow-hidden rounded-xl border ${cat.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} group-hover:opacity-100 transition-opacity`} />
                <div className="relative p-5 flex flex-col items-center text-center gap-3 min-h-[110px] justify-center">
                  <VehicleIcon type={cat.value} className={`w-10 h-10 ${cat.color} group-hover:scale-110 transition-transform duration-300`} />
                  <span className="text-sm font-bold text-white leading-tight">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-surface-border bg-dark-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">Kuidas see töötab?</h2>
            <p className="text-muted-light text-sm">Kolm lihtsat sammu elektriliikuri ostmiseks või müümiseks</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: <Search className="w-7 h-7 text-primary-500" />, title: 'Otsi või lisa kuulutus', desc: 'Sirvi kategooriaid ja filtreeri tulemusi. Müüjana lisa kuulutus mõne minutiga.' },
              { step: '02', icon: <ClipboardList className="w-7 h-7 text-primary-500" />, title: 'Vaata detaile', desc: 'Uuri tehnilist infot, pilte ja müüja kontaktandmeid. Kõik oluline on kohe näha.' },
              { step: '03', icon: <Handshake className="w-7 h-7 text-primary-500" />, title: 'Võta ühendust', desc: 'Lepi kokku vaatamine ja tehing otse müüjaga. Lihtne ja turvaline.' },
            ].map(s => (
              <div key={s.step} className="relative bg-dark-light border border-surface-border rounded-xl p-6 hover:border-primary-600/30 transition-all duration-300 group">
                <div className="absolute top-4 right-4 text-4xl font-black text-dark-lighter group-hover:text-primary-900/30 transition-colors">{s.step}</div>
                <div className="bg-primary-600/10 rounded-xl p-3 w-fit mb-4">{s.icon}</div>
                <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / feature cards */}
      <section className="border-b border-surface-border bg-dark-darkest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Zap className="w-6 h-6 text-primary-500" />, title: 'Ainult elektriliikurid', desc: 'Fokuseeritud platvorm — leia täpselt see, mida otsid, ilma mürata.' },
              { icon: <ShieldCheck className="w-6 h-6 text-primary-500" />, title: 'Turvaline tehing', desc: 'Registreeritud kasutajad ja läbipaistev kuulutuste ajalugu.' },
              { icon: <TrendingUp className="w-6 h-6 text-primary-500" />, title: 'Kasvav kogukond', desc: 'Kuulutused üle kogu Eesti — müüjad ja ostjad samas kohas.' },
            ].map(f => (
              <div key={f.title} className="flex gap-4 items-start bg-dark-medium border border-surface-border rounded-xl p-5 hover:border-primary-600/30 transition-all duration-300 hover:-translate-y-0.5">
                <div className="bg-primary-600/10 rounded-lg p-2.5 flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
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
      <section className="bg-gradient-to-br from-primary-900/20 via-dark-medium to-dark-medium border-t border-surface-border relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-3xl font-black text-white mb-3">
            Soovid oma elektriliikuri <span className="text-primary-500">müüa?</span>
          </h2>
          <p className="text-muted-light mb-8 max-w-md mx-auto text-base">
            Lisa kuulutus ja jõua tuhande huvitatud ostjani üle Eesti.
          </p>
          <Link to="/lisa-kuulutus" className="btn btn-primary btn-lg gap-2 text-base font-bold">
            <Zap className="w-5 h-5" /> Lisa kuulutus
          </Link>
        </div>
      </section>
    </div>
  )
}
