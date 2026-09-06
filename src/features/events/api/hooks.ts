import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import { updateEntityStatus, bulkUpdateStatus } from '@/lib/admin-crud'
import type { Event, EventWithRelations, AppError, PaginatedResult } from '@/types'
import {
  fetchEvents,
  fetchEventsPaginated,
  fetchEventBySlug,
  fetchEventFilterMeta,
  fetchEventsAdminPaginated,
  fetchEventAdminById,
  createEventAdmin,
  updateEventAdmin,
  deleteEventAdmin,
  duplicateEventAdmin,
  type EventFilters,
  type AdminEventFilters,
  type EventAdminInput,
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

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

const ADMIN_LIST_KEY = ['admin', 'events', 'list']

export function useEventsAdminPaginated(filters: AdminEventFilters) {
  return useQuery<PaginatedResult<Event>, AppError>({
    queryKey: [...ADMIN_LIST_KEY, filters],
    queryFn: () => fetchEventsAdminPaginated(filters),
  })
}

export function useEventAdminDetail(id: string | undefined) {
  return useQuery<EventWithRelations, AppError>({
    queryKey: ['admin', 'events', 'detail', id],
    queryFn: () => fetchEventAdminById(id as string),
    enabled: Boolean(id),
  })
}

function useInvalidateEventAdmin() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_LIST_KEY })
    queryClient.invalidateQueries({ queryKey: ['admin', 'domain-status-counts'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'recently-edited'] })
    queryClient.invalidateQueries({ queryKey: queryKeys.events.all })
  }
}

export function useCreateEventAdmin() {
  const invalidate = useInvalidateEventAdmin()
  return useMutation({ mutationFn: (input: EventAdminInput) => createEventAdmin(input), onSuccess: invalidate })
}

export function useUpdateEventAdmin() {
  const invalidate = useInvalidateEventAdmin()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: EventAdminInput }) => updateEventAdmin(id, input),
    onSuccess: invalidate,
  })
}

export function useDeleteEventAdmin() {
  const invalidate = useInvalidateEventAdmin()
  return useMutation({ mutationFn: (id: string) => deleteEventAdmin(id), onSuccess: invalidate })
}

export function useDuplicateEventAdmin() {
  const invalidate = useInvalidateEventAdmin()
  return useMutation({ mutationFn: (id: string) => duplicateEventAdmin(id), onSuccess: invalidate })
}

export function useUpdateEventStatusAdmin() {
  const invalidate = useInvalidateEventAdmin()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateEntityStatus('events', id, status),
    onSuccess: invalidate,
  })
}

export function useBulkUpdateEventStatusAdmin() {
  const invalidate = useInvalidateEventAdmin()
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) => bulkUpdateStatus('events', ids, status),
    onSuccess: invalidate,
  })
}
