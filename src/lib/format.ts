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

/**
 * Calculates whether an entity is open right now based on its opening_hours array.
 * Uses America/Bahia time (UTC-3).
 */
export function getOpenStatus(
  openingHours: Array<{ day: number; open?: string; close?: string; closed: boolean }> | null | undefined
): { isOpen: boolean; label: string } | null {
  if (!openingHours || !Array.isArray(openingHours) || openingHours.length === 0) {
    return null
  }

  // Get current time in America/Bahia (UTC-3)
  const now = new Date()
  const utcOffsetMinutes = now.getTimezoneOffset()
  // Bahia is UTC-3 (offset -180 minutes)
  const bahiaTime = new Date(now.getTime() + (utcOffsetMinutes - 180) * 60000)

  const currentDay = bahiaTime.getDay() // 0 = Sunday
  const currentHour = String(bahiaTime.getHours()).padStart(2, '0')
  const currentMinute = String(bahiaTime.getMinutes()).padStart(2, '0')
  const currentTime = `${currentHour}:${currentMinute}`

  const todaySchedule = openingHours.find((h) => h.day === currentDay)
  if (!todaySchedule || todaySchedule.closed || !todaySchedule.open || !todaySchedule.close) {
    return { isOpen: false, label: 'Fechado' }
  }

  const isOpen = currentTime >= todaySchedule.open && currentTime <= todaySchedule.close
  return {
    isOpen,
    label: isOpen ? 'Aberto agora' : 'Fechado',
  }
}

/**
 * Extracts a concise neighborhood (bairro) from a full address string.
 * Example: "Av. Manoel Novaes, 840 - Centro, Bom Jesus da Lapa - BA" -> "Centro"
 */
export function extractNeighborhood(address: string | null | undefined): string | null {
  if (!address) return null

  // Pattern: "... - Bairro, Bom Jesus..." or "... - Bairro - ..."
  const match = address.match(/-\s*([^,-]+?)(?:,|\s*-\s*Bom Jesus)/i)
  if (match && match[1]?.trim()) {
    const neighborhood = match[1].trim()
    // Avoid returning the city or state
    if (!neighborhood.toLowerCase().includes('bom jesus') && !neighborhood.toLowerCase().includes('ba')) {
      return neighborhood
    }
  }

  // Fallback: take part before city if comma-separated
  const parts = address.split(',')
  if (parts.length > 1) {
    const candidate = parts[0].trim()
    if (candidate.length < 35) return candidate
  }

  return null
}

/**
 * Calculates duration in days between departure and return dates.
 */
export function calculateDurationDays(departureDate: string, returnDate?: string | null): number | null {
  if (!returnDate) return null
  const dep = parseDateSafe(departureDate)
  const ret = parseDateSafe(returnDate)
  const diffTime = ret.getTime() - dep.getTime()
  if (diffTime < 0) return null
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 1
}

