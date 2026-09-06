import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Dining, DiningWithRelations, AppError } from '@/types'
import { fetchDining, fetchDiningBySlug, type DiningFilters } from './queries'

export function useDining(filters: DiningFilters = {}) {
  return useQuery<Dining[], AppError>({
    queryKey: queryKeys.dining.list(filters),
    queryFn: () => fetchDining(filters),
  })
}

export function useDiningDetail(slug: string) {
  return useQuery<DiningWithRelations, AppError>({
    queryKey: queryKeys.dining.detail(slug),
    queryFn: () => fetchDiningBySlug(slug),
    enabled: Boolean(slug),
  })
}
