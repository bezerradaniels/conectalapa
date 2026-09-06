import { useState } from 'react'
import { MessageCircle, MapPin, AtSign, Share2, Check } from 'lucide-react'
import { buildWhatsAppUrl, buildInstagramUrl } from '@/lib/whatsapp'
import { buildDirectionsUrl } from '@/lib/maps'
import { cn } from '@/lib/cn'

export interface ContactActionsProps {
  whatsapp?: string | null
  whatsappMessage: string
  instagram?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  shareTitle: string
  className?: string
}

const linkClass =
  'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page'

/**
 * Every contact channel is a real <a href>, never a JS-only button — users
 * long-press to copy or open in a new tab, and that breaks with onClick
 * handlers. Missing channels are simply omitted, never rendered disabled.
 */
export function ContactActions({
  whatsapp,
  whatsappMessage,
  instagram,
  address,
  latitude,
  longitude,
  shareTitle,
  className,
}: ContactActionsProps) {
  const [copied, setCopied] = useState(false)

  const whatsappUrl = buildWhatsAppUrl(whatsapp, whatsappMessage)
  const instagramUrl = buildInstagramUrl(instagram)
  const directionsUrl = buildDirectionsUrl(address, { latitude, longitude })
  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  async function handleShare() {
    const shareData = { title: shareTitle, url: window.location.href }

    if (canNativeShare) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled the share sheet — not an error worth surfacing.
      }
      return
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access denied; nothing more we can do without a fallback UI.
    }
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, 'bg-[#25D366] text-white hover:opacity-90 flex-1 sm:flex-none min-w-35')}
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          WhatsApp
        </a>
      )}

      {directionsUrl && (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, 'bg-bg-surface text-text-primary border border-border-hairline hover:bg-bg-subtle flex-1 sm:flex-none min-w-35')}
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          Como chegar
        </a>
      )}

      {instagramUrl && (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, 'bg-bg-surface text-text-primary border border-border-hairline hover:bg-bg-subtle')}
        >
          <AtSign className="w-4 h-4" aria-hidden="true" />
          Instagram
        </a>
      )}

      <button
        type="button"
        onClick={handleShare}
        className={cn(linkClass, 'bg-bg-surface text-text-primary border border-border-hairline hover:bg-bg-subtle')}
        aria-label={copied ? 'Link copiado' : 'Compartilhar'}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-success-text" aria-hidden="true" />
            <span className="text-success-text">Copiado!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" aria-hidden="true" />
            Compartilhar
          </>
        )}
      </button>
    </div>
  )
}
