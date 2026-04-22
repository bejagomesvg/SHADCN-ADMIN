import { getRouteApi } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import { getUsers, usersQueryKey } from './data/users'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: usersQueryKey,
    queryFn: getUsers,
  })

  return (
    <UsersProvider>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex flex-1 items-center justify-center rounded-md border'>
            <Loader2 className='size-6 animate-spin' />
          </div>
        ) : isError ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-3 rounded-md border p-6 text-center'>
            <AlertTriangle className='size-6 text-destructive' />
            <p className='text-sm text-muted-foreground'>
              {error instanceof Error ? error.message : 'Erro ao carregar usuários.'}
            </p>
            <Button variant='outline' onClick={() => refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <UsersTable data={users} search={search} navigate={navigate} />
        )}
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
