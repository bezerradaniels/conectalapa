import type { Blocker } from 'react-router-dom'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function UnsavedChangesDialog({ blocker }: { blocker: Blocker }) {
  if (blocker.state !== 'blocked') return null

  return (
    <Dialog isOpen onClose={() => blocker.reset?.()} size="sm" title="Sair sem salvar?">
      <p className="text-sm text-text-secondary">
        Você tem alterações não salvas nesta página. Se sair agora, elas serão perdidas.
      </p>
      <div className="flex justify-end gap-2 mt-5">
        <Button type="button" variant="secondary" onClick={() => blocker.reset?.()}>
          Continuar editando
        </Button>
        <Button type="button" variant="danger" onClick={() => blocker.proceed?.()}>
          Sair sem salvar
        </Button>
      </div>
    </Dialog>
  )
}
