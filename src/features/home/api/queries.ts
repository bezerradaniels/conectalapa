import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import { fetchEvents } from '@/features/events/api/queries'
import { fetchPackages } from '@/features/packages/api/queries'
import type { Event, Package } from '@/types'

export interface DomainCounts {
  businesses: number
  events: number
  packages: number
  lodging: number
  dining: number
}

export type RecentDomain = 'businesses' | 'lodging' | 'dining'

export interface RecentEntry {
  id: string
  name: string
  slug: string
  domain: RecentDomain
  domainLabel: string
  categoryName?: string | null
  address?: string | null
  imageUrl?: string | null
  createdAt: string
  detailPath: string
}

export async function fetchDomainCounts(): Promise<DomainCounts> {
  try {
    const [biz, ev, pkg, lodg, din] = await Promise.all([
      supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('packages').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('lodging').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('dining').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    ])

    if (biz.error) throw toAppError(biz.error)
    if (ev.error) throw toAppError(ev.error)
    if (pkg.error) throw toAppError(pkg.error)
    if (lodg.error) throw toAppError(lodg.error)
    if (din.error) throw toAppError(din.error)

    return {
      businesses: biz.count ?? 0,
      events: ev.count ?? 0,
      packages: pkg.count ?? 0,
      lodging: lodg.count ?? 0,
      dining: din.count ?? 0,
    }
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchUpcomingEvents(limit = 6): Promise<Event[]> {
  return fetchEvents({ excludeEnded: true, limit })
}

export async function fetchUpcomingPackages(limit = 4): Promise<Package[]> {
  return fetchPackages({ upcomingOnly: true, limit })
}

export async function fetchRecentEntries(limit = 6): Promise<RecentEntry[]> {
  try {
    const [bizRes, lodgRes, dinRes] = await Promise.all([
      supabase
        .from('businesses')
        .select(`
          id,
          name,
          slug,
          logo_url,
          address,
          created_at,
          category:categories (name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit),

      supabase
        .from('lodging')
        .select(`
          id,
          name,
          slug,
          address,
          created_at,
          category:categories (name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit),

      supabase
        .from('dining')
        .select(`
          id,
          name,
          slug,
          address,
          created_at,
          category:categories (name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit),
    ])

    if (bizRes.error) throw toAppError(bizRes.error)
    if (lodgRes.error) throw toAppError(lodgRes.error)
    if (dinRes.error) throw toAppError(dinRes.error)

    const bizEntries: RecentEntry[] = (bizRes.data || []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      domain: 'businesses',
      domainLabel: 'Empresa',
      categoryName: (row.category as { name: string } | null)?.name || null,
      address: row.address,
      imageUrl: row.logo_url,
      createdAt: row.created_at,
      detailPath: `/empresas/${row.slug}`,
    }))

    const lodgEntries: RecentEntry[] = (lodgRes.data || []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      domain: 'lodging',
      domainLabel: 'Hospedagem',
      categoryName: (row.category as { name: string } | null)?.name || null,
      address: row.address,
      imageUrl: null,
      createdAt: row.created_at,
      detailPath: `/hospedagem/${row.slug}`,
    }))

    const dinEntries: RecentEntry[] = (dinRes.data || []).map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      domain: 'dining',
      domainLabel: 'Gastronomia',
      categoryName: (row.category as { name: string } | null)?.name || null,
      address: row.address,
      imageUrl: null,
      createdAt: row.created_at,
      detailPath: `/gastronomia/${row.slug}`,
    }))

    const combined = [...bizEntries, ...lodgEntries, ...dinEntries]
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return combined.slice(0, limit)
  } catch (err) {
    throw toAppError(err)
  }
}
