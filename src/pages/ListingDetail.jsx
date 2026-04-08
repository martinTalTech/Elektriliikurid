import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Gauge, Zap, ArrowLeft, Share2, Heart, Eye, Phone, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { formatPrice, formatDate, getConditionLabel } from '../utils/format'
import ListingGrid from '../components/listings/ListingGrid'
import { useListings } from '../hooks/useListings'

export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const { listings: similar } = useListings({ limit: 4 })

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('listings')
        .select('*, listing_images(*), profiles(name, phone, email)')
        .eq('id', id)
        .single()
      setListing(data)
      if (data) {
        await supabase.from('listings').update({ views_count: (data.views_count || 0) + 1 }).eq('id', id)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-96 bg-dark-light rounded-xl mb-6" />
      <div className="h-8 bg-dark-light rounded w-1/2 mb-4" />
      <div className="h-6 bg-dark-light rounded w-1/4" />
    </div>
  )

  if (!listing) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-xl font-bold text-white">Kuulutust ei leitud</h2>
      <Link to="/kuulutused" className="btn btn-primary mt-6 inline-flex">
        Tagasi kuulutustele
      </Link>
    </div>
  )

  const images = listing.listing_images?.sort((a, b) => a.order - b.order) || []

  const specs = [
    { label: 'Aasta', value: listing.year },
    { label: 'Värvus', value: listing.color },
    { label: 'Seisukord', value: getConditionLabel(listing.condition) },
    { label: 'Läbisõit', value: listing.mileage_km ? `${listing.mileage_km.toLocaleString('et')} km` : null },
    { label: 'Mootori võimsus', value: listing.motor_power_w ? `${listing.motor_power_w} W` : null },
    { label: 'Aku mahtuvus', value: listing.battery_capacity_wh ? `${listing.battery_capacity_wh} Wh` : null },
    { label: 'Maksimaalne kiirus', value: listing.max_speed_kmh ? `${listing.max_speed_kmh} km/h` : null },
    { label: 'Sõiduulatus', value: listing.range_km ? `${listing.range_km} km` : null },
    { label: 'Laadimistsükleid', value: listing.charge_cycles },
  ].filter(s => s.value)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/kuulutused" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tagasi kuulutustele
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: images + specs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div>
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-dark-light">
              {images[activeImg] ? (
                <img src={images[activeImg].url} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                  {listing.vehicle_type === 'scooter' ? '🛴' :
                   listing.vehicle_type === 'cross'   ? '🏍️' :
                   listing.vehicle_type === 'mopeed'  ? '🛵' : '🚲'}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImg ? 'border-primary-500' : 'border-surface-border hover:border-muted'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specs */}
          {specs.length > 0 && (
            <div className="bg-dark-medium border border-surface-border rounded-xl p-5">
              <h2 className="text-base font-bold text-white mb-4">Tehnilised andmed</h2>
              <div className="grid grid-cols-2 gap-2">
                {specs.map(s => (
                  <div key={s.label} className="bg-dark-light rounded-lg p-3">
                    <div className="text-xs text-muted">{s.label}</div>
                    <div className="font-semibold text-white mt-0.5">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <div className="bg-dark-medium border border-surface-border rounded-xl p-5">
              <h2 className="text-base font-bold text-white mb-3">Kirjeldus</h2>
              <p className="text-muted-light whitespace-pre-wrap leading-relaxed text-sm">{listing.description}</p>
            </div>
          )}
        </div>

        {/* Right: price + contact */}
        <div>
          <div className="bg-dark-medium border border-surface-border rounded-xl p-5 sticky top-20">
            <h1 className="text-lg font-bold text-white leading-snug">{listing.title}</h1>
            <div className="text-3xl font-black text-primary-500 mt-2">
              {formatPrice(listing.price)}
              {listing.negotiable && (
                <span className="text-sm font-normal text-muted ml-2">(kaubeldav)</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {listing.county}{listing.city ? `, ${listing.city}` : ''}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {listing.views_count || 0} vaatamist
              </span>
            </div>
            <div className="text-xs text-muted mt-1">{formatDate(listing.created_at)}</div>

            <div className="border-t border-surface-border my-4" />

            {user ? (
              <>
                {showContact ? (
                  <div className="space-y-2">
                    {listing.profiles?.phone && (
                      <a href={`tel:${listing.profiles.phone}`} className="btn btn-primary w-full gap-2">
                        <Phone className="w-4 h-4" /> {listing.profiles.phone}
                      </a>
                    )}
                    {listing.profiles?.email && (
                      <a href={`mailto:${listing.profiles.email}`} className="btn btn-secondary w-full gap-2">
                        <Mail className="w-4 h-4" /> Saada email
                      </a>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setShowContact(true)} className="btn btn-primary w-full btn-lg gap-2">
                    <Phone className="w-5 h-5" /> Näita kontakti
                  </button>
                )}
              </>
            ) : (
              <Link to="/logi-sisse" className="btn btn-primary w-full btn-lg block text-center">
                Logi sisse, et kontakti näha
              </Link>
            )}

            <div className="flex gap-2 mt-3">
              <button className="btn btn-secondary flex-1 text-sm gap-1.5">
                <Heart className="w-4 h-4" /> Salvesta
              </button>
              <button
                onClick={() => navigator.share?.({ title: listing.title, url: window.location.href })}
                className="btn btn-secondary flex-1 text-sm gap-1.5"
              >
                <Share2 className="w-4 h-4" /> Jaga
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-5">Sarnased kuulutused</h2>
        <ListingGrid listings={similar.filter(l => l.id !== id).slice(0, 4)} loading={false} />
      </div>
    </div>
  )
}
