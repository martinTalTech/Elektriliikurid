import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { SCOOTER_BRANDS, CROSS_BRANDS, MOPED_BRANDS, EBIKE_BRANDS, CONDITIONS } from '../../constants/brands'
import { COUNTIES } from '../../constants/counties'

export default function Filters({ filters, onChange }) {
  const [open, setOpen] = useState({})
  const brands =
    filters.vehicle_type === 'cross' ? CROSS_BRANDS :
      filters.vehicle_type === 'mopeed' ? MOPED_BRANDS :
        filters.vehicle_type === 'jalgratas' ? EBIKE_BRANDS :
          SCOOTER_BRANDS

  const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  const set = (key, val) => onChange({ ...filters, [key]: val, page: 0 })

  const activeCount = Object.entries(filters).filter(([k, v]) =>
    !['page', 'sort', 'limit'].includes(k) && v && (Array.isArray(v) ? v.length : true)
  ).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Filtrid</h2>
        {activeCount > 0 && (
          <button
            onClick={() => onChange({ page: 0, sort: filters.sort })}
            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Tühjenda ({activeCount})
          </button>
        )}
      </div>

      {/* Tüüp */}
      <FilterSection title="Sõiduki tüüp" open={open.type} toggle={() => toggle('type')}>
        <div className="space-y-2">
          {[
            { value: '', label: 'Kõik' },
            { value: 'scooter', label: '🛴 Tõukeratas' },
            { value: 'cross', label: '🏍️ Elektro-krossika' },
            { value: 'mopeed', label: '🛵 Elektri mopeed' },
            { value: 'jalgratas', label: '🚲 Elektri jalgratas' }
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="vehicle_type"
                value={opt.value}
                checked={(filters.vehicle_type || '') === opt.value}
                onChange={() => set('vehicle_type', opt.value || undefined)}
                className="text-primary-600"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Mark */}
      <FilterSection title="Mark" open={open.brand} toggle={() => toggle('brand')}>
        <select
          value={filters.brand || ''}
          onChange={e => set('brand', e.target.value || undefined)}
          className="input text-sm"
        >
          <option value="">Kõik margid</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </FilterSection>

      {/* Hind */}
      <FilterSection title="Hind (€)" open={open.price} toggle={() => toggle('price')}>
        <div className="flex gap-2">
          <input type="number" placeholder="Alates" value={filters.price_from || ''} onChange={e => set('price_from', e.target.value || undefined)} className="input text-sm w-1/2" />
          <input type="number" placeholder="Kuni" value={filters.price_to || ''} onChange={e => set('price_to', e.target.value || undefined)} className="input text-sm w-1/2" />
        </div>
      </FilterSection>

      {/* Aastakäik */}
      <FilterSection title="Aastakäik" open={open.year} toggle={() => toggle('year')}>
        <div className="flex gap-2">
          <input type="number" placeholder="Alates" min="2015" max="2025" value={filters.year_from || ''} onChange={e => set('year_from', e.target.value || undefined)} className="input text-sm w-1/2" />
          <input type="number" placeholder="Kuni" min="2015" max="2025" value={filters.year_to || ''} onChange={e => set('year_to', e.target.value || undefined)} className="input text-sm w-1/2" />
        </div>
      </FilterSection>

      {/* Läbisõit */}
      <FilterSection title="Läbisõit (km)" open={open.mileage} toggle={() => toggle('mileage')}>
        <input type="number" placeholder="Kuni km" value={filters.mileage_to || ''} onChange={e => set('mileage_to', e.target.value || undefined)} className="input text-sm" />
      </FilterSection>

      {/* Seisund */}
      <FilterSection title="Seisund" open={open.condition} toggle={() => toggle('condition')}>
        <div className="space-y-2">
          {CONDITIONS.map(c => (
            <label key={c.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                value={c.value}
                checked={(filters.condition || []).includes(c.value)}
                onChange={e => {
                  const cur = filters.condition || []
                  set('condition', e.target.checked ? [...cur, c.value] : cur.filter(v => v !== c.value))
                }}
                className="text-primary-600 rounded"
              />
              <span className="text-sm">{c.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Maakond */}
      <FilterSection title="Maakond" open={open.county} toggle={() => toggle('county')}>
        <select value={filters.county || ''} onChange={e => set('county', e.target.value || undefined)} className="input text-sm">
          <option value="">Kõik maakonnad</option>
          {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, open = true, toggle, children }) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <button onClick={toggle} className="flex items-center justify-between w-full text-sm font-medium text-gray-700 mb-2">
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open !== false && <div>{children}</div>}
    </div>
  )
}
