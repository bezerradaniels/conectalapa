import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg'
  srText?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-8 h-8 border-3',
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', srText = 'Carregando…', className, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      role="status"
      className={cn('inline-flex items-center justify-center', className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'animate-spin rounded-full border-border-hairline border-t-accent',
          sizeClasses[size]
        )}
      />
      <span className="sr-only">{srText}</span>
    </span>
  )
})
