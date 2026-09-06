import { useQuery } from '@tanstack/react-query'
import {
  fetchDomainStatusCounts,
  fetchPendingSubmissionsCount,
  fetchRecentlyEditedEntries,
} from './queries'

export function useDomainStatusCounts() {
  return useQuery({
    queryKey: ['admin', 'domain-status-counts'],
    queryFn: fetchDomainStatusCounts,
    staleTime: 30 * 1000,
  })
}

export function usePendingSubmissionsCount() {
  return useQuery({
    queryKey: ['admin', 'pending-submissions-count'],
    queryFn: fetchPendingSubmissionsCount,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useRecentlyEditedEntries(limit = 8) {
  return useQuery({
    queryKey: ['admin', 'recently-edited', limit],
    queryFn: () => fetchRecentlyEditedEntries(limit),
    staleTime: 15 * 1000,
  })
}
