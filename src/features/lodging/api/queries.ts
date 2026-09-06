import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Lodging, LodgingWithRelations, Amenity, GalleryItem, PaginatedResult, Category } from '@/types'

export type LodgingSortOption = 'name_asc' | 'created_desc'

export interface LodgingFilters extends Record<string, unknown> {
  category?: string
  lodgingType?: string
  priceRange?: string
  neighborhood?: string
  amenity?: string
  search?: string
  sort?: LodgingSortOption
  page?: number
  pageSize?: number
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
  ),
  galleries (
    image_url,
    display_order
  )
`

export async function fetchLodging(filters: LodgingFilters = {}): Promise<(Lodging & { galleries?: GalleryItem[] })[]> {
  const result = await fetchLodgingPaginated({ ...filters, pageSize: filters.limit || 50 })
  return result.data
}

export async function fetchLodgingPaginated(
  filters: LodgingFilters = {}
): Promise<PaginatedResult<Lodging & { galleries?: GalleryItem[] }>> {
  try {
    const page = Math.max(1, Number(filters.page) || 1)
    const pageSize = Math.max(1, Number(filters.pageSize) || 12)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let selectClause = LODGING_LIST_COLUMNS
    if (filters.amenity) {
      selectClause += `, lodging_amenities!inner(amenity:amenities!inner(slug))`
    }
    if (filters.category) {
      selectClause = selectClause.replace('category:categories (', 'category:categories!inner (')
    }

    let query = supabase
      .from('lodging')
      .select(selectClause, { count: 'exact' })
      .eq('status', 'published')

    // Category
    if (filters.category) {
      query = query.eq('category.slug', filters.category)
    }

    // Lodging type
    if (filters.lodgingType) {
      query = query.eq('lodging_type', filters.lodgingType)
    }

    // Price range
    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange)
    }

    // Amenity / features
    if (filters.amenity) {
      query = query.eq('lodging_amenities.amenity.slug', filters.amenity)
    }

    // Neighborhood
    if (filters.neighborhood) {
      query = query.ilike('address', `%${filters.neighborhood}%`)
    }

    // Search
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Sorting
    if (filters.sort === 'created_desc') {
      query = query.order('created_at', { ascending: false })
    } else {
      // Default: name A-Z
      query = query.order('name', { ascending: true })
    }

    // Pagination
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      throw toAppError(error)
    }

    const items = ((data || []) as unknown as Record<string, unknown>[]).map((row) => ({
      ...row,
      galleries: Array.isArray(row.galleries)
        ? [...(row.galleries as GalleryItem[])].sort((a, b) => a.display_order - b.display_order)
        : [],
    })) as unknown as (Lodging & { galleries?: GalleryItem[] })[]

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

export async function fetchLodgingFilterMeta(): Promise<{
  categories: Category[]
  amenities: Amenity[]
  neighborhoods: string[]
  lodgingTypes: { value: string; label: string }[]
}> {
  try {
    const [catRes, amRes] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('domain', 'lodging')
        .order('name', { ascending: true }),
      supabase
        .from('amenities')
        .select('*')
        .or('domain.is.null,domain.eq.lodging')
        .order('name', { ascending: true }),
    ])

    if (catRes.error) throw toAppError(catRes.error)
    if (amRes.error) throw toAppError(amRes.error)

    const neighborhoods = [
      'Centro',
      'Amaralina',
      'Parque Verde',
      'Maravilha',
      'São Gotardo',
    ]

    const lodgingTypes = [
      { value: 'hotel', label: 'Hotel' },
      { value: 'pousada', label: 'Pousada' },
      { value: 'guesthouse', label: 'Hospedaria / Pensão' },
      { value: 'resort', label: 'Resort / Pousada Rural' },
      { value: 'other', label: 'Outras Hospedagens' },
    ]

    return {
      categories: (catRes.data || []) as Category[],
      amenities: (amRes.data || []) as Amenity[],
      neighborhoods,
      lodgingTypes,
    }
  } catch (err) {
    throw toAppError(err)
  }
}
