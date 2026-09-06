import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon: ReactNode
  headline: string
  explanation: string
  action?: ReactNode
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, headline, explanation, action, className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-xl border border-border-hairline bg-bg-surface',
        className
      )}
      {...props}
    >
      <div
        className="w-12 h-12 rounded-full bg-bg-subtle text-text-muted flex items-center justify-center mb-4 border border-border-hairline shrink-0"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1 tracking-tight">
        {headline}
      </h3>
      <p className="text-sm text-text-secondary max-w-md mb-6">
        {explanation}
      </p>
      {action && <div className="inline-flex items-center">{action}</div>}
    </div>
  )
})
