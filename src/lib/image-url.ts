/**
 * Rewrites an image URL to request a size close to its actual rendered
 * dimensions, instead of whatever the source happened to be stored at.
 *
 * Measured impact (Lighthouse, home page, throttled mobile): six seed
 * images alone accounted for ~1.6MB of a ~2MB page — all requested at
 * 1080px regardless of whether they render as a 56px avatar or a 400px
 * card. See docs/09-POLISH-LAUNCH.md report for before/after numbers.
 */

/**
 * Unsplash's image API accepts `w`/`h`/`fm`/`q` as query params on any
 * photo URL — no auth, no paid tier, works for every seed/demo image in
 * this project. Height is scaled proportionally so a URL's original
 * aspect ratio (square avatar, 4:5 promo, 3:2 gallery shot) survives the
 * resize.
 */
function optimizeUnsplashUrl(url: URL, targetWidth: number): string {
  const origW = Number(url.searchParams.get('w')) || targetWidth
  const origH = Number(url.searchParams.get('h')) || 0
  const scale = targetWidth / origW

  url.searchParams.set('w', String(Math.round(targetWidth)))
  if (origH) url.searchParams.set('h', String(Math.round(origH * scale)))
  url.searchParams.set('fm', 'webp')
  url.searchParams.set('q', '75')
  url.searchParams.set('fit', url.searchParams.get('fit') || 'crop')
  return url.toString()
}

/**
 * Supabase Storage's on-the-fly image transformation
 * (`/storage/v1/render/image/public/...?width=&height=&quality=`) is a
 * paid-tier feature, and this project's plan isn't confirmed to have it.
 * Rewriting to that endpoint blind risks breaking every real content
 * image in production if it's unavailable, so this passes the URL
 * through unchanged — the Phase 7 upload pipeline already caps images at
 * 1600px and re-encodes to WebP before they ever reach storage, which
 * covers most of the same ground. Revisit if Supabase Pro is adopted.
 */
function passthroughSupabaseUrl(url: URL): string {
  return url.toString()
}

/**
 * @param src Original image URL (may be null/undefined — passed through as-is).
 * @param targetWidth The image's actual rendered width in CSS px (not the container's).
 */
export function optimizeImageUrl(src: string | null | undefined, targetWidth: number): string | null | undefined {
  if (!src) return src

  let url: URL
  try {
    url = new URL(src)
  } catch {
    return src
  }

  if (url.hostname === 'images.unsplash.com') {
    return optimizeUnsplashUrl(url, targetWidth)
  }

  if (url.pathname.includes('/storage/v1/object/public/')) {
    return passthroughSupabaseUrl(url)
  }

  return src
}
