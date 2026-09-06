import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Business, BusinessWithRelations, Amenity, GalleryItem } from '@/types'

export interface BusinessFilters extends Record<string, unknown> {
  category?: string
  search?: string
  limit?: number
}

// Columns selected for list views (avoids sending heavy galleries over the wire)
const BUSINESS_LIST_COLUMNS = `
  id,
  name,
  slug,
  status,
  logo_url,
  address,
  whatsapp,
  instagram,
  description,
  services,
  opening_hours,
  additional_links,
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

export async function fetchBusinesses(filters: BusinessFilters = {}): Promise<Business[]> {
  try {
    let query = supabase
      .from('businesses')
      .select(BUSINESS_LIST_COLUMNS)
      .eq('status', 'published')
      .order('name', { ascending: true })

    if (filters.category) {
      query = query.eq('categories.slug', filters.category)
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
      opening_hours: Array.isArray(row.opening_hours) ? row.opening_hours : [],
      additional_links: Array.isArray(row.additional_links) ? row.additional_links : [],
    })) as unknown as Business[]
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchBusinessBySlug(slug: string): Promise<BusinessWithRelations> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        category:categories (*),
        business_amenities (
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

    const amenities: Amenity[] = (data.business_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    const gallery: GalleryItem[] = data.galleries || []

    return {
      ...data,
      opening_hours: Array.isArray(data.opening_hours) ? data.opening_hours : [],
      additional_links: Array.isArray(data.additional_links) ? data.additional_links : [],
      amenities,
      gallery,
    } as unknown as BusinessWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}
