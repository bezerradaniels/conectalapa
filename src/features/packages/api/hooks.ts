import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import { updateEntityStatus, bulkUpdateStatus } from '@/lib/admin-crud'
import type { Package, PackageWithRelations, AppError, PaginatedResult } from '@/types'
import {
  fetchPackages,
  fetchPackagesPaginated,
  fetchPackageBySlug,
  fetchPackageFilterMeta,
  fetchPackageAmenities,
  fetchPackagesAdminPaginated,
  fetchPackageAdminById,
  createPackageAdmin,
  updatePackageAdmin,
  deletePackageAdmin,
  duplicatePackageAdmin,
  type PackageFilters,
  type AdminPackageFilters,
  type PackageAdminInput,
} from './queries'

export function usePackages(filters: PackageFilters = {}) {
  return useQuery<Package[], AppError>({
    queryKey: queryKeys.packages.list(filters),
    queryFn: () => fetchPackages(filters),
  })
}

export function usePackagesPaginated(filters: PackageFilters = {}) {
  return useQuery<PaginatedResult<Package>, AppError>({
    queryKey: queryKeys.packages.list(filters),
    queryFn: () => fetchPackagesPaginated(filters),
  })
}

export function usePackage(slug: string) {
  return useQuery<PackageWithRelations, AppError>({
    queryKey: queryKeys.packages.detail(slug),
    queryFn: () => fetchPackageBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function usePackageFilterMeta() {
  return useQuery({
    queryKey: ['packages', 'filter-meta'],
    queryFn: () => fetchPackageFilterMeta(),
    staleTime: 10 * 60 * 1000,
  })
}

export function usePackageAmenities() {
  return useQuery({
    queryKey: ['packages', 'amenities'],
    queryFn: () => fetchPackageAmenities(),
    staleTime: 10 * 60 * 1000,
  })
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const ADMIN_LIST_KEY = ['admin', 'packages', 'list']

export function usePackagesAdminPaginated(filters: AdminPackageFilters) {
  return useQuery<PaginatedResult<Package>, AppError>({
    queryKey: [...ADMIN_LIST_KEY, filters],
    queryFn: () => fetchPackagesAdminPaginated(filters),
  })
}

export function usePackageAdminDetail(id: string | undefined) {
  return useQuery<PackageWithRelations, AppError>({
    queryKey: ['admin', 'packages', 'detail', id],
    queryFn: () => fetchPackageAdminById(id as string),
    enabled: Boolean(id),
  })
}

function useInvalidatePackageAdmin() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_LIST_KEY })
    queryClient.invalidateQueries({ queryKey: ['admin', 'domain-status-counts'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'recently-edited'] })
    queryClient.invalidateQueries({ queryKey: queryKeys.packages.all })
  }
}

export function useCreatePackageAdmin() {
  const invalidate = useInvalidatePackageAdmin()
  return useMutation({ mutationFn: (input: PackageAdminInput) => createPackageAdmin(input), onSuccess: invalidate })
}

export function useUpdatePackageAdmin() {
  const invalidate = useInvalidatePackageAdmin()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PackageAdminInput }) => updatePackageAdmin(id, input),
    onSuccess: invalidate,
  })
}

export function useDeletePackageAdmin() {
  const invalidate = useInvalidatePackageAdmin()
  return useMutation({ mutationFn: (id: string) => deletePackageAdmin(id), onSuccess: invalidate })
}

export function useDuplicatePackageAdmin() {
  const invalidate = useInvalidatePackageAdmin()
  return useMutation({ mutationFn: (id: string) => duplicatePackageAdmin(id), onSuccess: invalidate })
}

export function useUpdatePackageStatusAdmin() {
  const invalidate = useInvalidatePackageAdmin()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEntityStatus('packages', id, status),
    onSuccess: invalidate,
  })
}

export function useBulkUpdatePackageStatusAdmin() {
  const invalidate = useInvalidatePackageAdmin()
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => bulkUpdateStatus('packages', ids, status),
    onSuccess: invalidate,
  })
}
