import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Event, EventWithRelations, Amenity, GalleryItem, PaginatedResult, Category, ContentStatus, AdditionalLink } from '@/types'
import {
  createEntityWithRelations,
  updateEntityWithRelations,
  deleteEntityWithCleanup,
  duplicateEntity,
  type GalleryInput,
} from '@/lib/admin-crud'

export type EventSortOption = 'soonest' | 'created_desc'
export type EventDatePreset = 'hoje' | 'fim_de_semana' | 'este_mes' | 'todos'
export type EventPriceType = 'all' | 'free' | 'paid'

export interface EventFilters extends Record<string, unknown> {
  category?: string
  datePreset?: EventDatePreset
  priceType?: EventPriceType
  maxPrice?: number
  neighborhood?: string
  amenity?: string
  includePast?: boolean
  search?: string
  sort?: EventSortOption
  page?: number
  pageSize?: number
  limit?: number
  upcomingOnly?: boolean
  excludeEnded?: boolean
}

const EVENT_LIST_COLUMNS = `
  id,
  name,
  slug,
  status,
  whatsapp,
  instagram,
  promotional_image_url,
  image_aspect_ratio,
  ticket_price,
  ticket_price_description,
  start_datetime,
  end_datetime,
  address,
  venue_name,
  description,
  restrictions,
  links,
  created_at,
  updated_at,
  category_id,
  category:categories (
    id,
    name,
    slug,
    domain,
    description,
    icon,
    created_at,
    updated_at
  )
`

export async function fetchEvents(filters: EventFilters = {}): Promise<Event[]> {
  const result = await fetchEventsPaginated({ ...filters, pageSize: filters.limit || 50 })
  return result.data
}

export async function fetchEventsPaginated(filters: EventFilters = {}): Promise<PaginatedResult<Event>> {
  try {
    const page = Math.max(1, Number(filters.page) || 1)
    const pageSize = Math.max(1, Number(filters.pageSize) || 12)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let selectClause = EVENT_LIST_COLUMNS
    if (filters.amenity) {
      selectClause += `, event_amenities!inner(amenity:amenities!inner(slug))`
    }
    if (filters.category) {
      selectClause = selectClause.replace('category:categories (', 'category:categories!inner (')
    }

    let query = supabase
      .from('events')
      .select(selectClause, { count: 'exact' })
      .eq('status', 'published')

    // Filter by category
    if (filters.category) {
      query = query.eq('category.slug', filters.category)
    }

    // Filter by amenity
    if (filters.amenity) {
      query = query.eq('event_amenities.amenity.slug', filters.amenity)
    }

    // Filter by neighborhood or venue
    if (filters.neighborhood) {
      query = query.or(`address.ilike.%${filters.neighborhood}%,venue_name.ilike.%${filters.neighborhood}%`)
    }

    // Past / Upcoming handling: Default to hiding finished events unless includePast is true
    const nowIso = new Date().toISOString()
    if (!filters.includePast && !filters.search) {
      query = query.or(`end_datetime.gte.${nowIso},and(end_datetime.is.null,start_datetime.gte.${nowIso})`)
    }

    // Date presets
    if (filters.datePreset && filters.datePreset !== 'todos') {
      const today = new Date()
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString()
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999).toISOString()

      if (filters.datePreset === 'hoje') {
        query = query.gte('start_datetime', startOfToday).lte('start_datetime', endOfToday)
      } else if (filters.datePreset === 'fim_de_semana') {
        // Calculate upcoming weekend (Friday evening to Sunday night)
        const dayOfWeek = today.getDay()
        const daysUntilFriday = (5 - dayOfWeek + 7) % 7
        const friday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + daysUntilFriday, 18, 0, 0)
        const sunday = new Date(friday.getFullYear(), friday.getMonth(), friday.getDate() + 2, 23, 59, 59, 999)
        query = query.gte('start_datetime', friday.toISOString()).lte('start_datetime', sunday.toISOString())
      } else if (filters.datePreset === 'este_mes') {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999).toISOString()
        query = query.gte('start_datetime', startOfMonth).lte('start_datetime', endOfMonth)
      }
    }

    // Free vs Paid filter
    if (filters.priceType === 'free') {
      query = query.or('ticket_price.is.null,ticket_price.eq.0,ticket_price_description.ilike.%gratuit%,ticket_price_description.ilike.%franca%')
    } else if (filters.priceType === 'paid') {
      query = query.gt('ticket_price', 0)
    }

    // Max price ceiling
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      query = query.lte('ticket_price', filters.maxPrice)
    }

    // Search
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,venue_name.ilike.%${filters.search}%`)
    }

    // Sorting
    if (filters.sort === 'created_desc') {
      query = query.order('created_at', { ascending: false })
    } else {
      // Default: soonest first
      query = query.order('start_datetime', { ascending: true })
    }

    // Pagination
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      throw toAppError(error)
    }

    const items = ((data || []) as unknown as Record<string, unknown>[]).map((row) => ({
      ...row,
      links: Array.isArray(row.links) ? row.links : [],
    })) as unknown as Event[]

    const totalCount = count ?? items.length
    const totalPages = Math.ceil(totalCount / pageSize) || 1

    return {
      data: items,
      count: totalCount,
      page,
      pageSize,
      totalPages,
    }
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchEventBySlug(slug: string): Promise<EventWithRelations> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        category:categories (*),
        event_amenities (
          amenity:amenities (*)
        ),
        galleries (*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      throw toAppError(error)
    }

    const amenities: Amenity[] = (data.event_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    const gallery: GalleryItem[] = data.galleries || []

    return {
      ...data,
      links: Array.isArray(data.links) ? data.links : [],
      amenities,
      gallery,
    } as unknown as EventWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchEventFilterMeta(): Promise<{
  categories: Category[]
  amenities: Amenity[]
  neighborhoods: string[]
}> {
  try {
    const [catRes, amRes] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('domain', 'event')
        .order('name', { ascending: true }),
      supabase
        .from('amenities')
        .select('*')
        .or('domain.is.null,domain.eq.event')
        .order('name', { ascending: true }),
    ])

    if (catRes.error) throw toAppError(catRes.error)
    if (amRes.error) throw toAppError(amRes.error)

    const neighborhoods = [
      'Centro',
      'Santuário',
      'Maravilha',
      'Amaralina',
      'Parque Verde',
    ]

    return {
      categories: (catRes.data || []) as Category[],
      amenities: (amRes.data || []) as Amenity[],
      neighborhoods,
    }
  } catch (err) {
    throw toAppError(err)
  }
}

// ---------------------------------------------------------------------------
// Admin (authenticated, all statuses)
// ---------------------------------------------------------------------------

export type AdminSortField = 'name' | 'start_datetime' | 'created_at' | 'updated_at'

export interface AdminEventFilters {
  search?: string
  status?: ContentStatus | 'all'
  sortField?: AdminSortField
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export async function fetchEventsAdminPaginated(filters: AdminEventFilters = {}): Promise<PaginatedResult<Event>> {
  try {
    const page = Math.max(1, filters.page || 1)
    const pageSize = Math.max(1, filters.pageSize || 20)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('events').select(EVENT_LIST_COLUMNS, { count: 'exact' })
    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status)
    if (filters.search) query = query.ilike('name', `%${filters.search}%`)
    query = query.order(filters.sortField || 'name', { ascending: filters.sortDir !== 'desc' })
    query = query.range(from, to)

    const { data, count, error } = await query
    if (error) throw toAppError(error)

    const items = ((data || []) as unknown as Record<string, unknown>[]).map((row) => ({
      ...row,
      links: Array.isArray(row.links) ? row.links : [],
    })) as unknown as Event[]

    const totalCount = count ?? items.length
    return { data: items, count: totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) || 1 }
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchEventAdminById(id: string): Promise<EventWithRelations> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`*, category:categories (*), event_amenities (amenity:amenities (*)), galleries (*)`)
      .eq('id', id)
      .single()

    if (error) throw toAppError(error)

    const amenities: Amenity[] = (data.event_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    return {
      ...data,
      links: Array.isArray(data.links) ? data.links : [],
      amenities,
      gallery: (data.galleries || []) as GalleryItem[],
    } as unknown as EventWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}

export interface EventAdminInput {
  id?: string
  name: string
  slug: string
  category_id: string | null
  promotional_image_url: string | null
  image_aspect_ratio: string | null
  start_datetime: string
  end_datetime: string | null
  venue_name: string | null
  address: string | null
  whatsapp: string | null
  instagram: string | null
  description: string | null
  ticket_price: number | null
  ticket_price_description: string | null
  restrictions: string[]
  links: AdditionalLink[]
  status: ContentStatus
  amenityIds: string[]
  gallery: GalleryInput[]
}

function toEventScalar(input: EventAdminInput) {
  return {
    ...(input.id ? { id: input.id } : {}),
    name: input.name,
    slug: input.slug,
    category_id: input.category_id,
    promotional_image_url: input.promotional_image_url,
    image_aspect_ratio: input.image_aspect_ratio,
    start_datetime: input.start_datetime,
    end_datetime: input.end_datetime,
    venue_name: input.venue_name,
    address: input.address,
    whatsapp: input.whatsapp,
    instagram: input.instagram,
    description: input.description,
    ticket_price: input.ticket_price,
    ticket_price_description: input.ticket_price_description,
    restrictions: input.restrictions,
    links: input.links,
    status: input.status,
  }
}

export async function createEventAdmin(input: EventAdminInput) {
  return createEntityWithRelations('events', toEventScalar(input), {
    amenities: { joinTable: 'event_amenities', entityColumn: 'event_id', amenityIds: input.amenityIds },
    gallery: { entityColumn: 'event_id', images: input.gallery },
  })
}

export async function updateEventAdmin(id: string, input: EventAdminInput) {
  return updateEntityWithRelations('events', id, toEventScalar(input), {
    amenities: { joinTable: 'event_amenities', entityColumn: 'event_id', amenityIds: input.amenityIds },
    gallery: { entityColumn: 'event_id', images: input.gallery },
  })
}

export async function deleteEventAdmin(id: string): Promise<void> {
  const { data } = await supabase.from('events').select('promotional_image_url, galleries(image_url)').eq('id', id).single()
  const imageUrls = [
    (data as { promotional_image_url?: string | null } | null)?.promotional_image_url,
    ...(((data as { galleries?: { image_url: string }[] } | null)?.galleries || []).map((g) => g.image_url)),
  ]
  await deleteEntityWithCleanup('events', id, imageUrls)
}

export async function duplicateEventAdmin(id: string) {
  return duplicateEntity('events', id, 'name', { promotional_image_url: null }, { joinTable: 'event_amenities', entityColumn: 'event_id' })
}
