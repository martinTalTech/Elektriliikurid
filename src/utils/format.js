export function formatPrice(price) {
  if (!price) return '—'
  return new Intl.NumberFormat('et-EE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('et-EE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

export function getConditionLabel(value) {
  const map = { new: 'Uus', like_new: 'Nagu uus', good: 'Hea', fair: 'Rahuldav', poor: 'Halb' }
  return map[value] || value
}

export function getPrimaryImage(images) {
  if (!images?.length) return null
  const primary = images.find(i => i.is_primary)
  return (primary || images.sort((a, b) => a.order - b.order)[0])?.url || null
}
