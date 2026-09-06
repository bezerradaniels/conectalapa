import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Dining, DiningWithRelations, Amenity, GalleryItem, PaginatedResult, Category } from '@/types'
import { getOpenStatus } from '@/lib/format'

export type DiningSortOption = 'name_asc' | 'created_desc'

export interface DiningFilters extends Record<string, unknown> {
  category?: string
  restaurantType?: string
  priceRange?: string
  neighborhood?: string
  amenity?: string
  openNow?: boolean
  search?: string
  sort?: DiningSortOption
  page?: number
  pageSize?: number
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
  ),
  galleries (
    image_url,
    display_order
  )
`

export async function fetchDining(filters: DiningFilters = {}): Promise<(Dining & { galleries?: GalleryItem[] })[]> {
  const result = await fetchDiningPaginated({ ...filters, pageSize: filters.limit || 50 })
  return result.data
}

export async function fetchDiningPaginated(
  filters: DiningFilters = {}
): Promise<PaginatedResult<Dining & { galleries?: GalleryItem[] }>> {
  try {
    const page = Math.max(1, Number(filters.page) || 1)
    const pageSize = Math.max(1, Number(filters.pageSize) || 12)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let selectClause = DINING_LIST_COLUMNS
    if (filters.amenity) {
      selectClause += `, dining_amenities!inner(amenity:amenities!inner(slug))`
    }
    if (filters.category) {
      selectClause = selectClause.replace('category:categories (', 'category:categories!inner (')
    }

    let query = supabase
      .from('dining')
      .select(selectClause, { count: 'exact' })
      .eq('status', 'published')

    // Category
    if (filters.category) {
      query = query.eq('category.slug', filters.category)
    }

    // Restaurant type
    if (filters.restaurantType) {
      query = query.eq('restaurant_type', filters.restaurantType)
    }

    // Price range
    if (filters.priceRange) {
      query = query.eq('price_range', filters.priceRange)
    }

    // Amenity / features
    if (filters.amenity) {
      query = query.eq('dining_amenities.amenity.slug', filters.amenity)
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

    let items = ((data || []) as unknown as Record<string, unknown>[]).map((row) => ({
      ...row,
      opening_hours: Array.isArray(row.opening_hours) ? row.opening_hours : [],
      galleries: Array.isArray(row.galleries)
        ? [...(row.galleries as GalleryItem[])].sort((a, b) => a.display_order - b.display_order)
        : [],
    })) as unknown as (Dining & { galleries?: GalleryItem[] })[]

    // Open now filter
    if (filters.openNow) {
      items = items.filter((d) => {
        const st = getOpenStatus(d.opening_hours)
        return st?.isOpen ?? false
      })
    }

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

export async function fetchDiningFilterMeta(): Promise<{
  categories: Category[]
  amenities: Amenity[]
  neighborhoods: string[]
  restaurantTypes: { value: string; label: string }[]
}> {
  try {
    const [catRes, amRes] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('domain', 'dining')
        .order('name', { ascending: true }),
      supabase
        .from('amenities')
        .select('*')
        .or('domain.is.null,domain.eq.dining')
        .order('name', { ascending: true }),
    ])

    if (catRes.error) throw toAppError(catRes.error)
    if (amRes.error) throw toAppError(amRes.error)

    const neighborhoods = [
      'Centro',
      'Maravilha',
      'Orla do Rio',
      'Amaralina',
      'Parque Verde',
    ]

    const restaurantTypes = [
      { value: 'churrascaria', label: 'Churrascaria' },
      { value: 'peixaria', label: 'Peixaria / Frutos do Rio' },
      { value: 'pizzeria', label: 'Pizzaria' },
      { value: 'lanchonete', label: 'Lanchonete' },
      { value: 'cafeteria', label: 'Café & Doceria' },
      { value: 'bar', label: 'Bar & Petiscaria' },
      { value: 'restaurante', label: 'Restaurante Típico' },
    ]

    return {
      categories: (catRes.data || []) as Category[],
      amenities: (amRes.data || []) as Amenity[],
      neighborhoods,
      restaurantTypes,
    }
  } catch (err) {
    throw toAppError(err)
  }
}
