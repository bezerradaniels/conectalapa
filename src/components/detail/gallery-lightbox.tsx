import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryItem } from '@/types'
import { optimizeImageUrl } from '@/lib/image-url'

export interface GalleryLightboxProps {
  images: GalleryItem[]
  index: number
  entityName: string
  onClose: () => void
  onNavigate: (index: number) => void
}

const FOCUSABLE_SELECTOR = 'button:not([disabled])'
const SWIPE_THRESHOLD_PX = 50

export function GalleryLightbox({ images, index, entityName, onClose, onNavigate }: GalleryLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const hasMultiple = images.length > 1

  const goPrev = () => onNavigate((index - 1 + images.length) % images.length)
  const goNext = () => onNavigate((index + 1) % images.length)

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = setTimeout(() => {
      containerRef.current?.focus()
    }, 10)

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (hasMultiple && e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
        return
      }
      if (hasMultiple && e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
        return
      }
      if (e.key === 'Tab' && containerRef.current) {
        const focusables = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          last.focus()
          e.preventDefault()
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus()
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(focusTimer)
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, hasMultiple, onClose])

  const current = images[index]

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-slate-950/92 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria de imagens de ${entityName}`}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current
        touchStartX.current = null
        if (!hasMultiple) return
        if (dx > SWIPE_THRESHOLD_PX) goPrev()
        else if (dx < -SWIPE_THRESHOLD_PX) goNext()
      }}
    >
      <div ref={containerRef} tabIndex={-1} className="relative w-full h-full flex items-center justify-center outline-none p-4">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar galeria"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white z-10"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {hasMultiple && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Imagem anterior"
            className="absolute left-2 sm:left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white z-10"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <img
          src={optimizeImageUrl(current.image_url, 1200) || undefined}
          alt={current.caption || `${entityName} — foto ${index + 1}`}
          className="max-h-[85vh] max-w-[92vw] object-contain rounded-lg select-none"
        />

        {hasMultiple && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima imagem"
            className="absolute right-2 sm:right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white z-10"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        {hasMultiple && (
          <div
            aria-live="polite"
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs font-medium bg-black/50 px-2.5 py-1 rounded-full"
          >
            {index + 1} / {images.length}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
