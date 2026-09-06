import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null
  alt: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, alt, fallback, size = 'md', className, ...props },
  ref
) {
  const [hasError, setHasError] = useState(false)

  const initials =
    fallback ??
    alt
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase()

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full bg-bg-subtle border border-border-hairline font-medium text-text-secondary select-none',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials || '?'}</span>
      )}
    </div>
  )
})
