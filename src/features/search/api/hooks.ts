import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { AppError } from '@/types'
import { searchCrossDomain, type GroupedSearchResults, type SearchDomain } from './queries'

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delayMs)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delayMs])

  return debouncedValue
}

export function useCrossDomainSearch(
  query: string,
  domain?: SearchDomain,
  limit = 24
) {
  return useQuery<GroupedSearchResults, AppError>({
    queryKey: ['search', 'cross-domain', query, domain, limit],
    queryFn: ({ signal }) => searchCrossDomain(query, domain, limit, signal),
    enabled: Boolean(query && query.trim().length >= 2),
    staleTime: 60 * 1000,
  })
}
