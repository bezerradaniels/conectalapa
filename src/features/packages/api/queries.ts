import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Package, PackageWithRelations, Amenity, Business, PaginatedResult, Category } from '@/types'

export type PackageSortOption = 'soonest' | 'price_asc' | 'price_desc'

export interface PackageFilters extends Record<string, unknown> {
  category?: string
  destination?: string
  departureMonth?: string // Format 'YYYY-MM'
  priceRange?: 'under_1000' | '1000_1500' | 'above_1500'
  agency?: string
  search?: string
  sort?: PackageSortOption
  includePast?: boolean
  page?: number
  pageSize?: number
  limit?: number
  upcomingOnly?: boolean
}

const PACKAGE_LIST_COLUMNS = `
  id,
  destination,
  slug,
  status,
  departure_location,
  departure_date,
  return_date,
  agency_id,
  agency_name,
  agency_whatsapp,
  information,
  price,
  image_url,
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
  agency:businesses (
    id,
    name,
    slug,
    logo_url,
    whatsapp
  )
`

export async function fetchPackages(filters: PackageFilters = {}): Promise<Package[]> {
  const result = await fetchPackagesPaginated({ ...filters, pageSize: filters.limit || 50 })
  return result.data
}

export async function fetchPackagesPaginated(filters: PackageFilters = {}): Promise<PaginatedResult<Package>> {
  try {
    const page = Math.max(1, Number(filters.page) || 1)
    const pageSize = Math.max(1, Number(filters.pageSize) || 12)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let selectClause = PACKAGE_LIST_COLUMNS
    if (filters.category) {
      selectClause = selectClause.replace('category:categories (', 'category:categories!inner (')
    }

    let query = supabase
      .from('packages')
      .select(selectClause, { count: 'exact' })
      .eq('status', 'published')

    // Filter out past departure dates by default
    if (!filters.includePast) {
      const todayDate = new Date().toISOString().split('T')[0]
      query = query.gte('departure_date', todayDate)
    }

    // Category
    if (filters.category) {
      query = query.eq('category.slug', filters.category)
    }

    // Destination search
    if (filters.destination) {
      query = query.ilike('destination', `%${filters.destination}%`)
    }

    // General search
    if (filters.search) {
      query = query.or(`destination.ilike.%${filters.search}%,information.ilike.%${filters.search}%`)
    }

    // Departure month (e.g. '2026-10')
    if (filters.departureMonth) {
      const [year, month] = filters.departureMonth.split('-').map(Number)
      const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
      query = query.gte('departure_date', startOfMonth).lte('departure_date', endOfMonth)
    }

    // Price range
    if (filters.priceRange === 'under_1000') {
      query = query.lt('price', 1000)
    } else if (filters.priceRange === '1000_1500') {
      query = query.gte('price', 1000).lte('price', 1500)
    } else if (filters.priceRange === 'above_1500') {
      query = query.gt('price', 1500)
    }

    // Agency
    if (filters.agency) {
      query = query.or(`agency_id.eq.${filters.agency},agency_name.ilike.%${filters.agency}%`)
    }

    // Sorting
    if (filters.sort === 'price_asc') {
      query = query.order('price', { ascending: true })
    } else if (filters.sort === 'price_desc') {
      query = query.order('price', { ascending: false })
    } else {
      // Default: soonest departure
      query = query.order('departure_date', { ascending: true })
    }

    // Pagination
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      throw toAppError(error)
    }

    const items = (data || []) as unknown as Package[]
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

export async function fetchPackageBySlug(slug: string): Promise<PackageWithRelations> {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select(`
        *,
        category:categories (*),
        agency:businesses (*),
        package_amenities (
          amenity:amenities (*)
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      throw toAppError(error)
    }

    const amenities: Amenity[] = (data.package_amenities || [])
      .map((item: { amenity: Amenity | null }) => item.amenity)
      .filter((a): a is Amenity => a !== null)

    const agency: Business | null = data.agency
      ? ({
          ...data.agency,
          opening_hours: Array.isArray(data.agency.opening_hours) ? data.agency.opening_hours : [],
          additional_links: Array.isArray(data.agency.additional_links) ? data.agency.additional_links : [],
        } as unknown as Business)
      : null

    return {
      ...data,
      agency,
      amenities,
    } as unknown as PackageWithRelations
  } catch (err) {
    throw toAppError(err)
  }
}

export async function fetchPackageFilterMeta(): Promise<{
  categories: Category[]
  departureMonths: { value: string; label: string }[]
  agencies: { id: string; name: string }[]
}> {
  try {
    const [catRes, pkgDatesRes] = await Promise.all([
      supabase
        .from('categories')
        .select('*')
        .eq('domain', 'package')
        .order('name', { ascending: true }),
      supabase
        .from('packages')
        .select('departure_date, agency_name, agency:businesses(id, name)')
        .eq('status', 'published')
        .gte('departure_date', new Date().toISOString().split('T')[0])
        .order('departure_date', { ascending: true }),
    ])

    if (catRes.error) throw toAppError(catRes.error)
    if (pkgDatesRes.error) throw toAppError(pkgDatesRes.error)

    const monthMap = new Map<string, string>()
    const agencyMap = new Map<string, string>()

    const MONTH_LABELS = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ]

    for (const row of pkgDatesRes.data || []) {
      if (row.departure_date) {
        const [y, m] = row.departure_date.split('-').map(Number)
        const key = `${y}-${String(m).padStart(2, '0')}`
        if (!monthMap.has(key)) {
          monthMap.set(key, `${MONTH_LABELS[m - 1]} ${y}`)
        }
      }

      if (row.agency && (row.agency as unknown as { id: string; name: string }).id) {
        const ag = row.agency as unknown as { id: string; name: string }
        agencyMap.set(ag.id, ag.name)
      } else if (row.agency_name) {
        agencyMap.set(row.agency_name, row.agency_name)
      }
    }

    const departureMonths = Array.from(monthMap.entries()).map(([value, label]) => ({
      value,
      label,
    }))

    const agencies = Array.from(agencyMap.entries()).map(([id, name]) => ({
      id,
      name,
    }))

    return {
      categories: (catRes.data || []) as Category[],
      departureMonths,
      agencies,
    }
  } catch (err) {
    throw toAppError(err)
  }
}
