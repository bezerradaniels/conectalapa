import { useEffect, useRef, useState } from 'react'
import { Upload, X, ChevronUp, ChevronDown, Star, GripVertical } from 'lucide-react'
import { uploadEntityImage, deleteStorageObjectByUrl, type StorageBucket, type EntityDomain } from '@/lib/storage'
import { validateImageFile } from '@/lib/image-processing'
import type { UploadSession } from '@/components/admin/use-upload-session'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/cn'

export interface GalleryItemDraft {
  key: string
  image_url: string
  caption: string
  aspect_ratio?: string | null
}

export interface GalleryUploadFieldProps {
  label: string
  bucket: StorageBucket
  domain: EntityDomain
  entityId: string
  value: GalleryItemDraft[]
  onChange: (value: GalleryItemDraft[]) => void
  session: UploadSession
}

interface InFlightUpload {
  key: string
  name: string
  progress: number
  error: string | null
  cancelled: boolean
}

export function GalleryUploadField({ label, bucket, domain, entityId, value, onChange, session }: GalleryUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [inFlight, setInFlight] = useState<InFlightUpload[]>([])
  const dragIndexRef = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const valueRef = useRef(value)
  useEffect(() => {
    valueRef.current = value
  }, [value])
  // Cancellation is tracked outside React state: reading it back inside a
  // setInFlight updater to decide whether to call the parent's onChange
  // (i.e. updating a different component while this one renders) is exactly
  // the "setState during render" anti-pattern — a ref sidesteps that since
  // the decision happens as a plain statement after the update, not inside it.
  const cancelledKeysRef = useRef<Set<string>>(new Set())

  function handleFiles(files: FileList | File[]) {
    Array.from(files).forEach((file) => uploadOne(file))
  }

  async function uploadOne(file: File) {
    const key = crypto.randomUUID()
    setInFlight((prev) => [...prev, { key, name: file.name, progress: 0, error: null, cancelled: false }])

    const validationError = validateImageFile(file)
    if (validationError) {
      setInFlight((prev) => prev.map((u) => (u.key === key ? { ...u, error: validationError.message } : u)))
      return
    }

    try {
      const uploaded = await uploadEntityImage(bucket, domain, entityId, file, {
        onProgress: (percent) => setInFlight((prev) => prev.map((u) => (u.key === key ? { ...u, progress: percent } : u))),
      })

      setInFlight((prev) => prev.filter((u) => u.key !== key))

      if (cancelledKeysRef.current.has(key)) {
        cancelledKeysRef.current.delete(key)
        void deleteStorageObjectByUrl(uploaded.publicUrl)
      } else {
        session.registerUpload(bucket, uploaded.path, uploaded.publicUrl)
        const nextValue = [...valueRef.current, { key: crypto.randomUUID(), image_url: uploaded.publicUrl, caption: '' }]
        valueRef.current = nextValue
        onChange(nextValue)
      }
    } catch (err) {
      cancelledKeysRef.current.delete(key)
      setInFlight((prev) => prev.map((u) => (u.key === key ? { ...u, error: err instanceof Error ? err.message : 'Falha no upload.' } : u)))
    }
  }

  function cancelUpload(key: string) {
    cancelledKeysRef.current.add(key)
    setInFlight((prev) => prev.map((u) => (u.key === key ? { ...u, cancelled: true } : u)))
  }

  function dismissError(key: string) {
    setInFlight((prev) => prev.filter((u) => u.key !== key))
  }

  function removeImage(index: number) {
    const item = value[index]
    session.replaceValue(item.image_url)
    onChange(value.filter((_, i) => i !== index))
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  function setPrimary(index: number) {
    if (index === 0) return
    const next = [...value]
    const [moved] = next.splice(index, 1)
    next.unshift(moved)
    onChange(next)
  }

  function updateCaption(index: number, caption: string) {
    onChange(value.map((item, i) => (i === index ? { ...item, caption } : item)))
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary">{label}</label>

      {value.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {value.map((item, index) => (
            <li
              key={item.key}
              draggable
              onDragStart={() => (dragIndexRef.current = index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (dragIndexRef.current !== null) moveImage(dragIndexRef.current, index)
                dragIndexRef.current = null
              }}
              className="flex gap-3 rounded-lg border border-border-hairline bg-bg-surface p-2.5"
            >
              <div className="relative shrink-0">
                <img src={item.image_url} alt="" className="w-20 h-20 rounded-md object-cover border border-border-hairline" />
                {index === 0 && (
                  <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-accent text-slate-900 flex items-center justify-center" title="Imagem principal">
                    <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <Input
                  value={item.caption}
                  onChange={(e) => updateCaption(index, e.target.value)}
                  placeholder="Legenda / texto alternativo"
                  className="h-8 text-xs"
                  aria-label={`Legenda da imagem ${index + 1}`}
                />
                <div className="flex items-center gap-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    disabled={index === 0}
                    className="text-2xs font-medium text-accent-text hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer disabled:cursor-not-allowed"
                  >
                    Definir como principal
                  </button>
                  <span className="text-border-hairline" aria-hidden="true">
                    |
                  </span>
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    disabled={index === 0}
                    aria-label="Mover para cima"
                    className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    disabled={index === value.length - 1}
                    aria-label="Mover para baixo"
                    className="text-text-muted hover:text-text-primary disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span className="ml-auto hidden sm:block" title="Arraste para reordenar">
                    <GripVertical className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label="Remover imagem"
                    leadingIcon={<X className="w-3.5 h-3.5" aria-hidden="true" />}
                    onClick={() => removeImage(index)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {inFlight.map((upload) => (
        <div key={upload.key} className="flex items-center gap-2 rounded-lg border border-border-hairline bg-bg-subtle px-3 py-2">
          <span className="text-xs text-text-secondary truncate flex-1">{upload.name}</span>
          {upload.error ? (
            <>
              <span className="text-xs text-danger-text">{upload.error}</span>
              <button type="button" onClick={() => dismissError(upload.key)} aria-label="Descartar" className="text-text-muted hover:text-text-primary">
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <div className="w-20 h-1.5 rounded-full bg-bg-muted overflow-hidden">
                <div className="h-full bg-accent transition-all" style={{ width: `${upload.progress}%` }} />
              </div>
              <button
                type="button"
                onClick={() => cancelUpload(upload.key)}
                disabled={upload.cancelled}
                aria-label="Cancelar envio"
                className="text-text-muted hover:text-text-primary disabled:opacity-40"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      ))}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 h-24 rounded-lg border-2 border-dashed text-center px-4 transition-colors',
          isDragging ? 'border-accent bg-accent-subtle' : 'border-border-hairline bg-bg-subtle'
        )}
      >
        <Button type="button" variant="secondary" size="sm" leadingIcon={<Upload className="w-3.5 h-3.5" aria-hidden="true" />} onClick={() => inputRef.current?.click()}>
          Adicionar fotos
        </Button>
        <p className="text-2xs text-text-muted">ou arraste vários arquivos aqui</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <p className="text-2xs text-text-muted">
        As imagens são redimensionadas e convertidas para WebP automaticamente antes do envio.
      </p>
    </div>
  )
}
