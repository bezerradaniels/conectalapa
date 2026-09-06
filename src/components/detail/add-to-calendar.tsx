import { useMemo } from 'react'
import { CalendarPlus, Download } from 'lucide-react'
import { buildGoogleCalendarUrl, buildIcsDataUrl, type CalendarEventInput } from '@/lib/calendar'
import { cn } from '@/lib/cn'

export interface AddToCalendarProps {
  event: CalendarEventInput
  className?: string
}

const linkClass =
  'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg text-sm font-semibold bg-bg-surface text-text-primary border border-border-hairline hover:bg-bg-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page'

/**
 * Both options are real <a href> links (Google Calendar URL, and a data:
 * URI .ics download) — no click-to-generate JS step, so long-press/
 * open-in-new-tab keep working.
 */
export function AddToCalendar({ event, className }: AddToCalendarProps) {
  const googleUrl = useMemo(() => buildGoogleCalendarUrl(event), [event])
  const icsUrl = useMemo(() => buildIcsDataUrl(event), [event])

  return (
    <div className={cn('flex flex-wrap gap-2.5', className)}>
      <a href={googleUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <CalendarPlus className="w-4 h-4" aria-hidden="true" />
        Google Agenda
      </a>
      <a href={icsUrl} download={`${event.uid}.ics`} className={linkClass}>
        <Download className="w-4 h-4" aria-hidden="true" />
        Baixar .ics
      </a>
    </div>
  )
}
