import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'

export type SearchDomain = 'business' | 'event' | 'package' | 'lodging' | 'dining'

export interface SearchResultItem {
  domain: SearchDomain
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  category_name: string | null
  subtitle: string | null
  detail_path: string
  rank: number
}

export interface GroupedSearchResults {
  all: SearchResultItem[]
  businesses: SearchResultItem[]
  events: SearchResultItem[]
  packages: SearchResultItem[]
  lodging: SearchResultItem[]
  dining: SearchResultItem[]
  totalCount: number
}

export async function searchCrossDomain(
  query: string,
  domain?: SearchDomain,
  limit = 20,
  signal?: AbortSignal
): Promise<GroupedSearchResults> {
  const trimmed = query.trim()
  if (!trimmed) {
    return {
      all: [],
      businesses: [],
      events: [],
      packages: [],
      lodging: [],
      dining: [],
      totalCount: 0,
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rpcCall = (supabase.rpc as any)('search_cross_domain', {
      p_query: trimmed,
      p_domain: domain || null,
      p_limit: limit,
    })

    if (signal) {
      rpcCall = rpcCall.abortSignal(signal)
    }

    const { data, error } = await rpcCall

    if (error) {
      throw toAppError(error)
    }

    const all = ((data || []) as unknown) as SearchResultItem[]
    const businesses = all.filter((item) => item.domain === 'business')
    const events = all.filter((item) => item.domain === 'event')
    const packages = all.filter((item) => item.domain === 'package')
    const lodging = all.filter((item) => item.domain === 'lodging')
    const dining = all.filter((item) => item.domain === 'dining')

    return {
      all,
      businesses,
      events,
      packages,
      lodging,
      dining,
      totalCount: all.length,
    }
  } catch (err) {
    throw toAppError(err)
  }
}
