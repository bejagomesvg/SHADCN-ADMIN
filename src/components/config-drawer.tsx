import { type SVGProps, useMemo, useState } from 'react'
import { Root as Radio, Item } from '@radix-ui/react-radio-group'
import { CircleCheck, RotateCcw, Settings } from 'lucide-react'
import tailwindColors from 'tailwindcss/colors'
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
import { cn } from '@/lib/utils'
import { useDirection } from '@/context/direction-provider'
import { type Collapsible, useLayout } from '@/context/layout-provider'
import {
  SCHEME_COLOR_OPTIONS,
  getSchemeColorPreset,
  type CustomColorKey,
  useTheme,
} from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useSidebar } from './ui/sidebar'

function PaletteSwatch({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <span
      className={cn('size-3.5 rounded-full border border-black/10', className)}
      style={{ backgroundColor: color }}
      aria-hidden='true'
    />
  )
}

const SHADCN_COLOR_FAMILIES = [
  'neutral',
  'stone',
  'zinc',
  'slate',
  'gray',
  'mauve',
  'olive',
  'mist',
  'taupe',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const

const SHADCN_SHADE_STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const

const SHADCN_COLOR_OPTIONS_BY_FAMILY = SHADCN_COLOR_FAMILIES.map((family) => ({
  family,
  options: SHADCN_SHADE_STEPS.map((shade) => ({
    label: `${family}-${shade}`,
    value: tailwindColors[family][shade],
  })),
}))

const normalizeCssColor = (value: string) => {
  if (typeof document === 'undefined') return value.trim().toLowerCase()

  const element = document.createElement('span')
  element.style.removeProperty('background-color')
  element.style.setProperty('background-color', value.trim())

  if (!element.style.backgroundColor) return value.trim().toLowerCase()

  document.body.appendChild(element)
  const normalized = window.getComputedStyle(element).backgroundColor
  document.body.removeChild(element)

  return normalized.trim().toLowerCase()
}

const parseRgbChannels = (value: string) => {
  const hexMatch = value.trim().match(/^#([0-9a-f]{6})$/i)
  if (hexMatch) {
    const hex = hexMatch[1]
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    ] as const
  }

  const match = value
    .trim()
    .match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/i)

  if (match) {
    return [Number(match[1]), Number(match[2]), Number(match[3])] as const
  }

  const srgbMatch = value
    .trim()
    .match(
      /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\)$/i
    )

  if (srgbMatch) {
    return [
      Math.round(Number(srgbMatch[1]) * 255),
      Math.round(Number(srgbMatch[2]) * 255),
      Math.round(Number(srgbMatch[3]) * 255),
    ] as const
  }

  return null
}

const getColorDistance = (
  left: readonly [number, number, number],
  right: readonly [number, number, number]
) =>
  Math.sqrt(
    (left[0] - right[0]) ** 2 +
      (left[1] - right[1]) ** 2 +
      (left[2] - right[2]) ** 2
  )

export function ConfigDrawer() {
  const { setOpen } = useSidebar()
  const { resetDir } = useDirection()
  const { resetTheme } = useTheme()
  const { resetLayout } = useLayout()

  const handleReset = () => {
    setOpen(true)
    resetDir()
    resetTheme()
    resetLayout()
  }

  return (
    <Sheet>
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
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className='space-y-6 overflow-y-auto px-4'>
          <ThemeConfig />
          <SidebarConfig />
          <LayoutConfig />
          <DirConfig />
          <SchemeColorConfig />
        </div>
        <SheetFooter className='gap-2'>
          <Button
            variant='destructive'
            onClick={handleReset}
            aria-label='Reset all settings to default values'
          >
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  resetAriaLabel,
  className,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  /** Shown on the small per-section reset (RotateCcw) for accessibility and tests. */
  resetAriaLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          type='button'
          size='icon'
          variant='secondary'
          className='size-4 rounded-full'
          onClick={onReset}
          aria-label={resetAriaLabel}
        >
          <RotateCcw className='size-3' />
        </Button>
      )}
    </div>
  )
}

function RadioGroupItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string
    label: string
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isTheme?: boolean
}) {
  return (
    <Item
      value={item.value}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'relative rounded-[6px] ring-[1px] ring-border',
          'group-data-[state=checked]:shadow-2xl group-data-[state=checked]:ring-primary',
          'group-focus-visible:ring-2'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'size-6 fill-primary stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden='true'
        />
        <item.icon
          className={cn(
            !isTheme &&
              'fill-primary stroke-primary group-data-[state=unchecked]:fill-muted-foreground group-data-[state=unchecked]:stroke-muted-foreground'
          )}
          aria-hidden='true'
        />
      </div>
      <div
        className='mt-1 text-xs'
        id={`${item.value}-description`}
        aria-live='polite'
      >
        {item.label}
      </div>
    </Item>
  )
}

function ThemeConfig() {
  const { defaultTheme, theme, setTheme } = useTheme()
  return (
    <div>
      <SectionTitle
        title='Theme'
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
        resetAriaLabel='Reset theme preference to default'
      />
      <Radio
        value={theme}
        onValueChange={setTheme}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select theme preference'
        aria-describedby='theme-description'
      >
        {[
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
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
      <div id='theme-description' className='sr-only'>
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
        resetAriaLabel='Reset sidebar style to default'
      />
      <Radio
        value={variant}
        onValueChange={setVariant}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select sidebar style'
        aria-describedby='sidebar-description'
      >
        {[
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
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='sidebar-description' className='sr-only'>
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  )
}

const COLOR_GROUPS = [
  {
    value: 'primary',
    label: 'Primary',
    fields: [
      { key: 'primary', label: 'Background' },
      { key: 'primary-foreground', label: 'Foreground' },
    ],
  },
  {
    value: 'secondary',
    label: 'Secondary',
    fields: [
      { key: 'secondary', label: 'Background' },
      { key: 'secondary-foreground', label: 'Foreground' },
    ],
  },
  {
    value: 'accent',
    label: 'Accent',
    fields: [
      { key: 'accent', label: 'Background' },
      { key: 'accent-foreground', label: 'Foreground' },
    ],
  },
  {
    value: 'base',
    label: 'Base',
    fields: [
      { key: 'background', label: 'Background' },
      { key: 'foreground', label: 'Foreground' },
    ],
  },
  {
    value: 'card',
    label: 'Card',
    fields: [
      { key: 'card', label: 'Background' },
      { key: 'card-foreground', label: 'Foreground' },
    ],
  },
  {
    value: 'popover',
    label: 'Popover',
    fields: [
      { key: 'popover', label: 'Background' },
      { key: 'popover-foreground', label: 'Foreground' },
    ],
  },
  {
    value: 'muted',
    label: 'Muted',
    fields: [
      { key: 'muted', label: 'Background' },
      { key: 'muted-foreground', label: 'Foreground' },
    ],
  },
  {
    value: 'destructive',
    label: 'Destructive',
    fields: [{ key: 'destructive', label: 'Background' }],
  },
  {
    value: 'border-input',
    label: 'Border & Input',
    fields: [
      { key: 'border', label: 'Border' },
      { key: 'input', label: 'Input' },
      { key: 'ring', label: 'Ring' },
    ],
  },
  {
    value: 'chart',
    label: 'Chart',
    fields: [
      { key: 'chart-1', label: 'Chart 1' },
      { key: 'chart-2', label: 'Chart 2' },
      { key: 'chart-3', label: 'Chart 3' },
      { key: 'chart-4', label: 'Chart 4' },
      { key: 'chart-5', label: 'Chart 5' },
    ],
  },
  {
    value: 'sidebar',
    label: 'Sidebar',
    fields: [
      { key: 'sidebar', label: 'Background' },
      { key: 'sidebar-foreground', label: 'Foreground' },
      { key: 'sidebar-primary', label: 'Primary' },
      { key: 'sidebar-primary-foreground', label: 'Primary FG' },
      { key: 'sidebar-accent', label: 'Accent' },
      { key: 'sidebar-accent-foreground', label: 'Accent FG' },
      { key: 'sidebar-border', label: 'Border' },
      { key: 'sidebar-ring', label: 'Ring' },
    ],
  },
] as const

function ColorField({
  colorKey,
  label,
  value,
  onChange,
}: {
  colorKey: CustomColorKey
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [search, setSearch] = useState('')
  const normalizedValue = useMemo(() => normalizeCssColor(value), [value])
  const allShadcnOptions = useMemo(
    () => SHADCN_COLOR_OPTIONS_BY_FAMILY.flatMap((group) => group.options),
    []
  )
  const selectedColorOption = useMemo(() => {
    const exactMatch = allShadcnOptions.find(
      (option) => normalizeCssColor(option.value) === normalizedValue
    )

    if (exactMatch) return exactMatch

    const targetRgb = parseRgbChannels(normalizedValue)
    if (!targetRgb) return null

    let closestOption: (typeof allShadcnOptions)[number] | null = null
    let closestDistance = Number.POSITIVE_INFINITY

    allShadcnOptions.forEach((option) => {
      const optionRgb = parseRgbChannels(normalizeCssColor(option.value))
      if (!optionRgb) return

      const distance = getColorDistance(targetRgb, optionRgb)
      if (distance < closestDistance) {
        closestDistance = distance
        closestOption = option
      }
    })

    return closestOption
  }, [allShadcnOptions, normalizedValue])
  const normalizedSearch = search.trim().toLowerCase()
  const filteredGroups = SHADCN_COLOR_OPTIONS_BY_FAMILY.map((group) => ({
    family: group.family,
    options: group.options.filter((option) =>
      normalizedSearch
        ? option.label.toLowerCase().includes(normalizedSearch)
        : true
    ),
  })).filter((group) => group.options.length > 0)

  return (
    <div className='grid grid-cols-[minmax(90px,1fr)_minmax(0,1.6fr)] items-center gap-3'>
      <label
        htmlFor={`theme-color-${colorKey}`}
        className='text-sm text-card-foreground'
      >
        {label}
      </label>
      <Select value={selectedColorOption?.value} onValueChange={onChange}>
        <SelectTrigger
          id={`theme-color-${colorKey}`}
          className='w-full'
          aria-label={`Select ${label.toLowerCase()} color`}
        >
          <span className='flex min-w-0 items-center gap-2'>
            <span
              className='size-4 shrink-0 rounded-md border shadow-xs'
              style={{ backgroundColor: value }}
              aria-hidden='true'
            />
            <span className='truncate'>
              {selectedColorOption?.label ?? 'Select a shadcn color'}
            </span>
          </span>
        </SelectTrigger>
        <SelectContent className='max-h-80'>
          <div className='sticky top-0 z-10 border-b bg-popover p-2'>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder='Search colors...'
              className='h-8'
            />
          </div>
          {filteredGroups.map((group, index) => (
            <div key={group.family}>
              {index > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{group.family}</SelectLabel>
                {group.options.map((option) => (
                  <SelectItem key={option.label} value={option.value}>
                    <span className='flex items-center gap-2'>
                      <span
                        className='size-4 rounded-md border shadow-xs'
                        style={{ backgroundColor: option.value }}
                        aria-hidden='true'
                      />
                      <span>{option.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <div className='px-2 py-3 text-sm text-muted-foreground'>
              No colors found.
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  )
}

function SchemeColorConfig() {
  const {
    customColors,
    defaultSchemeColor,
    resetCustomColors,
    resolvedTheme,
    schemeColor,
    setCustomColor,
    setSchemeColor,
  } = useTheme()
  const [selectedGroup, setSelectedGroup] =
    useState<(typeof COLOR_GROUPS)[number]['value']>('primary')
  const activeGroup = useMemo(
    () =>
      COLOR_GROUPS.find((group) => group.value === selectedGroup) ??
      COLOR_GROUPS[0],
    [selectedGroup]
  )
  const palettePreset = useMemo(
    () => getSchemeColorPreset(schemeColor, resolvedTheme),
    [resolvedTheme, schemeColor]
  )
  const hasCustomColors = Object.keys(customColors).length > 0
  const selectedSchemeOption =
    SCHEME_COLOR_OPTIONS.find((option) => option.value === schemeColor) ??
    SCHEME_COLOR_OPTIONS[0]
  const groupedSchemeOptions = {
    neutral: SCHEME_COLOR_OPTIONS.filter(
      (option) => option.group === 'neutral'
    ),
    warm: SCHEME_COLOR_OPTIONS.filter((option) => option.group === 'warm'),
    cool: SCHEME_COLOR_OPTIONS.filter((option) => option.group === 'cool'),
  }
  const activeGroupKeys = activeGroup.fields.map(
    (field) => field.key as CustomColorKey
  )
  const hasActiveGroupCustomColors = activeGroupKeys.some(
    (key) => customColors[key]
  )

  const getDisplayValue = (key: CustomColorKey) => {
    const customValue = customColors[key]
    if (customValue) return customValue

    return palettePreset[key] ?? ''
  }

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Scheme Color'
        showReset={hasCustomColors || schemeColor !== defaultSchemeColor}
        onReset={() => {
          setSchemeColor(defaultSchemeColor)
          resetCustomColors()
        }}
        resetAriaLabel='Reset scheme color configuration'
      />
      <div className='max-w-md space-y-4'>
        <div className='grid gap-3 sm:grid-cols-2'>
          <div className='space-y-1'>
            <div className='text-xs font-medium tracking-wide text-muted-foreground'>
              Palette
            </div>
            <Select
              value={schemeColor}
              onValueChange={(value) => {
                resetCustomColors()
                setSchemeColor(value as typeof schemeColor)
              }}
            >
              <SelectTrigger
                className='w-full'
                aria-label='Select color palette'
              >
                <span className='flex items-center gap-2'>
                  <PaletteSwatch color={selectedSchemeOption.swatch} />
                  <span>{selectedSchemeOption.label}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Neutral</SelectLabel>
                  {groupedSchemeOptions.neutral.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className='flex items-center gap-2'>
                        <PaletteSwatch color={option.swatch} />
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Warm</SelectLabel>
                  {groupedSchemeOptions.warm.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className='flex items-center gap-2'>
                        <PaletteSwatch color={option.swatch} />
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Cool</SelectLabel>
                  {groupedSchemeOptions.cool.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className='flex items-center gap-2'>
                        <PaletteSwatch color={option.swatch} />
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-1'>
            <div className='text-xs font-medium tracking-wide text-muted-foreground'>
              Group
            </div>
            <Select
              value={selectedGroup}
              onValueChange={(value) =>
                setSelectedGroup(
                  value as (typeof COLOR_GROUPS)[number]['value']
                )
              }
            >
              <SelectTrigger className='w-full' aria-label='Select color group'>
                <SelectValue placeholder='Select a color group' />
              </SelectTrigger>
              <SelectContent>
                {COLOR_GROUPS.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='space-y-3 rounded-lg border bg-card p-3 text-card-foreground'>
          <div className='flex items-center justify-between gap-3'>
            <div className='text-xs font-medium tracking-wide text-muted-foreground'>
              Editing <span className='uppercase'>{activeGroup.label}</span>{' '}
              group in
              <span className='ms-2 rounded bg-accent px-2 py-0.5 uppercase'>
                {resolvedTheme}
              </span>{' '}
              theme
            </div>
            {hasActiveGroupCustomColors && (
              <Button
                type='button'
                size='sm'
                variant='ghost'
                className='h-7 px-2 text-xs text-card-foreground hover:bg-accent hover:text-accent-foreground'
                onClick={() => resetCustomColors(activeGroupKeys)}
              >
                Sync Palette
              </Button>
            )}
          </div>
          <p className='text-xs text-muted-foreground'>
            Editing applies fine adjustments on top of the selected palette.
          </p>
          <div className='space-y-3'>
            {activeGroup.fields.map((field) => (
              <ColorField
                key={field.key}
                colorKey={field.key as CustomColorKey}
                label={field.label}
                value={getDisplayValue(field.key as CustomColorKey)}
                onChange={(value) =>
                  setCustomColor(field.key as CustomColorKey, value)
                }
              />
            ))}
          </div>
        </div>
      </div>
      <div id='scheme-color-description' className='sr-only'>
        Select a color group and edit the CSS variables used by the interface
      </div>
    </div>
  )
}

function LayoutConfig() {
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
      <Radio
        value={radioState}
        onValueChange={(v) => {
          if (v === 'default') {
            setOpen(true)
            return
          }
          setOpen(false)
          setCollapsible(v as Collapsible)
        }}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select layout style'
        aria-describedby='layout-description'
      >
        {[
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
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='layout-description' className='sr-only'>
        Choose between default expanded, compact icon-only, or full layout mode
      </div>
    </div>
  )
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  return (
    <div>
      <SectionTitle
        title='Direction'
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
        resetAriaLabel='Reset text direction to default'
      />
      <Radio
        value={dir}
        onValueChange={setDir}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select site direction'
        aria-describedby='direction-description'
      >
        {[
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
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
      <div id='direction-description' className='sr-only'>
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  )
}
