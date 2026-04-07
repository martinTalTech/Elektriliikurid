import { Link } from 'react-router-dom'
import { MapPin, Calendar, Gauge } from 'lucide-react'
import { formatPrice, formatDate, getConditionLabel, getPrimaryImage } from '../../utils/format'

export default function ListingCard({ listing }) {
  const primaryImage = getPrimaryImage(listing.listing_images)

  return (
    <Link to={`/kuulutused/${listing.id}`} className="card block group">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">{listing.vehicle_type === 'scooter' ? '🛴' : '🏍️'}</span>
          </div>
        )}
        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">MÜÜDUD</span>
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          {listing.featured && (
            <span className="bg-primary-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">ESILETÕSTETUD</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
          {listing.title}
        </h3>
        <div className="mt-1 text-2xl font-bold text-primary-600">
          {formatPrice(listing.price)}
          {listing.negotiable && <span className="text-sm font-normal text-gray-500 ml-1">(kaubeldav)</span>}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{listing.year}</span>
          {listing.mileage_km && (
            <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{listing.mileage_km.toLocaleString('et')} km</span>
          )}
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.county}</span>
        </div>
        <div className="mt-2 text-xs text-gray-400">{formatDate(listing.created_at)}</div>
      </div>
    </Link>
  )
}
