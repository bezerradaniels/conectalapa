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
      ? 'bg-sky-50 text-sky-700 border-sky-200'
      : entry.domain === 'dining'
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-slate-100 text-slate-700 border-slate-200'

  return (
    <Link
      to={entry.detailPath}
      className="group flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border-hairline bg-bg-surface hover:border-border-subtle hover:shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label={`Ver detalhes de ${entry.name}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-subtle text-slate-500 border border-border-hairline">
          <DomainIcon className="w-5 h-5 text-slate-600" aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-none ${domainColorClass}`}
            >
              {entry.domainLabel}
            </span>
            {entry.categoryName && (
              <span className="text-xs text-text-muted truncate hidden sm:inline">
                {entry.categoryName}
              </span>
            )}
          </div>

          <h4 className="mt-1 text-sm font-semibold text-text-primary group-hover:text-accent-text transition-colors truncate">
            {entry.name}
          </h4>

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
