import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Pencil, Copy, Trash2, AlertCircle, RotateCcw } from 'lucide-react'
import type { ContentStatus } from '@/types'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/listing/pagination'
import { DeleteConfirm } from '@/components/admin/delete-confirm'

export interface AdminTableColumn<T> {
  key: string
  label: string
  sortable?: boolean
  render: (row: T) => ReactNode
  className?: string
}

export interface AdminTableRow {
  id: string
  // DB status columns are check-constrained `text`, not a real Postgres
  // enum, so generated row types carry `status: string` — narrowed to
  // ContentStatus at the point of use (StatusQuickSelect, badges).
  status: string
}

export interface AdminTableProps<T extends AdminTableRow> {
  columns: AdminTableColumn<T>[]
  rows: T[]
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void

  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string

  status: ContentStatus | 'all'
  onStatusChange: (status: ContentStatus | 'all') => void

  sortKey: string
  sortDir: 'asc' | 'desc'
  onSort: (key: string) => void

  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void

  createTo: string
  createLabel: string

  getRowLabel: (row: T) => string
  onEdit: (row: T) => void
  onDuplicate: (row: T) => Promise<void>
  onDelete: (row: T) => Promise<void>
  onStatusUpdate: (row: T, status: ContentStatus) => Promise<void>
  onBulkStatusUpdate: (ids: string[], status: ContentStatus) => Promise<void>
}

const STATUS_OPTIONS: { value: ContentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos os status' },
  { value: 'draft', label: 'Rascunho' },
  { value: 'published', label: 'Publicado' },
  { value: 'archived', label: 'Arquivado' },
]

export function AdminTable<T extends AdminTableRow>({
  columns,
  rows,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar…',
  status,
  onStatusChange,
  sortKey,
  sortDir,
  onSort,
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  createTo,
  createLabel,
  getRowLabel,
  onEdit,
  onDuplicate,
  onDelete,
  onStatusUpdate,
  onBulkStatusUpdate,
}: AdminTableProps<T>) {
  const [searchDraft, setSearchDraft] = useState(search)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [pendingDelete, setPendingDelete] = useState<T | null>(null)
  const [bulkStatus, setBulkStatus] = useState<ContentStatus>('published')
  const [isBulkApplying, setIsBulkApplying] = useState(false)
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null)

  // Reset selection during render when the visible page/filter changes,
  // rather than in an effect (React's "adjust state during render" pattern).
  const [selectionKey, setSelectionKey] = useState({ page, status, search, sortKey, sortDir })
  if (
    selectionKey.page !== page ||
    selectionKey.status !== status ||
    selectionKey.search !== search ||
    selectionKey.sortKey !== sortKey ||
    selectionKey.sortDir !== sortDir
  ) {
    setSelectionKey({ page, status, search, sortKey, sortDir })
    setSelectedIds([])
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchDraft !== search) onSearchChange(searchDraft)
    }, 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft])

  const allSelected = rows.length > 0 && selectedIds.length === rows.length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
          <Input
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label="Buscar"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ContentStatus | 'all')}
          options={STATUS_OPTIONS}
          className="sm:w-48"
          aria-label="Filtrar por status"
        />
        <Link to={createTo} className="shrink-0">
          <Button type="button" leadingIcon={<Plus className="w-4 h-4" aria-hidden="true" />} className="w-full">
            {createLabel}
          </Button>
        </Link>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-accent-border bg-accent-subtle px-3 py-2">
          <span className="text-sm font-medium text-accent-text">{selectedIds.length} selecionado(s)</span>
          <Select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value as ContentStatus)}
            options={STATUS_OPTIONS.filter((o) => o.value !== 'all')}
            className="w-40 h-9"
            aria-label="Novo status em lote"
          />
          <Button
            type="button"
            size="sm"
            isLoading={isBulkApplying}
            onClick={async () => {
              setIsBulkApplying(true)
              try {
                await onBulkStatusUpdate(selectedIds, bulkStatus)
                setSelectedIds([])
              } finally {
                setIsBulkApplying(false)
              }
            }}
          >
            Aplicar
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
            Cancelar
          </Button>
        </div>
      )}

      {isError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50/70 p-6 text-center text-red-700 flex flex-col items-center">
          <AlertCircle className="w-6 h-6 text-red-500 mb-2" aria-hidden="true" />
          <p className="text-sm font-medium">{errorMessage || 'Falha ao carregar.'}</p>
          {onRetry && (
            <Button variant="secondary" size="sm" onClick={onRetry} className="mt-3" leadingIcon={<RotateCcw className="w-4 h-4" aria-hidden="true" />}>
              Tentar novamente
            </Button>
          )}
        </div>
      ) : isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Search className="w-5 h-5" aria-hidden="true" />}
          headline="Nenhum resultado"
          explanation={search || status !== 'all' ? 'Ajuste a busca ou o filtro de status.' : 'Nenhuma entrada cadastrada ainda.'}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-hairline bg-bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-hairline text-left">
                <th className="w-10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    aria-label="Selecionar todos"
                    checked={allSelected}
                    onChange={(e) => setSelectedIds(e.target.checked ? rows.map((r) => r.id) : [])}
                    className="w-4 h-4 rounded border-border-hairline text-accent focus:ring-accent"
                  />
                </th>
                {columns.map((col) => (
                  <th key={col.key} className={col.className}>
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(col.key)}
                        className="flex items-center gap-1 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted hover:text-text-primary cursor-pointer"
                      >
                        {col.label}
                        {sortKey === col.key && <span aria-hidden="true">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </button>
                    ) : (
                      <span className="block px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted">{col.label}</span>
                    )}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border-hairline last:border-b-0 hover:bg-bg-subtle/50">
                  <td className="px-3 py-2.5">
                    <input
                      type="checkbox"
                      aria-label={`Selecionar ${getRowLabel(row)}`}
                      checked={selectedIds.includes(row.id)}
                      onChange={(e) =>
                        setSelectedIds((prev) => (e.target.checked ? [...prev, row.id] : prev.filter((id) => id !== row.id)))
                      }
                      className="w-4 h-4 rounded border-border-hairline text-accent focus:ring-accent"
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className={col.className || 'px-3 py-2.5'}>
                      {col.render(row)}
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <StatusQuickSelect status={row.status as ContentStatus} onChange={(s) => onStatusUpdate(row, s)} />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Editar ${getRowLabel(row)}`}
                        leadingIcon={<Pencil className="w-4 h-4" aria-hidden="true" />}
                        onClick={() => onEdit(row)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Duplicar ${getRowLabel(row)}`}
                        isLoading={duplicatingId === row.id}
                        leadingIcon={<Copy className="w-4 h-4" aria-hidden="true" />}
                        onClick={async () => {
                          setDuplicatingId(row.id)
                          try {
                            await onDuplicate(row)
                          } finally {
                            setDuplicatingId(null)
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Excluir ${getRowLabel(row)}`}
                        leadingIcon={<Trash2 className="w-4 h-4 text-danger-solid" aria-hidden="true" />}
                        onClick={() => setPendingDelete(row)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} totalCount={totalCount} pageSize={pageSize} onPageChange={onPageChange} />
      )}

      {pendingDelete && (
        <DeleteConfirm
          isOpen
          entityName={getRowLabel(pendingDelete)}
          onClose={() => setPendingDelete(null)}
          onConfirm={() => onDelete(pendingDelete)}
        />
      )}
    </div>
  )
}

function StatusQuickSelect({ status, onChange }: { status: ContentStatus; onChange: (status: ContentStatus) => void }) {
  return (
    <div className="relative">
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as ContentStatus)}
        aria-label="Alterar status"
        className="appearance-none bg-transparent border-none text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent rounded pr-1"
      >
        <option value="draft">Rascunho</option>
        <option value="published">Publicado</option>
        <option value="archived">Arquivado</option>
      </select>
    </div>
  )
}
