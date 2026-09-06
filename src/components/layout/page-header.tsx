import { type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  breadcrumbs?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('space-y-3 mb-6 sm:mb-8 border-b border-border-hairline/60 pb-5 sm:pb-6', className)}>
      {breadcrumbs}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-text-secondary max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
      </div>
    </div>
  )
}
