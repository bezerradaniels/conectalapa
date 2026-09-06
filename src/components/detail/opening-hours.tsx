import { Clock } from 'lucide-react'
import type { OpeningHourInterval } from '@/types'
import { getOpenStatus } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'

export interface OpeningHoursProps {
  hours: OpeningHourInterval[] | null | undefined
}

// Monday-first, matching how people in Brazil read a weekly schedule.
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
const DAY_LABELS: Record<number, string> = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
}

export function OpeningHours({ hours }: OpeningHoursProps) {
  if (!hours || hours.length === 0) return null

  const today = new Date().getDay()
  const status = getOpenStatus(hours)
  const byDay = new Map(hours.map((h) => [h.day, h]))

  return (
    <div>
      {status && (
        <Badge variant={status.isOpen ? 'success' : 'neutral'} size="md" className="mb-3 font-semibold">
          <Clock className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
          {status.label}
        </Badge>
      )}

      <ul className="divide-y divide-border-hairline border-y border-border-hairline">
        {DAY_ORDER.map((day) => {
          const schedule = byDay.get(day)
          const isToday = day === today

          return (
            <li
              key={day}
              className={cn(
                'flex items-center justify-between py-2 text-sm',
                isToday && 'font-bold text-text-primary'
              )}
            >
              <span className={cn(!isToday && 'text-text-secondary')}>{DAY_LABELS[day]}</span>
              <span className={cn('tabular-nums', !isToday && 'text-text-secondary')}>
                {!schedule || schedule.closed || !schedule.open || !schedule.close
                  ? 'Fechado'
                  : `${schedule.open} – ${schedule.close}`}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
