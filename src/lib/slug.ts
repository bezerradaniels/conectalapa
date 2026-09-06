import { supabase } from '@/lib/supabase'

export type SluggableTable = 'businesses' | 'events' | 'packages' | 'lodging' | 'dining'

/**
 * Client-side preview only — mirrors public.generate_slug()'s ASCII-folding
 * so the form can show a live slug as the admin types. The database
 * function (unaccent + collision suffixing) remains the source of truth;
 * call `generateUniqueSlug` before save to get the real, collision-free
 * value.
 */
export function slugifyPreview(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item'
}

/**
 * Calls the public.generate_slug() Postgres function, which unaccents,
 * lowercases, and appends a numeric suffix on collision within the target
 * table (excluding p_id, for edits).
 */
export async function generateUniqueSlug(
  table: SluggableTable,
  text: string,
  excludeId?: string | null
): Promise<string> {
  const { data, error } = await supabase.rpc('generate_slug', {
    p_text: text,
    p_table: table,
    p_id: excludeId || undefined,
  })

  if (error) throw error
  return data as string
}

/** Direct existence check for the debounced "slug is taken" indicator while typing. */
export async function isSlugTaken(table: SluggableTable, slug: string, excludeId?: string | null): Promise<boolean> {
  if (!slug) return false

  let query = supabase.from(table).select('id', { count: 'exact', head: true }).eq('slug', slug)
  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { count, error } = await query
  if (error) throw error
  return (count ?? 0) > 0
}
