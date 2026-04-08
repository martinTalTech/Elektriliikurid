import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useListings } from '../hooks/useListings'
import ListingGrid from '../components/listings/ListingGrid'
import Filters from '../components/listings/Filters'

export default function Listings() {
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const initTypes = searchParams.getAll('type').filter(Boolean)
  const [filters, setFilters] = useState({
    vehicle_types: initTypes.length ? initTypes : undefined,
    listing_type:  searchParams.get('listing_type') || undefined,
    sort: 'newest',
    page: 0,
    limit: 20,
  })

  const { listings, loading, total } = useListings(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Kuulutused</h1>
          <p className="text-muted text-sm mt-0.5">
            {loading ? '...' : `${total} kuulutust`}
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            className="btn btn-secondary text-sm md:hidden gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filtrid
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters - desktop */}
        <aside className="hidden md:block w-60 flex-shrink-0">
          <div className="sticky top-20 bg-dark-medium border border-surface-border rounded-xl p-4">
            <Filters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Mobile filters */}
        {showFilters && (
          <div
            className="fixed inset-0 z-50 bg-black/70 md:hidden"
            onClick={() => setShowFilters(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-80 bg-dark-medium border-l border-surface-border p-5 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white">Filtrid</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-dark-light transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
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
                <button
                  onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
                  className="btn btn-secondary px-6"
                >
                  Eelmine
                </button>
              )}
              {(filters.page + 1) * filters.limit < total && (
                <button
                  onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
                  className="btn btn-primary px-6"
                >
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
