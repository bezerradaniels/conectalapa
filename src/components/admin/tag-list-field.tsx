import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface TagListFieldProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

/** Repeatable plain-text list — used for services and event restrictions. */
export function TagListField({ label, values, onChange, placeholder }: TagListFieldProps) {
  const [draft, setDraft] = useState('')

  function addValue() {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...values, trimmed])
    setDraft('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">{label}</label>

      {values.length > 0 && (
        <ul className="space-y-1.5">
          {values.map((value, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="flex-1 text-sm text-text-primary bg-bg-subtle border border-border-hairline rounded-lg px-3 py-2">
                {value}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remover "${value}"`}
                leadingIcon={<X className="w-4 h-4" aria-hidden="true" />}
                onClick={() => onChange(values.filter((_, i) => i !== index))}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addValue()
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={addValue} leadingIcon={<Plus className="w-4 h-4" aria-hidden="true" />}>
          Adicionar
        </Button>
      </div>
    </div>
  )
}
