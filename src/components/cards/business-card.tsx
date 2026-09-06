import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'
import type { Business } from '@/types'
import { extractNeighborhood, getOpenStatus } from '@/lib/format'
import { Badge } from '@/components/ui/badge'

export interface BusinessCardProps {
  business: Business
}

export function BusinessCard({ business }: BusinessCardProps) {
  const neighborhood = extractNeighborhood(business.address)
  const openStatus = getOpenStatus(business.opening_hours)

  return (
    <Link
      to={`/empresas/${business.slug}`}
      className="group flex flex-col justify-between p-4 rounded-xl border border-border-hairline bg-bg-surface hover:border-border-subtle hover:shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Ver detalhes de ${business.name}`}
    >
      <div>
        <div className="flex items-start gap-3.5">
          {/* Logo or monogram fallback */}
          {business.logo_url ? (
            <img
              src={business.logo_url}
              alt=""
              loading="lazy"
              decoding="async"
              width={56}
              height={56}
              className="w-14 h-14 rounded-lg object-cover border border-border-hairline shrink-0 bg-bg-subtle"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-lg bg-accent-subtle border border-border-hairline text-accent-text font-bold text-lg flex items-center justify-center shrink-0 uppercase select-none"
              aria-hidden="true"
            >
              {business.name.slice(0, 2)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {business.category && (
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-2xs font-medium text-slate-700">
                  {business.category.name}
                </span>
              )}
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
            </div>

            <h3 className="mt-1 text-base font-semibold text-text-primary group-hover:text-accent-text transition-colors line-clamp-2 leading-snug">
              {business.name}
            </h3>
          </div>
        </div>

        {business.description && (
          <p className="mt-3 text-xs text-text-secondary line-clamp-2 leading-relaxed">
            {business.description}
          </p>
        )}
      </div>

      {neighborhood && (
        <div className="mt-4 pt-2.5 border-t border-border-hairline flex items-center gap-1.5 text-xs text-text-muted truncate">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="truncate">{neighborhood}</span>
        </div>
      )}
    </Link>
  )
}
