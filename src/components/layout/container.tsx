import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide'
}

const sizeClasses = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-7xl',
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'default', className, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('w-full mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
      {...props}
    >
      {children}
    </div>
  )
})
