import { Link } from 'react-router-dom'
import { MapPin, UtensilsCrossed, Clock } from 'lucide-react'
import type { Dining, GalleryItem } from '@/types'
import { extractNeighborhood, getOpenStatus, getRestaurantTypeLabel } from '@/lib/format'
import { Badge } from '@/components/ui/badge'

export interface DiningCardProps {
  dining: Dining & { galleries?: GalleryItem[] }
}

export function DiningCard({ dining }: DiningCardProps) {
  const neighborhood = extractNeighborhood(dining.address)
  const openStatus = getOpenStatus(dining.opening_hours)
  const typeLabel = getRestaurantTypeLabel(dining.restaurant_type, dining.category?.name)

  // Pick first gallery image if present
  const firstImage =
    dining.galleries && dining.galleries.length > 0
      ? dining.galleries[0]?.image_url
      : null

  return (
    <Link
      to={`/gastronomia/${dining.slug}`}
      className="group flex flex-col rounded-xl border border-border-hairline bg-bg-surface overflow-hidden hover:border-border-subtle hover:shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Ver detalhes de ${dining.name}`}
    >
      {firstImage ? (
        <div className="relative aspect-16/9 w-full bg-bg-subtle overflow-hidden">
          <img
            src={firstImage}
            alt=""
            loading="lazy"
            decoding="async"
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-1 text-2xs font-semibold text-slate-800 shadow-xs">
              {typeLabel}
            </span>
          </div>
          {dining.price_range && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center rounded-md bg-slate-900/80 backdrop-blur-xs px-2 py-1 text-2xs font-bold text-amber-300 shadow-xs">
                {dining.price_range}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative aspect-16/9 w-full bg-gradient-to-br from-orange-50 to-rose-100 flex items-center justify-center text-orange-700/60 border-b border-border-hairline">
          <UtensilsCrossed className="w-10 h-10 opacity-50" aria-hidden="true" />
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center rounded-md bg-white/95 px-2.5 py-1 text-2xs font-semibold text-slate-800 shadow-xs">
              {typeLabel}
            </span>
          </div>
          {dining.price_range && (
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center rounded-md bg-slate-900/80 px-2 py-1 text-2xs font-bold text-amber-300 shadow-xs">
                {dining.price_range}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="neutral" size="sm" className="font-medium text-2xs">
              {typeLabel}
            </Badge>

            {openStatus && (
              <Badge
                variant={openStatus.isOpen ? 'success' : 'neutral'}
                size="sm"
                className="font-medium text-2xs"
              >
                <Clock className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
                {openStatus.label}
              </Badge>
            )}

            {dining.price_range && (
              <Badge variant="accent" size="sm" className="font-bold text-2xs">
                {dining.price_range}
              </Badge>
            )}
          </div>

          <h3 className="mt-2 text-base font-semibold text-text-primary group-hover:text-accent-text transition-colors line-clamp-2 leading-snug">
            {dining.name}
          </h3>

          {dining.description && (
            <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed">
              {dining.description}
            </p>
          )}
        </div>

        {neighborhood && (
          <div className="mt-4 pt-2.5 border-t border-border-hairline flex items-center gap-1.5 text-xs text-text-muted truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{neighborhood}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
