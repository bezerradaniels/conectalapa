import { useEffect } from 'react'

export interface HeadProps {
  title?: string
  description?: string
}

export function Head({ title, description }: HeadProps) {
  useEffect(() => {
    const previousTitle = document.title
    const formattedTitle = title ? `${title} — ConectaLapa` : 'ConectaLapa — Guia da Cidade & Romaria'
    document.title = formattedTitle

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDesc = metaDesc ? metaDesc.getAttribute('content') : ''

    if (description) {
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.name = 'description'
        document.head.appendChild(metaDesc)
      }
      metaDesc.content = description
    }

    return () => {
      document.title = previousTitle
      if (metaDesc && previousDesc !== null) {
        metaDesc.content = previousDesc
      }
    }
  }, [title, description])

  return null
}
