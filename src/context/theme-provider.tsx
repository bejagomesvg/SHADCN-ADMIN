import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import tailwindColors from 'tailwindcss/colors'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

type Theme = 'dark' | 'light' | 'system'
type ResolvedTheme = Exclude<Theme, 'system'>
export type SchemeColor =
  | 'neutral'
  | 'stone'
  | 'zinc'
  | 'slate'
  | 'gray'
  | 'mauve'
  | 'olive'
  | 'mist'
  | 'taupe'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'blue'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
export type CustomColorKey =
  | 'background'
  | 'foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'destructive'
  | 'border'
  | 'input'
  | 'ring'
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5'
  | 'sidebar'
  | 'sidebar-foreground'
  | 'sidebar-primary'
  | 'sidebar-primary-foreground'
  | 'sidebar-accent'
  | 'sidebar-accent-foreground'
  | 'sidebar-border'
  | 'sidebar-ring'
export type CustomColors = Partial<Record<CustomColorKey, string>>

const DEFAULT_THEME = 'system'
const DEFAULT_SCHEME_COLOR: SchemeColor = 'orange'
const THEME_COOKIE_NAME = 'vite-ui-theme'
const SCHEME_COLOR_COOKIE_NAME = 'vite-ui-scheme-color'
const CUSTOM_COLORS_COOKIE_NAME = 'vite-ui-custom-colors'
const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
export const SCHEME_COLOR_OPTIONS: Array<{
  value: SchemeColor
  label: string
  swatch: string
  group: 'neutral' | 'warm' | 'cool'
}> = [
  { value: 'stone', label: 'Stone', swatch: '#78716c', group: 'neutral' },
  { value: 'neutral', label: 'Neutral', swatch: '#737373', group: 'neutral' },
  { value: 'slate', label: 'Slate', swatch: '#64748b', group: 'neutral' },
  { value: 'rose', label: 'Rose', swatch: '#f43f5e', group: 'warm' },
  { value: 'orange', label: 'Orange', swatch: '#f97316', group: 'warm' },
  { value: 'green', label: 'Green', swatch: '#22c55e', group: 'warm' },
  { value: 'amber', label: 'Amber', swatch: '#f59e0b', group: 'warm' },
  { value: 'emerald', label: 'Emerald', swatch: '#10b981', group: 'cool' },
  { value: 'blue', label: 'Blue', swatch: '#3b82f6', group: 'cool' },
  { value: 'fuchsia', label: 'Fuchsia', swatch: '#d946ef', group: 'cool' },
  { value: 'purple', label: 'Purple', swatch: '#a855f7', group: 'cool' },
  { value: 'violet', label: 'Violet', swatch: '#8b5cf6', group: 'cool' },
]

const NEUTRAL_FAMILIES = [
  'neutral',
  'stone',
  'zinc',
  'slate',
  'gray',
  'mauve',
  'olive',
  'mist',
  'taupe',
] as const

const getColorScale = (family: SchemeColor | 'red') =>
  tailwindColors[family] as Record<
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | '950',
    string
  >

const getBaseFamily = (family: SchemeColor) =>
  NEUTRAL_FAMILIES.includes(family as (typeof NEUTRAL_FAMILIES)[number])
    ? family
    : 'zinc'

const buildPalettePreset = (
  family: SchemeColor
): Record<ResolvedTheme, Partial<Record<CustomColorKey, string>>> => {
  const accent = getColorScale(family)
  const base = getColorScale(getBaseFamily(family))
  const destructive = getColorScale('red')
  const info = getColorScale('blue')
  const success = getColorScale('emerald')
  const warning = getColorScale('amber')
  const highlight = getColorScale('rose')

  return {
    light: {
      background: base['50'],
      foreground: base['950'],
      card: base['50'],
      'card-foreground': base['950'],
      popover: base['50'],
      'popover-foreground': base['950'],
      primary: accent['400'],
      'primary-foreground': accent['50'],
      secondary: accent['100'],
      'secondary-foreground': accent['900'],
      accent: accent['100'],
      'accent-foreground': accent['900'],
      muted: base['100'],
      'muted-foreground': base['500'],
      destructive: destructive['600'],
      border: base['200'],
      input: base['200'],
      ring: accent['400'],
      'chart-1': accent['400'],
      'chart-2': success['500'],
      'chart-3': info['500'],
      'chart-4': warning['500'],
      'chart-5': highlight['500'],
      sidebar: base['50'],
      'sidebar-foreground': base['700'],
      'sidebar-primary': accent['400'],
      'sidebar-primary-foreground': accent['50'],
      'sidebar-accent': accent['100'],
      'sidebar-accent-foreground': accent['900'],
      'sidebar-border': base['200'],
      'sidebar-ring': accent['400'],
    },
    dark: {
      background: base['950'],
      foreground: base['50'],
      card: base['900'],
      'card-foreground': base['50'],
      popover: base['900'],
      'popover-foreground': base['50'],
      primary: accent['400'],
      'primary-foreground': accent['950'],
      secondary: base['800'],
      'secondary-foreground': base['100'],
      accent: base['800'],
      'accent-foreground': accent['200'],
      muted: base['800'],
      'muted-foreground': base['400'],
      destructive: destructive['500'],
      border: base['800'],
      input: base['800'],
      ring: accent['500'],
      'chart-1': accent['400'],
      'chart-2': success['400'],
      'chart-3': info['400'],
      'chart-4': warning['400'],
      'chart-5': highlight['400'],
      sidebar: base['900'],
      'sidebar-foreground': base['100'],
      'sidebar-primary': accent['400'],
      'sidebar-primary-foreground': accent['950'],
      'sidebar-accent': base['800'],
      'sidebar-accent-foreground': accent['200'],
      'sidebar-border': base['800'],
      'sidebar-ring': accent['500'],
    },
  }
}

const PRESET_COLOR_KEYS: CustomColorKey[] = [
  'background',
  'foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'accent',
  'accent-foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'muted',
  'muted-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
]

const SCHEME_COLOR_PRESETS: Record<
  SchemeColor,
  Record<ResolvedTheme, Partial<Record<CustomColorKey, string>>>
> = {
  neutral: buildPalettePreset('neutral'),
  stone: buildPalettePreset('stone'),
  zinc: buildPalettePreset('zinc'),
  slate: buildPalettePreset('slate'),
  gray: buildPalettePreset('gray'),
  mauve: buildPalettePreset('mauve'),
  olive: buildPalettePreset('olive'),
  mist: buildPalettePreset('mist'),
  taupe: buildPalettePreset('taupe'),
  red: buildPalettePreset('red'),
  orange: buildPalettePreset('orange'),
  amber: buildPalettePreset('amber'),
  yellow: buildPalettePreset('yellow'),
  lime: buildPalettePreset('lime'),
  green: buildPalettePreset('green'),
  emerald: buildPalettePreset('emerald'),
  teal: buildPalettePreset('teal'),
  cyan: buildPalettePreset('cyan'),
  sky: buildPalettePreset('sky'),
  blue: buildPalettePreset('blue'),
  indigo: buildPalettePreset('indigo'),
  violet: buildPalettePreset('violet'),
  purple: buildPalettePreset('purple'),
  fuchsia: buildPalettePreset('fuchsia'),
  pink: buildPalettePreset('pink'),
  rose: buildPalettePreset('rose'),
}

export const getSchemeColorPreset = (
  schemeColor: SchemeColor,
  resolvedTheme: ResolvedTheme
) => SCHEME_COLOR_PRESETS[schemeColor][resolvedTheme]
const CUSTOM_COLOR_KEYS = PRESET_COLOR_KEYS

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  defaultTheme: Theme
  defaultSchemeColor: SchemeColor
  customColors: CustomColors
  resolvedTheme: ResolvedTheme
  schemeColor: SchemeColor
  theme: Theme
  setCustomColor: (key: CustomColorKey, value: string) => void
  setTheme: (theme: Theme) => void
  setSchemeColor: (schemeColor: SchemeColor) => void
  resetCustomColors: (keys?: CustomColorKey[]) => void
  resetTheme: () => void
}

const initialState: ThemeProviderState = {
  defaultTheme: DEFAULT_THEME,
  defaultSchemeColor: DEFAULT_SCHEME_COLOR,
  customColors: {},
  resolvedTheme: 'light',
  schemeColor: DEFAULT_SCHEME_COLOR,
  setCustomColor: () => null,
  theme: DEFAULT_THEME,
  setTheme: () => null,
  setSchemeColor: () => null,
  resetCustomColors: () => null,
  resetTheme: () => null,
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(
    () => (getCookie(storageKey) as Theme) || defaultTheme
  )
  const [schemeColor, _setSchemeColor] = useState<SchemeColor>(
    () =>
      (getCookie(SCHEME_COLOR_COOKIE_NAME) as SchemeColor) ||
      DEFAULT_SCHEME_COLOR
  )
  const [customColors, _setCustomColors] = useState<CustomColors>(() => {
    const stored = getCookie(CUSTOM_COLORS_COOKIE_NAME)

    if (!stored) return {}

    try {
      return JSON.parse(stored) as CustomColors
    } catch {
      return {}
    }
  })

  const resolvedTheme = useMemo((): ResolvedTheme => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme as ResolvedTheme
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (currentResolvedTheme: ResolvedTheme) => {
      root.classList.remove('light', 'dark') // Remove existing theme classes
      root.classList.add(currentResolvedTheme) // Add the new theme class
    }

    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        applyTheme(systemTheme)
      }
    }

    applyTheme(resolvedTheme)
    root.dataset.schemeColor = schemeColor
    const preset = SCHEME_COLOR_PRESETS[schemeColor][resolvedTheme]
    PRESET_COLOR_KEYS.forEach((key) => {
      root.style.removeProperty(`--${key}`)
    })
    Object.entries(preset).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
    CUSTOM_COLOR_KEYS.forEach((key) => {
      const value = customColors[key]

      if (value) {
        root.style.setProperty(`--${key}`, value)
      } else if (!(key in preset)) {
        root.style.removeProperty(`--${key}`)
      }
    })

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [customColors, schemeColor, theme, resolvedTheme])

  const setTheme = (theme: Theme) => {
    setCookie(storageKey, theme, THEME_COOKIE_MAX_AGE)
    _setTheme(theme)
  }

  const setSchemeColor = (schemeColor: SchemeColor) => {
    setCookie(
      SCHEME_COLOR_COOKIE_NAME,
      schemeColor,
      THEME_COOKIE_MAX_AGE
    )
    _setSchemeColor(schemeColor)
  }

  const setCustomColor = (key: CustomColorKey, value: string) => {
    _setCustomColors((current) => {
      const trimmedValue = value.trim()
      const next = {
        ...current,
        [key]: trimmedValue || undefined,
      }

      const sanitized = Object.fromEntries(
        Object.entries(next).filter(([, entryValue]) => Boolean(entryValue))
      ) as CustomColors

      if (Object.keys(sanitized).length === 0) {
        removeCookie(CUSTOM_COLORS_COOKIE_NAME)
      } else {
        setCookie(
          CUSTOM_COLORS_COOKIE_NAME,
          JSON.stringify(sanitized),
          THEME_COOKIE_MAX_AGE
        )
      }

      return sanitized
    })
  }

  const resetCustomColors = (keys?: CustomColorKey[]) => {
    if (!keys || keys.length === 0) {
      removeCookie(CUSTOM_COLORS_COOKIE_NAME)
      _setCustomColors({})
      return
    }

    _setCustomColors((current) => {
      const next = { ...current }

      keys.forEach((key) => {
        delete next[key]
      })

      if (Object.keys(next).length === 0) {
        removeCookie(CUSTOM_COLORS_COOKIE_NAME)
      } else {
        setCookie(
          CUSTOM_COLORS_COOKIE_NAME,
          JSON.stringify(next),
          THEME_COOKIE_MAX_AGE
        )
      }

      return next
    })
  }

  const resetTheme = () => {
    removeCookie(storageKey)
    removeCookie(SCHEME_COLOR_COOKIE_NAME)
    removeCookie(CUSTOM_COLORS_COOKIE_NAME)
    _setTheme(DEFAULT_THEME)
    _setSchemeColor(DEFAULT_SCHEME_COLOR)
    _setCustomColors({})
  }

  const contextValue = {
    defaultTheme,
    defaultSchemeColor: DEFAULT_SCHEME_COLOR,
    customColors,
    resolvedTheme,
    schemeColor,
    setCustomColor,
    resetTheme,
    resetCustomColors,
    theme,
    setSchemeColor,
    setTheme,
  }

  return (
    <ThemeContext value={contextValue} {...props}>
      {children}
    </ThemeContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
