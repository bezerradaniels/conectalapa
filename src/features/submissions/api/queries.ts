import { supabase } from '@/lib/supabase'
import { toAppError } from '@/lib/errors'
import type { Submission, ContentDomain, Json } from '@/types'
import type { AdminDomainTable } from '@/features/admin/api/queries'

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

/**
 * Everything beyond the dedicated contact/domain columns lives here — kept
 * loose on purpose since the public form's fields are intentionally
 * minimal and vary a little per domain.
 */
export interface SubmissionPayload {
  name: string
  description: string
  address?: string
  instagram?: string
  website?: string
  event_date?: string
  destination?: string
  /** Set by the admin conversion flow — see approveSubmission. */
  converted_table?: AdminDomainTable
  converted_id?: string
}

export interface CreateSubmissionInput {
  contact_name: string
  contact_phone: string
  contact_email?: string | null
  target_domain: ContentDomain
  payload: SubmissionPayload
  ip_address?: string | null
}

/** The public, anonymous insert path — RLS grants `anon` insert-only on this table. */
export async function createSubmission(input: CreateSubmissionInput): Promise<void> {
  const { error } = await supabase.from('submissions').insert({
    contact_name: input.contact_name,
    contact_phone: input.contact_phone,
    contact_email: input.contact_email || null,
    target_domain: input.target_domain,
    payload: input.payload as unknown as Json,
    ip_address: input.ip_address || null,
  })
  if (error) throw toAppError(error)
}

export interface AdminSubmissionFilters {
  status?: SubmissionStatus | 'all'
}

export async function fetchSubmissionsAdmin(filters: AdminSubmissionFilters = {}): Promise<Submission[]> {
  let query = supabase.from('submissions').select('*').order('created_at', { ascending: true })
  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }
  const { data, error } = await query
  if (error) throw toAppError(error)
  return (data || []) as Submission[]
}

export async function fetchSubmissionAdminById(id: string): Promise<Submission> {
  const { data, error } = await supabase.from('submissions').select('*').eq('id', id).single()
  if (error) throw toAppError(error)
  return data as Submission
}

/**
 * The submission only ever moves to "approved" from here — called after
 * the admin's create form successfully saves the resulting entity, never
 * when the form merely opens. `converted_table`/`converted_id` land in
 * `payload` (no dedicated columns) so the origin stays traceable without a
 * schema change to a live table.
 */
export async function approveSubmission(id: string, convertedTable: AdminDomainTable, convertedId: string): Promise<void> {
  const existing = await fetchSubmissionAdminById(id)
  const payload = {
    ...(existing.payload as unknown as SubmissionPayload),
    converted_table: convertedTable,
    converted_id: convertedId,
  }

  const { error } = await supabase
    .from('submissions')
    .update({ status: 'approved', reviewed_at: new Date().toISOString(), payload: payload as unknown as Json })
    .eq('id', id)
  if (error) throw toAppError(error)
}

export async function rejectSubmission(id: string, note?: string): Promise<void> {
  const { error } = await supabase
    .from('submissions')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString(), review_notes: note || null })
    .eq('id', id)
  if (error) throw toAppError(error)
}

export async function bulkRejectSubmissions(ids: string[]): Promise<void> {
  const { error } = await supabase
    .from('submissions')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .in('id', ids)
  if (error) throw toAppError(error)
}

export async function deleteSubmissionAdmin(id: string): Promise<void> {
  const { error } = await supabase.from('submissions').delete().eq('id', id)
  if (error) throw toAppError(error)
}
