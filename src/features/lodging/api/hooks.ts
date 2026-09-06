import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Lodging, LodgingWithRelations, AppError } from '@/types'
import { fetchLodging, fetchLodgingBySlug, type LodgingFilters } from './queries'

export function useLodging(filters: LodgingFilters = {}) {
  return useQuery<Lodging[], AppError>({
    queryKey: queryKeys.lodging.list(filters),
    queryFn: () => fetchLodging(filters),
  })
}

export function useLodgingDetail(slug: string) {
  return useQuery<LodgingWithRelations, AppError>({
    queryKey: queryKeys.lodging.detail(slug),
    queryFn: () => fetchLodgingBySlug(slug),
    enabled: Boolean(slug),
  })
}
