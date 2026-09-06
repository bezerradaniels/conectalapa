import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type SkeletonProps = HTMLAttributes<HTMLDivElement>

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'rounded-md bg-bg-muted animate-pulse motion-reduce:animate-none',
        className
      )}
      {...props}
    />
  )
})
