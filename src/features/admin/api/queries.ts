import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { ContentStatus } from '@/types'

export const ADMIN_DOMAIN_TABLES = ['businesses', 'events', 'packages', 'lodging', 'dining'] as const
export type AdminDomainTable = (typeof ADMIN_DOMAIN_TABLES)[number]

export interface DomainStatusCounts {
  table: AdminDomainTable
  draft: number
  published: number
  archived: number
  total: number
}

export async function fetchDomainStatusCounts(): Promise<DomainStatusCounts[]> {
  try {
    const results = await Promise.all(
      ADMIN_DOMAIN_TABLES.map(async (table) => {
        const [draft, published, archived] = await Promise.all(
          (['draft', 'published', 'archived'] as ContentStatus[]).map((status) =>
            supabase.from(table).select('id', { count: 'exact', head: true }).eq('status', status)
          )
        )
        const draftCount = draft.count ?? 0
        const publishedCount = published.count ?? 0
        const archivedCount = archived.count ?? 0
        return {
          table,
          draft: draftCount,
          published: publishedCount,
          archived: archivedCount,
          total: draftCount + publishedCount + archivedCount,
        }
      })
    )
    return results
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchPendingSubmissionsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('submissions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  if (error) throw toAppError(error)
  return count ?? 0
}

export interface RecentEntry {
  id: string
  slug: string
  name: string
  status: ContentStatus
  updated_at: string
  table: AdminDomainTable
  editPath: string
}

const NAME_COLUMN: Record<AdminDomainTable, string> = {
  businesses: 'name',
  events: 'name',
  packages: 'destination',
  lodging: 'name',
  dining: 'name',
}

const EDIT_BASE_PATH: Record<AdminDomainTable, string> = {
  businesses: '/admin/empresas',
  events: '/admin/eventos',
  packages: '/admin/pacotes',
  lodging: '/admin/hospedagem',
  dining: '/admin/gastronomia',
}

export async function fetchRecentlyEditedEntries(limit = 8): Promise<RecentEntry[]> {
  try {
    const perTable = await Promise.all(
      ADMIN_DOMAIN_TABLES.map(async (table) => {
        const nameColumn = NAME_COLUMN[table]
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(limit)

        if (error) throw error

        return ((data || []) as unknown as Record<string, string>[]).map(
          (row): RecentEntry => ({
            id: row.id,
            slug: row.slug,
            name: row[nameColumn],
            status: row.status as ContentStatus,
            updated_at: row.updated_at,
            table,
            editPath: `${EDIT_BASE_PATH[table]}/${row.id}`,
          })
        )
      })
    )

    return perTable
      .flat()
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit)
  } catch (err) {
    throw toAppError(err)
  }
}
