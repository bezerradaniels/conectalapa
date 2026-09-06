import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'
import { Spinner } from '@/components/ui/spinner'

type BaseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

type ButtonWithChildren = BaseButtonProps & {
  children: ReactNode
  'aria-label'?: string
}

type IconOnlyButton = BaseButtonProps & {
  children?: undefined
  leadingIcon: ReactNode
  trailingIcon?: undefined
  'aria-label': string
}

export type ButtonProps = ButtonWithChildren | IconOnlyButton

const variantStyles: Record<NonNullable<BaseButtonProps['variant']>, string> = {
  primary:
    'bg-accent text-slate-900 font-semibold hover:bg-accent-hover active:opacity-95 shadow-none border border-transparent',
  secondary:
    'bg-bg-surface text-text-primary font-medium border border-border-hairline hover:bg-bg-subtle hover:border-border-subtle active:bg-bg-subtle',
  ghost:
    'bg-transparent text-text-secondary font-medium hover:text-text-primary hover:bg-bg-subtle active:bg-bg-subtle border border-transparent',
  danger:
    'bg-danger-solid text-white font-medium hover:bg-danger-solid-hover active:opacity-95 border border-transparent focus-visible:ring-danger-solid',
}

const sizeStyles: Record<NonNullable<BaseButtonProps['size']>, { button: string; iconOnly: string; spinner: 'sm' | 'md' | 'lg' }> = {
  sm: {
    button: 'h-8 px-3 text-xs gap-1.5 rounded-md',
    iconOnly: 'w-8 h-8 p-0 rounded-md',
    spinner: 'sm',
  },
  md: {
    button: 'h-10 px-4 text-sm gap-2 rounded-lg',
    iconOnly: 'w-10 h-10 p-0 rounded-lg',
    spinner: 'sm',
  },
  lg: {
    button: 'h-12 px-6 text-base gap-2.5 rounded-lg',
    iconOnly: 'w-12 h-12 p-0 rounded-lg',
    spinner: 'md',
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leadingIcon,
    trailingIcon,
    disabled,
    className,
    children,
    ...props
  },
  ref
) {
  const isIconOnly = !children && Boolean(leadingIcon)
  const sizeConfig = sizeStyles[size]

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center font-sans transition-colors cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page',
        'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
        variantStyles[variant],
        isIconOnly ? sizeConfig.iconOnly : sizeConfig.button,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Spinner size={sizeConfig.spinner} className="shrink-0" />
      ) : (
        leadingIcon && <span className="shrink-0 inline-flex items-center">{leadingIcon}</span>
      )}

      {children && <span className="truncate">{children}</span>}

      {!isLoading && trailingIcon && (
        <span className="shrink-0 inline-flex items-center">{trailingIcon}</span>
      )}
    </button>
  )
})
