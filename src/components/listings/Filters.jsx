import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { SCOOTER_BRANDS, CROSS_BRANDS, MOPED_BRANDS, EBIKE_BRANDS, RULA_BRANDS, MONO_BRANDS, CONDITIONS } from '../../constants/brands'
import { COUNTIES } from '../../constants/counties'

export default function Filters({ filters, onChange }) {
  const [open, setOpen] = useState({ listing_type: true, type: true, price: true })

  const brandMap = { scooter: SCOOTER_BRANDS, cross: CROSS_BRANDS, mopeed: MOPED_BRANDS, jalgratas: EBIKE_BRANDS, rula: RULA_BRANDS, monoratas: MONO_BRANDS }
  const selectedTypes = filters.vehicle_types || []
  const brands = selectedTypes.length === 1
    ? brandMap[selectedTypes[0]] || SCOOTER_BRANDS
    : [...new Set(Object.values(brandMap).flat())].sort()

  const toggle = (key) => setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  const set = (key, val) => onChange({ ...filters, [key]: val, page: 0 })

  const activeCount = Object.entries(filters).reduce((sum, [k, v]) => {
    if (['page', 'sort', 'limit'].includes(k) || !v) return sum
    return sum + (Array.isArray(v) ? v.length : 1)
  }, 0)

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
            { value: 'sale', label: 'Müük' },
            { value: 'rent', label: 'Rent' },
            { value: 'auction', label: 'Oksjon' },
            { value: 'wanted', label: 'Otsitakse' },
          ].map(opt => {
            const selected = (filters.listing_types || []).includes(opt.value)
            return (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    const cur = filters.listing_types || []
                    const next = selected ? cur.filter(v => v !== opt.value) : [...cur, opt.value]
                    set('listing_types', next.length ? next : undefined)
                  }}
                />
                <span className="text-sm text-muted-light group-hover:text-white transition-colors">{opt.label}</span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Tüüp */}
      <FilterSection title="Sõiduki tüüp" open={open.type} toggle={() => toggle('type')}>
        <div className="space-y-2 pt-1">
          {[
            { value: 'scooter', label: 'Elektri tõukeratas' },
            { value: 'cross', label: 'Elektri krossikas' },
            { value: 'mopeed', label: 'Elektri mopeed' },
            { value: 'jalgratas', label: 'Elektri jalgratas' },
            { value: 'rula', label: 'Elektri rula' },
            { value: 'monoratas', label: 'Monoratas' },
          ].map(opt => {
            const selected = (filters.vehicle_types || []).includes(opt.value)
            return (
              <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    const cur = filters.vehicle_types || []
                    const next = selected ? cur.filter(v => v !== opt.value) : [...cur, opt.value]
                    set('vehicle_types', next.length ? next : undefined)
                  }}
                />
                <span className="text-sm text-muted-light group-hover:text-white transition-colors">{opt.label}</span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Mark */}
      <FilterSection title="Mark" open={open.brand} toggle={() => toggle('brand')}>
        <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
          {brands.filter(b => b !== 'Muu').map(b => {
            const selected = (filters.brands || []).includes(b)
            return (
              <label key={b} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    const cur = filters.brands || []
                    const next = selected ? cur.filter(v => v !== b) : [...cur, b]
                    set('brands', next.length ? next : undefined)
                  }}
                />
                <span className="text-sm text-muted-light group-hover:text-white transition-colors">{b}</span>
              </label>
            )
          })}
          {/* Muu - alati kõige all */}
          <label className="flex items-center gap-2.5 cursor-pointer group border-t border-surface-border pt-2 mt-1">
            <input
              type="checkbox"
              checked={(filters.brands || []).includes('Muu')}
              onChange={() => {
                const cur = filters.brands || []
                const hasMuu = cur.includes('Muu')
                const next = hasMuu ? cur.filter(v => v !== 'Muu') : [...cur, 'Muu']
                onChange({ ...filters, brands: next.length ? next : undefined, custom_brand: hasMuu ? undefined : filters.custom_brand, page: 0 })
              }}
            />
            <span className="text-sm text-muted-light group-hover:text-white transition-colors">Muu</span>
          </label>
          {(filters.brands || []).includes('Muu') && (
            <input
              type="text"
              placeholder="Kirjuta margi nimi..."
              value={filters.custom_brand || ''}
              onChange={e => onChange({ ...filters, custom_brand: e.target.value || undefined, page: 0 })}
              className="input text-sm mt-1"
            />
          )}
        </div>
      </FilterSection>

      {/* Hind */}
      <FilterSection title="Hind (€)" open={open.price} toggle={() => toggle('price')}>
        <div className="flex gap-2 mt-1">
          <input type="number" placeholder="Alates" value={filters.price_from || ''} onChange={e => set('price_from', e.target.value || undefined)} className="input text-sm w-1/2" />
          <input type="number" placeholder="Kuni" value={filters.price_to || ''} onChange={e => set('price_to', e.target.value || undefined)} className="input text-sm w-1/2" />
        </div>
      </FilterSection>

      {/* Aastakäik */}
      <FilterSection title="Aastakäik" open={open.year} toggle={() => toggle('year')}>
        <div className="flex gap-2 mt-1">
          <input type="number" placeholder="Alates" min="2015" max="2025" value={filters.year_from || ''} onChange={e => set('year_from', e.target.value || undefined)} className="input text-sm w-1/2" />
          <input type="number" placeholder="Kuni" min="2015" max="2025" value={filters.year_to || ''} onChange={e => set('year_to', e.target.value || undefined)} className="input text-sm w-1/2" />
        </div>
      </FilterSection>

      {/* Läbisõit */}
      <FilterSection title="Läbisõit (km)" open={open.mileage} toggle={() => toggle('mileage')}>
        <div className="flex gap-2 mt-1">
          <input type="number" placeholder="Alates" value={filters.mileage_from || ''} onChange={e => set('mileage_from', e.target.value || undefined)} className="input text-sm w-1/2" />
          <input type="number" placeholder="Kuni" value={filters.mileage_to || ''} onChange={e => set('mileage_to', e.target.value || undefined)} className="input text-sm w-1/2" />
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

      {/* Maakond */}
      <FilterSection title="Maakond" open={open.county} toggle={() => toggle('county')}>
        <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
          {COUNTIES.map(c => {
            const selected = (filters.counties || []).includes(c)
            return (
              <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => {
                    const cur = filters.counties || []
                    const next = selected ? cur.filter(v => v !== c) : [...cur, c]
                    set('counties', next.length ? next : undefined)
                  }}
                />
                <span className="text-sm text-muted-light group-hover:text-white transition-colors">{c}</span>
              </label>
            )
          })}
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
