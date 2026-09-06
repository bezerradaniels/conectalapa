import type { OpeningHourInterval } from '@/types'

const DAY_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const WEEKDAYS = [1, 2, 3, 4, 5]

export interface OpeningHoursEditorProps {
  value: OpeningHourInterval[]
  onChange: (value: OpeningHourInterval[]) => void
}

/**
 * Seven rows of two time inputs is tedious to fill by hand, so this adds a
 * closed toggle per day and a "copy to Mon-Fri" shortcut from any weekday
 * row — the common case (same hours all week) becomes one row plus a click.
 */
export function OpeningHoursEditor({ value, onChange }: OpeningHoursEditorProps) {
  const byDay = new Map(value.map((h) => [h.day, h]))
  const rows: OpeningHourInterval[] = Array.from({ length: 7 }, (_, day) => byDay.get(day) || { day, closed: true, open: '08:00', close: '18:00' })

  function updateDay(day: number, patch: Partial<OpeningHourInterval>) {
    onChange(rows.map((row) => (row.day === day ? { ...row, ...patch } : row)))
  }

  function copyToWeekdays(sourceDay: number) {
    const source = rows.find((r) => r.day === sourceDay)
    if (!source) return
    onChange(rows.map((row) => (WEEKDAYS.includes(row.day) ? { ...source, day: row.day } : row)))
  }

  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium text-text-primary">Horário de funcionamento</legend>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.day} className="flex items-center gap-2 flex-wrap rounded-lg border border-border-hairline bg-bg-surface px-3 py-2">
            <span className="w-20 shrink-0 text-sm font-medium text-text-primary">{DAY_LABELS[row.day]}</span>

            <label className="flex items-center gap-1.5 text-xs text-text-muted shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={!row.closed}
                onChange={(e) => updateDay(row.day, { closed: !e.target.checked })}
                className="w-4 h-4 rounded border-border-hairline text-accent focus:ring-accent"
              />
              Aberto
            </label>

            {!row.closed && (
              <span className="flex items-center gap-2">
                <input
                  type="time"
                  aria-label={`Horário de abertura — ${DAY_LABELS[row.day]}`}
                  value={row.open || '08:00'}
                  onChange={(e) => updateDay(row.day, { open: e.target.value })}
                  className="h-9 px-2 text-sm rounded-lg border border-border-hairline bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <span className="text-xs text-text-muted">até</span>
                <input
                  type="time"
                  aria-label={`Horário de fechamento — ${DAY_LABELS[row.day]}`}
                  value={row.close || '18:00'}
                  onChange={(e) => updateDay(row.day, { close: e.target.value })}
                  className="h-9 px-2 text-sm rounded-lg border border-border-hairline bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </span>
            )}

            {WEEKDAYS.includes(row.day) && !row.closed && (
              <button
                type="button"
                onClick={() => copyToWeekdays(row.day)}
                className="ml-auto text-xs font-medium text-accent-text hover:underline cursor-pointer"
              >
                Copiar p/ seg–sex
              </button>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  )
}
