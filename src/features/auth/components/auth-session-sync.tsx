import { useEffect } from 'react'
import { buildAuthUserFromSession } from '@/features/auth/lib/session'
import { useAuthStore } from '@/stores/auth-store'
import { supabase } from '@/utils/supabase'

export function AuthSessionSync() {
  const setUser = useAuthStore((state) => state.auth.setUser)
  const setAccessToken = useAuthStore((state) => state.auth.setAccessToken)
  const reset = useAuthStore((state) => state.auth.reset)
  const setInitialized = useAuthStore((state) => state.auth.setInitialized)

  useEffect(() => {
    let active = true

    const syncSession = async (
      session: Awaited<ReturnType<NonNullable<typeof supabase>['auth']['getSession']>>['data']['session']
    ) => {
      if (!active) return

      if (!session) {
        reset()
        return
      }

      try {
        const authUser = await buildAuthUserFromSession(session)

        if (!active) return

        if (!authUser) {
          reset()
          return
        }

        setUser(authUser)
        setAccessToken(session.access_token)
        setInitialized(true)
      } catch {
        if (!active) return
        reset()
      }
    }

    if (!supabase) {
      reset()
      setInitialized(true)
      return
    }

    void supabase.auth
      .getSession()
      .then(({ data }) => syncSession(data.session))
      .catch(() => {
        if (!active) return
        reset()
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        void syncSession(session)
      }, 0)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [reset, setAccessToken, setInitialized, setUser])

  return null
}
