import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Dining, DiningWithRelations, AppError, PaginatedResult, GalleryItem } from '@/types'
import {
  fetchDining,
  fetchDiningPaginated,
  fetchDiningBySlug,
  fetchDiningFilterMeta,
  type DiningFilters,
} from './queries'

export function useDining(filters: DiningFilters = {}) {
  return useQuery<(Dining & { galleries?: GalleryItem[] })[], AppError>({
    queryKey: queryKeys.dining.list(filters),
    queryFn: () => fetchDining(filters),
  })
}

export function useDiningPaginated(filters: DiningFilters = {}) {
  return useQuery<PaginatedResult<Dining & { galleries?: GalleryItem[] }>, AppError>({
    queryKey: queryKeys.dining.list(filters),
    queryFn: () => fetchDiningPaginated(filters),
  })
}

export function useDiningDetail(slug: string) {
  return useQuery<DiningWithRelations, AppError>({
    queryKey: queryKeys.dining.detail(slug),
    queryFn: () => fetchDiningBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useDiningFilterMeta() {
  return useQuery({
    queryKey: ['dining', 'filter-meta'],
    queryFn: () => fetchDiningFilterMeta(),
    staleTime: 10 * 60 * 1000,
  })
}
