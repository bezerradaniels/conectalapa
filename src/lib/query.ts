import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Filter shapes are owned by each feature and land here once Phase 3/5
// introduce features/{domain}/types.ts. Kept generic for now so this
// factory doesn't import folders that don't exist yet.
type Filters = Record<string, unknown>

export const queryKeys = {
  businesses: {
    all: ['businesses'] as const,
    list: (filters: Filters) => ['businesses', 'list', filters] as const,
    detail: (slug: string) => ['businesses', 'detail', slug] as const,
  },
  events: {
    all: ['events'] as const,
    list: (filters: Filters) => ['events', 'list', filters] as const,
    detail: (slug: string) => ['events', 'detail', slug] as const,
  },
  packages: {
    all: ['packages'] as const,
    list: (filters: Filters) => ['packages', 'list', filters] as const,
    detail: (slug: string) => ['packages', 'detail', slug] as const,
  },
  lodging: {
    all: ['lodging'] as const,
    list: (filters: Filters) => ['lodging', 'list', filters] as const,
    detail: (slug: string) => ['lodging', 'detail', slug] as const,
  },
  dining: {
    all: ['dining'] as const,
    list: (filters: Filters) => ['dining', 'list', filters] as const,
    detail: (slug: string) => ['dining', 'detail', slug] as const,
  },
} as const
