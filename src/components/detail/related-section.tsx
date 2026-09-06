import type { ReactNode } from 'react'

export interface RelatedSectionProps {
  title: string
  hasItems: boolean
  children: ReactNode
}

/** Renders nothing when there's nothing related, rather than an empty section. */
export function RelatedSection({ title, hasItems, children }: RelatedSectionProps) {
  if (!hasItems) return null

  return (
    <section aria-labelledby="related-heading" className="pt-8 mt-2 border-t border-border-hairline">
      <h2 id="related-heading" className="text-lg font-bold text-text-primary mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>
    </section>
  )
}
