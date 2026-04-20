import { type Session } from '@supabase/supabase-js'
import { getUserByEmail } from '@/features/users/data/users'
import { type AuthUser } from '@/stores/auth-store'

const formatNameFromEmail = (email: string) => {
  const localPart = email.split('@')[0] || 'user'
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function buildAuthUserFromSession(session: Session) {
  const email = session.user.email?.trim().toLowerCase()

  if (!email) {
    return null
  }

  const profile = await getUserByEmail(email)

  const authUser: AuthUser = {
    id: session.user.id,
    name: profile
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : formatNameFromEmail(email),
    username: profile?.username ?? email.split('@')[0],
    email,
    role: profile?.role ?? 'cashier',
    status: profile?.status ?? 'active',
    exp: session.expires_at ? session.expires_at * 1000 : null,
    avatar: null,
  }

  return authUser
}
