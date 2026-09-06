import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Lodging, LodgingWithRelations, Amenity, GalleryItem, PaginatedResult, Category, ContentStatus } from '@/types'
import {
  createEntityWithRelations,
  updateEntityWithRelations,
  deleteEntityWithCleanup,
  duplicateEntity,
  type GalleryInput,
} from '@/lib/admin-crud'

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

// ---------------------------------------------------------------------------
// Admin (authenticated, all statuses)
// ---------------------------------------------------------------------------

export type AdminSortField = 'name' | 'created_at' | 'updated_at'

export interface AdminLodgingFilters {
  search?: string
  status?: ContentStatus | 'all'
  sortField?: AdminSortField
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export async function fetchLodgingAdminPaginated(filters: AdminLodgingFilters = {}): Promise<PaginatedResult<Lodging>> {
  try {
    const page = Math.max(1, filters.page || 1)
    const pageSize = Math.max(1, filters.pageSize || 20)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('lodging').select(LODGING_LIST_COLUMNS, { count: 'exact' })
    if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status)
    if (filters.search) query = query.ilike('name', `%${filters.search}%`)
    query = query.order(filters.sortField || 'name', { ascending: filters.sortDir !== 'desc' })
    query = query.range(from, to)

    const { data, count, error } = await query
    if (error) throw toAppError(error)

    const items = (data || []) as unknown as Lodging[]
    const totalCount = count ?? items.length
    return { data: items, count: totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) || 1 }
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchLodgingAdminById(id: string): Promise<LodgingWithRelations> {
  try {
    const { data, error } = await supabase
      .from('lodging')
      .select(`*, category:categories (*), lodging_amenities (amenity:amenities (*)), galleries (*)`)
      .eq('id', id)
      .single()

    if (error) throw toAppError(error)

    const amenities: Amenity[] = (data.lodging_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    return { ...data, amenities, gallery: (data.galleries || []) as GalleryItem[] } as unknown as LodgingWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}

export interface LodgingAdminInput {
  id?: string
  name: string
  slug: string
  category_id: string | null
  lodging_type: string
  address: string | null
  whatsapp: string | null
  instagram: string | null
  description: string | null
  price_range: string | null
  status: ContentStatus
  amenityIds: string[]
  gallery: GalleryInput[]
}

function toLodgingScalar(input: LodgingAdminInput) {
  return {
    ...(input.id ? { id: input.id } : {}),
    name: input.name,
    slug: input.slug,
    category_id: input.category_id,
    lodging_type: input.lodging_type,
    address: input.address,
    whatsapp: input.whatsapp,
    instagram: input.instagram,
    description: input.description,
    price_range: input.price_range,
    status: input.status,
  }
}

export async function createLodgingAdmin(input: LodgingAdminInput) {
  return createEntityWithRelations('lodging', toLodgingScalar(input), {
    amenities: { joinTable: 'lodging_amenities', entityColumn: 'lodging_id', amenityIds: input.amenityIds },
    gallery: { entityColumn: 'lodging_id', images: input.gallery },
  })
}

export async function updateLodgingAdmin(id: string, input: LodgingAdminInput) {
  return updateEntityWithRelations('lodging', id, toLodgingScalar(input), {
    amenities: { joinTable: 'lodging_amenities', entityColumn: 'lodging_id', amenityIds: input.amenityIds },
    gallery: { entityColumn: 'lodging_id', images: input.gallery },
  })
}

export async function deleteLodgingAdmin(id: string): Promise<void> {
  const { data } = await supabase.from('lodging').select('galleries(image_url)').eq('id', id).single()
  const imageUrls = ((data as { galleries?: { image_url: string }[] } | null)?.galleries || []).map((g) => g.image_url)
  await deleteEntityWithCleanup('lodging', id, imageUrls)
}

export async function duplicateLodgingAdmin(id: string) {
  return duplicateEntity('lodging', id, 'name', {}, { joinTable: 'lodging_amenities', entityColumn: 'lodging_id' })
}
