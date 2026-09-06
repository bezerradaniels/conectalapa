import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'coral' | 'mint' | 'purple'
  size?: 'sm' | 'md'
  icon?: ReactNode
}

const variantStyles = {
  neutral: 'bg-bg-subtle text-text-secondary border-black/[0.04]',
  accent: 'bg-accent-subtle text-accent-text border-accent-border/50',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
  coral: 'bg-coral-subtle text-coral-text border-coral/20',
  mint: 'bg-mint-subtle text-mint-text border-mint/20',
  purple: 'bg-purple-subtle text-purple-text border-purple/20',
}

const sizeStyles = {
  sm: 'text-2xs font-semibold px-2.5 py-0.5 gap-1',
  md: 'text-xs font-semibold px-3 py-1 gap-1.5',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'neutral', size = 'sm', icon, className, children, ...props },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center font-medium rounded-full border border-solid select-none tracking-normal',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 inline-flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  )
})
