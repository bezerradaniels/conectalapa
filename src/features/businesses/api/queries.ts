import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Business, BusinessWithRelations, Amenity, GalleryItem, PaginatedResult, Category } from '@/types'
import { getOpenStatus } from '@/lib/format'

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
