/**
 * WhatsApp and Instagram link builders.
 *
 * Admin-entered phone numbers arrive in wildly inconsistent formats:
 * "(77) 99999-9999", "77999999999", "+5577999999999", "077 99999999", etc.
 * `normalizePhoneToE164BR` reduces all of these to a bare-digit E.164 string
 * (country code + area code + number, no "+") that `wa.me` accepts.
 */

/**
 * Normalizes a Brazilian phone number to E.164 digits (no "+").
 * Returns null when the input can't be confidently normalized rather than
 * guessing — a wrong number is worse than a missing button.
 */
export function normalizePhoneToE164BR(raw: string | null | undefined): string | null {
  if (!raw) return null

  const hasPlus = raw.trim().startsWith('+')
  const digits = raw.replace(/\D/g, '').replace(/^0+/, '')

  if (!digits) return null

  // Explicit country code present: "+55 77 99999-9999" -> 5577999999999
  if (hasPlus) {
    if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
      return digits
    }
    return null
  }

  // "5577999999999" typed without the "+" — same shape as above.
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits
  }

  // Local number with area code, no country code: "(77) 99999-9999" / "77999999999"
  // 10 digits = area code + 8-digit landline, 11 digits = area code + 9-digit mobile.
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`
  }

  // Anything else (missing area code, truncated, extra digits) is ambiguous.
  return null
}

/**
 * Builds a wa.me link with a prefilled message, or null if the stored
 * number can't be normalized — callers should render nothing in that case.
 */
export function buildWhatsAppUrl(rawPhone: string | null | undefined, message: string): string | null {
  const phone = normalizePhoneToE164BR(rawPhone)
  if (!phone) return null
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

/**
 * Formats digits into a Brazilian phone display mask as the admin types —
 * "(77) 99999-9999" for an 11-digit mobile, "(77) 9999-9999" for a
 * 10-digit landline. Purely cosmetic; `normalizePhoneToE164BR` is what
 * actually gets stored.
 */
export function formatPhoneBRInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length === 0) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

/**
 * Builds an Instagram profile URL from a handle, accepting "@handle",
 * "handle", or a full instagram.com URL.
 */
export function buildInstagramUrl(rawHandle: string | null | undefined): string | null {
  if (!rawHandle) return null

  let handle = rawHandle.trim()
  if (!handle) return null

  const urlMatch = handle.match(/instagram\.com\/([^/?#]+)/i)
  if (urlMatch) {
    handle = urlMatch[1]
  }

  handle = handle.replace(/^@/, '').trim()
  if (!handle) return null

  return `https://instagram.com/${encodeURIComponent(handle)}`
}
