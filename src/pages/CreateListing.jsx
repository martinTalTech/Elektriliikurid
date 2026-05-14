import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, Upload, X, Banknote, Key, Gavel, Search, Plus, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import VehicleIcon from '../components/VehicleIcon'
import { useAuth } from '../hooks/useAuth'
import { BRANDS_BY_TYPE, VEHICLE_TYPES, CONDITIONS } from '../constants/brands'
import { COUNTIES } from '../constants/counties'
import { usePageTitle } from '../hooks/usePageTitle'

const STEPS = ['Sõiduki andmed', 'Tehniline info', 'Kirjeldus & pildid', 'Hind & asukoht', 'Avalda']

const PLANS = [
  { v: 'basic',    label: 'Basic',    price: '2.99€', desc: '30 päeva aktiivne' },
  { v: 'standard', label: 'Standard', price: '4.99€', desc: '60 päeva aktiivne', popular: true },
  { v: 'premium',  label: 'Premium',  price: '9.99€', desc: '90 päeva + esiletõstmine' },
]

const PLAN_PRICES = { basic: '2.99€', standard: '4.99€', premium: '9.99€' }

const AUCTION_DURATIONS = [
  { label: '24 tundi',  hours: 24  },
  { label: '48 tundi',  hours: 48  },
  { label: '72 tundi',  hours: 72  },
  { label: '7 päeva',   hours: 168 },
]

export default function CreateListing() {
  usePageTitle('Lisa kuulutus')
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [defects, setDefects] = useState([]) // [{ tempId, description, imageFile, imageUrl, uploading }]
  const [data, setData] = useState({
    listing_type: 'sale',
    vehicle_type: '', brand: '', model: '', year: new Date().getFullYear(), color: '',
    motor_power_w: '', battery_capacity_wh: '', max_speed_kmh: '', range_km: '',
    mileage_km: '', charge_cycles: '',
    condition: 'good', title: '', description: '',
    price: '', negotiable: false, county: '', city: '',
    plan: 'standard',
    bid_increment: '1',
    auction_ends_at: '',
  })

  const LISTING_TYPES = [
    { v: 'sale',    icon: <Banknote className="w-5 h-5" />, label: 'Müük',      desc: 'Müün oma sõidukit' },
    { v: 'rent',    icon: <Key className="w-5 h-5" />,      label: 'Rent',      desc: 'Annan rentimiseks' },
    { v: 'auction', icon: <Gavel className="w-5 h-5" />,    label: 'Oksjon',    desc: 'Enampakkumine' },
    { v: 'wanted',  icon: <Search className="w-5 h-5" />,   label: 'Otsitakse', desc: 'Otsin sõidukit' },
  ]

  const isFree = data.listing_type !== 'sale'
  const isAuction = data.listing_type === 'auction'

  if (!user) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-bold text-white mb-2">Logi sisse kuulutuse lisamiseks</h2>
      <a href="#/logi-sisse" className="btn btn-primary mt-4 inline-flex">Logi sisse</a>
    </div>
  )

  const set = (key, val) => setData(d => ({ ...d, [key]: val }))
  const brands = BRANDS_BY_TYPE[data.vehicle_type] || BRANDS_BY_TYPE.scooter

  const autoTitle = () => {
    if (data.brand && data.model && data.year) {
      const cond = CONDITIONS.find(c => c.value === data.condition)
      const prefix = isAuction ? 'OKSJON: ' : ''
      set('title', `${prefix}${data.year} ${data.brand} ${data.model} — ${cond?.label || 'heas seisukorras'}`)
    }
  }

  const setAuctionDuration = (hours) => {
    const end = new Date(Date.now() + hours * 60 * 60 * 1000)
    const local = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 16)
    set('auction_ends_at', local)
  }

  // ── Pildi valideerimine ja üleslaadimine ──
  const handleImageUpload = async (files) => {
    const uploaded = []
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" on liiga suur. Max 5MB.`)
        continue
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert(`"${file.name}" — lubatud on JPG, PNG, WebP.`)
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

  // ── Kahjustuste haldus ──
  const addDefect = () => {
    setDefects(prev => [...prev, {
      tempId: Math.random().toString(36).slice(2),
      description: '',
      imageFile: null,
      imageUrl: '',
      uploading: false,
    }])
  }

  const updateDefect = (tempId, field, value) => {
    setDefects(prev => prev.map(d => d.tempId === tempId ? { ...d, [field]: value } : d))
  }

  const removeDefect = (tempId) => {
    setDefects(prev => prev.filter(d => d.tempId !== tempId))
  }

  const handleDefectImage = async (tempId, file) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Lubatud on JPG, PNG, WebP'); return
    }
    updateDefect(tempId, 'uploading', true)
    const ext = file.name.split('.').pop()
    const path = `defects/${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('listing-images').upload(path, file)
    if (!error) {
      const { data: urlData } = supabase.storage.from('listing-images').getPublicUrl(path)
      setDefects(prev => prev.map(d =>
        d.tempId === tempId
          ? { ...d, imageFile: file, imageUrl: urlData.publicUrl, uploading: false }
          : d
      ))
    } else {
      updateDefect(tempId, 'uploading', false)
    }
  }

  // ── Kuulutuse salvestamine ──
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const initialStatus = isFree ? 'active' : 'pending_payment'

      const { data: listing, error } = await supabase.from('listings').insert({
        user_id: user.id,
        status: initialStatus,
        vehicle_type: data.vehicle_type,
        brand: data.brand, model: data.model,
        year: parseInt(data.year), color: data.color,
        motor_power_w:         data.motor_power_w         ? parseInt(data.motor_power_w)         : null,
        battery_capacity_wh:   data.battery_capacity_wh   ? parseInt(data.battery_capacity_wh)   : null,
        max_speed_kmh:         data.max_speed_kmh         ? parseInt(data.max_speed_kmh)         : null,
        range_km:              data.range_km              ? parseInt(data.range_km)              : null,
        mileage_km:            data.mileage_km            ? parseInt(data.mileage_km)            : null,
        charge_cycles:         data.charge_cycles         ? parseInt(data.charge_cycles)         : null,
        condition: data.condition,
        title: data.title, description: data.description,
        price:     data.price     ? parseFloat(data.price)     : null,
        negotiable: data.negotiable,
        county: data.county, city: data.city,
        listing_type: data.listing_type,
        rent_price_day:      data.rent_price_day      ? parseFloat(data.rent_price_day)      : null,
        rent_min_days:       data.rent_min_days       ? parseInt(data.rent_min_days)         : null,
        rent_available_from: data.rent_available_from || null,
        rent_available_to:   data.rent_available_to   || null,
        auction_ends_at:     data.auction_ends_at     || null,
        bid_increment:       isAuction && data.bid_increment ? parseFloat(data.bid_increment) : null,
        bid_count: 0,
      }).select().single()

      if (error) throw error

      // Laadi kuulutuse pildid
      for (let i = 0; i < images.length; i++) {
        await supabase.from('listing_images').insert({
          listing_id: listing.id, url: images[i].url, order: i, is_primary: i === 0
        })
      }

      // Laadi kahjustused (ainult oksjonil)
      if (isAuction) {
        for (let i = 0; i < defects.length; i++) {
          const defect = defects[i]
          if (!defect.description.trim()) continue

          const { data: defectRow, error: defectErr } = await supabase
            .from('auction_defects')
            .insert({ listing_id: listing.id, description: defect.description, order: i })
            .select().single()

          if (!defectErr && defectRow && defect.imageUrl) {
            await supabase.from('auction_defect_images').insert({
              defect_id: defectRow.id, url: defect.imageUrl, order: 0
            })
          }
        }
      }

      // Tasuta kuulutus (rent / oksjon / otsitakse)
      if (isFree) {
        navigate(`/kuulutused/${listing.id}?avaldatud=ok`)
        return
      }

      // Müügikuulutus — Stripe makse
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
              i < step   ? 'bg-primary-600 text-white' :
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

        {/* ── Samm 0: Sõiduki andmed ── */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-bold text-lg text-white">Sõiduki andmed</h2>

            <div>
              <label className="label">Kuulutuse tüüp *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LISTING_TYPES.map(t => (
                  <button key={t.v} type="button" onClick={() => set('listing_type', t.v)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      data.listing_type === t.v
                        ? 'border-primary-500 bg-primary-600/10 text-primary-400'
                        : 'border-surface-border hover:border-muted text-muted-light'
                    }`}>
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
                  <button key={t.value} type="button" onClick={() => set('vehicle_type', t.value)}
                    className={`py-3 px-1 rounded-xl border-2 text-center transition-all ${
                      data.vehicle_type === t.value
                        ? 'border-primary-500 bg-primary-600/10 text-primary-400'
                        : 'border-surface-border hover:border-muted text-muted-light'
                    }`}>
                    <div className="flex justify-center mb-1"><VehicleIcon type={t.value} className="w-7 h-7" /></div>
                    <div className="font-bold text-xs leading-tight">{t.label.split(' ').pop()}</div>
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
                <input type="number" value={data.year} onChange={e => set('year', e.target.value)} min="2015" max="2030" className="input" />
              </div>
              <div>
                <label className="label">Värvus</label>
                <input value={data.color} onChange={e => set('color', e.target.value)} placeholder="nt. Must" className="input" />
              </div>
            </div>
          </div>
        )}

        {/* ── Samm 1: Tehniline info ── */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-white">Tehniline info</h2>
            {[
              { key: 'motor_power_w',       label: 'Mootori võimsus (W)',          placeholder: 'nt. 500' },
              { key: 'battery_capacity_wh', label: 'Aku mahtuvus (Wh)',            placeholder: 'nt. 365' },
              { key: 'max_speed_kmh',       label: 'Maksimaalne kiirus (km/h)',     placeholder: 'nt. 25'  },
              { key: 'range_km',            label: 'Sõiduulatus (km)',              placeholder: 'nt. 40'  },
              { key: 'mileage_km',          label: 'Läbisõit (km)',                 placeholder: 'nt. 500' },
              { key: 'charge_cycles',       label: 'Laadimistsükleid (valikuline)', placeholder: 'nt. 150' },
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
                    data.condition === c.value ? 'border-primary-500 bg-primary-600/10' : 'border-surface-border hover:border-muted'
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

        {/* ── Samm 2: Kirjeldus & pildid ── */}
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

            {/* Pildid */}
            <div>
              <label className="label">Pildid (min 1, max 10)</label>
              <label className="border-2 border-dashed border-surface-border rounded-xl p-8 text-center cursor-pointer hover:border-primary-600/50 transition-colors block">
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
                  onChange={e => handleImageUpload(Array.from(e.target.files))} />
                <Upload className="w-8 h-8 text-muted mx-auto mb-2" />
                <p className="text-sm text-muted-light">Kliki piltide üleslaadimiseks</p>
                <p className="text-xs text-muted mt-1">JPG, PNG, WebP • Max 5MB</p>
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-dark-light">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <X className="w-3 h-3" />
                      </button>
                      {i === 0 && <div className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded font-semibold">Peapilt</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Kahjustused — ainult oksjonile */}
            {isAuction && (
              <div className="border-t border-surface-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="label mb-0">Kahjustused ja puudused</label>
                    <p className="text-xs text-muted mt-0.5">Iga kahjustus vajab kirjeldust ja pilti</p>
                  </div>
                  <button type="button" onClick={addDefect}
                    className="btn btn-secondary text-sm gap-1.5">
                    <Plus className="w-4 h-4" /> Lisa kahjustus
                  </button>
                </div>

                {defects.length === 0 && (
                  <div className="border-2 border-dashed border-surface-border rounded-xl p-5 text-center text-muted text-sm">
                    Kahjustusi pole lisatud — kui sõidukil on puudusi, lisa need siia
                  </div>
                )}

                <div className="space-y-3">
                  {defects.map((defect, i) => (
                    <div key={defect.tempId} className="bg-dark-light border border-surface-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-white">Kahjustus {i + 1}</span>
                        <button type="button" onClick={() => removeDefect(defect.tempId)}
                          className="text-muted hover:text-red-400 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={defect.description}
                        onChange={e => updateDefect(defect.tempId, 'description', e.target.value)}
                        rows={2}
                        placeholder="Kirjelda kahjustust täpselt..."
                        className="input resize-none text-sm mb-3"
                      />
                      {defect.imageUrl ? (
                        <div className="relative w-32 h-32">
                          <img src={defect.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                          <button type="button"
                            onClick={() => setDefects(prev => prev.map(d =>
                              d.tempId === defect.tempId ? { ...d, imageFile: null, imageUrl: '' } : d
                            ))}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="border border-dashed border-surface-border rounded-lg px-4 py-2 text-xs text-muted cursor-pointer hover:border-primary-600/50 transition-colors inline-flex items-center gap-2">
                          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                            onChange={e => e.target.files[0] && handleDefectImage(defect.tempId, e.target.files[0])} />
                          {defect.uploading ? 'Laen üles...' : <><Upload className="w-3.5 h-3.5" /> Lisa foto kahjustusest *</>}
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                {/* Kohustuslik lahtiütlemine — näita juba loomise ajal */}
                <div className="mt-4 bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-200/80 leading-relaxed">
                    <strong>Kohustuslik teade:</strong> Ostjal on kohustus tutvuda sõiduki seisukorraga enne pakkumise tegemist. Müüja ei vastuta kaubal esinevate puuduste eest, olenemata sellest, kas need on kuulutusel eraldi märgitud või mitte.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Samm 3: Hind & asukoht ── */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-white">Hind & asukoht</h2>

            <div>
              <label className="label">
                {data.listing_type === 'auction' ? 'Alghind (€) *' :
                 data.listing_type === 'wanted'  ? 'Maksimaalne eelarve (€)' : 'Hind (€) *'}
              </label>
              <input type="number" value={data.price} onChange={e => set('price', e.target.value)} placeholder="nt. 299" className="input" />
            </div>

            {/* Oksjoni eritingimused */}
            {isAuction && (
              <div className="space-y-4 border-t border-surface-border pt-4">
                <h3 className="font-semibold text-white text-sm">Oksjoni tingimused</h3>

                <div>
                  <label className="label">Panuse samm (€) *</label>
                  <p className="text-xs text-muted mb-2">Minimaalne summa, mille võrra peab iga järgmine pakkumine eelneva pakkumise ületama</p>
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 5, 10, 20].map(v => (
                      <button key={v} type="button"
                        onClick={() => set('bid_increment', String(v))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                          data.bid_increment === String(v)
                            ? 'border-primary-500 bg-primary-600/10 text-primary-400'
                            : 'border-surface-border text-muted hover:border-muted'
                        }`}>
                        {v}€
                      </button>
                    ))}
                  </div>
                  <input type="number" value={data.bid_increment} onChange={e => set('bid_increment', e.target.value)}
                    placeholder="nt. 5" min="0.5" step="0.5" className="input" />
                </div>

                <div>
                  <label className="label">Oksjoni kestus *</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {AUCTION_DURATIONS.map(d => (
                      <button key={d.hours} type="button"
                        onClick={() => setAuctionDuration(d.hours)}
                        className="px-3 py-2 rounded-lg text-sm font-semibold border-2 border-surface-border text-muted hover:border-primary-500 hover:text-primary-400 transition-all">
                        {d.label}
                      </button>
                    ))}
                  </div>
                  <label className="label text-xs">Või vali täpne lõpuaeg</label>
                  <input type="datetime-local" value={data.auction_ends_at}
                    onChange={e => set('auction_ends_at', e.target.value)} className="input" />
                </div>
              </div>
            )}

            {/* Rendi tingimused */}
            {data.listing_type === 'rent' && (
              <div className="space-y-4 border-t border-surface-border pt-4">
                <h3 className="font-semibold text-white text-sm">Rendi tingimused</h3>
                <div>
                  <label className="label">Hind päevas (€) *</label>
                  <input type="number" value={data.rent_price_day || ''} onChange={e => set('rent_price_day', e.target.value)} placeholder="nt. 15" className="input" />
                </div>
                <div>
                  <label className="label">Minimaalne rendiaeg (päevad)</label>
                  <input type="number" value={data.rent_min_days || 1} onChange={e => set('rent_min_days', e.target.value)} placeholder="1" className="input" />
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

            {data.listing_type !== 'wanted' && !isAuction && (
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

        {/* ── Samm 4: Avalda ── */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-bold text-lg text-white">
              {isFree ? 'Avalda kuulutus' : 'Makse & avaldamine'}
            </h2>

            {/* Eelvaade */}
            <div className="bg-dark-light border border-surface-border rounded-xl p-4">
              <h3 className="font-semibold text-xs text-muted uppercase tracking-wider mb-2">Eelvaade</h3>
              <div className="font-bold text-white">{data.title || '—'}</div>
              <div className="text-2xl font-black text-primary-500 mt-1">
                {isAuction ? `Alghind: ${data.price || '—'} €` : data.price ? `${data.price} €` : '—'}
              </div>
              {isAuction && data.bid_increment && (
                <div className="text-sm text-muted mt-0.5">Panuse samm: {data.bid_increment} €</div>
              )}
              <div className="text-sm text-muted mt-1">{data.county}{data.city ? `, ${data.city}` : ''}</div>
            </div>

            {/* Tasuta (oksjon / rent / otsitakse) */}
            {isFree ? (
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4 text-center">
                  <div className="text-green-400 font-bold text-lg">Tasuta avaldamine</div>
                  <div className="text-sm text-muted mt-1">
                    {isAuction
                      ? 'Oksjonikuulutuse ülespanek on tasuta. Vahendustasu ainult eduka oksjoni korral.'
                      : data.listing_type === 'rent'
                      ? 'Rendikuulutuse ülespanek on tasuta. Vahendustasu ainult eduka tehingu korral.'
                      : 'Otsitakse kuulutuse ülespanek on tasuta.'}
                  </div>
                </div>

                {/* Oksjoni lahtiütlemine */}
                {isAuction && (
                  <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                      Avaldades kinnitad, et kuulutus on tõene ja täpne. Oksjoni võitja on seotud pakkumisega. Kuulutuse tühistamine pärast pakkumiste laekumist on tasuline (2.00 €).
                    </p>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={loading}
                  className="btn btn-primary btn-lg w-full text-base font-bold">
                  {loading ? 'Avaldamine...' : isAuction ? 'Alusta oksjonit' : 'Avalda kuulutus tasuta'}
                </button>
              </div>
            ) : (
              /* Müügikuulutus — vali pakett */
              <div className="space-y-4">
                <h3 className="font-semibold text-white mb-3">Vali pakett</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PLANS.map(plan => (
                    <button key={plan.v} type="button" onClick={() => set('plan', plan.v)}
                      className={`p-4 rounded-xl border-2 text-left transition-all relative ${
                        data.plan === plan.v ? 'border-primary-500 bg-primary-600/10' : 'border-surface-border hover:border-muted'
                      }`}>
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
                <button onClick={handleSubmit} disabled={loading}
                  className="btn btn-primary btn-lg w-full text-base font-bold">
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
