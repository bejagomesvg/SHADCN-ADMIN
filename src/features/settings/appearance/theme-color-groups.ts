import type { CustomColorKey } from '@/context/theme-types'

export const COLOR_GROUPS = [
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

export type ThemeColorGroup = (typeof COLOR_GROUPS)[number]['value']

export const COLOR_GROUP_VALUES = COLOR_GROUPS.map((group) => group.value) as [
  ThemeColorGroup,
  ...ThemeColorGroup[],
]

export type ThemeColorGroupField = {
  key: CustomColorKey
  label: string
}
