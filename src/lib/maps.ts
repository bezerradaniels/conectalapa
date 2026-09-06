/**
 * Directions link builder. The Phase 3 domain models don't store
 * latitude/longitude, so this always falls back to a text address search —
 * coordinates are accepted here so a future migration can upgrade precision
 * without touching call sites.
 */
export function buildDirectionsUrl(
  address: string | null | undefined,
  coords?: { latitude?: number | null; longitude?: number | null }
): string | null {
  if (coords?.latitude != null && coords?.longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.latitude},${coords.longitude}`
  }

  if (!address || !address.trim()) return null

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address.trim())}`
}
