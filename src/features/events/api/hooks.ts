import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Event, EventWithRelations, AppError, PaginatedResult } from '@/types'
import {
  fetchEvents,
  fetchEventsPaginated,
  fetchEventBySlug,
  fetchEventFilterMeta,
  type EventFilters,
} from './queries'

export function useEvents(filters: EventFilters = {}) {
  return useQuery<Event[], AppError>({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => fetchEvents(filters),
  })
}

export function useEventsPaginated(filters: EventFilters = {}) {
  return useQuery<PaginatedResult<Event>, AppError>({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => fetchEventsPaginated(filters),
  })
}

export function useEvent(slug: string) {
  return useQuery<EventWithRelations, AppError>({
    queryKey: queryKeys.events.detail(slug),
    queryFn: () => fetchEventBySlug(slug),
    enabled: Boolean(slug),
  })
}

export function useEventFilterMeta() {
  return useQuery({
    queryKey: ['events', 'filter-meta'],
    queryFn: () => fetchEventFilterMeta(),
    staleTime: 10 * 60 * 1000,
  })
}
