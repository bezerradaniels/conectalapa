import { X } from 'lucide-react'

export interface FilterChip {
  id: string
  label: string
  onRemove: () => void
}

export interface FilterChipsProps {
  chips: FilterChip[]
  onClearAll: () => void
  className?: string
}

export function FilterChips({ chips, onClearAll, className = '' }: FilterChipsProps) {
  if (chips.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 pt-2 ${className}`}>
      <span className="text-xs text-text-muted font-medium mr-1">Filtros ativos:</span>
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-accent-subtle text-accent-text border border-accent/20 transition-all hover:bg-accent/15"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="p-0.5 rounded-full hover:bg-accent/20 focus:outline-none focus:ring-1 focus:ring-accent text-accent-text"
            aria-label={`Remover filtro ${chip.label}`}
          >
            <X className="w-3 h-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-red-600 hover:text-red-700 underline font-medium ml-1 focus:outline-none focus:ring-1 focus:ring-red-400 rounded-sm px-1 py-0.5"
      >
        Limpar todos
      </button>
    </div>
  )
}
