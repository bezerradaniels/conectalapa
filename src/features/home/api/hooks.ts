import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query'
import {
  fetchDomainCounts,
  fetchUpcomingEvents,
  fetchUpcomingPackages,
  fetchRecentEntries,
  type DomainCounts,
  type RecentEntry,
} from './queries'
import type { Event, Package } from '@/types'

export function useDomainCounts() {
  return useQuery<DomainCounts, Error>({
    queryKey: queryKeys.home.counts,
    queryFn: fetchDomainCounts,
    staleTime: 5 * 60 * 1000,
  })
}

export function useUpcomingEvents(limit = 6) {
  return useQuery<Event[], Error>({
    queryKey: queryKeys.home.upcomingEvents(limit),
    queryFn: () => fetchUpcomingEvents(limit),
    staleTime: 2 * 60 * 1000,
  })
}

export function useUpcomingPackages(limit = 4) {
  return useQuery<Package[], Error>({
    queryKey: queryKeys.home.upcomingPackages(limit),
    queryFn: () => fetchUpcomingPackages(limit),
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecentEntries(limit = 6) {
  return useQuery<RecentEntry[], Error>({
    queryKey: queryKeys.home.recentEntries(limit),
    queryFn: () => fetchRecentEntries(limit),
    staleTime: 2 * 60 * 1000,
  })
}
