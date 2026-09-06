import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Inbox, MessageCircle, Check, X, Trash2 } from 'lucide-react'
import {
  useSubmissionsAdmin,
  useRejectSubmission,
  useBulkRejectSubmissions,
  useDeleteSubmissionAdmin,
} from '@/features/submissions/api/hooks'
import type { SubmissionPayload, SubmissionStatus } from '@/features/submissions/api/queries'
import type { Submission, ContentDomain } from '@/types'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { useListingParams } from '@/components/listing'
import { Head } from '@/components/seo/head'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'

const DOMAIN_LABELS: Record<ContentDomain, string> = {
  business: 'Empresa',
  event: 'Evento',
  package: 'Pacote',
  lodging: 'Hospedagem',
  dining: 'Gastronomia',
}

const CREATE_ROUTE: Record<ContentDomain, string> = {
  business: '/admin/empresas/novo',
  event: '/admin/eventos/novo',
  package: '/admin/pacotes/novo',
  lodging: '/admin/hospedagem/novo',
  dining: '/admin/gastronomia/novo',
}

const STATUS_LABELS: Record<SubmissionStatus, string> = { pending: 'Pendente', approved: 'Aprovado', rejected: 'Recusado' }
const STATUS_VARIANTS: Record<SubmissionStatus, 'accent' | 'success' | 'neutral'> = {
  pending: 'accent',
  approved: 'success',
  rejected: 'neutral',
}

const paramsSchema = z.object({ status: z.enum(['all', 'pending', 'approved', 'rejected']).default('pending') })
type SubmissionListParams = z.infer<typeof paramsSchema>
const DEFAULT_PARAMS: SubmissionListParams = { status: 'pending' }

export default function AdminSubmissionsListPage() {
  const navigate = useNavigate()
  const { params, setParam } = useListingParams({ schema: paramsSchema, defaultValues: DEFAULT_PARAMS })

  const { data, isLoading } = useSubmissionsAdmin({ status: params.status })
  const rejectMutation = useRejectSubmission()
  const bulkRejectMutation = useBulkRejectSubmissions()
  const deleteMutation = useDeleteSubmissionAdmin()

  const [detail, setDetail] = useState<Submission | null>(null)
  const [rejecting, setRejecting] = useState<Submission | null>(null)
  const [rejectNote, setRejectNote] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const submissions = data || []
  const allSelected = submissions.length > 0 && selectedIds.length === submissions.length

  function handleApprove(submission: Submission) {
    const domain = submission.target_domain as ContentDomain
    navigate(`${CREATE_ROUTE[domain]}?fromSubmission=${submission.id}`)
  }

  async function handleReject() {
    if (!rejecting) return
    await rejectMutation.mutateAsync({ id: rejecting.id, note: rejectNote || undefined })
    setRejecting(null)
    setRejectNote('')
    if (detail?.id === rejecting.id) setDetail(null)
  }

  return (
    <div>
      <Head title="Solicitações — Admin" />
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-bold text-text-primary">Solicitações</h1>
        <Select
          value={params.status}
          onChange={(e) => setParam('status', e.target.value as SubmissionListParams['status'])}
          className="w-48"
          aria-label="Filtrar por status"
          options={[
            { value: 'pending', label: 'Pendentes' },
            { value: 'approved', label: 'Aprovadas' },
            { value: 'rejected', label: 'Recusadas' },
            { value: 'all', label: 'Todos os status' },
          ]}
        />
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-accent-border bg-accent-subtle px-3 py-2 mb-3">
          <span className="text-sm font-medium text-accent-text">{selectedIds.length} selecionada(s)</span>
          <Button
            type="button"
            size="sm"
            variant="danger"
            isLoading={bulkRejectMutation.isPending}
            leadingIcon={<X className="w-3.5 h-3.5" aria-hidden="true" />}
            onClick={async () => {
              await bulkRejectMutation.mutateAsync(selectedIds)
              setSelectedIds([])
            }}
          >
            Recusar selecionadas
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
            Cancelar
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      ) : submissions.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-5 h-5" aria-hidden="true" />}
          headline="Nenhuma solicitação"
          explanation={params.status === 'pending' ? 'Nada pendente no momento.' : 'Nenhum registro para este filtro.'}
        />
      ) : (
        <div className="rounded-xl border border-border-hairline bg-bg-surface divide-y divide-border-hairline">
          <div className="flex items-center gap-3 px-4 py-2 bg-bg-subtle/60">
            <input
              type="checkbox"
              aria-label="Selecionar todas"
              checked={allSelected}
              onChange={(e) => setSelectedIds(e.target.checked ? submissions.map((s) => s.id) : [])}
              className="w-4 h-4 rounded border-border-hairline text-accent focus:ring-accent"
            />
            <span className="text-2xs font-semibold uppercase tracking-wide text-text-muted">
              Mais antigas primeiro
            </span>
          </div>

          {submissions.map((submission) => {
            const payload = submission.payload as unknown as SubmissionPayload
            const domain = submission.target_domain as ContentDomain
            return (
              <div key={submission.id} className="flex items-center gap-3 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label={`Selecionar solicitação de ${submission.contact_name}`}
                  checked={selectedIds.includes(submission.id)}
                  onChange={(e) =>
                    setSelectedIds((prev) => (e.target.checked ? [...prev, submission.id] : prev.filter((id) => id !== submission.id)))
                  }
                  className="w-4 h-4 rounded border-border-hairline text-accent focus:ring-accent shrink-0"
                />

                <button type="button" onClick={() => setDetail(submission)} className="flex-1 min-w-0 text-left cursor-pointer">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xs font-semibold uppercase tracking-wide text-text-muted">{DOMAIN_LABELS[domain]}</span>
                    <Badge variant={STATUS_VARIANTS[submission.status as SubmissionStatus]} size="sm">
                      {STATUS_LABELS[submission.status as SubmissionStatus]}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-text-primary truncate">{payload?.name || submission.contact_name}</p>
                  <p className="text-xs text-text-muted truncate">
                    {submission.contact_name} · {submission.contact_phone}
                  </p>
                </button>

                <span className="text-2xs text-text-muted shrink-0">
                  {format(new Date(submission.created_at), "d MMM, HH:mm", { locale: ptBR })}
                </span>

                {submission.status === 'pending' && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-label="Aprovar"
                      leadingIcon={<Check className="w-4 h-4 text-success-text" aria-hidden="true" />}
                      onClick={() => handleApprove(submission)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-label="Recusar"
                      leadingIcon={<X className="w-4 h-4 text-danger-solid" aria-hidden="true" />}
                      onClick={() => setRejecting(submission)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {detail && (
        <SubmissionDetailDialog
          submission={detail}
          onClose={() => setDetail(null)}
          onApprove={() => handleApprove(detail)}
          onReject={() => setRejecting(detail)}
          onDelete={async () => {
            await deleteMutation.mutateAsync(detail.id)
            setDetail(null)
          }}
        />
      )}

      {rejecting && (
        <Dialog isOpen onClose={() => setRejecting(null)} size="sm" title="Recusar solicitação">
          <p className="text-sm text-text-secondary mb-3">
            Recusar a solicitação de <strong className="text-text-primary">{rejecting.contact_name}</strong>? Uma nota é opcional.
          </p>
          <Textarea
            label="Nota (opcional)"
            rows={3}
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            placeholder="Ex: dados incompletos, spam, duplicado…"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setRejecting(null)}>
              Cancelar
            </Button>
            <Button type="button" variant="danger" isLoading={rejectMutation.isPending} onClick={handleReject}>
              Recusar
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  )
}

function SubmissionDetailDialog({
  submission,
  onClose,
  onApprove,
  onReject,
  onDelete,
}: {
  submission: Submission
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  onDelete: () => Promise<void>
}) {
  const payload = submission.payload as unknown as SubmissionPayload
  const domain = submission.target_domain as ContentDomain
  const whatsappUrl = buildWhatsAppUrl(submission.contact_phone, `Olá ${submission.contact_name}! Vi sua solicitação no ConectaLapa.`)
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <Dialog isOpen onClose={onClose} size="md" title={payload?.name || submission.contact_name}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="neutral" size="sm">{DOMAIN_LABELS[domain]}</Badge>
          <Badge variant={STATUS_VARIANTS[submission.status as SubmissionStatus]} size="sm">
            {STATUS_LABELS[submission.status as SubmissionStatus]}
          </Badge>
          <span className="text-xs text-text-muted">
            {format(new Date(submission.created_at), "d 'de' MMM 'de' yyyy, HH:mm", { locale: ptBR })}
          </span>
        </div>

        <dl className="space-y-2 text-sm">
          <Row label="Contato">{submission.contact_name}</Row>
          <Row label="WhatsApp">
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-accent-text font-medium hover:underline">
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                {submission.contact_phone}
              </a>
            ) : (
              submission.contact_phone
            )}
          </Row>
          {submission.contact_email && <Row label="E-mail">{submission.contact_email}</Row>}
          <Row label="Descrição">
            <span className="whitespace-pre-line">{payload?.description}</span>
          </Row>
          {payload?.address && <Row label="Endereço">{payload.address}</Row>}
          {payload?.instagram && <Row label="Instagram">{payload.instagram}</Row>}
          {payload?.website && <Row label="Site">{payload.website}</Row>}
          {payload?.event_date && <Row label="Data do evento">{payload.event_date}</Row>}
          {payload?.destination && <Row label="Saída">{payload.destination}</Row>}
          {submission.review_notes && <Row label="Nota da revisão">{submission.review_notes}</Row>}
        </dl>

        <div className="flex flex-wrap justify-between gap-2 pt-3 border-t border-border-hairline">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isLoading={isDeleting}
            leadingIcon={<Trash2 className="w-4 h-4 text-danger-solid" aria-hidden="true" />}
            onClick={async () => {
              setIsDeleting(true)
              try {
                await onDelete()
              } finally {
                setIsDeleting(false)
              }
            }}
          >
            Excluir
          </Button>

          {submission.status === 'pending' && (
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={onReject}>
                Recusar
              </Button>
              <Button type="button" size="sm" onClick={onApprove}>
                Aprovar e cadastrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-text-muted">{label}</dt>
      <dd className="flex-1 text-text-primary">{children}</dd>
    </div>
  )
}
