import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { cn } from '@/lib/utils'
import { useAppHeaderContent } from './app-header-context'
import { Header } from './header'

export function AppHeader() {
  const content = useAppHeaderContent()

  return (
    <Header fixed>
      <Search className={cn(!content && 'me-auto')} />
      {content && (
        <div className='me-auto flex min-w-0 items-center gap-3'>
          {content}
        </div>
      )}
      <ConfigDrawer />
      <ProfileDropdown />
    </Header>
  )
}
