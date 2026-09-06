import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Dining, DiningWithRelations, Amenity, GalleryItem, PaginatedResult, Category, ContentStatus, OpeningHourInterval } from '@/types'
import { getOpenStatus } from '@/lib/format'
import {
  createEntityWithRelations,
  updateEntityWithRelations,
  deleteEntityWithCleanup,
  duplicateEntity,
  type GalleryInput,
} from '@/lib/admin-crud'

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

// ---------------------------------------------------------------------------
// Admin (authenticated, all statuses)
// ---------------------------------------------------------------------------

export type AdminSortField = 'name' | 'created_at' | 'updated_at'

export interface AdminDiningFilters {
  search?: string
  status?: ContentStatus | 'all'
  sortField?: AdminSortField
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export async function fetchDiningAdminPaginated(filters: AdminDiningFilters = {}): Promise<PaginatedResult<Dining>> {
  try {
    const page = Math.max(1, filters.page || 1)
    const pageSize = Math.max(1, filters.pageSize || 20)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('dining').select(DINING_LIST_COLUMNS, { count: 'exact' })
    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status)
    if (filters.search) query = query.ilike('name', `%${filters.search}%`)
    query = query.order(filters.sortField || 'name', { ascending: filters.sortDir !== 'desc' })
    query = query.range(from, to)

    const { data, count, error } = await query
    if (error) throw toAppError(error)

    const items = ((data || []) as unknown as Record<string, unknown>[]).map((row) => ({
      ...row,
      opening_hours: Array.isArray(row.opening_hours) ? row.opening_hours : [],
    })) as unknown as Dining[]

    const totalCount = count ?? items.length
    return { data: items, count: totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) || 1 }
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchDiningAdminById(id: string): Promise<DiningWithRelations> {
  try {
    const { data, error } = await supabase
      .from('dining')
      .select(`*, category:categories (*), dining_amenities (amenity:amenities (*)), galleries (*)`)
      .eq('id', id)
      .single()

    if (error) throw toAppError(error)

    const amenities: Amenity[] = (data.dining_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    return {
      ...data,
      opening_hours: Array.isArray(data.opening_hours) ? data.opening_hours : [],
      amenities,
      gallery: (data.galleries || []) as GalleryItem[],
    } as unknown as DiningWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}

export interface DiningAdminInput {
  id?: string
  name: string
  slug: string
  category_id: string | null
  restaurant_type: string
  address: string | null
  whatsapp: string | null
  instagram: string | null
  opening_hours: OpeningHourInterval[]
  price_range: string | null
  description: string | null
  status: ContentStatus
  amenityIds: string[]
  gallery: GalleryInput[]
}

function toDiningScalar(input: DiningAdminInput) {
  return {
    ...(input.id ? { id: input.id } : {}),
    name: input.name,
    slug: input.slug,
    category_id: input.category_id,
    restaurant_type: input.restaurant_type,
    address: input.address,
    whatsapp: input.whatsapp,
    instagram: input.instagram,
    opening_hours: input.opening_hours,
    price_range: input.price_range,
    description: input.description,
    status: input.status,
  }
}

export async function createDiningAdmin(input: DiningAdminInput) {
  return createEntityWithRelations('dining', toDiningScalar(input), {
    amenities: { joinTable: 'dining_amenities', entityColumn: 'dining_id', amenityIds: input.amenityIds },
    gallery: { entityColumn: 'dining_id', images: input.gallery },
  })
}

export async function updateDiningAdmin(id: string, input: DiningAdminInput) {
  return updateEntityWithRelations('dining', id, toDiningScalar(input), {
    amenities: { joinTable: 'dining_amenities', entityColumn: 'dining_id', amenityIds: input.amenityIds },
    gallery: { entityColumn: 'dining_id', images: input.gallery },
  })
}

export async function deleteDiningAdmin(id: string): Promise<void> {
  const { data } = await supabase.from('dining').select('galleries(image_url)').eq('id', id).single()
  const imageUrls = ((data as { galleries?: { image_url: string }[] } | null)?.galleries || []).map((g) => g.image_url)
  await deleteEntityWithCleanup('dining', id, imageUrls)
}

export async function duplicateDiningAdmin(id: string) {
  return duplicateEntity('dining', id, 'name', {}, { joinTable: 'dining_amenities', entityColumn: 'dining_id' })
}
