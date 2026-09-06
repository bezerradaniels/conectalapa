import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Business, BusinessWithRelations, AppError, PaginatedResult } from '@/types'
import {
  fetchBusinesses,
  fetchBusinessesPaginated,
  fetchBusinessBySlug,
  fetchBusinessFilterMeta,
  type BusinessFilters,
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
