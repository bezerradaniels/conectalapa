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
    <section className={cn('py-8 border-t border-black/[0.04] first:border-t-0 first:pt-0', className)}>
      <h2 className="flex items-center gap-2 text-lg font-bold text-text-primary mb-4">
        {icon && (
          <span className="shrink-0 inline-flex items-center text-accent" aria-hidden="true">
            {icon}
          </span>
        )}
        {title}
      </h2>
      <div className="text-sm sm:text-base text-text-secondary leading-relaxed">{children}</div>
    </section>
  )
}
