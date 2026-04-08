export const SCOOTER_BRANDS = [
  'Xiaomi', 'Segway-Ninebot', 'Kaabo', 'Dualtron', 'Inokim',
  'Pure Electric', 'Vsett', 'Zero', 'NIU', 'Joyor', 'Kugoo',
  'Gotrax', 'Levy', 'Unagi', 'Apollo', 'Mercane', 'Navee',
  'Okai', 'Muu'
]

export const CROSS_BRANDS = [
  'Sur-Ron', 'Talaria', 'KTM Freeride E', 'Electric Motion',
  'Stark Future', 'Cake', 'Zero Motorcycles', 'Kuberg',
  'Stark', 'Muu'
]

export const MOPED_BRANDS = [
  'NIU', 'Vespa', 'BMW', 'Piaggio', 'Silence', 'Peugeot',
  'Vmoto', 'Super73', 'Seat MÒ', 'Horwin', 'Gogoro',
  'Ather', 'Ola Electric', 'Zero Motorcycles', 'Energica', 'Muu'
]

export const EBIKE_BRANDS = [
  'Xiaomi', 'Segway-Ninebot', 'Trek', 'Specialized', 'Giant',
  'Cannondale', 'Scott', 'Cube', 'Merida', 'Haibike', 'Kalkhoff',
  'Orbea', 'Focus', 'Gazelle', 'Riese & Müller', 'Bianchi',
  'Tern', 'Brompton', 'Aventon', 'Rad Power Bikes', 'Lectric',
  'Yamaha', 'Ancheer', 'Eleglide', 'Fiido', 'ADO', 'Engwe',
  'Lankeleisi', 'Muu'
]

export const RULA_BRANDS = [
  'Evolve', 'Boosted', 'WowGo', 'Meepo', 'Backfire',
  'Lacroix', 'Exway', 'Hoyt St', 'Ownboard', 'Teamgee',
  'Vestar', 'Acton', 'Koowheel', 'Muu'
]

export const MONO_BRANDS = [
  'Inmotion', 'Begode', 'KingSong', 'Gotway', 'Leaperkim',
  'Ninebot One', 'Segway', 'Solowheel', 'Muu'
]

export const CONDITIONS = [
  { value: 'new',      label: 'Uus',        description: 'Kasutamata, originaalpakendis' },
  { value: 'like_new', label: 'Nagu uus',   description: 'Väga vähe kasutatud' },
  { value: 'good',     label: 'Hea',        description: 'Esineb väiksemaid kulumise jälgi, täielikult töökorras' },
  { value: 'fair',     label: 'Rahuldav',   description: 'Nähtavad kasutamisjäljed, töökorras' },
  { value: 'poor',     label: 'Halb',       description: 'Vajab remonti' },
]

export const VEHICLE_TYPES = [
  { value: 'scooter',   label: 'Elektri tõukeratas', gradient: 'from-green-900/40 to-green-800/20' },
  { value: 'cross',     label: 'Elektri krossikas', gradient: 'from-orange-900/40 to-orange-800/20' },
  { value: 'mopeed',    label: 'Elektri mopeed',    gradient: 'from-blue-900/40 to-blue-800/20' },
  { value: 'jalgratas', label: 'Elektri jalgratas',  gradient: 'from-teal-900/40 to-teal-800/20' },
  { value: 'rula',      label: 'Elektri rula',       gradient: 'from-purple-900/40 to-purple-800/20' },
  { value: 'monoratas', label: 'Monoratas',           gradient: 'from-yellow-900/40 to-yellow-800/20' },
]

export const BRANDS_BY_TYPE = {
  scooter:   SCOOTER_BRANDS,
  cross:     CROSS_BRANDS,
  mopeed:    MOPED_BRANDS,
  jalgratas: EBIKE_BRANDS,
  rula:      RULA_BRANDS,
  monoratas: MONO_BRANDS,
}
