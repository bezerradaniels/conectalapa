import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Package, PackageWithRelations, AppError } from '@/types'
import { fetchPackages, fetchPackageBySlug, type PackageFilters } from './queries'

export function usePackages(filters: PackageFilters = {}) {
  return useQuery<Package[], AppError>({
    queryKey: queryKeys.packages.list(filters),
    queryFn: () => fetchPackages(filters),
  })
}

export function usePackage(slug: string) {
  return useQuery<PackageWithRelations, AppError>({
    queryKey: queryKeys.packages.detail(slug),
    queryFn: () => fetchPackageBySlug(slug),
    enabled: Boolean(slug),
  })
}
