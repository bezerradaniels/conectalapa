import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'
import { AlertCircle, ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  options?: SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    id: providedId,
    label,
    description,
    error,
    required,
    disabled,
    options,
    className,
    children,
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
        <select
          ref={ref}
          id={id}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'w-full h-11 pl-4 pr-10 py-2.5 text-base md:text-sm rounded-xl bg-slate-50/80 focus:bg-white text-text-primary',
            'border border-black/[0.07] transition-all duration-200 appearance-none cursor-pointer shadow-2xs',
            'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
            'disabled:opacity-50 disabled:bg-bg-subtle disabled:cursor-not-allowed',
            error && 'border-danger-solid focus:ring-danger-solid/20 focus:border-danger-solid',
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </span>
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
