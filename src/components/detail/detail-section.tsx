import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface DetailSectionProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function DetailSection({ title, icon, children, className }: DetailSectionProps) {
  return (
    <section className={cn('py-6 border-t border-border-hairline first:border-t-0 first:pt-0', className)}>
      <h2 className="flex items-center gap-2 text-base font-bold text-text-primary mb-3">
        {icon && (
          <span className="shrink-0 inline-flex items-center text-text-muted" aria-hidden="true">
            {icon}
          </span>
        )}
        {title}
      </h2>
      <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
    </section>
  )
}
