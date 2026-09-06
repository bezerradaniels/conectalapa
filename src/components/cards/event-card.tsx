import { Link } from 'react-router-dom'
import { MapPin, Ticket, Calendar, Sparkles } from 'lucide-react'
import type { Event } from '@/types'
import { getEventDateBadge, formatEventDateRange, getEventPriceDisplay, extractNeighborhood } from '@/lib/format'
import { optimizeImageUrl } from '@/lib/image-url'
import { Badge } from '@/components/ui/badge'

export interface EventCardProps {
  event: Event
  showImage?: boolean
}

export function EventCard({ event, showImage = true }: EventCardProps) {
  const { day, month } = getEventDateBadge(event.start_datetime)

  // "If the price is unannounced, say so; do not render it as free."
  const { label: priceDisplay, kind: priceKind } = getEventPriceDisplay(event)
  const isFree = priceKind === 'free'

  // Determine event timing state (upcoming, happening now, ended)
  const now = new Date().getTime()
  const start = new Date(event.start_datetime).getTime()
  const end = event.end_datetime ? new Date(event.end_datetime).getTime() : start + 3 * 3600 * 1000 // default 3h

  const isHappeningNow = now >= start && now <= end
  const isPast = now > end

  // Image aspect ratio mapping
  const aspectClass = {
    '1:1': 'aspect-square',
    '4:5': 'aspect-4/5',
    '16:9': 'aspect-16/9',
  }[event.image_aspect_ratio || '1:1'] || 'aspect-square'

  const neighborhood = extractNeighborhood(event.address)

  return (
    <Link
      to={`/eventos/${event.slug}`}
      className="group flex flex-col sm:flex-row items-stretch gap-4 p-5 rounded-2xl border border-border-hairline bg-bg-surface shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-black/[0.08] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <span className="sr-only">Ver detalhes do evento </span>
      {/* Optional promotional image or date visual anchor */}
      {showImage && event.promotional_image_url ? (
        <div className={`relative w-full sm:w-36 shrink-0 ${aspectClass} overflow-hidden rounded-2xl bg-bg-subtle border border-black/[0.04]`}>
          <img
            src={optimizeImageUrl(event.promotional_image_url, 400) || undefined}
            alt=""
            loading="lazy"
            decoding="async"
            width={144}
            height={144}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
          {/* Floating date badge on top of image */}
          <div className="absolute top-2.5 left-2.5 flex flex-col items-center justify-center py-1 px-2 rounded-xl bg-slate-900/85 text-white shadow-xs backdrop-blur-sm border border-white/10">
            <span className="text-sm font-bold leading-none">{day}</span>
            <span className="text-3xs font-bold uppercase tracking-wider text-amber-300">{month}</span>
          </div>
        </div>
      ) : (
        /* Fallback date badge */
        <div className="flex sm:flex-col items-center justify-center gap-1 sm:gap-0 w-full sm:w-24 py-4 px-3 sm:px-1 rounded-2xl bg-accent-subtle/80 border border-accent-border/30 text-center shrink-0">
          <Calendar className="w-5 h-5 text-accent mb-1 hidden sm:block mx-auto" aria-hidden="true" />
          <span className="text-2xl font-bold leading-tight text-text-primary">{day}</span>
          <span className="text-xs font-bold uppercase tracking-wider text-accent-text">{month}</span>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {isHappeningNow ? (
              <Badge variant="success" size="sm" className="font-semibold text-2xs">
                <Sparkles className="w-2.5 h-2.5 mr-1 animate-pulse" aria-hidden="true" />
                Acontecendo agora
              </Badge>
            ) : isPast ? (
              <Badge variant="neutral" size="sm" className="font-medium text-2xs opacity-75">
                Encerrado
              </Badge>
            ) : null}

            {event.category && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-2xs font-medium text-slate-700">
                {event.category.name}
              </span>
            )}

            <Badge
              variant={isFree ? 'success' : priceKind === 'unannounced' ? 'neutral' : 'accent'}
              size="sm"
              className="font-medium text-2xs"
            >
              <Ticket className="w-2.5 h-2.5 mr-1" aria-hidden="true" />
              {priceDisplay}
            </Badge>
          </div>

          <h3 className="mt-2 text-base font-semibold text-text-primary group-hover:text-accent-text transition-colors line-clamp-2 leading-snug">
            {event.name}
          </h3>

          <p className="mt-1 text-xs text-text-muted">
            {formatEventDateRange(event.start_datetime, event.end_datetime)}
          </p>
        </div>

        {(event.venue_name || neighborhood) && (
          <div className="mt-3 pt-2 border-t border-border-hairline flex items-center gap-1.5 text-xs text-text-muted truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">
              {event.venue_name || neighborhood}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
