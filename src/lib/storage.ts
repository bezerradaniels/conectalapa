import { supabase } from '@/lib/supabase'
import { resizeAndConvertToWebP, validateImageFile, type ProcessedImage } from '@/lib/image-processing'

/**
 * Storage bucket purpose:
 * - "logos"     — one square-ish logo per business.
 * - "events"    — one hero/promotional image per entity (events'
 *                 promotional_image_url, and packages' image_url, which
 *                 has no dedicated bucket of its own).
 * - "galleries" — multi-photo galleries for business/event/lodging/dining.
 *
 * PATH CONVENTION: `{bucket}/{entity_id}/{domain}-{uuid}.{ext}`. The Phase 3
 * migration's comment documented `{bucket}/{domain}/{entity_id}/{uuid}`, but
 * Supabase Storage itself requires the first path segment after the bucket
 * to parse as a UUID (confirmed empirically — a non-UUID first segment is
 * rejected with `InvalidParameter: invalid input syntax for type uuid`), so
 * the entity id has to lead. `domain` is folded into the filename instead,
 * purely for human debuggability when browsing the bucket.
 */
export type StorageBucket = 'logos' | 'events' | 'galleries'
export type EntityDomain = 'business' | 'event' | 'package' | 'lodging' | 'dining'

export interface UploadedImage {
  path: string
  publicUrl: string
  processed: ProcessedImage
}

export interface UploadProgressHandlers {
  onProgress?: (percent: number) => void
}

/**
 * Validates, resizes/converts to WebP, then uploads to
 * `{bucket}/{entityId}/{domain}-{uuid}.webp`. `entityId` must be a real
 * UUID — either the entity's real DB id, or one generated client-side up
 * front for a not-yet-created entity and passed as that entity's `id` on
 * insert, so the storage path always matches the eventual row.
 */
export async function uploadEntityImage(
  bucket: StorageBucket,
  domain: EntityDomain,
  entityId: string,
  file: File,
  options: { maxDimension?: number; quality?: number; maxBytes?: number } & UploadProgressHandlers = {}
): Promise<UploadedImage> {
  const validationError = validateImageFile(file, options.maxBytes)
  if (validationError) throw new Error(validationError.message)

  options.onProgress?.(10)
  const processed = await resizeAndConvertToWebP(file, options.maxDimension, options.quality)
  options.onProgress?.(45)

  const path = `${entityId}/${domain}-${crypto.randomUUID()}.webp`

  const { error } = await supabase.storage.from(bucket).upload(path, processed.blob, {
    contentType: 'image/webp',
    upsert: false,
  })
  options.onProgress?.(90)

  if (error) throw error

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path)
  options.onProgress?.(100)

  return { path, publicUrl: publicUrlData.publicUrl, processed }
}

/** Parses a Supabase Storage public URL back into {bucket, path} for cleanup. */
export function parseStorageUrl(url: string): { bucket: StorageBucket; path: string } | null {
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
  if (!match) return null
  const [, bucket, path] = match
  if (bucket !== 'logos' && bucket !== 'events' && bucket !== 'galleries') return null
  return { bucket, path: decodeURIComponent(path) }
}

/** Best-effort delete — logged, never thrown, since a DB row is already gone by the time this runs. */
export async function deleteStorageObjectByUrl(url: string | null | undefined): Promise<void> {
  if (!url) return
  const parsed = parseStorageUrl(url)
  if (!parsed) return

  const { error } = await supabase.storage.from(parsed.bucket).remove([parsed.path])
  if (error) {
    console.error('[storage cleanup] failed to remove', url, error)
  }
}

export async function deleteStorageObjectsByUrls(urls: Array<string | null | undefined>): Promise<void> {
  await Promise.all(urls.map((url) => deleteStorageObjectByUrl(url)))
}
