import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: any
  session: any
  profile: any
  isInitializing: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInWithPhone: (phone: string) => Promise<{ error: any }>
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: any; user?: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; session: any; user: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isInitializing, setIsInitializing] = useState(true)

  // Track current user id to skip redundant state updates.
  const currentUserIdRef = useRef<string | null>(null)

  // Bootstrap — restore session + subscribe to auth changes.
  useEffect(() => {
    if (!supabase) {
      setIsInitializing(false)
      return
    }

    let mounted = true

    // 1. Pull the existing session synchronously (restores from localStorage).
    supabase.auth.getSession().then(async ({ data: { session: sess } }) => {
      if (!mounted) return
      if (sess?.user) {
        currentUserIdRef.current = sess.user.id
        setUser(sess.user)
        setSession(sess)
        setIsInitializing(false)
      } else {
        setIsInitializing(false)
      }
    })

    // 2. Subscribe to future auth state changes (sign in/out, token refresh).
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, sess) => {
      // Skip redundant updates (Supabase fires these on tab focus).
      const newId = sess?.user?.id ?? null
      if (newId === currentUserIdRef.current && event !== 'SIGNED_OUT') return
      currentUserIdRef.current = newId

      if (!mounted) return

      setUser(sess?.user ?? null)
      setSession(sess ?? null)

      if (event === 'SIGNED_OUT' || !sess?.user) {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  // ---- Auth actions -------------------------------------------------------

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase client not initialized') }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signInWithPhone = async (phone: string) => {
    if (!supabase) return { error: new Error('Supabase client not initialized') }
    const { error } = await supabase.auth.signInWithOtp({ phone })
    return { error }
  }

  const verifyPhoneOtp = async (phone: string, token: string) => {
    if (!supabase) return { error: new Error('Supabase client not initialized') }
    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
    return { error, user: data?.user }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase client not initialized'), session: null, user: null }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error, session: data?.session, user: data?.user }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    currentUserIdRef.current = null
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      isInitializing,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signInWithPhone,
      verifyPhoneOtp,
      signOut,
    }),
    [user, session, profile, isInitializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Convenience hook — throws if used outside the provider. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
