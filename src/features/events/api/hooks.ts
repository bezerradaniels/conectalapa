import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import type { Event, EventWithRelations, AppError } from '@/types'
import { fetchEvents, fetchEventBySlug, type EventFilters } from './queries'

export function useEvents(filters: EventFilters = {}) {
  return useQuery<Event[], AppError>({
    queryKey: queryKeys.events.list(filters),
    queryFn: () => fetchEvents(filters),
  })
}

export function useEvent(slug: string) {
  return useQuery<EventWithRelations, AppError>({
    queryKey: queryKeys.events.detail(slug),
    queryFn: () => fetchEventBySlug(slug),
    enabled: Boolean(slug),
  })
}
