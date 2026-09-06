import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import { updateEntityStatus, bulkUpdateStatus } from '@/lib/admin-crud'
import type { Dining, DiningWithRelations, AppError, PaginatedResult, GalleryItem } from '@/types'
import {
  fetchDining,
  fetchDiningPaginated,
  fetchDiningBySlug,
  fetchDiningFilterMeta,
  fetchDiningAdminPaginated,
  fetchDiningAdminById,
  createDiningAdmin,
  updateDiningAdmin,
  deleteDiningAdmin,
  duplicateDiningAdmin,
  type DiningFilters,
  type AdminDiningFilters,
  type DiningAdminInput,
} from './queries'

export function useDining(filters: DiningFilters = {}) {
  return useQuery<(Dining & { galleries?: GalleryItem[] })[], AppError>({
    queryKey: queryKeys.dining.list(filters),
    queryFn: () => fetchDining(filters),
  })
}

export function useDiningPaginated(filters: DiningFilters = {}) {
  return useQuery<PaginatedResult<Dining & { galleries?: GalleryItem[] }>, AppError>({
    queryKey: queryKeys.dining.list(filters),
    queryFn: () => fetchDiningPaginated(filters),
  })
}

export function useDiningDetail(slug: string) {
  return useQuery<DiningWithRelations, AppError>({
    queryKey: queryKeys.dining.detail(slug),
    queryFn: () => fetchDiningBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useDiningFilterMeta() {
  return useQuery({
    queryKey: ['dining', 'filter-meta'],
    queryFn: () => fetchDiningFilterMeta(),
    staleTime: 10 * 60 * 1000,
  })
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const ADMIN_LIST_KEY = ['admin', 'dining', 'list']

export function useDiningAdminPaginated(filters: AdminDiningFilters) {
  return useQuery<PaginatedResult<Dining>, AppError>({
    queryKey: [...ADMIN_LIST_KEY, filters],
    queryFn: () => fetchDiningAdminPaginated(filters),
  })
}

export function useDiningAdminDetail(id: string | undefined) {
  return useQuery<DiningWithRelations, AppError>({
    queryKey: ['admin', 'dining', 'detail', id],
    queryFn: () => fetchDiningAdminById(id as string),
    enabled: Boolean(id),
  })
}

function useInvalidateDiningAdmin() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_LIST_KEY })
    queryClient.invalidateQueries({ queryKey: ['admin', 'domain-status-counts'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'recently-edited'] })
    queryClient.invalidateQueries({ queryKey: queryKeys.dining.all })
  }
}

export function useCreateDiningAdmin() {
  const invalidate = useInvalidateDiningAdmin()
  return useMutation({ mutationFn: (input: DiningAdminInput) => createDiningAdmin(input), onSuccess: invalidate })
}

export function useUpdateDiningAdmin() {
  const invalidate = useInvalidateDiningAdmin()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: DiningAdminInput }) => updateDiningAdmin(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteDiningAdmin() {
  const invalidate = useInvalidateDiningAdmin()
  return useMutation({ mutationFn: (id: string) => deleteDiningAdmin(id), onSuccess: invalidate })
}

export function useDuplicateDiningAdmin() {
  const invalidate = useInvalidateDiningAdmin()
  return useMutation({ mutationFn: (id: string) => duplicateDiningAdmin(id), onSuccess: invalidate })
}

export function useUpdateDiningStatusAdmin() {
  const invalidate = useInvalidateDiningAdmin()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEntityStatus('dining', id, status),
    onSuccess: invalidate,
  })
}

export function useBulkUpdateDiningStatusAdmin() {
  const invalidate = useInvalidateDiningAdmin()
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => bulkUpdateStatus('dining', ids, status),
    onSuccess: invalidate,
  })
}
