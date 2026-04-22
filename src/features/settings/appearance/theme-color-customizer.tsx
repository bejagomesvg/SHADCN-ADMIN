import { useMemo, useState } from 'react'
import tailwindColors from 'tailwindcss/colors'
import { RotateCcw } from 'lucide-react'
import { getSchemeColorPreset, useTheme } from '@/context/theme-provider'
import type { CustomColorKey } from '@/context/theme-types'
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
    id: `${family}-${shade}`,
    label: `${family}-${shade}`,
    value: tailwindColors[family][shade],
  })),
}))

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
    <div className='grid grid-cols-[minmax(110px,1fr)_minmax(0,1.8fr)] items-center gap-3'>
      <label htmlFor={`theme-color-${colorKey}`} className='text-sm'>
        {label}
      </label>
      <Select
        value={selectedColorOption?.id}
        onValueChange={(optionId) => {
          const option = allShadcnOptions.find((item) => item.id === optionId)
          if (option) onChange(option.value)
        }}
      >
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
                  <SelectItem key={option.id} value={option.id}>
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

export function ThemeColorCustomizer() {
  const {
    customColors,
    resetCustomColors,
    resolvedTheme,
    schemeColor,
    setCustomColor,
  } = useTheme()
  const [selectedGroup, setSelectedGroup] =
    useState<(typeof COLOR_GROUPS)[number]['value']>('primary')
  const activeGroup =
    COLOR_GROUPS.find((group) => group.value === selectedGroup) ??
    COLOR_GROUPS[0]
  const palettePreset = useMemo(
    () => getSchemeColorPreset(schemeColor, resolvedTheme),
    [resolvedTheme, schemeColor]
  )
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
    <section className='max-w-xl space-y-4'>
      <div className='space-y-1'>
        <div className='text-sm font-medium'>Group</div>
        <Select
          value={selectedGroup}
          onValueChange={(value) =>
            setSelectedGroup(value as (typeof COLOR_GROUPS)[number]['value'])
          }
        >
          <SelectTrigger className='w-[200px]' aria-label='Select color group'>
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
      <div className='space-y-3 rounded-lg border bg-card p-4 text-card-foreground'>
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
              <RotateCcw className='me-1 size-3' />
              Sync Palette
            </Button>
          )}
        </div>
        <p className='text-sm text-muted-foreground'>
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
    </section>
  )
}
