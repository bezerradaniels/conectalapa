import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Business, BusinessWithRelations, AppError } from '@/types'
import { fetchBusinesses, fetchBusinessBySlug, type BusinessFilters } from './queries'

export function useBusinesses(filters: BusinessFilters = {}) {
  return useQuery<Business[], AppError>({
    queryKey: queryKeys.businesses.list(filters),
    queryFn: () => fetchBusinesses(filters),
  })
}

export function useBusiness(slug: string) {
  return useQuery<BusinessWithRelations, AppError>({
    queryKey: queryKeys.businesses.detail(slug),
    queryFn: () => fetchBusinessBySlug(slug),
    enabled: Boolean(slug),
  })
}
