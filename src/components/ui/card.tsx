import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { interactive = false, className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-border-hairline bg-bg-surface text-text-primary shadow-sm transition-all duration-300',
        interactive &&
          'hover:-translate-y-1 hover:shadow-md hover:border-black/[0.08] cursor-pointer focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn('p-5 sm:p-6 pb-3 space-y-1.5', className)} {...props} />
  }
)

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, children, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold leading-tight tracking-tight text-text-primary', className)}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cn('text-sm text-text-secondary', className)} {...props} />
  }
)

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('p-5 sm:p-6 pt-0', className)} {...props} />
  }
)

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function CardFooter({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn('flex items-center p-5 sm:p-6 border-t border-border-hairline mt-4 pt-4', className)}
        {...props}
      />
    )
  }
)
