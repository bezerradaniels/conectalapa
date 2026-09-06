import { useRef, useState } from 'react'
import type { GalleryItem } from '@/types'
import { optimizeImageUrl } from '@/lib/image-url'
import { GalleryLightbox } from './gallery-lightbox'

export interface GalleryProps {
  images: GalleryItem[] | null | undefined
  entityName: string
  className?: string
}

export function Gallery({ images, entityName, className }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([])

  if (!images || images.length === 0) return null

  const sorted = [...images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))

  function closeLightbox() {
    const openedIndex = lightboxIndex
    setLightboxIndex(null)
    if (openedIndex !== null) {
      thumbRefs.current[openedIndex]?.focus()
    }
  }

  return (
    <div className={className}>
      <div className={sorted.length === 1 ? 'grid grid-cols-1' : 'grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4'}>
        {sorted.map((image, index) => (
          <button
            key={image.id}
            ref={(el) => {
              thumbRefs.current[index] = el
            }}
            type="button"
            onClick={() => setLightboxIndex(index)}
            aria-label={`Ver imagem ${index + 1} de ${sorted.length} de ${entityName}`}
            className={
              sorted.length === 1
                ? 'relative aspect-video w-full rounded-3xl overflow-hidden bg-bg-subtle border border-black/[0.04] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
                : 'relative aspect-square w-full rounded-2xl overflow-hidden bg-bg-subtle border border-black/[0.04] shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
            }
          >
            <img
              src={optimizeImageUrl(image.image_url, sorted.length === 1 ? 700 : 300) || undefined}
              alt={image.caption || `${entityName} — foto ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={sorted}
          index={lightboxIndex}
          entityName={entityName}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  )
}
