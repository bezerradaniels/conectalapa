/**
 * Client-side image resize + WebP conversion. Runs before every admin
 * upload — the admin will pick 4MB phone photos straight out of a camera
 * roll, and uploading those raw wastes their time on a slow connection and
 * every visitor's bandwidth forever.
 */

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // matches the galleries/events bucket limit; logos are capped tighter client-side

export interface ProcessedImage {
  blob: Blob
  originalSize: number
  processedSize: number
  width: number
  height: number
}

export interface ImageValidationError {
  code: 'invalid_type' | 'too_large'
  message: string
}

/** Validates type and size before any processing starts, not after a failed upload. */
export function validateImageFile(file: File, maxBytes: number = MAX_UPLOAD_BYTES): ImageValidationError | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return { code: 'invalid_type', message: 'Formato não suportado. Envie um arquivo JPEG, PNG ou WebP.' }
  }
  if (file.size > maxBytes) {
    return {
      code: 'too_large',
      message: `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)}MB). O limite é ${(maxBytes / 1024 / 1024).toFixed(0)}MB.`,
    }
  }
  return null
}

/**
 * Resizes to fit within maxDimension (preserving aspect ratio, never
 * upscaling) and re-encodes as WebP at the given quality.
 */
export async function resizeAndConvertToWebP(
  file: File,
  maxDimension = 1600,
  quality = 0.82
): Promise<ProcessedImage> {
  const bitmap = await createImageBitmap(file)

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não foi possível processar a imagem neste navegador.')

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality))
  if (!blob) throw new Error('Falha ao converter a imagem para WebP.')

  return { blob, originalSize: file.size, processedSize: blob.size, width, height }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
