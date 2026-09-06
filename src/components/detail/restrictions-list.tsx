import { AlertTriangle } from 'lucide-react'

export interface RestrictionsListProps {
  restrictions: string[] | null | undefined
}

/**
 * Deliberately styled opposite of AmenityList (warning palette, alert icon,
 * bordered card) — "open bar" and "no coolers allowed" must never look the
 * same, since misreading a restriction sends someone in the wrong clothes.
 */
export function RestrictionsList({ restrictions }: RestrictionsListProps) {
  if (!restrictions || restrictions.length === 0) return null

  return (
    <div className="rounded-xl border border-warning-border bg-warning-bg p-4">
      <div className="flex items-center gap-2 text-warning-text font-bold text-sm mb-2">
        <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
        Restrições e observações
      </div>
      <ul className="space-y-1.5 pl-1">
        {restrictions.map((restriction, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-warning-text/90">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-warning-text/70 shrink-0" aria-hidden="true" />
            <span>{restriction}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
