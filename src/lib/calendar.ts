/**
 * "Add to calendar" link builders for event detail pages: a Google Calendar
 * URL and a downloadable .ics file, both real hrefs (no click-to-generate
 * JS step) so long-press/copy/open-in-new-tab keep working.
 */

const DEFAULT_DURATION_MS = 3 * 60 * 60 * 1000 // matches the EventCard "happening now" assumption

export interface CalendarEventInput {
  uid: string
  title: string
  description?: string | null
  location?: string | null
  start: string
  end?: string | null
}

function toUtcStamp(iso: string): string {
  const date = new Date(iso)
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
}

function resolveEnd(start: string, end?: string | null): string {
  if (end) return end
  return new Date(new Date(start).getTime() + DEFAULT_DURATION_MS).toISOString()
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

export function buildGoogleCalendarUrl(event: CalendarEventInput): string {
  const start = toUtcStamp(event.start)
  const end = toUtcStamp(resolveEnd(event.start, event.end))

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
  })

  if (event.description) params.set('details', event.description)
  if (event.location) params.set('location', event.location)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function buildIcsFileContent(event: CalendarEventInput): string {
  const now = toUtcStamp(new Date().toISOString())
  const start = toUtcStamp(event.start)
  const end = toUtcStamp(resolveEnd(event.start, event.end))

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ConectaLapa//Eventos//PT-BR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.uid}@conectalapa.com.br`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ]

  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`)
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`)

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
}

/**
 * A data: URI rather than a Blob object URL — pure and synchronous, so it
 * can be computed during render (in useMemo) with no side effect to clean
 * up on unmount.
 */
export function buildIcsDataUrl(event: CalendarEventInput): string {
  const content = buildIcsFileContent(event)
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`
}
