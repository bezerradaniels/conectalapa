import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Event, EventWithRelations, Amenity, GalleryItem } from '@/types'

export interface EventFilters extends Record<string, unknown> {
  category?: string
  search?: string
  upcomingOnly?: boolean
  limit?: number
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
  try {
    let query = supabase
      .from('events')
      .select(EVENT_LIST_COLUMNS)
      .eq('status', 'published')
      .order('start_datetime', { ascending: true })

    if (filters.category) {
      query = query.eq('categories.slug', filters.category)
    }

    if (filters.upcomingOnly) {
      query = query.gte('start_datetime', new Date().toISOString())
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      throw toAppError(error)
    }

    return (data || []).map((row) => ({
      ...row,
      links: Array.isArray(row.links) ? row.links : [],
    })) as unknown as Event[]
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
