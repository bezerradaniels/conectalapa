import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { AuthContext } from '@/app/auth-context-def'

async function checkIsAdmin(userId: string): Promise<boolean> {
  // RLS on `admins` only returns a row when is_admin() is already true for
  // this user, so an empty result reliably means "not an admin" rather
  // than a query failure.
  const { data } = await supabase.from('admins').select('id').eq('user_id', userId).maybeSingle()
  return Boolean(data)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sessionExpired, setSessionExpired] = useState(false)

  const manualSignOutRef = useRef(false)
  const hadSessionRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    async function applySession(nextSession: Session | null) {
      if (nextSession?.user) {
        const admin = await checkIsAdmin(nextSession.user.id)
        if (cancelled) return
        setSession(nextSession)
        setIsAdmin(admin)
        hadSessionRef.current = true
      } else {
        if (cancelled) return
        setSession(null)
        setIsAdmin(false)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session).finally(() => {
        if (!cancelled) setLoading(false)
      })
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'SIGNED_OUT') {
        if (manualSignOutRef.current) {
          manualSignOutRef.current = false
          setSession(null)
          setIsAdmin(false)
          setSessionExpired(false)
          hadSessionRef.current = false
        } else if (hadSessionRef.current) {
          // Refresh token died mid-use — don't tear down the page.
          setSessionExpired(true)
        }
        return
      }

      applySession(nextSession)
    })

    return () => {
      cancelled = true
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.session) {
      // Never distinguish "wrong password" from "no such user" — that enumerates accounts.
      return { error: 'Credenciais inválidas.' }
    }

    const admin = await checkIsAdmin(data.session.user.id)
    if (!admin) {
      manualSignOutRef.current = true
      await supabase.auth.signOut()
      return { error: 'Credenciais inválidas.' }
    }

    setSession(data.session)
    setIsAdmin(true)
    setSessionExpired(false)
    hadSessionRef.current = true
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    manualSignOutRef.current = true
    await supabase.auth.signOut()
  }, [])

  const clearSessionExpired = useCallback(() => setSessionExpired(false), [])

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin,
        loading,
        sessionExpired,
        signIn,
        signOut,
        clearSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
