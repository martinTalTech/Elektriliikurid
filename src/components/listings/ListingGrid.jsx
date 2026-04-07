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
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-700">Kuulutusi ei leitud</h3>
        <p className="text-gray-500 mt-1">Proovi muuta filtreid või otsingutingimusi</p>
      </div>
    )
  }

  return (
    <div className={`grid ${colClass} gap-4`}>
      {listings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
    </div>
  )
}
