import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, Check, Loader2, X } from 'lucide-react'
import { slugifyPreview, isSlugTaken, type SluggableTable } from '@/lib/slug'
import { Input } from '@/components/ui/input'

export interface SlugFieldProps {
  table: SluggableTable
  value: string
  onChange: (slug: string) => void
  /** The name/destination text the slug should auto-derive from until the admin edits it directly. */
  sourceText: string
  entityId?: string | null
  /** True when editing an already-published entry — gates the "this breaks shared links" warning. */
  isPublished?: boolean
  originalSlug?: string | null
  error?: string
}

type Availability = 'idle' | 'checking' | 'available' | 'taken'

export function SlugField({ table, value, onChange, sourceText, entityId, isPublished, originalSlug, error }: SlugFieldProps) {
  const [touched, setTouched] = useState(false)
  const [availability, setAvailability] = useState<Availability>('idle')

  // Auto-derive from the source field until the admin edits the slug directly.
  useEffect(() => {
    if (touched) return
    const next = slugifyPreview(sourceText || '')
    if (next !== value) onChange(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceText, touched])

  // Reset the availability indicator during render when the slug changes
  // (React's "adjust state during render" pattern), rather than as a
  // synchronous setState at the top of an effect.
  const [checkedValue, setCheckedValue] = useState(value)
  if (checkedValue !== value) {
    setCheckedValue(value)
    setAvailability(value ? 'checking' : 'idle')
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!value) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const taken = await isSlugTaken(table, value, entityId)
        setAvailability(taken ? 'taken' : 'available')
      } catch {
        setAvailability('idle')
      }
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [table, value, entityId])

  const slugChangedOnPublished = Boolean(isPublished && originalSlug && value && value !== originalSlug)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          label="Slug (URL)"
          value={value}
          onChange={(e) => {
            setTouched(true)
            onChange(slugifyPreview(e.target.value))
          }}
          error={error}
          className="pr-9"
        />
        <span className="absolute right-3 top-[34px] pointer-events-none">
          {availability === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-text-muted" aria-hidden="true" />}
          {availability === 'available' && <Check className="w-4 h-4 text-success-text" aria-hidden="true" />}
          {availability === 'taken' && <X className="w-4 h-4 text-danger-solid" aria-hidden="true" />}
        </span>
      </div>

      {availability === 'taken' && <p className="text-xs text-danger-text">Este slug já está em uso.</p>}

      {slugChangedOnPublished && (
        <p className="flex items-start gap-1.5 text-xs text-warning-text bg-warning-bg border border-warning-border rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden="true" />
          Esta entrada já está publicada. Mudar o slug quebra qualquer link (WhatsApp, redes sociais) já
          compartilhado com o endereço atual — não há redirecionamento automático do slug antigo.
        </p>
      )}
    </div>
  )
}
