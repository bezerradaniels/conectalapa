import { Link } from 'react-router-dom'
import { MapPin, Ticket } from 'lucide-react'
import type { Event } from '@/types'
import { getEventDateBadge, formatEventDateRange, formatCurrency } from '@/lib/format'
import { Badge } from '@/components/ui/badge'

export interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const { day, month } = getEventDateBadge(event.start_datetime)
  const isFree = event.ticket_price === null || event.ticket_price === 0
  const priceDisplay = event.ticket_price_description
    ? event.ticket_price_description
    : isFree
      ? 'Gratuito'
      : formatCurrency(event.ticket_price)

  return (
    <Link
      to={`/eventos/${event.slug}`}
      className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-border-hairline bg-bg-surface hover:border-border-subtle hover:shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Ver detalhes do evento ${event.name}`}
    >
      {/* Date badge: immediate visual anchor */}
      <div className="flex sm:flex-col items-center justify-center gap-1 sm:gap-0 w-full sm:w-14 py-2 px-3 sm:px-1 rounded-lg bg-bg-subtle border border-border-hairline text-center shrink-0">
        <span className="text-xl font-bold leading-tight text-text-primary">{day}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-accent-text">{month}</span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between w-full h-full">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            {event.category && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                {event.category.name}
              </span>
            )}
            <Badge variant={isFree ? 'success' : 'neutral'} size="sm" className="font-medium">
              <Ticket className="w-3 h-3 mr-1" aria-hidden="true" />
              {priceDisplay}
            </Badge>
          </div>

          <h3 className="mt-2 text-base font-semibold text-text-primary group-hover:text-accent-text transition-colors line-clamp-2">
            {event.name}
          </h3>

          <p className="mt-1 text-xs text-text-muted">
            {formatEventDateRange(event.start_datetime, event.end_datetime)}
          </p>
        </div>

        {event.venue_name && (
          <div className="mt-3 pt-2 border-t border-border-hairline flex items-center gap-1.5 text-xs text-text-muted truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{event.venue_name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
