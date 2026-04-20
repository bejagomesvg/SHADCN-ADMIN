import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'supabase_access_token'
const AUTH_USER = 'supabase_auth_user'

export interface AuthUser {
  id: string
  name: string
  username: string
  email: string
  role: string
  status: string
  exp: number | null
  avatar?: string | null
}

interface AuthState {
  auth: {
    initialized: boolean
    setInitialized: (initialized: boolean) => void
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const accessTokenCookie = getCookie(ACCESS_TOKEN)
  const initToken = accessTokenCookie ? JSON.parse(accessTokenCookie) : ''
  const authUserCookie = getCookie(AUTH_USER)
  const initUser = authUserCookie ? (JSON.parse(authUserCookie) as AuthUser) : null

  return {
    auth: {
      initialized: false,
      setInitialized: (initialized) =>
        set((state) => ({ ...state, auth: { ...state.auth, initialized } })),
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(AUTH_USER, JSON.stringify(user))
          } else {
            removeCookie(AUTH_USER)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          if (accessToken) {
            setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          } else {
            removeCookie(ACCESS_TOKEN)
          }
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(AUTH_USER)
          return {
            ...state,
            auth: {
              ...state.auth,
              initialized: true,
              user: null,
              accessToken: '',
            },
          }
        }),
    },
  }
})
