import type { ContentStatus } from '@/types'
import { cn } from '@/lib/cn'

export interface StatusControlProps {
  value: ContentStatus
  onChange: (status: ContentStatus) => void
  disabled?: boolean
}

const OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicado' },
  { value: 'archived', label: 'Arquivado' },
]

const CONSEQUENCE: Record<ContentStatus, string> = {
  draft: 'Não aparece no site público. Só você pode ver esta entrada (por link de pré-visualização).',
  published: 'Aparece no site público imediatamente após salvar.',
  archived: 'Removido do site público, mas mantido no sistema para referência futura.',
}

/** Publishing consequence is always stated plainly, next to the control that changes it. */
export function StatusControl({ value, onChange, disabled }: StatusControlProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium text-text-primary">Status</legend>
      <div className="inline-flex rounded-lg border border-border-hairline bg-bg-subtle p-1" role="radiogroup" aria-label="Status de publicação">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
              value === option.value ? 'bg-bg-surface text-text-primary shadow-xs' : 'text-text-muted hover:text-text-primary'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-text-muted">{CONSEQUENCE[value]}</p>
    </fieldset>
  )
}
