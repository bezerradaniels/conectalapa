import { useSearchParams } from 'react-router-dom'
import { useSubmissionAdminDetail } from '@/features/submissions/api/hooks'

/**
 * Reads `?fromSubmission=<id>` off the URL — present when the admin
 * clicked "Aprovar" on a pending submission — and loads it so the create
 * form can prefill from it. Absent on every normal create/edit visit.
 */
export function useSubmissionPrefill() {
  const [searchParams] = useSearchParams()
  const submissionId = searchParams.get('fromSubmission') || undefined
  const { data: submission, isLoading } = useSubmissionAdminDetail(submissionId)
  return { submissionId, submission, isLoadingSubmission: isLoading }
}
