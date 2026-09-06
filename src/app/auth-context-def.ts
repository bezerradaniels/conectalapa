import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export interface AuthContextValue {
  session: Session | null
  user: User | null
  isAdmin: boolean
  /** True only during the very first session check on load. */
  loading: boolean
  /**
   * True when a previously-valid session was lost mid-use (refresh token
   * expired/revoked) rather than through an explicit sign-out. The
   * protected route keeps the page mounted and shows a re-auth modal
   * instead of redirecting, so an in-progress form isn't lost.
   */
  sessionExpired: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  /** Called by the re-auth modal after a successful sign-in to resume normally. */
  clearSessionExpired: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
