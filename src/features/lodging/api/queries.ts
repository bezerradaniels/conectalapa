import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Lodging, LodgingWithRelations, Amenity, GalleryItem } from '@/types'

export interface LodgingFilters extends Record<string, unknown> {
  category?: string
  lodgingType?: string
  priceRange?: string
  search?: string
  limit?: number
}

const LODGING_LIST_COLUMNS = `
  id,
  name,
  slug,
  status,
  lodging_type,
  address,
  description,
  whatsapp,
  instagram,
  price_range,
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

export async function fetchLodging(filters: LodgingFilters = {}): Promise<Lodging[]> {
  try {
    let query = supabase
      .from('lodging')
      .select(LODGING_LIST_COLUMNS)
      .eq('status', 'published')
      .order('name', { ascending: true })

    if (filters.category) {
      query = query.eq('categories.slug', filters.category)
    }

    if (filters.lodgingType) {
      query = query.eq('lodging_type', filters.lodgingType)
    }

    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange)
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

    return (data || []) as unknown as Lodging[]
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchLodgingBySlug(slug: string): Promise<LodgingWithRelations> {
  try {
    const { data, error } = await supabase
      .from('lodging')
      .select(`
        *,
        category:categories (*),
        lodging_amenities (
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

    const amenities: Amenity[] = (data.lodging_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    const gallery: GalleryItem[] = data.galleries || []

    return {
      ...data,
      amenities,
      gallery,
    } as unknown as LodgingWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}
