import { supabase } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'
import { toAppError } from '@/lib/errors'
import { deleteStorageObjectsByUrls } from '@/lib/storage'
import { generateUniqueSlug, type SluggableTable } from '@/lib/slug'
import type { AdminDomainTable } from '@/features/admin/api/queries'

export type AmenityJoinTable =
  | 'business_amenities'
  | 'event_amenities'
  | 'package_amenities'
  | 'lodging_amenities'
  | 'dining_amenities'

export type GalleryEntityColumn = 'business_id' | 'event_id' | 'lodging_id' | 'dining_id'

/**
 * These junction/gallery tables are genuinely polymorphic from the caller's
 * side (5 domains, 2 columns each, different names) in a way Postgrest's
 * generated per-table types can't express without a 5-way switch that
 * would just duplicate this same logic five times. The cast is scoped to
 * this one client handle inside this file; every caller still goes through
 * the fully-typed `AmenityJoinTable`/`GalleryEntityColumn` unions above.
 */
const dynamicClient = supabase as unknown as SupabaseClient

/**
 * Replaces an entity's amenity links wholesale — simpler and cheap enough
 * at this content volume than diffing add/remove sets.
 */
export async function syncAmenityLinks(
  joinTable: AmenityJoinTable,
  entityColumn: string,
  entityId: string,
  amenityIds: string[]
): Promise<void> {
  const { error: deleteError } = await dynamicClient.from(joinTable).delete().eq(entityColumn, entityId)
  if (deleteError) throw toAppError(deleteError)

  if (amenityIds.length === 0) return

  const { error: insertError } = await dynamicClient
    .from(joinTable)
    .insert(amenityIds.map((amenityId) => ({ [entityColumn]: entityId, amenity_id: amenityId })))
  if (insertError) throw toAppError(insertError)
}

export interface GalleryInput {
  id?: string
  image_url: string
  caption?: string | null
  aspect_ratio?: string | null
}

/**
 * Replaces an entity's gallery wholesale in display order. The form
 * already owns delete-on-remove for individual images (via
 * deleteStorageObjectByUrl when a thumbnail is removed), so this only
 * reconciles row order/captions and inserts newly-uploaded images.
 */
export async function syncGallery(
  entityColumn: GalleryEntityColumn,
  entityId: string,
  images: GalleryInput[]
): Promise<void> {
  const { error: deleteError } = await supabase.from('galleries').delete().eq(entityColumn, entityId)
  if (deleteError) throw toAppError(deleteError)

  if (images.length === 0) return

  const { error: insertError } = await dynamicClient.from('galleries').insert(
    images.map((image, index) => ({
      [entityColumn]: entityId,
      image_url: image.image_url,
      caption: image.caption || null,
      aspect_ratio: image.aspect_ratio || null,
      display_order: index,
    }))
  )
  if (insertError) throw toAppError(insertError)
}

/**
 * Hard delete, justified in the Phase 7 report: this is a single-admin
 * tool with no audit/versioning requirement, `status: 'archived'` already
 * covers "stop showing but keep for reference", and the schema has no
 * `deleted_at` column. The DB row goes first (its cascades remove gallery/
 * amenity-join rows atomically); storage cleanup is best-effort afterward
 * so a storage hiccup never leaves a dangling, broken DB row.
 */
export async function deleteEntityWithCleanup(
  table: AdminDomainTable,
  id: string,
  imageUrls: Array<string | null | undefined>
): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw toAppError(error)

  await deleteStorageObjectsByUrls(imageUrls)
}

export async function updateEntityStatus(table: AdminDomainTable, id: string, status: string): Promise<void> {
  const { error } = await supabase.from(table).update({ status }).eq('id', id)
  if (error) throw toAppError(error)
}

export async function bulkUpdateStatus(table: AdminDomainTable, ids: string[], status: string): Promise<void> {
  const { error } = await supabase.from(table).update({ status }).in('id', ids)
  if (error) throw toAppError(error)
}

export interface RelationsConfig {
  amenities?: { joinTable: AmenityJoinTable; entityColumn: string; amenityIds: string[] }
  gallery?: { entityColumn: GalleryEntityColumn; images: GalleryInput[] }
}

async function syncRelations(entityId: string, relations: RelationsConfig): Promise<void> {
  if (relations.amenities) {
    await syncAmenityLinks(relations.amenities.joinTable, relations.amenities.entityColumn, entityId, relations.amenities.amenityIds)
  }
  if (relations.gallery) {
    await syncGallery(relations.gallery.entityColumn, entityId, relations.gallery.images)
  }
}

export async function createEntityWithRelations(
  table: AdminDomainTable,
  scalar: Record<string, unknown>,
  relations: RelationsConfig = {}
): Promise<{ id: string; slug: string }> {
  const { data, error } = await dynamicClient.from(table).insert(scalar).select('id, slug').single()
  if (error) throw toAppError(error)

  const created = data as { id: string; slug: string }
  await syncRelations(created.id, relations)
  return created
}

export async function updateEntityWithRelations(
  table: AdminDomainTable,
  id: string,
  scalar: Record<string, unknown>,
  relations: RelationsConfig = {}
): Promise<void> {
  const { error } = await dynamicClient.from(table).update(scalar).eq('id', id)
  if (error) throw toAppError(error)

  await syncRelations(id, relations)
}

/**
 * Duplicate deliberately does not copy images: a gallery row's image_url
 * would otherwise be shared by two entities, and deleting either one later
 * would silently break the other's photo. The clone starts imageless and
 * as a draft — the admin re-adds photos deliberately, no accidental
 * cross-entity storage coupling.
 */
export async function duplicateEntity(
  table: AdminDomainTable,
  id: string,
  nameField: string,
  overrides: Record<string, unknown>,
  amenityJoin?: { joinTable: AmenityJoinTable; entityColumn: string }
): Promise<{ id: string; slug: string }> {
  const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
  if (error) throw toAppError(error)

  const source = data as unknown as Record<string, unknown>
  const newName = `${String(source[nameField])} (cópia)`
  const slug = await generateUniqueSlug(table as SluggableTable, newName)

  const clone: Record<string, unknown> = { ...source, ...overrides }
  delete clone.id
  delete clone.created_at
  delete clone.updated_at
  clone[nameField] = newName
  clone.slug = slug
  clone.status = 'draft'

  const { data: inserted, error: insertError } = await dynamicClient.from(table).insert(clone).select('id, slug').single()
  if (insertError) throw toAppError(insertError)
  const created = inserted as { id: string; slug: string }

  if (amenityJoin) {
    const { data: sourceLinks, error: linksError } = await dynamicClient
      .from(amenityJoin.joinTable)
      .select('amenity_id')
      .eq(amenityJoin.entityColumn, id)
    if (linksError) throw toAppError(linksError)

    const amenityIds = ((sourceLinks || []) as { amenity_id: string }[]).map((row) => row.amenity_id)
    if (amenityIds.length > 0) {
      await syncAmenityLinks(amenityJoin.joinTable, amenityJoin.entityColumn, created.id, amenityIds)
    }
  }

  return created
}
