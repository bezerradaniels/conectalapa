import { useEffect } from 'react'

export interface HeadProps {
  title?: string
  description?: string
  /** Absolute or root-relative image URL for social link previews. */
  image?: string | null
  /** Canonical URL for this page; defaults to the current location. */
  url?: string
  type?: 'website' | 'article'
}

const DEFAULT_DESCRIPTION = 'Guia comercial e turístico de Bom Jesus da Lapa - BA.'

function resolveAbsoluteUrl(value: string): string | undefined {
  if (typeof window === 'undefined') return value
  try {
    return new URL(value, window.location.origin).toString()
  } catch {
    return undefined
  }
}

/**
 * Injects document.title and Open Graph/Twitter meta tags at runtime.
 *
 * KNOWN LIMITATION: this is a client-rendered SPA. Crawlers that don't
 * execute JavaScript (notably WhatsApp's link-preview bot) will only ever
 * see index.html's static tags, never the ones set here. These tags are
 * still correct for crawlers that do run JS (Facebook's on-demand fetch,
 * Twitter, most browsers' "copy link" previews), and they keep the tab
 * title/description right — but do not treat this as solving link
 * previews. See docs/06-DETAIL-PAGES.md "Social sharing metadata" for the
 * recommended fix (prerendering / edge-rendered tags / SSR).
 */
export function Head({ title, description, image, url, type = 'website' }: HeadProps) {
  useEffect(() => {
    const previousTitle = document.title
    const formattedTitle = title ? `${title} — ConectaLapa` : 'ConectaLapa — Guia da Cidade & Romaria'
    document.title = formattedTitle

    const finalDescription = description || DEFAULT_DESCRIPTION
    const finalUrl = url ? resolveAbsoluteUrl(url) : typeof window !== 'undefined' ? window.location.href : undefined
    const finalImage = image ? resolveAbsoluteUrl(image) : undefined

    const tagSpecs: Array<{ attr: 'name' | 'property'; key: string; content: string | undefined }> = [
      { attr: 'name', key: 'description', content: finalDescription },
      { attr: 'property', key: 'og:title', content: formattedTitle },
      { attr: 'property', key: 'og:description', content: finalDescription },
      { attr: 'property', key: 'og:type', content: type },
      { attr: 'property', key: 'og:url', content: finalUrl },
      { attr: 'property', key: 'og:image', content: finalImage },
      { attr: 'name', key: 'twitter:card', content: finalImage ? 'summary_large_image' : 'summary' },
      { attr: 'name', key: 'twitter:title', content: formattedTitle },
      { attr: 'name', key: 'twitter:description', content: finalDescription },
      { attr: 'name', key: 'twitter:image', content: finalImage },
    ]

    const cleanups = tagSpecs.map(({ attr, key, content }) => {
      if (!content) return () => {}

      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      const previousContent = el?.getAttribute('content') ?? null
      const wasCreated = !el

      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)

      return () => {
        if (!el) return
        if (wasCreated) {
          el.remove()
        } else if (previousContent !== null) {
          el.setAttribute('content', previousContent)
        }
      }
    })

    return () => {
      document.title = previousTitle
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [title, description, image, url, type])

  return null
}
