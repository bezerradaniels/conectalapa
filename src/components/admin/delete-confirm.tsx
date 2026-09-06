import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export interface DeleteConfirmProps {
  isOpen: boolean
  entityName: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

/** Names what's being deleted — never a generic "tem certeza?". */
export function DeleteConfirm({ isOpen, entityName, onClose, onConfirm }: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirm() {
    setIsDeleting(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm" title="Excluir permanentemente">
      <p className="text-sm text-text-secondary">
        Excluir <strong className="text-text-primary font-semibold">{entityName}</strong>? Isso também remove suas
        fotos e comodidades associadas. Esta ação não pode ser desfeita.
      </p>
      <div className="flex justify-end gap-2 mt-5">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleConfirm}
          isLoading={isDeleting}
          leadingIcon={<Trash2 className="w-4 h-4" aria-hidden="true" />}
        >
          Excluir
        </Button>
      </div>
    </Dialog>
  )
}
