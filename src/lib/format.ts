/**
 * ConectaLapa formatters for currency, dates, and text in pt-BR locale.
 */

const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return 'Gratuito'
  }
  return BRL_FORMATTER.format(amount)
}

/**
 * Parses an ISO date or date-time string safely.
 * Handles both 'YYYY-MM-DD' and full ISO-8601 strings.
 */
function parseDateSafe(input: string): Date {
  if (input.includes('T')) {
    return new Date(input)
  }
  const [year, month, day] = input.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

const MONTH_SHORT_PT_BR = [
  'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
  'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ',
]

const MONTH_LONG_PT_BR = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

export function getEventDateBadge(isoDateTime: string): { day: string; month: string } {
  const d = parseDateSafe(isoDateTime)
  const day = String(d.getDate()).padStart(2, '0')
  const month = MONTH_SHORT_PT_BR[d.getMonth()] || ''
  return { day, month }
}

export function formatEventDateRange(startIso: string, endIso?: string | null): string {
  const start = parseDateSafe(startIso)
  const startDay = start.getDate()
  const startMonth = MONTH_LONG_PT_BR[start.getMonth()]

  if (!endIso) {
    const hours = String(start.getHours()).padStart(2, '0')
    const minutes = String(start.getMinutes()).padStart(2, '0')
    const timeStr = hours !== '00' || minutes !== '00' ? ` às ${hours}:${minutes}` : ''
    return `${startDay} de ${startMonth}${timeStr}`
  }

  const end = parseDateSafe(endIso)
  const endDay = end.getDate()
  const endMonth = MONTH_LONG_PT_BR[end.getMonth()]

  if (start.getMonth() === end.getMonth()) {
    return `${startDay} a ${endDay} de ${startMonth}`
  }

  return `${startDay} de ${startMonth} a ${endDay} de ${endMonth}`
}

export function formatDepartureDate(dateStr: string): string {
  const d = parseDateSafe(dateStr)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}
