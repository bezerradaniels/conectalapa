import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Store, CalendarDays, Palmtree, Bed, UtensilsCrossed, Inbox, Plus, ArrowRight } from 'lucide-react'
import { useDomainStatusCounts, usePendingSubmissionsCount, useRecentlyEditedEntries } from '@/features/admin/api/hooks'
import { Head } from '@/components/seo/head'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/admin'
import type { AdminDomainTable } from '@/features/admin/api/queries'
import type { ContentStatus } from '@/types'

const DOMAIN_META: Record<AdminDomainTable, { label: string; icon: typeof Store; listTo: string; createTo: string }> = {
  businesses: { label: 'Empresas', icon: Store, listTo: '/admin/empresas', createTo: '/admin/empresas/novo' },
  events: { label: 'Eventos', icon: CalendarDays, listTo: '/admin/eventos', createTo: '/admin/eventos/novo' },
  packages: { label: 'Pacotes', icon: Palmtree, listTo: '/admin/pacotes', createTo: '/admin/pacotes/novo' },
  lodging: { label: 'Hospedagem', icon: Bed, listTo: '/admin/hospedagem', createTo: '/admin/hospedagem/novo' },
  dining: { label: 'Gastronomia', icon: UtensilsCrossed, listTo: '/admin/gastronomia', createTo: '/admin/gastronomia/novo' },
}

export default function AdminDashboardPage() {
  const { data: counts, isLoading: isLoadingCounts } = useDomainStatusCounts()
  const { data: pendingCount } = usePendingSubmissionsCount()
  const { data: recent, isLoading: isLoadingRecent } = useRecentlyEditedEntries(8)

  return (
    <div className="space-y-8">
      <Head title="Dashboard — Admin" />
      <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>

      {pendingCount ? (
        <Link
          to="/admin/solicitacoes"
          className="flex items-center gap-3 rounded-xl border border-accent-border bg-accent-subtle px-4 py-3 hover:bg-accent-subtle/70 transition-colors"
        >
          <Inbox className="w-5 h-5 text-accent-text shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium text-accent-text flex-1">
            {pendingCount} {pendingCount === 1 ? 'solicitação pendente' : 'solicitações pendentes'} para revisar
          </span>
          <ArrowRight className="w-4 h-4 text-accent-text shrink-0" aria-hidden="true" />
        </Link>
      ) : null}

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted mb-3">Conteúdo por domínio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {isLoadingCounts
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
            : (counts || []).map((c) => {
                const meta = DOMAIN_META[c.table]
                const Icon = meta.icon
                return (
                  <div key={c.table} className="rounded-xl border border-border-hairline bg-bg-surface p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-lg bg-accent-subtle border border-border-hairline text-accent-text flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5" aria-hidden="true" />
                      </span>
                      <Link to={meta.createTo} aria-label={`Criar ${meta.label}`} className="text-text-muted hover:text-accent-text">
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      </Link>
                    </div>
                    <div>
                      <Link to={meta.listTo} className="text-base font-bold text-text-primary hover:text-accent-text">
                        {meta.label}
                      </Link>
                      <p className="text-2xl font-bold text-text-primary mt-1">{c.total}</p>
                    </div>
                    <div className="flex items-center gap-2 text-2xs text-text-muted">
                      <span>{c.published} publicado{c.published === 1 ? '' : 's'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{c.draft} rascunho{c.draft === 1 ? '' : 's'}</span>
                      {c.archived > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{c.archived} arquivado{c.archived === 1 ? '' : 's'}</span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-text-muted mb-3">Editado recentemente</h2>
        <div className="rounded-xl border border-border-hairline bg-bg-surface divide-y divide-border-hairline">
          {isLoadingRecent ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : recent && recent.length > 0 ? (
            recent.map((entry) => (
              <Link
                key={`${entry.table}-${entry.id}`}
                to={entry.editPath}
                className="flex items-center gap-3 px-4 py-3 hover:bg-bg-subtle transition-colors"
              >
                <span className="text-2xs font-semibold uppercase tracking-wide text-text-muted whitespace-nowrap shrink-0 w-28">{DOMAIN_META[entry.table].label}</span>
                <span className="flex-1 min-w-0 truncate text-sm font-medium text-text-primary">{entry.name}</span>
                <StatusBadge status={entry.status as ContentStatus} />
                <span className="text-2xs text-text-muted w-28 text-right shrink-0">
                  {format(new Date(entry.updated_at), "d MMM, HH:mm", { locale: ptBR })}
                </span>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-text-muted">Nenhuma edição registrada ainda.</p>
          )}
        </div>
      </section>
    </div>
  )
}
