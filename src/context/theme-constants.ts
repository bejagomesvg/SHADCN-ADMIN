import type { SchemeColor } from './theme-types'

export const SCHEME_COLOR_OPTIONS: Array<{
  value: SchemeColor
  label: string
  swatch: string
  group: 'neutral' | 'warm' | 'cool'
}> = [
  { value: 'red', label: 'Red', swatch: '#f43f5e', group: 'warm' },
  { value: 'orange', label: 'Orange', swatch: '#f97316', group: 'warm' },
  { value: 'yellow', label: 'Yellow', swatch: '#eab308', group: 'warm' },
  { value: 'green', label: 'Green', swatch: '#22c55e', group: 'warm' },
  { value: 'teal', label: 'Teal', swatch: '#14b8a6', group: 'cool' },
  { value: 'mist', label: 'Mist', swatch: '#67e8f9', group: 'cool' },
  { value: 'blue', label: 'Blue', swatch: '#3b82f6', group: 'cool' },
  { value: 'purple', label: 'Purple', swatch: '#a855f7', group: 'cool' },
  { value: 'fuchsia', label: 'Fuchsia', swatch: '#d946ef', group: 'cool' },
  { value: 'pink', label: 'Pink', swatch: '#ec4899', group: 'warm' },
]
