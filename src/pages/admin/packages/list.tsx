import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Palmtree } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useListingParams } from '@/components/listing'
import { AdminTable, StatusBadge, type AdminTableColumn } from '@/components/admin'
import type { Package, ContentStatus } from '@/types'
import { formatCurrency } from '@/lib/format'
import { Head } from '@/components/seo/head'
import {
  usePackagesAdminPaginated,
  useDeletePackageAdmin,
  useDuplicatePackageAdmin,
  useUpdatePackageStatusAdmin,
  useBulkUpdatePackageStatusAdmin,
} from '@/features/packages/api/hooks'

const paramsSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['all', 'draft', 'published', 'archived']).default('all'),
  sortField: z.enum(['destination', 'departure_date', 'created_at', 'updated_at']).default('departure_date'),
  sortDir: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
})

export default function AdminPackageListPage() {
  const navigate = useNavigate()
  const { params, setParam, setParams } = useListingParams({
    schema: paramsSchema,
    defaultValues: { status: 'all', sortField: 'departure_date', sortDir: 'desc', page: 1 },
  })

  const { data, isLoading, isError, error, refetch } = usePackagesAdminPaginated({
    search: params.search,
    status: params.status,
    sortField: params.sortField,
    sortDir: params.sortDir,
    page: params.page,
    pageSize: 20,
  })

  const deleteMutation = useDeletePackageAdmin()
  const duplicateMutation = useDuplicatePackageAdmin()
  const statusMutation = useUpdatePackageStatusAdmin()
  const bulkStatusMutation = useBulkUpdatePackageStatusAdmin()

  const columns: AdminTableColumn<Package>[] = [
    {
      key: 'destination',
      label: 'Destino',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 min-w-0">
          {row.image_url ? (
            <img src={row.image_url} alt="" className="w-8 h-8 rounded-md object-cover border border-border-hairline shrink-0" />
          ) : (
            <span className="w-8 h-8 rounded-md bg-bg-subtle border border-border-hairline flex items-center justify-center shrink-0 text-text-muted">
              <Palmtree className="w-4 h-4" aria-hidden="true" />
            </span>
          )}
          <span className="truncate font-medium text-text-primary">{row.destination}</span>
        </div>
      ),
    },
    {
      key: 'departure_date',
      label: 'Saída',
      sortable: true,
      render: (row) => <span className="text-text-secondary">{format(new Date(`${row.departure_date}T00:00`), "d 'de' MMM yyyy", { locale: ptBR })}</span>,
    },
    { key: 'price', label: 'Preço', render: (row) => <span className="text-text-secondary">{formatCurrency(row.price)}</span> },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status as ContentStatus} /> },
  ]

  return (
    <div>
      <Head title="Pacotes — Admin" />
      <h1 className="text-xl font-bold text-text-primary mb-6">Pacotes</h1>

      <AdminTable
        columns={columns}
        rows={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => refetch()}
        search={params.search || ''}
        onSearchChange={(v) => setParam('search', v || undefined)}
        searchPlaceholder="Buscar por destino…"
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
        createTo="/admin/pacotes/novo"
        createLabel="Novo pacote"
        getRowLabel={(row) => row.destination}
        onEdit={(row) => navigate(`/admin/pacotes/${row.id}`)}
        onDuplicate={(row) => duplicateMutation.mutateAsync(row.id).then(({ id }) => navigate(`/admin/pacotes/${id}`))}
        onDelete={(row) => deleteMutation.mutateAsync(row.id)}
        onStatusUpdate={(row, status) => statusMutation.mutateAsync({ id: row.id, status })}
        onBulkStatusUpdate={(ids, status) => bulkStatusMutation.mutateAsync({ ids, status })}
      />
    </div>
  )
}
