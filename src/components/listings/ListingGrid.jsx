import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import ListingCard from './ListingCard'
import SkeletonCard from './SkeletonCard'

export default function ListingGrid({ listings, loading, columns = 4 }) {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-4`}>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (!listings.length) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-light border border-surface-border mb-5">
          <Search className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Kuulutusi ei leitud</h3>
        <p className="text-muted mb-6 max-w-sm mx-auto">Hetkel pole siin ühtegi kuulutust. Proovi muuta filtreid või lisa ise esimene kuulutus!</p>
        <Link to="/lisa-kuulutus" className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" /> Lisa kuulutus
        </Link>
      </div>
    )
  }

  return (
    <div className={`grid ${colClass} gap-4`}>
      {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
    </div>
  )
}
