import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Package, PackageWithRelations, Amenity, Business } from '@/types'

export interface PackageFilters extends Record<string, unknown> {
  category?: string
  search?: string
  upcomingOnly?: boolean
  limit?: number
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
  try {
    let query = supabase
      .from('packages')
      .select(PACKAGE_LIST_COLUMNS)
      .eq('status', 'published')
      .order('departure_date', { ascending: true })

    if (filters.category) {
      query = query.eq('categories.slug', filters.category)
    }

    if (filters.upcomingOnly) {
      query = query.gte('departure_date', new Date().toISOString().split('T')[0])
    }

    if (filters.search) {
      query = query.ilike('destination', `%${filters.search}%`)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      throw toAppError(error)
    }

    return (data || []) as unknown as Package[]
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
