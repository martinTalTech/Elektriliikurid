import { Link } from 'react-router-dom'
import { MapPin, Calendar, Gauge, Star, Key, Gavel, Search } from 'lucide-react'
import { formatPrice, formatDate, getConditionLabel, getPrimaryImage } from '../../utils/format'
import VehicleIcon from '../VehicleIcon'

export default function ListingCard({ listing }) {
  const primaryImage = getPrimaryImage(listing.listing_images)

  return (
    <Link to={`/kuulutused/${listing.id}`} className="card block group">
      {/* Image */}
      <div className="aspect-[4/3] bg-dark-light overflow-hidden relative">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted/40">
            <VehicleIcon type={listing.vehicle_type || 'scooter'} className="w-14 h-14" />
          </div>
        )}

        {/* Sold overlay */}
        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold px-4 py-1.5 rounded-full text-sm tracking-wide">
              MÜÜDUD
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {listing.featured && (
            <span className="flex items-center gap-1 bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 fill-white" /> TOP
            </span>
          )}
          {listing.listing_type && listing.listing_type !== 'sale' && (
            <span className={`flex items-center gap-1 text-white text-xs font-bold px-2 py-0.5 rounded-full ${
              listing.listing_type === 'rent'    ? 'bg-blue-600' :
              listing.listing_type === 'auction' ? 'bg-orange-600' :
              listing.listing_type === 'wanted'  ? 'bg-purple-600' : ''
            }`}>
              {listing.listing_type === 'rent'    && <><Key className="w-3 h-3" /> RENT</>}
              {listing.listing_type === 'auction' && <><Gavel className="w-3 h-3" /> OKSJON</>}
              {listing.listing_type === 'wanted'  && <><Search className="w-3 h-3" /> OTSITAKSE</>}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm truncate group-hover:text-primary-400 transition-colors leading-snug">
          {listing.title}
        </h3>

        <div className="mt-1.5 text-xl font-black text-primary-500">
          {formatPrice(listing.price)}
          {listing.negotiable && (
            <span className="text-xs font-normal text-muted ml-1.5">(kaubeldav)</span>
          )}
        </div>

        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          {listing.year && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {listing.year}
            </span>
          )}
          {listing.mileage_km && (
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3" />
              {listing.mileage_km.toLocaleString('et')} km
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {listing.county}
          </span>
        </div>

        <div className="mt-2 pt-2 border-t border-surface-border text-xs text-muted">
          {formatDate(listing.created_at)}
        </div>
      </div>
    </Link>
  )
}
