import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ArrowLeft, Share2, Heart, Eye, Phone, Mail, Search,
         Gavel, Clock, AlertTriangle, ChevronDown, ChevronUp, Trophy } from 'lucide-react'
import VehicleIcon from '../components/VehicleIcon'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { formatPrice, formatDate, getConditionLabel } from '../utils/format'
import ListingGrid from '../components/listings/ListingGrid'
import { useListings } from '../hooks/useListings'
import { usePageTitle } from '../hooks/usePageTitle'

// ── Abifunktsioon: loenduri kuvamine ──
function formatCountdown(ms) {
  if (!ms || ms <= 0) return null
  const s = Math.floor(ms / 1000)
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (d > 0) return `${d}p ${h}t ${m}min`
  if (h > 0) return `${h}t ${m}min ${sec}s`
  if (m > 0) return `${m}min ${sec}s`
  return `${sec}s`
}

// ── Oksjoni paneeli komponent ──
function AuctionPanel({ listing, user, onBidPlaced }) {
  const [bidAmount, setBidAmount] = useState('')
  const [bidLoading, setBidLoading] = useState(false)
  const [bidError, setBidError] = useState('')
  const [bidSuccess, setBidSuccess] = useState('')
  const [timeLeft, setTimeLeft] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [bids, setBids] = useState([])

  const isOwner   = user && listing.user_id === user.id
  const isActive  = listing.status === 'active'
  const isEnded   = listing.status === 'completed' || listing.status === 'expired'
  const hasBids   = (listing.bid_count || 0) > 0
  const minBid    = hasBids
    ? (listing.current_bid + (listing.bid_increment || 1))
    : (listing.price || 0)

  // Loendur
  useEffect(() => {
    if (!isActive || !listing.auction_ends_at) return
    const calc = () => {
      const diff = new Date(listing.auction_ends_at) - Date.now()
      setTimeLeft(diff > 0 ? diff : 0)
    }
    calc()
    const iv = setInterval(calc, 1000)
    return () => clearInterval(iv)
  }, [listing.auction_ends_at, isActive])

  // Lae pakkumiste ajalugu
  useEffect(() => {
    supabase.from('bids')
      .select('id, amount, created_at')
      .eq('listing_id', listing.id)
      .order('amount', { ascending: false })
      .limit(20)
      .then(({ data }) => setBids(data || []))
  }, [listing.id, listing.bid_count])

  const handleBid = async () => {
    const amount = parseFloat(bidAmount)
    if (!amount || amount <= 0) {
      setBidError('Sisesta kehtiv summa')
      return
    }
    setBidLoading(true)
    setBidError('')
    setBidSuccess('')

    const { data, error } = await supabase.rpc('place_bid', {
      p_listing_id: listing.id,
      p_amount: amount,
    })

    setBidLoading(false)

    if (error || data?.error) {
      setBidError(data?.error || error?.message || 'Pakkumine ebaõnnestus')
      return
    }

    setBidSuccess(
      data.extended
        ? `Pakkumine ${amount.toFixed(2)} € vastu võetud! Oksjon pikenes 5 minutit.`
        : `Pakkumine ${amount.toFixed(2)} € vastu võetud!`
    )
    setBidAmount('')
    onBidPlaced(data)
  }

  const urgentTime = timeLeft !== null && timeLeft < 5 * 60 * 1000

  return (
    <div className="bg-dark-medium border border-surface-border rounded-xl p-5 sticky top-20 space-y-4">
      {/* Pealkiri */}
      <div className="flex items-center gap-2">
        <Gavel className="w-5 h-5 text-primary-500" />
        <h2 className="font-bold text-white">Oksjon</h2>
        {isActive && (
          <span className="ml-auto text-xs bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded-full font-semibold">
            Aktiivne
          </span>
        )}
        {isEnded && (
          <span className="ml-auto text-xs bg-surface text-muted border border-surface-border px-2 py-0.5 rounded-full font-semibold">
            Lõppenud
          </span>
        )}
      </div>

      {/* Praegune kõrgeim pakkumine / alghind */}
      <div>
        {hasBids ? (
          <>
            <div className="text-xs text-muted">Kõrgeim pakkumine</div>
            <div className="text-3xl font-black text-primary-500">{listing.current_bid?.toFixed(2)} €</div>
            <div className="text-xs text-muted mt-0.5">{listing.bid_count} pakkumist</div>
          </>
        ) : (
          <>
            <div className="text-xs text-muted">Alghind</div>
            <div className="text-3xl font-black text-white">{listing.price?.toFixed(2)} €</div>
            <div className="text-xs text-muted mt-0.5">Pakkumisi pole veel</div>
          </>
        )}
      </div>

      {/* Loendur */}
      {isActive && listing.auction_ends_at && (
        <div className={`rounded-xl p-3 text-center border ${
          urgentTime
            ? 'bg-red-900/20 border-red-800/50'
            : 'bg-dark-light border-surface-border'
        }`}>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock className={`w-4 h-4 ${urgentTime ? 'text-red-400' : 'text-muted'}`} />
            <span className={`text-xs font-semibold ${urgentTime ? 'text-red-400' : 'text-muted'}`}>
              {urgentTime ? 'Lõpeb varsti!' : 'Lõpeb'}
            </span>
          </div>
          <div className={`text-2xl font-black tabular-nums ${urgentTime ? 'text-red-400' : 'text-white'}`}>
            {timeLeft === 0 ? 'Lõppenud' : formatCountdown(timeLeft)}
          </div>
          {urgentTime && (
            <div className="text-xs text-red-300/70 mt-1">
              Pakkumine pikendab oksjoni +5 minutit
            </div>
          )}
        </div>
      )}

      {/* Oksjon lõppenud — võitja */}
      {isEnded && hasBids && (
        <div className="bg-primary-600/10 border border-primary-600/30 rounded-xl p-4 text-center">
          <Trophy className="w-6 h-6 text-primary-500 mx-auto mb-1" />
          <div className="text-sm font-bold text-white">Oksjon lõppenud</div>
          <div className="text-xs text-muted mt-0.5">
            Võitnud pakkumine: <strong className="text-primary-400">{listing.current_bid?.toFixed(2)} €</strong>
          </div>
        </div>
      )}

      {isEnded && !hasBids && (
        <div className="bg-dark-light border border-surface-border rounded-xl p-4 text-center text-sm text-muted">
          Oksjon lõppes ilma pakkumisteta
        </div>
      )}

      {/* Pakkumise vorm */}
      {isActive && !isOwner && (
        <>
          {user ? (
            <div className="space-y-2">
              <label className="label">Sinu pakkumine (€)</label>
              <p className="text-xs text-muted -mt-1">
                Minimaalne: <strong className="text-white">{minBid.toFixed(2)} €</strong>
                {listing.bid_increment > 0 && hasBids && (
                  <span className="ml-1">(samm: {listing.bid_increment} €)</span>
                )}
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  placeholder={minBid.toFixed(2)}
                  min={minBid}
                  step={listing.bid_increment || 1}
                  className="input flex-1"
                />
                <button
                  onClick={handleBid}
                  disabled={bidLoading}
                  className="btn btn-primary gap-1.5 whitespace-nowrap"
                >
                  <Gavel className="w-4 h-4" />
                  {bidLoading ? 'Saadan...' : 'Paku'}
                </button>
              </div>

              {/* Kiirvalikud */}
              {[0, 1, 2].map(extra => {
                const val = minBid + extra * (listing.bid_increment || 1)
                return (
                  <button key={extra} type="button"
                    onClick={() => setBidAmount(val.toFixed(2))}
                    className="mr-2 text-xs px-2.5 py-1 rounded-lg border border-surface-border text-muted hover:border-primary-500 hover:text-primary-400 transition-colors">
                    {val.toFixed(2)} €
                  </button>
                )
              })}

              {bidError && (
                <div className="bg-red-900/30 border border-red-800 text-red-400 text-xs p-2.5 rounded-lg">
                  {bidError}
                </div>
              )}
              {bidSuccess && (
                <div className="bg-green-900/30 border border-green-800 text-green-400 text-xs p-2.5 rounded-lg">
                  {bidSuccess}
                </div>
              )}
            </div>
          ) : (
            <Link to="/logi-sisse" className="btn btn-primary w-full btn-lg block text-center">
              Logi sisse pakkumiseks
            </Link>
          )}
        </>
      )}

      {isActive && isOwner && (
        <div className="text-xs text-muted text-center py-2">
          Sa oled selle oksjoni omanik
        </div>
      )}

      {/* Pakkumiste ajalugu */}
      {bids.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory(h => !h)}
            className="flex items-center justify-between w-full text-sm font-semibold text-white py-1"
          >
            <span>Pakkumiste ajalugu ({bids.length})</span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showHistory && (
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
              {bids.map((bid, i) => (
                <div key={bid.id} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  i === 0 ? 'bg-primary-600/10 border border-primary-600/20' : 'bg-dark-light'
                }`}>
                  <span className={i === 0 ? 'font-bold text-primary-400' : 'text-muted'}>
                    {i === 0 && <Trophy className="w-3 h-3 inline mr-1" />}
                    {bid.amount.toFixed(2)} €
                  </span>
                  <span className="text-xs text-muted">{formatDate(bid.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Peakomponent ──
export default function ListingDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  usePageTitle(listing ? listing.title : 'Kuulutus')
  const [activeImg, setActiveImg] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const { listings: similar } = useListings({ limit: 4 })

  const loadListing = useCallback(async () => {
    const { data, error } = await supabase
      .from('listings')
      .select('*, listing_images(*), auction_defects(*, auction_defect_images(*))')
      .eq('id', id)
      .single()

    if (error || !data) { setLoading(false); return }

    if (data.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, phone, email')
        .eq('id', data.user_id)
        .single()
      data.profiles = profile
    }

    setListing(data)
    supabase.from('listings').update({ views_count: (data.views_count || 0) + 1 }).eq('id', id).then()
    setLoading(false)
  }, [id])

  useEffect(() => { loadListing() }, [loadListing])

  // Pärast edukat pakkumist uuenda lokaalne olek kohe
  const handleBidPlaced = (result) => {
    setListing(prev => prev ? {
      ...prev,
      current_bid:     result.current_bid,
      bid_count:       (prev.bid_count || 0) + 1,
      auction_ends_at: result.expires_at,
    } : prev)
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-96 bg-dark-light rounded-xl mb-6" />
      <div className="h-8 bg-dark-light rounded w-1/2 mb-4" />
      <div className="h-6 bg-dark-light rounded w-1/4" />
    </div>
  )

  if (!listing) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-light border border-surface-border mb-5">
        <Search className="w-8 h-8 text-muted" />
      </div>
      <h2 className="text-xl font-bold text-white">Kuulutust ei leitud</h2>
      <Link to="/kuulutused" className="btn btn-primary mt-6 inline-flex">Tagasi kuulutustele</Link>
    </div>
  )

  const isAuction = listing.listing_type === 'auction'
  const images    = listing.listing_images?.sort((a, b) => a.order - b.order) || []
  const defects   = listing.auction_defects?.sort((a, b) => a.order - b.order) || []

  const specs = [
    { label: 'Aasta',              value: listing.year },
    { label: 'Värvus',             value: listing.color },
    { label: 'Seisukord',          value: getConditionLabel(listing.condition) },
    { label: 'Läbisõit',           value: listing.mileage_km ? `${listing.mileage_km.toLocaleString('et')} km` : null },
    { label: 'Mootori võimsus',    value: listing.motor_power_w ? `${listing.motor_power_w} W` : null },
    { label: 'Aku mahtuvus',       value: listing.battery_capacity_wh ? `${listing.battery_capacity_wh} Wh` : null },
    { label: 'Maksimaalne kiirus', value: listing.max_speed_kmh ? `${listing.max_speed_kmh} km/h` : null },
    { label: 'Sõiduulatus',        value: listing.range_km ? `${listing.range_km} km` : null },
    { label: 'Laadimistsükleid',   value: listing.charge_cycles },
  ].filter(s => s.value)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/kuulutused" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Tagasi kuulutustele
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vasak: pildid + andmed */}
        <div className="lg:col-span-2 space-y-6">

          {/* Galerii */}
          <div>
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-dark-light">
              {images[activeImg] ? (
                <img src={images[activeImg].url} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted/30">
                  <VehicleIcon type={listing.vehicle_type || 'scooter'} className="w-20 h-20" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={img.id} onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImg ? 'border-primary-500' : 'border-surface-border hover:border-muted'
                    }`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tehnilised andmed */}
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

          {/* Kirjeldus */}
          {listing.description && (
            <div className="bg-dark-medium border border-surface-border rounded-xl p-5">
              <h2 className="text-base font-bold text-white mb-3">Kirjeldus</h2>
              <p className="text-muted-light whitespace-pre-wrap leading-relaxed text-sm">{listing.description}</p>
            </div>
          )}

          {/* Kahjustused — ainult oksjonil */}
          {isAuction && defects.length > 0 && (
            <div className="bg-dark-medium border border-orange-800/30 rounded-xl p-5">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Kahjustused ja puudused ({defects.length})
              </h2>
              <div className="space-y-4">
                {defects.map((defect, i) => (
                  <div key={defect.id} className="border-b border-surface-border pb-4 last:border-0 last:pb-0">
                    <div className="text-sm font-semibold text-white mb-1">Kahjustus {i + 1}</div>
                    <p className="text-sm text-muted-light mb-3">{defect.description}</p>
                    {defect.auction_defect_images?.map(img => (
                      <img key={img.id} src={img.url} alt=""
                        className="w-40 h-32 object-cover rounded-lg border border-surface-border" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kohustuslik lahtiütlemine — ainult oksjonil */}
          {isAuction && (
            <div className="bg-yellow-900/15 border border-yellow-800/40 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-200/80 leading-relaxed">
                <strong>Ostjal on kohustus tutvuda sõiduki seisukorraga enne pakkumise tegemist.</strong>{' '}
                Müüja ei vastuta kaubal esinevate puuduste eest, olenemata sellest, kas need on kuulutusel eraldi märgitud või mitte.
              </p>
            </div>
          )}
        </div>

        {/* Parem: hind / oksjon / kontakt */}
        <div>
          {isAuction ? (
            <AuctionPanel listing={listing} user={user} onBidPlaced={handleBidPlaced} />
          ) : (
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
                showContact ? (
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
                )
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
          )}
        </div>
      </div>

      {/* Sarnased */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-5">Sarnased kuulutused</h2>
        <ListingGrid listings={similar.filter(l => l.id !== id).slice(0, 4)} loading={false} />
      </div>
    </div>
  )
}
