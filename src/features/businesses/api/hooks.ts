import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import { updateEntityStatus, bulkUpdateStatus } from '@/lib/admin-crud'
import type { Business, BusinessWithRelations, AppError, PaginatedResult } from '@/types'
import {
  fetchBusinesses,
  fetchBusinessesPaginated,
  fetchBusinessBySlug,
  fetchBusinessFilterMeta,
  fetchBusinessesAdminPaginated,
  fetchBusinessAdminById,
  createBusinessAdmin,
  updateBusinessAdmin,
  deleteBusinessAdmin,
  duplicateBusinessAdmin,
  type BusinessFilters,
  type AdminBusinessFilters,
  type BusinessAdminInput,
} from './queries'

export function useBusinesses(filters: BusinessFilters = {}) {
  return useQuery<Business[], AppError>({
    queryKey: queryKeys.businesses.list(filters),
    queryFn: () => fetchBusinesses(filters),
  })
}

export function useBusinessesPaginated(filters: BusinessFilters = {}) {
  return useQuery<PaginatedResult<Business>, AppError>({
    queryKey: queryKeys.businesses.list(filters),
    queryFn: () => fetchBusinessesPaginated(filters),
  })
}

export function useBusiness(slug: string) {
  return useQuery<BusinessWithRelations, AppError>({
    queryKey: queryKeys.businesses.detail(slug),
    queryFn: () => fetchBusinessBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useBusinessFilterMeta() {
  return useQuery({
    queryKey: ['businesses', 'filter-meta'],
    queryFn: () => fetchBusinessFilterMeta(),
    staleTime: 10 * 60 * 1000,
  })
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const ADMIN_LIST_KEY = ['admin', 'businesses', 'list']

export function useBusinessesAdminPaginated(filters: AdminBusinessFilters) {
  return useQuery<PaginatedResult<Business>, AppError>({
    queryKey: [...ADMIN_LIST_KEY, filters],
    queryFn: () => fetchBusinessesAdminPaginated(filters),
  })
}

export function useBusinessAdminDetail(id: string | undefined) {
  return useQuery<BusinessWithRelations, AppError>({
    queryKey: ['admin', 'businesses', 'detail', id],
    queryFn: () => fetchBusinessAdminById(id as string),
    enabled: Boolean(id),
  })
}

function useInvalidateBusinessAdmin() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_LIST_KEY })
    queryClient.invalidateQueries({ queryKey: ['admin', 'domain-status-counts'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'recently-edited'] })
    queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all })
  }
}

export function useCreateBusinessAdmin() {
  const invalidate = useInvalidateBusinessAdmin()
  return useMutation({
    mutationFn: (input: BusinessAdminInput) => createBusinessAdmin(input),
    onSuccess: invalidate,
  })
}

export function useUpdateBusinessAdmin() {
  const invalidate = useInvalidateBusinessAdmin()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BusinessAdminInput }) => updateBusinessAdmin(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteBusinessAdmin() {
  const invalidate = useInvalidateBusinessAdmin()
  return useMutation({
    mutationFn: (id: string) => deleteBusinessAdmin(id),
    onSuccess: invalidate,
  })
}

export function useDuplicateBusinessAdmin() {
  const invalidate = useInvalidateBusinessAdmin()
  return useMutation({
    mutationFn: (id: string) => duplicateBusinessAdmin(id),
    onSuccess: invalidate,
  })
}

export function useUpdateBusinessStatusAdmin() {
  const invalidate = useInvalidateBusinessAdmin()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEntityStatus('businesses', id, status),
    onSuccess: invalidate,
  })
}

export function useBulkUpdateBusinessStatusAdmin() {
  const invalidate = useInvalidateBusinessAdmin()
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => bulkUpdateStatus('businesses', ids, status),
    onSuccess: invalidate,
  })
}
