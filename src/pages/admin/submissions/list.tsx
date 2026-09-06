import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Inbox } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Submission } from '@/types'
import { Head } from '@/components/seo/head'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'

const DOMAIN_LABELS: Record<string, string> = {
  business: 'Empresa',
  event: 'Evento',
  package: 'Pacote',
  lodging: 'Hospedagem',
  dining: 'Gastronomia',
}

async function fetchSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw toAppError(error)
  return (data || []) as Submission[]
}

/**
 * Read-only view for now — the full moderation queue (approve/reject,
 * detail view, approve-to-entry conversion) is Phase 8. This exists so
 * the dashboard badge and sidebar link land somewhere real rather than a
 * dead link, and gives the admin visibility into what's waiting.
 */
export default function AdminSubmissionsListPage() {
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'submissions'], queryFn: fetchSubmissions })

  const pending = (data || []).filter((s) => s.status === 'pending')
  const others = (data || []).filter((s) => s.status !== 'pending')

  return (
    <div>
      <Head title="Solicitações — Admin" />
      <h1 className="text-xl font-bold text-text-primary mb-2">Solicitações</h1>
      <p className="text-sm text-text-muted mb-6">
        A fila completa de moderação (aprovar, recusar, converter em cadastro) chega na Fase 8. Por enquanto, esta é
        a lista para acompanhamento.
      </p>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div className="rounded-xl border border-border-hairline bg-bg-surface divide-y divide-border-hairline">
              {pending.map((s) => (
                <SubmissionRow key={s.id} submission={s} />
              ))}
            </div>
          )}
          {others.length > 0 && (
            <div className="rounded-xl border border-border-hairline bg-bg-surface divide-y divide-border-hairline opacity-70">
              {others.map((s) => (
                <SubmissionRow key={s.id} submission={s} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmptyState icon={<Inbox className="w-5 h-5" aria-hidden="true" />} headline="Nenhuma solicitação" explanation="Quando alguém pedir um cadastro pelo site, ela aparece aqui." />
      )}
    </div>
  )
}

function SubmissionRow({ submission }: { submission: Submission }) {
  const payload = submission.payload as Record<string, unknown>
  const name = typeof payload.name === 'string' ? payload.name : submission.contact_name

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-2xs font-semibold uppercase tracking-wide text-text-muted w-20 shrink-0">
        {DOMAIN_LABELS[submission.target_domain] || submission.target_domain}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{name}</p>
        <p className="text-2xs text-text-muted truncate">{submission.contact_name} · {submission.contact_phone}</p>
      </div>
      <Badge variant={submission.status === 'pending' ? 'accent' : submission.status === 'approved' ? 'success' : 'neutral'} size="sm">
        {submission.status === 'pending' ? 'Pendente' : submission.status === 'approved' ? 'Aprovado' : 'Recusado'}
      </Badge>
      <span className="text-2xs text-text-muted w-24 text-right shrink-0">
        {format(new Date(submission.created_at), "d MMM, HH:mm", { locale: ptBR })}
      </span>
    </div>
  )
}
