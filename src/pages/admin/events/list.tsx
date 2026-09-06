import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useListingParams } from '@/components/listing'
import { AdminTable, StatusBadge, type AdminTableColumn } from '@/components/admin'
import type { Event, ContentStatus } from '@/types'
import { Head } from '@/components/seo/head'
import {
  useEventsAdminPaginated,
  useDeleteEventAdmin,
  useDuplicateEventAdmin,
  useUpdateEventStatusAdmin,
  useBulkUpdateEventStatusAdmin,
} from '@/features/events/api/hooks'

const paramsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'draft', 'published', 'archived']).default('all'),
  sortField: z.enum(['name', 'start_datetime', 'created_at', 'updated_at']).default('start_datetime'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
})

export default function AdminEventListPage() {
  const navigate = useNavigate()
  const { params, setParam, setParams } = useListingParams({
    schema: paramsSchema,
    defaultValues: { status: 'all', sortField: 'start_datetime', sortDir: 'desc', page: 1 },
  })

  const { data, isLoading, isError, error, refetch } = useEventsAdminPaginated({
    search: params.search,
    status: params.status,
    sortField: params.sortField,
    sortDir: params.sortDir,
    page: params.page,
    pageSize: 20,
  })

  const deleteMutation = useDeleteEventAdmin()
  const duplicateMutation = useDuplicateEventAdmin()
  const statusMutation = useUpdateEventStatusAdmin()
  const bulkStatusMutation = useBulkUpdateEventStatusAdmin()

  const columns: AdminTableColumn<Event>[] = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          {row.promotional_image_url ? (
            <img src={row.promotional_image_url} alt="" className="w-8 h-8 rounded-md object-cover border border-border-hairline shrink-0" />
          ) : (
            <span className="w-8 h-8 rounded-md bg-bg-subtle border border-border-hairline flex items-center justify-center shrink-0 text-text-muted">
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
            </span>
          )}
          <span className="truncate font-medium text-text-primary">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'start_datetime',
      label: 'Data',
      sortable: true,
      render: (row) => <span className="text-text-secondary">{format(new Date(row.start_datetime), "d 'de' MMM yyyy", { locale: ptBR })}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status as ContentStatus} />,
    },
    {
      key: 'updated_at',
      label: 'Atualizado',
      sortable: true,
      render: (row) => <span className="text-text-muted">{format(new Date(row.updated_at), "d 'de' MMM, HH:mm", { locale: ptBR })}</span>,
    },
  ]

  return (
    <div>
      <Head title="Eventos — Admin" />
      <h1 className="text-xl font-bold text-text-primary mb-6">Eventos</h1>

      <AdminTable
        columns={columns}
        rows={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => refetch()}
        search={params.search || ''}
        onSearchChange={(v) => setParam('search', v || undefined)}
        searchPlaceholder="Buscar por nome…"
        status={params.status}
        onStatusChange={(v) => setParam('status', v)}
        sortKey={params.sortField}
        sortDir={params.sortDir}
        onSort={(key) =>
          setParams(
            { sortField: key, sortDir: params.sortField === key && params.sortDir === 'asc' ? 'desc' : 'asc' },
            { resetPage: false }
          )
        }
        page={data?.page || 1}
        totalPages={data?.totalPages || 1}
        totalCount={data?.count || 0}
        pageSize={data?.pageSize || 20}
        onPageChange={(page) => setParams({ page }, { resetPage: false })}
        createTo="/admin/eventos/novo"
        createLabel="Novo evento"
        getRowLabel={(row) => row.name}
        onEdit={(row) => navigate(`/admin/eventos/${row.id}`)}
        onDuplicate={(row) => duplicateMutation.mutateAsync(row.id).then(({ id }) => navigate(`/admin/eventos/${id}`))}
        onDelete={(row) => deleteMutation.mutateAsync(row.id)}
        onStatusUpdate={(row, status) => statusMutation.mutateAsync({ id: row.id, status })}
        onBulkStatusUpdate={(ids, status) => bulkStatusMutation.mutateAsync({ ids, status })}
      />
    </div>
  )
}
