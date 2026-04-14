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

export const MODELS_BY_BRAND = {
  // Scooter brands
  'Xiaomi': ['Mi Electric Scooter 3', 'Mi Electric Scooter 4', 'Mi Electric Scooter 4 Pro', 'Mi Electric Scooter 4 Ultra', 'Mi Electric Scooter Pro 2', 'Mi Essential', 'Muu'],
  'Segway-Ninebot': ['Max G30', 'Max G2', 'E2', 'F2', 'F2 Plus', 'F2 Pro', 'F65', 'GT1', 'GT2', 'P65', 'Muu'],
  'Kaabo': ['Mantis 10', 'Mantis King GT', 'Wolf Warrior 11', 'Wolf King', 'Wolf King GT Pro', 'Skywalker 10S', 'Muu'],
  'Dualtron': ['Thunder 2', 'Victor Luxury', 'Storm', 'Mini Special', 'Ultra 2', 'Eagle Pro', 'Muu'],
  'Inokim': ['Quick 4', 'OX Super', 'OXO', 'Light 2', 'Muu'],
  'Vsett': ['8', '9+', '10+', '11+', 'Muu'],
  'Apollo': ['City Pro', 'Ghost', 'Phantom', 'Pro', 'Muu'],
  // Cross brands
  'Sur-Ron': ['Light Bee X', 'Light Bee S', 'Storm Bee', 'Ultra Bee', 'Muu'],
  'Talaria': ['Sting', 'Sting R', 'XXX', 'Muu'],
  // Moped brands
  'NIU': ['NQi Pro', 'NQi Sport', 'MQi GT', 'MQi+', 'UQi Pro', 'Gova C0', 'Gova G0', 'Muu'],
  'Super73': ['S2', 'RX', 'ZX', 'S1', 'Muu'],
  // E-bike brands
  'Trek': ['Powerfly', 'Rail', 'Domane+', 'FX+', 'Allant+', 'Muu'],
  'Specialized': ['Turbo Levo', 'Turbo Vado', 'Turbo Como', 'Turbo Creo', 'Muu'],
  'Giant': ['Explore E+', 'Trance X E+', 'Reign E+', 'Talon E+', 'Muu'],
  'Cube': ['Stereo Hybrid', 'Reaction Hybrid', 'Touring Hybrid', 'Kathmandu Hybrid', 'Muu'],
  'Rad Power Bikes': ['RadRover', 'RadRunner', 'RadWagon', 'RadCity', 'RadMission', 'Muu'],
  // Rula brands
  'Evolve': ['GTR Bamboo', 'Stoke', 'Hadean Carbon', 'Muu'],
  'Boosted': ['Stealth', 'Plus', 'Mini X', 'Mini S', 'Muu'],
  'Meepo': ['Hurricane', 'Voyager', 'Mini 2', 'V4', 'Shuffle S', 'Muu'],
  // Mono brands
  'Inmotion': ['V11', 'V12', 'V13', 'V8F', 'Muu'],
  'Begode': ['Master Pro', 'Hero', 'Extreme', 'Mten4', 'Muu'],
  'KingSong': ['S22', 'S18', '16X', '14D', 'Muu'],
}

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
