/**
 * Clean SVG icons for vehicle types — replaces emojis for a professional look.
 * Usage: <VehicleIcon type="scooter" className="w-6 h-6" />
 */
export default function VehicleIcon({ type, className = 'w-6 h-6' }) {
  const icons = {
    scooter: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {/* Wheels */}
        <circle cx="6" cy="19" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        {/* Deck / base connecting wheels */}
        <path d="M8.5 19h7" />
        {/* Steering column */}
        <path d="M10 19l2-7" />
        <path d="M12 12l0-6" />
        {/* Handlebar */}
        <path d="M9 5.5h6" />
        <path d="M9 5.5v1" />
        <path d="M15 5.5v1" />
        {/* Rear fender */}
        <path d="M15.5 19l2-4" />
      </svg>
    ),
    cross: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="4.5" cy="18.5" r="2.5" />
        <circle cx="19.5" cy="18.5" r="2.5" />
        <path d="M7 18.5h10" />
        <path d="M17 18.5l1.5-6.5h2" />
        <path d="M7 18.5l2-8h5l3 2" />
        <path d="M9 10.5l-1-4h3l2 4" />
        <path d="M8 6.5l5-2" />
      </svg>
    ),
    mopeed: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="5" cy="18" r="3" />
        <circle cx="19" cy="18" r="3" />
        <path d="M8 18h8" />
        <path d="M16 18l1-5h3" />
        <path d="M8 18l1-5h7l1-3H10" />
        <path d="M10 10l-1-4h5" />
      </svg>
    ),
    jalgratas: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="5.5" cy="17.5" r="3.5" />
        <circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M5.5 17.5l4-8h5l4 8" />
        <path d="M9.5 9.5l9 8" />
        <path d="M8 5h4l-2.5 4.5" />
        <path d="M15 14l-5.5-4.5" />
      </svg>
    ),
    rula: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="11" width="18" height="3" rx="1.5" />
        <circle cx="7" cy="17" r="1.5" />
        <circle cx="17" cy="17" r="1.5" />
        <path d="M7 14v1.5M17 14v1.5" />
        <path d="M12 11V7" />
        <path d="M10 7h4" />
      </svg>
    ),
    monoratas: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="14" r="6" />
        <circle cx="12" cy="14" r="2.5" />
        <path d="M12 8V5" />
        <path d="M9 5h6" />
        <path d="M8.5 10l-2-3" />
        <path d="M15.5 10l2-3" />
      </svg>
    ),
  }

  return icons[type] || null
}
