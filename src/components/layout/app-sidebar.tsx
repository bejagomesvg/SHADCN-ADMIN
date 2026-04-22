import { useLayout } from '@/context/layout-provider'
import { useAuthStore } from '@/stores/auth-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Search } from '@/components/search'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const authUser = useAuthStore((state) => state.auth.user)
  const sidebarUser = authUser
    ? {
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar ?? '/avatars/01.png',
      }
    : sidebarData.user

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
        <Search className='h-8 w-full flex-none bg-background/55 sm:w-full md:w-full lg:w-full xl:w-full group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:[&>span:first-of-type]:sr-only group-data-[collapsible=icon]:[&_kbd]:hidden' />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
