export default function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="aspect-[4/3] bg-dark-light" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark-lighter rounded w-3/4" />
        <div className="h-6 bg-dark-lighter rounded w-1/3" />
        <div className="flex gap-3">
          <div className="h-3 bg-dark-lighter rounded w-10" />
          <div className="h-3 bg-dark-lighter rounded w-14" />
          <div className="h-3 bg-dark-lighter rounded w-12" />
        </div>
        <div className="pt-2 border-t border-surface-border">
          <div className="h-3 bg-dark-lighter rounded w-20" />
        </div>
      </div>
    </div>
  )
}
