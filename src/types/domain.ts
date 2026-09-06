import type { Database } from './database'

type Tables = Database['public']['Tables']

// Base row types extracted from generated database schema
export type CategoryRow = Tables['categories']['Row']
export type AmenityRow = Tables['amenities']['Row']
export type BusinessRow = Tables['businesses']['Row']
export type EventRow = Tables['events']['Row']
export type PackageRow = Tables['packages']['Row']
export type LodgingRow = Tables['lodging']['Row']
export type DiningRow = Tables['dining']['Row']
export type SubmissionRow = Tables['submissions']['Row']
export type GalleryRow = Tables['galleries']['Row']

// Enums and literals
export type ContentStatus = 'draft' | 'published' | 'archived'
export type ContentDomain = 'business' | 'event' | 'package' | 'lodging' | 'dining'
export type LodgingType = 'hotel' | 'pousada' | 'guesthouse' | 'resort' | 'other'
export type PriceRange = '$' | '$$' | '$$$' | '$$$$'
export type ImageAspectRatio = '1:1' | '4:5' | '16:9'

// Structured JSON fields
export interface OpeningHourInterval {
  day: number // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  open?: string // e.g. "08:00"
  close?: string // e.g. "18:00"
  closed: boolean
}

export interface AdditionalLink {
  label: string
  url: string
}

// Domain models
export type Category = CategoryRow
export type Amenity = AmenityRow
export type GalleryItem = GalleryRow

export interface Business extends Omit<BusinessRow, 'opening_hours' | 'additional_links'> {
  opening_hours: OpeningHourInterval[]
  additional_links: AdditionalLink[]
  category?: Category | null
}

export interface BusinessWithRelations extends Business {
  category: Category | null
  amenities: Amenity[]
  gallery: GalleryItem[]
}

export interface Event extends Omit<EventRow, 'links'> {
  links: AdditionalLink[]
  category?: Category | null
}

export interface EventWithRelations extends Event {
  category: Category | null
  amenities: Amenity[]
  gallery: GalleryItem[]
}

export interface PackageAgencySummary {
  id: string
  name: string
  slug: string
  logo_url: string | null
  whatsapp: string | null
}

export interface Package extends PackageRow {
  category?: Category | null
  agency?: PackageAgencySummary | null
}

export interface PackageWithRelations extends Package {
  category: Category | null
  agency: Business | null
  amenities: Amenity[]
}

export interface Lodging extends LodgingRow {
  category?: Category | null
}

export interface LodgingWithRelations extends Lodging {
  category: Category | null
  amenities: Amenity[]
  gallery: GalleryItem[]
}

export interface Dining extends Omit<DiningRow, 'opening_hours'> {
  opening_hours: OpeningHourInterval[]
  category?: Category | null
}

export interface DiningWithRelations extends Dining {
  category: Category | null
  amenities: Amenity[]
  gallery: GalleryItem[]
}

export type Submission = SubmissionRow

// Normalized application error
export interface AppError {
  message: string
  code?: string
  original?: unknown
}

// Paginated response wrapper
export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
