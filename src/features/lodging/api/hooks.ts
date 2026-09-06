import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import { updateEntityStatus, bulkUpdateStatus } from '@/lib/admin-crud'
import type { Lodging, LodgingWithRelations, AppError, PaginatedResult, GalleryItem } from '@/types'
import {
  fetchLodging,
  fetchLodgingPaginated,
  fetchLodgingBySlug,
  fetchLodgingFilterMeta,
  fetchLodgingAdminPaginated,
  fetchLodgingAdminById,
  createLodgingAdmin,
  updateLodgingAdmin,
  deleteLodgingAdmin,
  duplicateLodgingAdmin,
  type LodgingFilters,
  type AdminLodgingFilters,
  type LodgingAdminInput,
} from './queries'

export function useLodging(filters: LodgingFilters = {}) {
  return useQuery<(Lodging & { galleries?: GalleryItem[] })[], AppError>({
    queryKey: queryKeys.lodging.list(filters),
    queryFn: () => fetchLodging(filters),
  })
}

export function useLodgingPaginated(filters: LodgingFilters = {}) {
  return useQuery<PaginatedResult<Lodging & { galleries?: GalleryItem[] }>, AppError>({
    queryKey: queryKeys.lodging.list(filters),
    queryFn: () => fetchLodgingPaginated(filters),
  })
}

export function useLodgingDetail(slug: string) {
  return useQuery<LodgingWithRelations, AppError>({
    queryKey: queryKeys.lodging.detail(slug),
    queryFn: () => fetchLodgingBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useLodgingFilterMeta() {
  return useQuery({
    queryKey: ['lodging', 'filter-meta'],
    queryFn: () => fetchLodgingFilterMeta(),
    staleTime: 10 * 60 * 1000,
  })
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const ADMIN_LIST_KEY = ['admin', 'lodging', 'list']

export function useLodgingAdminPaginated(filters: AdminLodgingFilters) {
  return useQuery<PaginatedResult<Lodging>, AppError>({
    queryKey: [...ADMIN_LIST_KEY, filters],
    queryFn: () => fetchLodgingAdminPaginated(filters),
  })
}

export function useLodgingAdminDetail(id: string | undefined) {
  return useQuery<LodgingWithRelations, AppError>({
    queryKey: ['admin', 'lodging', 'detail', id],
    queryFn: () => fetchLodgingAdminById(id as string),
    enabled: Boolean(id),
  })
}

function useInvalidateLodgingAdmin() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_LIST_KEY })
    queryClient.invalidateQueries({ queryKey: ['admin', 'domain-status-counts'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'recently-edited'] })
    queryClient.invalidateQueries({ queryKey: queryKeys.lodging.all })
  }
}

export function useCreateLodgingAdmin() {
  const invalidate = useInvalidateLodgingAdmin()
  return useMutation({ mutationFn: (input: LodgingAdminInput) => createLodgingAdmin(input), onSuccess: invalidate })
}

export function useUpdateLodgingAdmin() {
  const invalidate = useInvalidateLodgingAdmin()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: LodgingAdminInput }) => updateLodgingAdmin(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteLodgingAdmin() {
  const invalidate = useInvalidateLodgingAdmin()
  return useMutation({ mutationFn: (id: string) => deleteLodgingAdmin(id), onSuccess: invalidate })
}

export function useDuplicateLodgingAdmin() {
  const invalidate = useInvalidateLodgingAdmin()
  return useMutation({ mutationFn: (id: string) => duplicateLodgingAdmin(id), onSuccess: invalidate })
}

export function useUpdateLodgingStatusAdmin() {
  const invalidate = useInvalidateLodgingAdmin()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEntityStatus('lodging', id, status),
    onSuccess: invalidate,
  })
}

export function useBulkUpdateLodgingStatusAdmin() {
  const invalidate = useInvalidateLodgingAdmin()
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => bulkUpdateStatus('lodging', ids, status),
    onSuccess: invalidate,
  })
}
