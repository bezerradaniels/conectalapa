import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id: providedId,
    label,
    description,
    error,
    required,
    disabled,
    className,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const id = providedId || generatedId
  const descriptionId = `${id}-description`
  const errorId = `${id}-error`

  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
    ariaDescribedBy,
  ]
    .filter(Boolean)
    .join(' ') || undefined

  return (
    <div className="w-full space-y-1.5 text-left font-sans">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-primary select-none"
        >
          {label}
          {required && <span className="text-danger-solid ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {description && (
        <p id={descriptionId} className="text-xs text-text-muted">
          {description}
        </p>
      )}

      <div className="relative">
        <input
          ref={ref}
          id={id}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'w-full h-10 px-3 py-2 text-base md:text-sm rounded-lg bg-bg-surface text-text-primary',
            'border border-border-hairline transition-colors',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-border-subtle',
            'disabled:opacity-50 disabled:bg-bg-subtle disabled:cursor-not-allowed',
            error && 'border-danger-solid focus:ring-danger-solid',
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs text-danger-text mt-1 animate-fade-in"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-danger-solid" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
})
