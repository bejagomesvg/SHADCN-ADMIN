import { Outlet, useLocation } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { AppHeaderSlot } from '@/components/layout/app-header-context'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'

const settingsNavItems = [
  {
    title: 'Profile',
    href: '/settings',
  },
  {
    title: 'Account',
    href: '/settings/account',
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
  },
  {
    title: 'Display',
    href: '/settings/display',
  },
]

export function Settings() {
  const { pathname } = useLocation()
  const settingsNav = settingsNavItems.map((item) => ({
    ...item,
    isActive: pathname === item.href,
  }))

  return (
    <>
      <AppHeaderSlot>
        <TopNav links={settingsNav} />
      </AppHeaderSlot>

      <Main>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight text-primary md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-3' />
        <div className='w-full p-1'>
          <Outlet />
        </div>
      </Main>
    </>
  )
}
