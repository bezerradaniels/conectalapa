import { Link } from 'react-router-dom'
import { Calendar, Building2, Palmtree, Clock } from 'lucide-react'
import type { Package } from '@/types'
import { formatDepartureDate, formatCurrency, calculateDurationDays } from '@/lib/format'
import { optimizeImageUrl } from '@/lib/image-url'

export interface PackageCardProps {
  pkg: Package
}

export function PackageCard({ pkg }: PackageCardProps) {
  const agencyName = pkg.agency?.name || pkg.agency_name || 'Agência local'
  const departureFormatted = formatDepartureDate(pkg.departure_date)
  const durationDays = calculateDurationDays(pkg.departure_date, pkg.return_date)

  return (
    <Link
      to={`/pacotes/${pkg.slug}`}
      className="group flex flex-col rounded-xl border border-border-hairline bg-bg-surface overflow-hidden hover:border-border-subtle hover:shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <span className="sr-only">Ver detalhes do pacote para </span>
      {pkg.image_url ? (
        <div className="relative aspect-16/9 w-full bg-bg-subtle overflow-hidden">
          <img
            src={optimizeImageUrl(pkg.image_url, 700) || undefined}
            alt=""
            loading="lazy"
            decoding="async"
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-xs px-2.5 py-1 text-2xs font-semibold text-slate-800 shadow-xs">
              <Calendar className="w-3 h-3 text-accent-text" aria-hidden="true" />
              Saída {departureFormatted}
            </span>
            {durationDays && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/80 backdrop-blur-xs px-2 py-1 text-2xs font-medium text-white shadow-xs">
                <Clock className="w-3 h-3 text-slate-300" aria-hidden="true" />
                {durationDays} {durationDays === 1 ? 'dia' : 'dias'}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="relative aspect-16/9 w-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-teal-600/70 border-b border-border-hairline">
          <Palmtree className="w-10 h-10 opacity-50" aria-hidden="true" />
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/95 px-2.5 py-1 text-2xs font-semibold text-slate-800 shadow-xs">
              <Calendar className="w-3 h-3 text-accent-text" aria-hidden="true" />
              Saída {departureFormatted}
            </span>
            {durationDays && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-1 text-2xs font-medium text-white shadow-xs">
                {durationDays} {durationDays === 1 ? 'dia' : 'dias'}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {pkg.category && (
            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-2xs font-medium text-slate-700 mb-1.5">
              {pkg.category.name}
            </span>
          )}

          <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-text transition-colors line-clamp-2 leading-snug">
            {pkg.destination}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-text-muted truncate">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">{agencyName}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border-hairline flex items-baseline justify-between">
          <span className="text-xs text-text-muted">A partir de</span>
          <span className="text-base font-bold text-text-primary">
            {formatCurrency(pkg.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}
