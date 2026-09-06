import type { ContentStatus } from '@/types'
import { Badge } from '@/components/ui/badge'

const LABELS: Record<ContentStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicado',
  archived: 'Arquivado',
}

const VARIANTS: Record<ContentStatus, 'neutral' | 'success' | 'warning'> = {
  draft: 'neutral',
  published: 'success',
  archived: 'warning',
}

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <Badge variant={VARIANTS[status]} size="sm">
      {LABELS[status]}
    </Badge>
  )
}
