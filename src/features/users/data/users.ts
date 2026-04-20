import { supabase } from '@/utils/supabase'
import { type User, type UserStatus } from './schema'

type SupabaseUserRow = {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
  phone_number: string | null
  status: UserStatus
  role: User['role']
  created_at: string
  updated_at: string
}

type UserPayload = Pick<
  User,
  'firstName' | 'lastName' | 'username' | 'email' | 'phoneNumber' | 'role'
> & {
  status?: UserStatus
}

type InvitePayload = {
  email: string
  role: User['role']
  description?: string
}

export const usersQueryKey = ['users']

const USERS_SELECT = `
  id,
  first_name,
  last_name,
  username,
  email,
  phone_number,
  status,
  role,
  created_at,
  updated_at
`

const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.'
    )
  }

  return supabase
}

const mapRowToUser = (row: SupabaseUserRow): User => ({
  id: row.id,
  firstName: row.first_name,
  lastName: row.last_name,
  username: row.username,
  email: row.email,
  phoneNumber: row.phone_number ?? '',
  status: row.status,
  role: row.role,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
})

const mapPayloadToRow = (payload: UserPayload) => ({
  first_name: payload.firstName.trim(),
  last_name: payload.lastName.trim(),
  username: payload.username.trim().toLowerCase(),
  email: payload.email.trim().toLowerCase(),
  phone_number: payload.phoneNumber.trim() || null,
  status: payload.status ?? 'active',
  role: payload.role,
})

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  return 'Erro ao comunicar com o Supabase.'
}

const usernameFromEmail = (email: string) => {
  const localPart = email.split('@')[0] || 'user'
  return `${localPart.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()}_${Math.random().toString(36).slice(2, 8)}`
}

const nameFromEmail = (email: string) => {
  const localPart = email.split('@')[0] || 'Invited User'
  const parts = localPart
    .split(/[._-]+/)
    .map((part) => part.trim())
    .filter(Boolean)

  const [firstName = 'Invited', ...rest] = parts
  const lastName = rest.join(' ') || 'User'

  return {
    firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
    lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
  }
}

export async function getUsers() {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('users')
    .select(USERS_SELECT)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(toErrorMessage(error))
  }

  return (data satisfies SupabaseUserRow[]).map(mapRowToUser)
}

export async function getUserByEmail(email: string) {
  const client = getSupabaseClient()
  const normalizedEmail = email.trim().toLowerCase()
  const { data, error } = await client
    .from('users')
    .select(USERS_SELECT)
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (error) {
    throw new Error(toErrorMessage(error))
  }

  return data ? mapRowToUser(data satisfies SupabaseUserRow) : null
}

export async function createUser(payload: UserPayload) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('users')
    .insert(mapPayloadToRow(payload))
    .select(USERS_SELECT)
    .single()

  if (error) {
    throw new Error(toErrorMessage(error))
  }

  return mapRowToUser(data satisfies SupabaseUserRow)
}

export async function updateUser(id: string, payload: UserPayload) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('users')
    .update(mapPayloadToRow(payload))
    .eq('id', id)
    .select(USERS_SELECT)
    .single()

  if (error) {
    throw new Error(toErrorMessage(error))
  }

  return mapRowToUser(data satisfies SupabaseUserRow)
}

export async function deleteUser(id: string) {
  const client = getSupabaseClient()
  const { error } = await client.from('users').delete().eq('id', id)

  if (error) {
    throw new Error(toErrorMessage(error))
  }
}

export async function deleteUsers(ids: string[]) {
  if (ids.length === 0) return

  const client = getSupabaseClient()
  const { error } = await client.from('users').delete().in('id', ids)

  if (error) {
    throw new Error(toErrorMessage(error))
  }
}

export async function updateUsersStatus(ids: string[], status: UserStatus) {
  if (ids.length === 0) return

  const client = getSupabaseClient()
  const { error } = await client
    .from('users')
    .update({ status })
    .in('id', ids)

  if (error) {
    throw new Error(toErrorMessage(error))
  }
}

export async function inviteUser(payload: InvitePayload) {
  const { firstName, lastName } = nameFromEmail(payload.email)

  return createUser({
    firstName,
    lastName,
    username: usernameFromEmail(payload.email),
    email: payload.email,
    phoneNumber: '',
    role: payload.role,
    status: 'invited',
  })
}

export async function markUsersAsInvited(ids: string[]) {
  return updateUsersStatus(ids, 'invited')
}
