import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Lodging, LodgingWithRelations, AppError, PaginatedResult, GalleryItem } from '@/types'
import {
  fetchLodging,
  fetchLodgingPaginated,
  fetchLodgingBySlug,
  fetchLodgingFilterMeta,
  type LodgingFilters,
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
