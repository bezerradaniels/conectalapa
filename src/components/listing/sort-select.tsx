import { ArrowDownUp } from 'lucide-react'
import { Select } from '@/components/ui/select'

export interface SortOption {
  value: string
  label: string
}

export interface SortSelectProps {
  value: string
  onChange: (value: string) => void
  options: SortOption[]
  label?: string
  className?: string
}

export function SortSelect({
  value,
  onChange,
  options,
  label = 'Ordenar por',
  className,
}: SortSelectProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <label htmlFor="listing-sort-select" className="sr-only sm:not-sr-only text-xs font-medium text-text-muted whitespace-nowrap flex items-center gap-1.5">
        <ArrowDownUp className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
        {label}:
      </label>
      <Select
        id="listing-sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        aria-label={label}
        className="w-auto min-w-[150px] text-xs py-1.5"
      />
    </div>
  )
}
