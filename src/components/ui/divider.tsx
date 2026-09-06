import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  children?: ReactNode
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', children, className, ...props },
  ref
) {
  if (orientation === 'vertical') {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="vertical"
        className={cn('inline-block h-full w-px bg-border-hairline self-stretch', className)}
        {...props}
      />
    )
  }

  if (children) {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center text-xs text-text-muted my-4', className)}
        {...props}
      >
        <span className="flex-1 border-t border-border-hairline" />
        <span className="px-3 font-medium">{children}</span>
        <span className="flex-1 border-t border-border-hairline" />
      </div>
    )
  }

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full border-t border-border-hairline my-4', className)}
      {...props}
    />
  )
})
