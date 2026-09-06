import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/use-auth'
import { Spinner } from '@/components/ui/spinner'
import { SessionExpiredModal } from '@/components/admin/session-expired-modal'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading, sessionExpired } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-slate-950">
        <Spinner size="lg" className="text-white" />
      </div>
    )
  }

  // A dead session from a genuine expiry is handled in place (see
  // SessionExpiredModal) rather than redirected away, so an in-progress
  // form is never torn down. Only a session that was never valid to begin
  // with sends the admin to login.
  if (!sessionExpired && (!session || !isAdmin)) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return (
    <>
      {children}
      {sessionExpired && <SessionExpiredModal />}
    </>
  )
}
