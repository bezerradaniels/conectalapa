import { Link } from 'react-router-dom'
import { MapPin, Building2, Bed, UtensilsCrossed } from 'lucide-react'
import type { RecentEntry } from '@/features/home/api/queries'

export interface RecentEntryCardProps {
  entry: RecentEntry
}

export function RecentEntryCard({ entry }: RecentEntryCardProps) {
  const DomainIcon =
    entry.domain === 'lodging'
      ? Bed
      : entry.domain === 'dining'
        ? UtensilsCrossed
        : Building2

  const domainColorClass =
    entry.domain === 'lodging'
      ? 'bg-sky-50 text-sky-700 border-sky-200/60'
      : entry.domain === 'dining'
        ? 'bg-orange-50 text-orange-700 border-orange-200/60'
        : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'

  return (
    <Link
      to={entry.detailPath}
      className="group flex items-center justify-between gap-4 p-4 rounded-2xl border border-border-hairline bg-bg-surface shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-black/[0.08] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      <span className="sr-only">Ver detalhes de </span>
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 border border-black/[0.04] group-hover:scale-105 transition-transform">
          <DomainIcon className="w-5 h-5 text-slate-700" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-2xs font-semibold leading-none ${domainColorClass}`}
            >
              {entry.domainLabel}
            </span>
            {entry.categoryName && (
              <span className="text-xs text-text-muted truncate hidden sm:inline">
                {entry.categoryName}
              </span>
            )}
          </div>

          <h3 className="mt-1 text-sm font-semibold text-text-primary group-hover:text-accent-text transition-colors truncate">
            {entry.name}
          </h3>

          {entry.address && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-text-muted truncate">
              <MapPin className="w-3 h-3 shrink-0 text-slate-400" aria-hidden="true" />
              <span className="truncate">{entry.address}</span>
            </div>
          )}
        </div>
      </div>

      <span className="text-xs text-text-muted shrink-0 group-hover:text-accent-text transition-colors font-medium">
        Ver
      </span>
    </Link>
  )
}
