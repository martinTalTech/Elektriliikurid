import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, Upload, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { SCOOTER_BRANDS, CROSS_BRANDS, MOPED_BRANDS, EBIKE_BRANDS, CONDITIONS } from '../constants/brands'
import { COUNTIES } from '../constants/counties'
import { getStripe } from '../lib/stripe'

const STEPS = ['Sõiduki andmed', 'Tehniline info', 'Kirjeldus & pildid', 'Hind & asukoht', 'Makse']

export default function CreateListing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [data, setData] = useState({
    listing_type: 'sale',
    vehicle_type: '', brand: '', model: '', year: new Date().getFullYear(), color: '',
    motor_power_w: '', battery_capacity_wh: '', max_speed_kmh: '', range_km: '', mileage_km: '', charge_cycles: '',
    condition: 'good', title: '', description: '',
    price: '', negotiable: false, county: '', city: '',
    plan: 'standard'
  })

  if (!user) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-semibold mb-2">Logi sisse kuulutuse lisamiseks</h2>
      <a href="#/logi-sisse" className="btn btn-primary mt-4 inline-flex">Logi sisse</a>
    </div>
  )

  const set = (key, val) => setData(d => ({ ...d, [key]: val }))
  const brands =
    data.vehicle_type === 'cross' ? CROSS_BRANDS :
      data.vehicle_type === 'mopeed' ? MOPED_BRANDS :
        data.vehicle_type === 'jalgratas' ? EBIKE_BRANDS :
          SCOOTER_BRANDS

  const autoTitle = () => {
    if (data.brand && data.model && data.year) {
      const cond = CONDITIONS.find(c => c.value === data.condition)
      set('title', `${data.year} ${data.brand} ${data.model} — ${cond?.label || 'heas seisukorras'}`)
    }
  }

  const handleImageUpload = async (files) => {
    const uploaded = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `listings/${user.id}/${Date.now()}.${ext}`
      const { data: up, error } = await supabase.storage.from('listing-images').upload(path, file)
      if (!error) {
        const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(path)
        uploaded.push({ url: urlData.publicUrl, path })
      }
    }
    setImages(prev => [...prev, ...uploaded])
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data: listing, error } = await supabase.from('listings').insert({
        user_id: user.id,
        status: 'pending_payment',
        vehicle_type: data.vehicle_type,
        brand: data.brand, model: data.model, year: parseInt(data.year), color: data.color,
        motor_power_w: data.motor_power_w ? parseInt(data.motor_power_w) : null,
        battery_capacity_wh: data.battery_capacity_wh ? parseInt(data.battery_capacity_wh) : null,
        max_speed_kmh: data.max_speed_kmh ? parseInt(data.max_speed_kmh) : null,
        range_km: data.range_km ? parseInt(data.range_km) : null,
        mileage_km: data.mileage_km ? parseInt(data.mileage_km) : null,
        charge_cycles: data.charge_cycles ? parseInt(data.charge_cycles) : null,
        condition: data.condition,
        title: data.title, description: data.description,
        price: parseFloat(data.price), negotiable: data.negotiable,
        county: data.county, city: data.city,
        listing_type: data.listing_type,
        rent_price_day: data.rent_price_day ? parseFloat(data.rent_price_day) : null,
        rent_min_days: data.rent_min_days ? parseInt(data.rent_min_days) : null,
        rent_available_from: data.rent_available_from || null,
        rent_available_to: data.rent_available_to || null,
      }).select().single()

      if (error) throw error

      // Upload images
      for (let i = 0; i < images.length; i++) {
        await supabase.from('listing_images').insert({
          listing_id: listing.id, url: images[i].url, order: i, is_primary: i === 0
        })
      }

      // Stripe checkout
      const amount = data.plan === 'premium' ? 599 : 299
      const stripe = await getStripe()
      // In a real app, create checkout session via backend/edge function
      // For now, navigate to success
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ listing_id: listing.id, plan: data.plan })
      })
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      alert('Viga: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lisa kuulutus</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${i < step ? 'bg-primary-600 text-white' :
              i === step ? 'bg-primary-100 text-primary-700 border-2 border-primary-500' :
                'bg-gray-100 text-gray-400'
              }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:block ${i === step ? 'font-medium text-primary-700' : 'text-gray-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-0.5 bg-gray-200 mx-2 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <div className="card p-6">
        {/* Step 0: Vehicle data */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-4">Sõiduki andmed</h2>
            <div>
              <div>
                <label className="label">Kuulutuse tüüp *</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { v: 'sale', icon: '💰', label: 'Müük' },
                    { v: 'rent', icon: '🔑', label: 'Rent' }
                  ].map(t => (
                    <button
                      key={t.v}
                      onClick={() => set('listing_type', t.v)}
                      className={`p-4 rounded-xl border-2 text-center transition-colors ${data.listing_type === t.v ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="text-3xl mb-1">{t.icon}</div>
                      <div className="font-medium text-sm">{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <label className="label">Sõiduki tüüp *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { v: 'scooter', icon: '🛴', label: 'Tõukeratas' },
                  { v: 'cross', icon: '🏍️', label: 'Elektri krossikas' },
                  { v: 'mopeed', icon: '🛵', label: 'Elektri mopeed' },
                  { v: 'jalgratas', icon: '🚲', label: 'Elektri jalgratas' }
                ].map(t => (
                  <button
                    key={t.v}
                    onClick={() => set('vehicle_type', t.v)}
                    className={`p-4 rounded-xl border-2 text-center transition-colors ${data.vehicle_type === t.v ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-3xl mb-1">{t.icon}</div>
                    <div className="font-medium text-sm">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Mark *</label>
              <select value={data.brand} onChange={e => set('brand', e.target.value)} className="input">
                <option value="">Vali mark</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Mudel *</label>
              <input value={data.model} onChange={e => set('model', e.target.value)} placeholder="nt. Pro 2" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Aastakäik *</label>
                <input type="number" value={data.year} onChange={e => set('year', e.target.value)} min="2015" max="2025" className="input" />
              </div>
              <div>
                <label className="label">Värvus</label>
                <input value={data.color} onChange={e => set('color', e.target.value)} placeholder="nt. Must" className="input" />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Technical */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-4">Tehniline info</h2>
            {[
              { key: 'motor_power_w', label: 'Mootori võimsus (W)', placeholder: 'nt. 500' },
              { key: 'battery_capacity_wh', label: 'Aku mahtuvus (Wh)', placeholder: 'nt. 365' },
              { key: 'max_speed_kmh', label: 'Maksimaalne kiirus (km/h)', placeholder: 'nt. 25' },
              { key: 'range_km', label: 'Sõiduulatus (km)', placeholder: 'nt. 40' },
              { key: 'mileage_km', label: 'Läbisõit (km)', placeholder: 'nt. 500' },
              { key: 'charge_cycles', label: 'Laadimistsükleid (valikuline)', placeholder: 'nt. 150' },
            ].map(f => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                <input type="number" value={data[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} className="input" />
              </div>
            ))}
            <div>
              <label className="label">Seisund *</label>
              <div className="space-y-2">
                {CONDITIONS.map(c => (
                  <label key={c.value} className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${data.condition === c.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                    <input type="radio" name="condition" value={c.value} checked={data.condition === c.value} onChange={() => set('condition', c.value)} className="mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{c.label}</div>
                      <div className="text-xs text-gray-500">{c.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Description & images */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-4">Kirjeldus & pildid</h2>
            <div>
              <label className="label">Pealkiri *</label>
              <div className="flex gap-2">
                <input value={data.title} onChange={e => set('title', e.target.value)} placeholder="Kuulutuse pealkiri" className="input flex-1" />
                <button onClick={autoTitle} type="button" className="btn btn-secondary text-sm whitespace-nowrap">Auto</button>
              </div>
            </div>
            <div>
              <label className="label">Kirjeldus</label>
              <textarea value={data.description} onChange={e => set('description', e.target.value)} rows={5} placeholder="Kirjelda sõidukit..." className="input resize-none" />
            </div>
            <div>
              <label className="label">Pildid (min 1, max 10)</label>
              <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 transition-colors block">
                <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleImageUpload(Array.from(e.target.files))} />
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Kliki piltide üleslaadimiseks</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP • Max 5MB per pilt</p>
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {i === 0 && <div className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded">Peapilt</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Price & location */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg mb-4">Hind & asukoht</h2>
            <div>
              <label className="label">Hind (€) *</label>
              <input type="number" value={data.price} onChange={e => set('price', e.target.value)} placeholder="nt. 599" className="input" />
            </div>
            {data.listing_type === 'rent' && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-gray-700">Rendi tingimused</h3>
                <div>
                  <label className="label">Hind päevas (€) *</label>
                  <input type="number" value={data.rent_price_day || ''} onChange={e => set('rent_price_day', e.target.value)} placeholder="nt. 15" className="input" />
                </div>
                <div>
                  <label className="label">Minimaalne rendiaeg (päevad)</label>
                  <input type="number" value={data.rent_min_days || 1} onChange={e => set('rent_min_days', e.target.value)} placeholder="nt. 1" className="input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Saadaval alates</label>
                    <input type="date" value={data.rent_available_from || ''} onChange={e => set('rent_available_from', e.target.value)} className="input" />
                  </div>
                  <div>
                    <label className="label">Saadaval kuni</label>
                    <input type="date" value={data.rent_available_to || ''} onChange={e => set('rent_available_to', e.target.value)} className="input" />
                  </div>
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.negotiable} onChange={e => set('negotiable', e.target.checked)} className="rounded text-primary-600" />
              <span className="text-sm font-medium">Hind on kaubeldav</span>
            </label>
            <div>
              <label className="label">Maakond *</label>
              <select value={data.county} onChange={e => set('county', e.target.value)} className="input">
                <option value="">Vali maakond</option>
                {COUNTIES.map(c => <option key={c} value={c}>{c} maakond</option>)}
              </select>
            </div>
            <div>
              <label className="label">Linn/vald</label>
              <input value={data.city} onChange={e => set('city', e.target.value)} placeholder="nt. Tallinn" className="input" />
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-semibold text-lg">Makse & avaldamine</h2>

            {/* Preview */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-sm text-gray-500 mb-2">Eelvaade</h3>
              <div className="font-semibold">{data.title}</div>
              <div className="text-2xl font-bold text-primary-600 mt-1">{data.price ? `${data.price} €` : '—'}</div>
              <div className="text-sm text-gray-500 mt-1">{data.county}{data.city ? `, ${data.city}` : ''}</div>
            </div>

            {/* Plans */}
            <div>
              <h3 className="font-medium mb-3">Vali pakett</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: 'kiirmüük', label: 'Kiirmüük', price: '1.99€', desc: '10 päeva aktiivne', badge: null },
                  { v: 'standard', label: 'Standard', price: '3.99€', desc: '30 päeva aktiivne', badge: null },
                  { v: 'premium', label: 'Premium', price: '5.99€', desc: '60 päeva aktiivne + esiletõstmine', badge: null },
                ].map(plan => (
                  <button
                    key={plan.v}
                    onClick={() => set('plan', plan.v)}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${data.plan === plan.v ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center gap-2">
                      {plan.badge && <span>{plan.badge}</span>}
                      <span className="font-semibold">{plan.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-primary-600 mt-1">{plan.price}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{plan.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary btn-lg w-full text-base"
            >
              {loading ? 'Töötleb...' : `Maksa ${data.plan === 'premium' ? '5.99€' : data.plan === 'standard' ? '3.99€' : '1.99€'} ja avalda`}
            </button>
            <p className="text-xs text-gray-400 text-center">Turvaline makse Stripe kaudu</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn btn-secondary">
              <ChevronLeft className="w-4 h-4 mr-1" /> Eelmine
            </button>
          ) : <div />}
          {step < STEPS.length - 1 && (
            <button onClick={() => setStep(s => s + 1)} className="btn btn-primary">
              Järgmine <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
