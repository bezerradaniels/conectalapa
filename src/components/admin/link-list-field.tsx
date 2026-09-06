import { Plus, X } from 'lucide-react'
import type { AdditionalLink } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface LinkListFieldProps {
  label: string
  values: AdditionalLink[]
  onChange: (values: AdditionalLink[]) => void
}

/** Repeatable label+URL rows — additional_links / event links. */
export function LinkListField({ label, values, onChange }: LinkListFieldProps) {
  function updateRow(index: number, patch: Partial<AdditionalLink>) {
    onChange(values.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">{label}</label>

      {values.length > 0 && (
        <div className="space-y-2">
          {values.map((row, index) => (
            <div key={index} className="flex items-start gap-2">
              <Input
                value={row.label}
                onChange={(e) => updateRow(index, { label: e.target.value })}
                placeholder="Rótulo (ex: Site oficial)"
                className="flex-1"
              />
              <Input
                value={row.url}
                onChange={(e) => updateRow(index, { url: e.target.value })}
                placeholder="https://…"
                type="url"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Remover link"
                leadingIcon={<X className="w-4 h-4" aria-hidden="true" />}
                onClick={() => onChange(values.filter((_, i) => i !== index))}
              />
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => onChange([...values, { label: '', url: '' }])}
        leadingIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
      >
        Adicionar link
      </Button>
    </div>
  )
}
