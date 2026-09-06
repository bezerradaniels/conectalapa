import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'
import type { Business } from '@/types'
import { extractNeighborhood, getOpenStatus } from '@/lib/format'
import { optimizeImageUrl } from '@/lib/image-url'
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
      className="group flex flex-col justify-between p-5 sm:p-6 rounded-2xl border border-border-hairline bg-bg-surface shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-black/[0.08] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <span className="sr-only">Ver detalhes de </span>
      <div>
        <div className="flex items-start gap-4">
          {/* Logo or monogram fallback */}
          {business.logo_url ? (
            <img
              src={optimizeImageUrl(business.logo_url, 128) || undefined}
              alt=""
              loading="lazy"
              decoding="async"
              width={64}
              height={64}
              className="w-16 h-16 rounded-2xl object-cover border border-black/[0.04] shrink-0 bg-bg-subtle shadow-xs"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-2xl bg-accent-subtle border border-accent-border/40 text-accent-text font-bold text-xl flex items-center justify-center shrink-0 uppercase select-none shadow-xs"
              aria-hidden="true"
            >
              {business.name.slice(0, 2)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {business.category && (
                <span className="inline-flex items-center rounded-full bg-slate-100/90 px-2.5 py-0.5 text-2xs font-semibold text-slate-700 border border-black/[0.04]">
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
