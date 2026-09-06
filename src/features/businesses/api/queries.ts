import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Business, BusinessWithRelations, Amenity, GalleryItem, PaginatedResult, Category, ContentStatus, OpeningHourInterval, AdditionalLink } from '@/types'
import { getOpenStatus } from '@/lib/format'
import {
  createEntityWithRelations,
  updateEntityWithRelations,
  deleteEntityWithCleanup,
  duplicateEntity,
  type GalleryInput,
} from '@/lib/admin-crud'

export type BusinessSortOption = 'name_asc' | 'created_desc'

export interface BusinessFilters extends Record<string, unknown> {
  category?: string
  neighborhood?: string
  amenity?: string
  openNow?: boolean
  search?: string
  sort?: BusinessSortOption
  page?: number
  pageSize?: number
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
  const result = await fetchBusinessesPaginated({ ...filters, pageSize: filters.limit || 50 })
  return result.data
}

export async function fetchBusinessesPaginated(filters: BusinessFilters = {}): Promise<PaginatedResult<Business>> {
  try {
    const page = Math.max(1, Number(filters.page) || 1)
    const pageSize = Math.max(1, Number(filters.pageSize) || 12)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let selectClause = BUSINESS_LIST_COLUMNS
    if (filters.amenity) {
      selectClause += `, business_amenities!inner(amenity:amenities!inner(slug))`
    }
    if (filters.category) {
      selectClause = selectClause.replace('category:categories (', 'category:categories!inner (')
    }

    let query = supabase
      .from('businesses')
      .select(selectClause, { count: 'exact' })
      .eq('status', 'published')

    // Category filter
    if (filters.category) {
      query = query.eq('category.slug', filters.category)
    }

    // Amenity relational filter
    if (filters.amenity) {
      query = query.eq('business_amenities.amenity.slug', filters.amenity)
    }

    // Neighborhood filter
    if (filters.neighborhood) {
      query = query.ilike('address', `%${filters.neighborhood}%`)
    }

    // Search query
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

    // Pagination range
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      throw toAppError(error)
    }

    let items = ((data || []) as unknown as Record<string, unknown>[]).map((row) => ({
      ...row,
      opening_hours: Array.isArray(row.opening_hours) ? row.opening_hours : [],
      additional_links: Array.isArray(row.additional_links) ? row.additional_links : [],
    })) as unknown as Business[]

    // Client-side post-filter for openNow if requested (since opening_hours is a jsonb interval list)
    if (filters.openNow) {
      items = items.filter((biz) => {
        const status = getOpenStatus(biz.opening_hours)
        return status?.isOpen ?? false
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

export async function fetchBusinessFilterMeta(): Promise<{
  categories: Category[]
  amenities: Amenity[]
  neighborhoods: string[]
}> {
  try {
    const [catRes, amRes] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('domain', 'business')
        .order('name', { ascending: true }),
      supabase
        .from('amenities')
        .select('*')
        .or('domain.is.null,domain.eq.business')
        .order('name', { ascending: true }),
    ])

    if (catRes.error) throw toAppError(catRes.error)
    if (amRes.error) throw toAppError(amRes.error)

    const neighborhoods = [
      'Centro',
      'São Gotardo',
      'Amaralina',
      'Parque Verde',
      'Maravilha',
      'João Paulo II',
      'Santa Catarina',
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

export type AdminSortField = 'name' | 'created_at' | 'updated_at'

export interface AdminBusinessFilters {
  search?: string
  status?: ContentStatus | 'all'
  sortField?: AdminSortField
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export async function fetchBusinessesAdminPaginated(filters: AdminBusinessFilters = {}): Promise<PaginatedResult<Business>> {
  try {
    const page = Math.max(1, filters.page || 1)
    const pageSize = Math.max(1, filters.pageSize || 20)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase.from('businesses').select(BUSINESS_LIST_COLUMNS, { count: 'exact' })

    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }
    query = query.order(filters.sortField || 'name', { ascending: filters.sortDir !== 'desc' })
    query = query.range(from, to)

    const { data, count, error } = await query
    if (error) throw toAppError(error)

    const items = ((data || []) as unknown as Record<string, unknown>[]).map((row) => ({
      ...row,
      opening_hours: Array.isArray(row.opening_hours) ? row.opening_hours : [],
      additional_links: Array.isArray(row.additional_links) ? row.additional_links : [],
    })) as unknown as Business[]

    const totalCount = count ?? items.length
    return { data: items, count: totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) || 1 }
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchBusinessAdminById(id: string): Promise<BusinessWithRelations> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select(`*, category:categories (*), business_amenities (amenity:amenities (*)), galleries (*)`)
      .eq('id', id)
      .single()

    if (error) throw toAppError(error)

    const amenities: Amenity[] = (data.business_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    return {
      ...data,
      opening_hours: Array.isArray(data.opening_hours) ? data.opening_hours : [],
      additional_links: Array.isArray(data.additional_links) ? data.additional_links : [],
      amenities,
      gallery: (data.galleries || []) as GalleryItem[],
    } as unknown as BusinessWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}

export interface BusinessAdminInput {
  /** Client-generated up front so uploaded images can use the real entity id as their storage path from the start. */
  id?: string
  name: string
  slug: string
  category_id: string | null
  logo_url: string | null
  address: string | null
  whatsapp: string | null
  instagram: string | null
  description: string | null
  services: string[]
  opening_hours: OpeningHourInterval[]
  additional_links: AdditionalLink[]
  status: ContentStatus
  amenityIds: string[]
  gallery: GalleryInput[]
}

function toBusinessScalar(input: BusinessAdminInput) {
  return {
    ...(input.id ? { id: input.id } : {}),
    name: input.name,
    slug: input.slug,
    category_id: input.category_id,
    logo_url: input.logo_url,
    address: input.address,
    whatsapp: input.whatsapp,
    instagram: input.instagram,
    description: input.description,
    services: input.services,
    opening_hours: input.opening_hours,
    additional_links: input.additional_links,
    status: input.status,
  }
}

export async function createBusinessAdmin(input: BusinessAdminInput) {
  return createEntityWithRelations('businesses', toBusinessScalar(input), {
    amenities: { joinTable: 'business_amenities', entityColumn: 'business_id', amenityIds: input.amenityIds },
    gallery: { entityColumn: 'business_id', images: input.gallery },
  })
}

export async function updateBusinessAdmin(id: string, input: BusinessAdminInput) {
  return updateEntityWithRelations('businesses', id, toBusinessScalar(input), {
    amenities: { joinTable: 'business_amenities', entityColumn: 'business_id', amenityIds: input.amenityIds },
    gallery: { entityColumn: 'business_id', images: input.gallery },
  })
}

export async function deleteBusinessAdmin(id: string): Promise<void> {
  const { data } = await supabase.from('businesses').select('logo_url, galleries(image_url)').eq('id', id).single()
  const imageUrls = [
    (data as { logo_url?: string | null } | null)?.logo_url,
    ...(((data as { galleries?: { image_url: string }[] } | null)?.galleries || []).map((g) => g.image_url)),
  ]
  await deleteEntityWithCleanup('businesses', id, imageUrls)
}

export async function duplicateBusinessAdmin(id: string) {
  return duplicateEntity('businesses', id, 'name', { logo_url: null }, { joinTable: 'business_amenities', entityColumn: 'business_id' })
}
