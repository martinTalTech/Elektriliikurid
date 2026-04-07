import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useListings } from '../hooks/useListings'
import ListingGrid from '../components/listings/ListingGrid'
import Filters from '../components/listings/Filters'

export default function Listings() {
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    vehicle_type: searchParams.get('type') || undefined,
    sort: 'newest',
    page: 0,
    limit: 20,
  })

  const { listings, loading, total } = useListings(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kuulutused</h1>
          <p className="text-gray-500 text-sm mt-1">{total} kuulutust</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={e => setFilters(f => ({ ...f, sort: e.target.value, page: 0 }))}
            className="input text-sm w-auto"
          >
            <option value="newest">Uusim enne</option>
            <option value="oldest">Vanim enne</option>
            <option value="price_asc">Hind kasvav</option>
            <option value="price_desc">Hind kahanev</option>
            <option value="mileage_asc">Läbisõit kasvav</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary text-sm md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 mr-1.5" /> Filtrid
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters - desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20">
            <Filters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Mobile filters */}
        {showFilters && (
          <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowFilters(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filtrid</h2>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              <Filters filters={filters} onChange={(f) => { setFilters(f); setShowFilters(false) }} />
            </div>
          </div>
        )}

        {/* Listings */}
        <div className="flex-1 min-w-0">
          <ListingGrid listings={listings} loading={loading} columns={3} />
          {!loading && total > filters.limit && (
            <div className="mt-8 flex justify-center gap-2">
              {filters.page > 0 && (
                <button onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))} className="btn btn-secondary">
                  Eelmine
                </button>
              )}
              {(filters.page + 1) * filters.limit < total && (
                <button onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))} className="btn btn-primary">
                  Järgmine
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
