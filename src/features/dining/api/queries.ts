import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Dining, DiningWithRelations, Amenity, GalleryItem } from '@/types'

export interface DiningFilters extends Record<string, unknown> {
  category?: string
  restaurantType?: string
  priceRange?: string
  search?: string
  limit?: number
}

const DINING_LIST_COLUMNS = `
  id,
  name,
  slug,
  status,
  restaurant_type,
  address,
  whatsapp,
  instagram,
  opening_hours,
  price_range,
  description,
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

export async function fetchDining(filters: DiningFilters = {}): Promise<Dining[]> {
  try {
    let query = supabase
      .from('dining')
      .select(DINING_LIST_COLUMNS)
      .eq('status', 'published')
      .order('name', { ascending: true })

    if (filters.category) {
      query = query.eq('categories.slug', filters.category)
    }

    if (filters.restaurantType) {
      query = query.eq('restaurant_type', filters.restaurantType)
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

    return (data || []).map((row) => ({
      ...row,
      opening_hours: Array.isArray(row.opening_hours) ? row.opening_hours : [],
    })) as unknown as Dining[]
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchDiningBySlug(slug: string): Promise<DiningWithRelations> {
  try {
    const { data, error } = await supabase
      .from('dining')
      .select(`
        *,
        category:categories (*),
        dining_amenities (
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

    const amenities: Amenity[] = (data.dining_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    const gallery: GalleryItem[] = data.galleries || []

    return {
      ...data,
      opening_hours: Array.isArray(data.opening_hours) ? data.opening_hours : [],
      amenities,
      gallery,
    } as unknown as DiningWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}
