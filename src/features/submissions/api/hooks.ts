import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AppError, Submission } from '@/types'
import type { AdminDomainTable } from '@/features/admin/api/queries'
import {
  createSubmission,
  fetchSubmissionsAdmin,
  fetchSubmissionAdminById,
  approveSubmission,
  rejectSubmission,
  bulkRejectSubmissions,
  deleteSubmissionAdmin,
  type CreateSubmissionInput,
  type AdminSubmissionFilters,
} from './queries'

export function useCreateSubmission() {
  return useMutation({
    mutationFn: (input: CreateSubmissionInput) => createSubmission(input),
  })
}

const ADMIN_LIST_KEY = ['admin', 'submissions', 'list']

export function useSubmissionsAdmin(filters: AdminSubmissionFilters = {}) {
  return useQuery<Submission[], AppError>({
    queryKey: [...ADMIN_LIST_KEY, filters],
    queryFn: () => fetchSubmissionsAdmin(filters),
  })
}

export function useSubmissionAdminDetail(id: string | undefined) {
  return useQuery<Submission, AppError>({
    queryKey: ['admin', 'submissions', 'detail', id],
    queryFn: () => fetchSubmissionAdminById(id as string),
    enabled: Boolean(id),
  })
}

function useInvalidateSubmissions() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_LIST_KEY })
    queryClient.invalidateQueries({ queryKey: ['admin', 'pending-submissions-count'] })
  }
}

export function useApproveSubmission() {
  const invalidate = useInvalidateSubmissions()
  return useMutation({
    mutationFn: ({ id, table, entityId }: { id: string; table: AdminDomainTable; entityId: string }) =>
      approveSubmission(id, table, entityId),
    onSuccess: invalidate,
  })
}

export function useRejectSubmission() {
  const invalidate = useInvalidateSubmissions()
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => rejectSubmission(id, note),
    onSuccess: invalidate,
  })
}

export function useBulkRejectSubmissions() {
  const invalidate = useInvalidateSubmissions()
  return useMutation({
    mutationFn: (ids: string[]) => bulkRejectSubmissions(ids),
    onSuccess: invalidate,
  })
}

export function useDeleteSubmissionAdmin() {
  const invalidate = useInvalidateSubmissions()
  return useMutation({
    mutationFn: (id: string) => deleteSubmissionAdmin(id),
    onSuccess: invalidate,
  })
}
