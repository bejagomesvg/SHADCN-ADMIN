import { useState } from 'react'
import { RotateCcw, Settings } from 'lucide-react'
import { useDirection } from '@/context/direction-provider'
import { useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { SchemeColorConfig } from './config-drawer/scheme-color-config'
import {
  DirConfig,
  LayoutConfig,
  SidebarConfig,
  ThemeConfig,
} from './config-drawer/settings-sections'
import { useSidebar } from './ui/sidebar'

export function ConfigDrawer() {
  const { open: sidebarOpen, setOpen } = useSidebar()
  const { defaultDir, dir, resetDir } = useDirection()
  const {
    customColors,
    defaultSchemeColor,
    defaultTheme,
    resetTheme,
    schemeColor,
    theme,
  } = useTheme()
  const {
    collapsible,
    defaultCollapsible,
    defaultVariant,
    resetLayout,
    variant,
  } = useLayout()
  const [open, setSheetOpen] = useState(false)
  const [resetRevision, setResetRevision] = useState(0)
  const hasChanges =
    theme !== defaultTheme ||
    schemeColor !== defaultSchemeColor ||
    Object.keys(customColors).length > 0 ||
    variant !== defaultVariant ||
    collapsible !== defaultCollapsible ||
    !sidebarOpen ||
    dir !== defaultDir

  const handleReset = () => {
    setOpen(true)
    resetDir()
    resetTheme()
    resetLayout()
    setResetRevision((current) => current + 1)
  }

  return (
    <Sheet open={open} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          aria-label='Open theme settings'
          className='rounded-full'
        >
          <Settings aria-hidden='true' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col'>
        <SheetHeader className='pb-0 text-start'>
          <SheetTitle className='flex items-center gap-2'>
            Theme Settings
            {hasChanges && (
              <Button
                type='button'
                size='icon'
                variant='secondary'
                className='size-5 rounded-full'
                onClick={handleReset}
                aria-label='Reset all settings to default values'
              >
                <RotateCcw className='size-3' />
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className='space-y-6 overflow-y-auto px-4'>
          <ThemeConfig />
          <SchemeColorConfig
            key={`${open ? 'open' : 'closed'}-${resetRevision}`}
          />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
        </div>
      </SheetContent>
    </Sheet>
  )
}
