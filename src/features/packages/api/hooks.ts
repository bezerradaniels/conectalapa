import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Package, PackageWithRelations, AppError, PaginatedResult } from '@/types'
import {
  fetchPackages,
  fetchPackagesPaginated,
  fetchPackageBySlug,
  fetchPackageFilterMeta,
  type PackageFilters,
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
