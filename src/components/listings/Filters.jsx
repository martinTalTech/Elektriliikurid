import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { BRANDS_BY_TYPE, VEHICLE_TYPES, CONDITIONS } from '../../constants/brands'
import { COUNTIES } from '../../constants/counties'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1999 }, (_, i) => CURRENT_YEAR - i)

const PRICE_OPTIONS = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000]

const MILEAGE_FROM_OPTIONS = [0, 100, 500, 1000, 2000, 5000, 10000, 20000, 50000]
const MILEAGE_TO_OPTIONS   = [100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000]

export default function Filters({ filters, onChange }) {
  const [open, setOpen] = useState({ listing_type: true, type: true, price: true, year: true, mileage: true })

  const selectedTypes = filters.vehicle_types || []
  const brands = selectedTypes.length === 1 ? (BRANDS_BY_TYPE[selectedTypes[0]] || []) : []

  const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  const set = (key, val) => onChange({ ...filters, [key]: val, page: 0 })

  const toggleListingType = (val) => {
    const cur = filters.listing_types || []
    set('listing_types', cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val])
  }

  const toggleVehicleType = (val) => {
    const cur = filters.vehicle_types || []
    set('vehicle_types', cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val])
  }

  const toggleCounty = (val) => {
    const cur = filters.counties || []
    set('counties', cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val])
  }

  const activeCount = Object.entries(filters).filter(([k, v]) =>
    !['page', 'sort', 'limit'].includes(k) && v && (Array.isArray(v) ? v.length : true)
  ).length

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-white text-sm">Filtrid</h2>
        {activeCount > 0 && (
          <button
            onClick={() => onChange({ page: 0, sort: filters.sort, limit: filters.limit })}
            className="text-xs text-primary-500 hover:text-primary-400 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Tühjenda ({activeCount})
          </button>
        )}
      </div>

      {/* Kuulutuse liik */}
      <FilterSection title="Kuulutuse liik" open={open.listing_type} toggle={() => toggle('listing_type')}>
        <div className="space-y-2 pt-1">
          {[
            { value: 'sale',    label: 'Müük' },
            { value: 'rent',    label: 'Rent' },
            { value: 'auction', label: 'Oksjon' },
            { value: 'wanted',  label: 'Otsitakse' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                value={opt.value}
                checked={(filters.listing_types || []).includes(opt.value)}
                onChange={() => toggleListingType(opt.value)}
              />
              <span className="text-sm text-muted-light group-hover:text-white transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Sõiduki tüüp — multi-select checkboxid */}
      <FilterSection title="Sõiduki tüüp" open={open.type} toggle={() => toggle('type')}>
        <div className="space-y-2 pt-1">
          {VEHICLE_TYPES.map(t => (
            <label key={t.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                value={t.value}
                checked={selectedTypes.includes(t.value)}
                onChange={() => toggleVehicleType(t.value)}
              />
              <span className="text-sm text-muted-light group-hover:text-white transition-colors">
                {t.icon} {t.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Mark — ainult kui täpselt 1 tüüp valitud */}
      {brands.length > 0 && (
        <FilterSection title="Mark" open={open.brand} toggle={() => toggle('brand')}>
          <select
            value={filters.brand || ''}
            onChange={e => set('brand', e.target.value || undefined)}
            className="input text-sm mt-1"
          >
            <option value="">Kõik margid</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </FilterSection>
      )}

      {/* Hind */}
      <FilterSection title="Hind (€)" open={open.price} toggle={() => toggle('price')}>
        <div className="flex gap-2 mt-1">
          <select value={filters.price_from || ''} onChange={e => set('price_from', e.target.value || undefined)} className="input text-sm w-1/2">
            <option value="">Alates</option>
            {PRICE_OPTIONS.map(p => <option key={p} value={p}>{p === 0 ? '0 €' : `${p.toLocaleString('et')} €`}</option>)}
          </select>
          <select value={filters.price_to || ''} onChange={e => set('price_to', e.target.value || undefined)} className="input text-sm w-1/2">
            <option value="">Kuni</option>
            {PRICE_OPTIONS.filter(p => p > 0).map(p => <option key={p} value={p}>{p === 10000 ? '10 000+ €' : `${p.toLocaleString('et')} €`}</option>)}
          </select>
        </div>
      </FilterSection>

      {/* Aastakäik */}
      <FilterSection title="Aastakäik" open={open.year} toggle={() => toggle('year')}>
        <div className="flex gap-2 mt-1">
          <select value={filters.year_from || ''} onChange={e => set('year_from', e.target.value || undefined)} className="input text-sm w-1/2">
            <option value="">Alates</option>
            {YEARS.slice().reverse().map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={filters.year_to || ''} onChange={e => set('year_to', e.target.value || undefined)} className="input text-sm w-1/2">
            <option value="">Kuni</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </FilterSection>

      {/* Läbisõit */}
      <FilterSection title="Läbisõit (km)" open={open.mileage} toggle={() => toggle('mileage')}>
        <div className="flex gap-2 mt-1">
          <select value={filters.mileage_from || ''} onChange={e => set('mileage_from', e.target.value || undefined)} className="input text-sm w-1/2">
            <option value="">Alates</option>
            {MILEAGE_FROM_OPTIONS.map(m => <option key={m} value={m}>{m.toLocaleString('et')} km</option>)}
          </select>
          <select value={filters.mileage_to || ''} onChange={e => set('mileage_to', e.target.value || undefined)} className="input text-sm w-1/2">
            <option value="">Kuni</option>
            {MILEAGE_TO_OPTIONS.map(m => <option key={m} value={m}>{m === 100000 ? '100 000+ km' : `${m.toLocaleString('et')} km`}</option>)}
          </select>
        </div>
      </FilterSection>

      {/* Seisund */}
      <FilterSection title="Seisund" open={open.condition} toggle={() => toggle('condition')}>
        <div className="space-y-2 pt-1">
          {CONDITIONS.map(c => (
            <label key={c.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                value={c.value}
                checked={(filters.condition || []).includes(c.value)}
                onChange={e => {
                  const cur = filters.condition || []
                  set('condition', e.target.checked ? [...cur, c.value] : cur.filter(v => v !== c.value))
                }}
              />
              <span className="text-sm text-muted-light group-hover:text-white transition-colors">{c.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Maakond — multi-select checkboxid */}
      <FilterSection title="Maakond" open={open.county} toggle={() => toggle('county')}>
        <div className="space-y-2 pt-1 max-h-48 overflow-y-auto pr-1">
          {COUNTIES.map(c => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                value={c}
                checked={(filters.counties || []).includes(c)}
                onChange={() => toggleCounty(c)}
              />
              <span className="text-sm text-muted-light group-hover:text-white transition-colors">{c}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, open = true, toggle, children }) {
  return (
    <div className="border-b border-surface-border pb-3 pt-3 first:pt-0">
      <button
        onClick={toggle}
        className="flex items-center justify-between w-full text-xs font-bold text-muted-light uppercase tracking-wider hover:text-white transition-colors"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open !== false && <div>{children}</div>}
    </div>
  )
}
