import { type SVGProps } from 'react'
import { Root as Radio } from '@radix-ui/react-radio-group'
import { IconDir } from '@/assets/custom/icon-dir'
import { IconLayoutCompact } from '@/assets/custom/icon-layout-compact'
import { IconLayoutDefault } from '@/assets/custom/icon-layout-default'
import { IconLayoutFull } from '@/assets/custom/icon-layout-full'
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating'
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { IconThemeSystem } from '@/assets/custom/icon-theme-system'
import { useDirection } from '@/context/direction-provider'
import { type Collapsible, useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { useSidebar } from '@/components/ui/sidebar'
import {
  PreviewRadioGroupItem,
  type PreviewRadioItem,
} from './preview-radio-group'
import { SectionTitle } from './section-title'

const RADIO_GRID_CLASS = 'grid w-full max-w-md grid-cols-3 gap-4'

function PreviewRadioGrid({
  value,
  onValueChange,
  items,
  label,
  descriptionId,
  description,
}: {
  value: string
  onValueChange: (value: string) => void
  items: PreviewRadioItem[]
  label: string
  descriptionId: string
  description: string
}) {
  return (
    <>
      <Radio
        value={value}
        onValueChange={onValueChange}
        className={RADIO_GRID_CLASS}
        aria-label={label}
        aria-describedby={descriptionId}
      >
        {items.map((item) => (
          <PreviewRadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id={descriptionId} className='sr-only'>
        {description}
      </div>
    </>
  )
}

export function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme()
  const handleThemeChange = (value: string) => {
    setTheme(value as Parameters<typeof setTheme>[0])
  }

  return (
    <div>
      <SectionTitle
        title='Theme'
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
        resetAriaLabel='Reset theme preference to default'
      />
      <PreviewRadioGrid
        value={theme}
        onValueChange={handleThemeChange}
        label='Select theme preference'
        descriptionId='theme-description'
        description='Choose between system preference, light mode, or dark mode'
        items={[
          {
            value: 'system',
            label: 'System',
            icon: IconThemeSystem,
          },
          {
            value: 'light',
            label: 'Light',
            icon: IconThemeLight,
          },
          {
            value: 'dark',
            label: 'Dark',
            icon: IconThemeDark,
          },
        ]}
      />
    </div>
  )
}

export function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  const handleVariantChange = (value: string) => {
    setVariant(value as Parameters<typeof setVariant>[0])
  }

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
        resetAriaLabel='Reset sidebar style to default'
      />
      <PreviewRadioGrid
        value={variant}
        onValueChange={handleVariantChange}
        label='Select sidebar style'
        descriptionId='sidebar-description'
        description='Choose between inset, floating, or standard sidebar layout'
        items={[
          {
            value: 'inset',
            label: 'Inset',
            icon: IconSidebarInset,
          },
          {
            value: 'floating',
            label: 'Floating',
            icon: IconSidebarFloating,
          },
          {
            value: 'sidebar',
            label: 'Sidebar',
            icon: IconSidebarSidebar,
          },
        ]}
      />
    </div>
  )
}

export function LayoutConfig() {
  const { open, setOpen } = useSidebar()
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout()
  const radioState = open ? 'default' : collapsible

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Layout'
        showReset={radioState !== 'default'}
        onReset={() => {
          setOpen(true)
          setCollapsible(defaultCollapsible)
        }}
        resetAriaLabel='Reset layout options to default'
      />
      <PreviewRadioGrid
        value={radioState}
        onValueChange={(value) => {
          if (value === 'default') {
            setOpen(true)
            return
          }
          setOpen(false)
          setCollapsible(value as Collapsible)
        }}
        label='Select layout style'
        descriptionId='layout-description'
        description='Choose between default expanded, compact icon-only, or full layout mode'
        items={[
          {
            value: 'default',
            label: 'Default',
            icon: IconLayoutDefault,
          },
          {
            value: 'icon',
            label: 'Compact',
            icon: IconLayoutCompact,
          },
          {
            value: 'offcanvas',
            label: 'Full layout',
            icon: IconLayoutFull,
          },
        ]}
      />
    </div>
  )
}

export function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  const handleDirChange = (value: string) => {
    setDir(value as Parameters<typeof setDir>[0])
  }

  return (
    <div>
      <SectionTitle
        title='Direction'
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
        resetAriaLabel='Reset text direction to default'
      />
      <PreviewRadioGrid
        value={dir}
        onValueChange={handleDirChange}
        label='Select site direction'
        descriptionId='direction-description'
        description='Choose between left-to-right or right-to-left site direction'
        items={[
          {
            value: 'ltr',
            label: 'Left to Right',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='ltr' {...props} />
            ),
          },
          {
            value: 'rtl',
            label: 'Right to Left',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='rtl' {...props} />
            ),
          },
        ]}
      />
    </div>
  )
}
