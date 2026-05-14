import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, Upload, X, Banknote, Key, Gavel, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import VehicleIcon from '../components/VehicleIcon'
import { useAuth } from '../hooks/useAuth'
import { BRANDS_BY_TYPE, MODELS_BY_BRAND, VEHICLE_TYPES, CONDITIONS } from '../constants/brands'
import { COUNTIES } from '../constants/counties'
import { usePageTitle } from '../hooks/usePageTitle'

const STEPS = ['Sõiduki andmed', 'Tehniline info', 'Kirjeldus & pildid', 'Hind & asukoht', 'Avalda']

const PLANS = [
  { v: 'basic',    label: 'Basic',    price: '2.99€', desc: '30 päeva aktiivne' },
  { v: 'standard', label: 'Standard', price: '4.99€', desc: '60 päeva aktiivne', popular: true },
  { v: 'premium',  label: 'Premium',  price: '9.99€', desc: '90 päeva + esiletõstmine' },
]

const PLAN_PRICES = { basic: '2.99€', standard: '4.99€', premium: '9.99€' }

export default function CreateListing() {
  usePageTitle('Lisa kuulutus')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [data, setData] = useState({
    listing_type: 'sale',
    vehicle_type: '', brand: '', custom_brand: '', model: '', custom_model: '', year: new Date().getFullYear(), color: '',
    motor_power_w: '', battery_capacity_wh: '', max_speed_kmh: '', range_km: '', mileage_km: '', charge_cycles: '',
    condition: 'good', title: '', description: '',
    price: '', negotiable: false, county: '', city: '',
    plan: 'standard'
  })

  const LISTING_TYPES = [
    { v: 'sale',    icon: <Banknote className="w-5 h-5" />, label: 'Müük',      desc: 'Müün oma sõidukit' },
    { v: 'rent',    icon: <Key className="w-5 h-5" />,      label: 'Rent',      desc: 'Annan rentimiseks' },
    { v: 'auction', icon: <Gavel className="w-5 h-5" />,    label: 'Oksjon',    desc: 'Enampakkumine' },
    { v: 'wanted',  icon: <Search className="w-5 h-5" />,   label: 'Otsitakse', desc: 'Otsin sõidukit' },
  ]

  // Rent, oksjon ja otsitakse on tasuta — ainult müük nõuab makset
  const isFree = data.listing_type !== 'sale'

  if (!user) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-bold text-white mb-2">Logi sisse kuulutuse lisamiseks</h2>
      <a href="#/logi-sisse" className="btn btn-primary mt-4 inline-flex">Logi sisse</a>
    </div>
  )

  const set = (key, val) => setData(d => ({ ...d, [key]: val }))
  const brands = BRANDS_BY_TYPE[data.vehicle_type] || BRANDS_BY_TYPE.scooter

  const actualBrand = data.brand === 'Muu' ? data.custom_brand : data.brand
  const models = MODELS_BY_BRAND[data.brand] || []
  const actualModel = data.model === 'Muu' ? data.custom_model : data.model

  const autoTitle = () => {
    if (actualBrand && actualModel && data.year) {
      const cond = CONDITIONS.find(c => c.value === data.condition)
      set('title', `${data.year} ${actualBrand} ${actualModel} — ${cond?.label || 'heas seisukorras'}`)
    }
  }

  const handleImageUpload = async (files) => {
    const uploaded = []
    for (const file of files) {
      // Kontrolli faili suurust (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" on liiga suur. Maksimaalne lubatud suurus on 5MB.`)
        continue
      }
      // Kontrolli faili tüüpi
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert(`"${file.name}" — lubatud formaadid on ainult JPG, PNG ja WebP.`)
        continue
      }

      const ext = file.name.split('.').pop()
      const path = `listings/${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('listing-images').upload(path, file)
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
      // Tasuta kuulutused (rent, oksjon, otsitakse) lähevad kohe aktiivseks
      const initialStatus = isFree ? 'active' : 'pending_payment'

      const { data: listing, error } = await supabase.from('listings').insert({
        user_id: user.id,
        status: initialStatus,
        vehicle_type: data.vehicle_type,
        brand: actualBrand, model: actualModel, year: parseInt(data.year), color: data.color,
        motor_power_w: data.motor_power_w ? parseInt(data.motor_power_w) : null,
        battery_capacity_wh: data.battery_capacity_wh ? parseInt(data.battery_capacity_wh) : null,
        max_speed_kmh: data.max_speed_kmh ? parseInt(data.max_speed_kmh) : null,
        range_km: data.range_km ? parseInt(data.range_km) : null,
        mileage_km: data.mileage_km ? parseInt(data.mileage_km) : null,
        charge_cycles: data.charge_cycles ? parseInt(data.charge_cycles) : null,
        condition: data.condition,
        title: data.title, description: data.description,
        price: data.price ? parseFloat(data.price) : null,
        negotiable: data.negotiable,
        county: data.county, city: data.city,
        listing_type: data.listing_type,
        rent_price_day: data.rent_price_day ? parseFloat(data.rent_price_day) : null,
        rent_min_days: data.rent_min_days ? parseInt(data.rent_min_days) : null,
        rent_available_from: data.rent_available_from || null,
        rent_available_to: data.rent_available_to || null,
        auction_ends_at: data.auction_ends_at || null,
      }).select().single()

      if (error) {
        if (error.message.includes('vehicle_type_check')) {
          alert('Viga: palun vali sõiduki tüüp')
        } else {
          alert('Viga: ' + error.message)
        }
        setLoading(false)
        return
      }

      // Laadi pildid üles
      for (let i = 0; i < images.length; i++) {
        await supabase.from('listing_images').insert({
          listing_id: listing.id, url: images[i].url, order: i, is_primary: i === 0
        })
      }

      // Tasuta kuulutus — suuna otse kuulutuse lehele
      if (isFree) {
        navigate(`/kuulutused/${listing.id}?avaldatud=ok`)
        return
      }

      // Müügikuulutus — käivita Stripe makse
      // Saada kasutaja JWT token (mitte anon key!) edge function'ile
      const { data: { session: authSession } } = await supabase.auth.getSession()
      if (!authSession) throw new Error('Sessioon aegus, logi uuesti sisse')

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authSession.access_token}`,
        },
        body: JSON.stringify({ listing_id: listing.id, plan: data.plan })
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Makse alustamine ebaõnnestus')

      window.location.href = json.url
    } catch (err) {
      alert('Viga: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-white mb-6">Lisa kuulutus</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
              i < step  ? 'bg-primary-600 text-white' :
              i === step ? 'bg-primary-600/20 text-primary-400 border-2 border-primary-500' :
                          'bg-dark-light text-muted border-2 border-surface-border'
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`ml-2 text-sm hidden sm:block ${i === step ? 'font-semibold text-primary-400' : 'text-muted'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-0.5 bg-surface-border mx-2 flex-shrink-0" />}
          </div>
        ))}
      </div>

      <div className="bg-dark-medium border border-surface-border rounded-xl p-6">
        {/* Samm 0: Sõiduki andmed */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-bold text-lg text-white">Sõiduki andmed</h2>

            <div>
              <label className="label">Kuulutuse tüüp *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-1">
                {LISTING_TYPES.map(t => (
                  <button
                    key={t.v}
                    type="button"
                    onClick={() => set('listing_type', t.v)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      data.listing_type === t.v
                        ? 'border-primary-500 bg-primary-600/10 text-primary-400'
                        : 'border-surface-border hover:border-muted text-muted-light'
                    }`}
                  >
                    <div className="flex justify-center mb-1.5">{t.icon}</div>
                    <div className="font-bold text-sm">{t.label}</div>
                    <div className="text-xs mt-0.5 opacity-70">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Sõiduki tüüp *</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {VEHICLE_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => set('vehicle_type', t.value)}
                    className={`py-3 px-1 rounded-xl border-2 text-center transition-all ${
                      data.vehicle_type === t.value
                        ? 'border-primary-500 bg-primary-600/10 text-primary-400'
                        : 'border-surface-border hover:border-muted text-muted-light'
                    }`}
                  >
                    <div className="flex justify-center mb-1"><VehicleIcon type={t.value} className="w-7 h-7" /></div>
                    <div className="font-bold text-xs leading-tight">{t.label.split(' ').pop()}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Mark *</label>
              <select value={data.brand} onChange={e => { set('brand', e.target.value); if (e.target.value !== 'Muu') set('custom_brand', ''); set('model', ''); set('custom_model', '') }} className="input">
                <option value="">Vali mark</option>
                {brands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {data.brand === 'Muu' && (
                <input
                  value={data.custom_brand}
                  onChange={e => set('custom_brand', e.target.value)}
                  placeholder="Sisesta margi nimi"
                  className="input mt-2"
                  autoFocus
                />
              )}
            </div>
            <div>
              <label className="label">Mudel *</label>
              {models.length > 0 ? (
                <>
                  <select value={data.model} onChange={e => { set('model', e.target.value); if (e.target.value !== 'Muu') set('custom_model', '') }} className="input">
                    <option value="">Vali mudel</option>
                    {models.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {data.model === 'Muu' && (
                    <input
                      value={data.custom_model}
                      onChange={e => set('custom_model', e.target.value)}
                      placeholder="Sisesta mudeli nimi"
                      className="input mt-2"
                      autoFocus
                    />
                  )}
                </>
              ) : (
                <input value={data.model} onChange={e => set('model', e.target.value)} placeholder="nt. Pro 2" className="input" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Aastakäik *</label>
                <input type="number" value={data.year} onChange={e => set('year', e.target.value)} min="2015" max="2030" className="input" />
              </div>
              <div>
                <label className="label">Värvus</label>
                <input value={data.color} onChange={e => set('color', e.target.value)} placeholder="nt. Must" className="input" />
              </div>
            </div>
          </div>
        )}

        {/* Samm 1: Tehniline info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-white">Tehniline info</h2>
            {[
              { key: 'motor_power_w',       label: 'Mootori võimsus (W)',           placeholder: 'nt. 500' },
              { key: 'battery_capacity_wh', label: 'Aku mahtuvus (Wh)',             placeholder: 'nt. 365' },
              { key: 'max_speed_kmh',       label: 'Maksimaalne kiirus (km/h)',      placeholder: 'nt. 25' },
              { key: 'range_km',            label: 'Sõiduulatus (km)',               placeholder: 'nt. 40' },
              { key: 'mileage_km',          label: 'Läbisõit (km)',                  placeholder: 'nt. 500' },
              { key: 'charge_cycles',       label: 'Laadimistsükleid (valikuline)',  placeholder: 'nt. 150' },
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
                  <label key={c.value} className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    data.condition === c.value
                      ? 'border-primary-500 bg-primary-600/10'
                      : 'border-surface-border hover:border-muted'
                  }`}>
                    <input type="radio" name="condition" value={c.value} checked={data.condition === c.value} onChange={() => set('condition', c.value)} className="mt-0.5" />
                    <div>
                      <div className="font-semibold text-sm text-white">{c.label}</div>
                      <div className="text-xs text-muted mt-0.5">{c.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Samm 2: Kirjeldus & pildid */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-white">Kirjeldus & pildid</h2>
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
              <label className="border-2 border-dashed border-surface-border rounded-xl p-8 text-center cursor-pointer hover:border-primary-600/50 transition-colors block">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={e => handleImageUpload(Array.from(e.target.files))}
                />
                <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-sm text-muted-light">Kliki piltide üleslaadimiseks</p>
                <p className="text-xs text-muted mt-1">JPG, PNG, WebP • Max 5MB per pilt</p>
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-dark-light">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {i === 0 && <div className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded font-semibold">Peapilt</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Samm 3: Hind & asukoht */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-white">Hind & asukoht</h2>

            <div>
              <label className="label">
                {data.listing_type === 'auction' ? 'Alghind (€) *' :
                 data.listing_type === 'wanted'  ? 'Maksimaalne eelarve (€)' :
                                                   'Hind (€) *'}
              </label>
              <input type="number" value={data.price} onChange={e => set('price', e.target.value)} placeholder="nt. 599" className="input" />
            </div>

            {data.listing_type === 'rent' && (
              <div className="space-y-4 border-t border-surface-border pt-4">
                <h3 className="font-semibold text-white text-sm">Rendi tingimused</h3>
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

            {data.listing_type === 'auction' && (
              <div className="space-y-4 border-t border-surface-border pt-4">
                <h3 className="font-semibold text-white text-sm">Oksjoni tingimused</h3>
                <div>
                  <label className="label">Oksjon lõpeb *</label>
                  <input type="datetime-local" value={data.auction_ends_at || ''} onChange={e => set('auction_ends_at', e.target.value)} className="input" />
                </div>
              </div>
            )}

            {data.listing_type !== 'wanted' && (
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={data.negotiable} onChange={e => set('negotiable', e.target.checked)} />
                <span className="text-sm font-medium text-white">Hind on kaubeldav</span>
              </label>
            )}

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

        {/* Samm 4: Avalda */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-bold text-lg text-white">
              {isFree ? 'Avalda kuulutus' : 'Makse & avaldamine'}
            </h2>

            {/* Eelvaade */}
            <div className="bg-dark-light border border-surface-border rounded-xl p-4">
              <h3 className="font-semibold text-xs text-muted uppercase tracking-wider mb-2">Eelvaade</h3>
              <div className="font-bold text-white">{data.title || '—'}</div>
              <div className="text-2xl font-black text-primary-500 mt-1">{data.price ? `${data.price} €` : '—'}</div>
              <div className="text-sm text-muted mt-1">{data.county}{data.city ? `, ${data.city}` : ''}</div>
            </div>

            {/* Tasuta kuulutus (rent / oksjon / otsitakse) */}
            {isFree ? (
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4 text-center">
                  <div className="text-green-400 font-bold text-lg">Tasuta avaldamine</div>
                  <div className="text-sm text-muted mt-1">
                    {data.listing_type === 'rent'
                      ? 'Rendikuulutuse ülespanek on tasuta. Vahendustasu ainult eduka tehingu korral.'
                      : data.listing_type === 'auction'
                      ? 'Oksjonikuulutuse ülespanek on tasuta. Vahendustasu ainult eduka oksjoni korral.'
                      : 'Otsitakse kuulutuse ülespanek on tasuta.'}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full text-base font-bold"
                >
                  {loading ? 'Avaldamine...' : 'Avalda kuulutus tasuta'}
                </button>
              </div>
            ) : (
              /* Müügikuulutus — vali pakett ja maksa */
              <div className="space-y-4">
                <h3 className="font-semibold text-white mb-3">Vali pakett</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PLANS.map(plan => (
                    <button
                      key={plan.v}
                      type="button"
                      onClick={() => set('plan', plan.v)}
                      className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                        data.plan === plan.v
                          ? 'border-primary-500 bg-primary-600/10'
                          : 'border-surface-border hover:border-muted'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          Populaarseim
                        </div>
                      )}
                      <div className="font-bold text-white">{plan.label}</div>
                      <div className="text-2xl font-black text-primary-500 mt-1">{plan.price}</div>
                      <div className="text-xs text-muted mt-0.5">{plan.desc}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn btn-primary btn-lg w-full text-base font-bold"
                >
                  {loading ? 'Töötleb...' : `Maksa ${PLAN_PRICES[data.plan]} ja avalda`}
                </button>
                <p className="text-xs text-muted text-center">Turvaline makse Stripe kaudu</p>
              </div>
            )}
          </div>
        )}

        {/* Navigatsioon */}
        <div className="flex justify-between mt-6 pt-4 border-t border-surface-border">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn btn-secondary gap-1">
              <ChevronLeft className="w-4 h-4" /> Eelmine
            </button>
          ) : <div />}
          {step < STEPS.length - 1 && (
            <button onClick={() => setStep(s => s + 1)} className="btn btn-primary gap-1">
              Järgmine <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
