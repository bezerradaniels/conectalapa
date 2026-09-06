import { useRef, useState } from 'react'
import { Upload, X, ImageOff } from 'lucide-react'
import { uploadEntityImage, type StorageBucket, type EntityDomain } from '@/lib/storage'
import { validateImageFile, formatFileSize } from '@/lib/image-processing'
import type { UploadSession } from '@/components/admin/use-upload-session'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

export interface ImageUploadFieldProps {
  label: string
  bucket: StorageBucket
  domain: EntityDomain
  entityId: string
  value: string | null
  onChange: (url: string | null) => void
  session: UploadSession
  hint?: string
  maxDimension?: number
}

export function ImageUploadField({ label, bucket, domain, entityId, value, onChange, session, hint, maxDimension }: ImageUploadFieldProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [sizeInfo, setSizeInfo] = useState<{ before: number; after: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError(null)
    const validationError = validateImageFile(file)
    if (validationError) {
      setError(validationError.message)
      return
    }

    setIsUploading(true)
    setProgress(0)
    try {
      const uploaded = await uploadEntityImage(bucket, domain, entityId, file, { maxDimension, onProgress: setProgress })
      session.replaceValue(value)
      session.registerUpload(bucket, uploaded.path, uploaded.publicUrl)
      setSizeInfo({ before: uploaded.processed.originalSize, after: uploaded.processed.processedSize })
      onChange(uploaded.publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload.')
    } finally {
      setIsUploading(false)
    }
  }

  function handleRemove() {
    session.replaceValue(value)
    onChange(null)
    setSizeInfo(null)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">{label}</label>
      {hint && <p className="text-xs text-text-muted">{hint}</p>}

      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="" className="h-32 w-auto rounded-lg border border-border-hairline object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remover imagem"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            const file = e.dataTransfer.files[0]
            if (file) handleFile(file)
          }}
          className={cn(
            'flex flex-col items-center justify-center gap-2 h-32 rounded-lg border-2 border-dashed text-center px-4 transition-colors',
            isDragging ? 'border-accent bg-accent-subtle' : 'border-border-hairline bg-bg-subtle'
          )}
        >
          {isUploading ? (
            <>
              <div className="w-32 h-1.5 rounded-full bg-bg-muted overflow-hidden">
                <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-text-muted">Enviando… {progress}%</p>
            </>
          ) : (
            <>
              <ImageOff className="w-5 h-5 text-text-muted" aria-hidden="true" />
              <Button type="button" variant="secondary" size="sm" leadingIcon={<Upload className="w-3.5 h-3.5" aria-hidden="true" />} onClick={() => inputRef.current?.click()}>
                Escolher imagem
              </Button>
              <p className="text-2xs text-text-muted">ou arraste um arquivo aqui</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {sizeInfo && (
        <p className="text-2xs text-text-muted">
          {formatFileSize(sizeInfo.before)} → {formatFileSize(sizeInfo.after)} após otimização
        </p>
      )}
      {error && <p className="text-xs text-danger-text">{error}</p>}
    </div>
  )
}
