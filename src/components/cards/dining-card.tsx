import { Link } from 'react-router-dom'
import { MapPin, UtensilsCrossed, Clock } from 'lucide-react'
import type { Dining, GalleryItem } from '@/types'
import { extractNeighborhood, getOpenStatus, getRestaurantTypeLabel } from '@/lib/format'
import { optimizeImageUrl } from '@/lib/image-url'
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
      className="group flex flex-col rounded-2xl border border-border-hairline bg-bg-surface overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-black/[0.08] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <span className="sr-only">Ver detalhes de </span>
      {firstImage ? (
        <div className="relative aspect-video w-full bg-bg-subtle overflow-hidden">
          <img
            src={optimizeImageUrl(firstImage, 700) || undefined}
            alt=""
            loading="lazy"
            decoding="async"
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-sm px-3 py-1 text-2xs font-semibold text-slate-800 shadow-xs border border-black/[0.04]">
              {typeLabel}
            </span>
          </div>
          {dining.price_range && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center rounded-full bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 text-2xs font-bold text-amber-300 shadow-xs">
                {dining.price_range}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative aspect-video w-full bg-linear-to-br from-orange-50 to-rose-100 flex items-center justify-center text-orange-700/60 border-b border-border-hairline">
          <UtensilsCrossed className="w-10 h-10 opacity-50" aria-hidden="true" />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-2xs font-semibold text-slate-800 shadow-xs border border-black/[0.04]">
              {typeLabel}
            </span>
          </div>
          {dining.price_range && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center rounded-full bg-slate-900/85 px-2.5 py-1 text-2xs font-bold text-amber-300 shadow-xs">
                {dining.price_range}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
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
