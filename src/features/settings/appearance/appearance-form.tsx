import { useEffect, useId, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { fonts } from '@/config/fonts'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { IconThemeSystem } from '@/assets/custom/icon-theme-system'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { useFont } from '@/context/font-provider'
import { SCHEME_COLOR_OPTIONS } from '@/context/theme-constants'
import { getSchemeColorPreset, useTheme } from '@/context/theme-provider'
import type { CustomColorKey, SchemeColor } from '@/context/theme-types'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup } from '@/components/ui/radio-group'
import { PreviewRadioGroupItem } from '@/components/config-drawer/preview-radio-group'
import { PalettePreview } from '@/components/config-drawer/scheme-color-config'
import { ThemeColorCustomizer } from './theme-color-customizer'
import { COLOR_GROUPS, COLOR_GROUP_VALUES } from './theme-color-groups'

const appearanceFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  font: z.enum(fonts),
  schemeColor: z.string(),
  group: z.enum(COLOR_GROUP_VALUES),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

const getPalettePageSize = () => {
  if (typeof window === 'undefined') return 7
  if (window.innerWidth >= 1536) return 7
  if (window.innerWidth >= 1280) return 6
  if (window.innerWidth >= 1024) return 5
  if (window.innerWidth >= 768) return 4
  if (window.innerWidth >= 640) return 3
  if (window.innerWidth >= 480) return 2

  return 1
}

const getPaletteStart = (schemeColor: string, pageSize: number) => {
  const selectedIndex = SCHEME_COLOR_OPTIONS.findIndex(
    (option) => option.value === schemeColor
  )
  const safeIndex = selectedIndex >= 0 ? selectedIndex : 0

  return Math.floor(safeIndex / pageSize) * pageSize
}

const themeOptions = [
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
] as const

export function AppearanceForm() {
  const { font, setFont } = useFont()
  const {
    customColors,
    resolvedTheme,
    theme,
    setTheme,
    schemeColor,
    setSchemeColor,
  } = useTheme()
  const themeGroupLabelId = useId()
  const schemeColorGroupLabelId = useId()
  const [palettePageSize, setPalettePageSize] = useState(getPalettePageSize)
  const [paletteStart, setPaletteStart] = useState(() =>
    getPaletteStart(schemeColor, getPalettePageSize())
  )
  const paletteCount = SCHEME_COLOR_OPTIONS.length
  const visiblePaletteOptions = Array.from(
    { length: palettePageSize },
    (_, offset) => SCHEME_COLOR_OPTIONS[(paletteStart + offset) % paletteCount]
  )

  useEffect(() => {
    const handleResize = () => {
      const nextPageSize = getPalettePageSize()

      setPalettePageSize(nextPageSize)
      setPaletteStart(
        (current) => Math.floor(current / nextPageSize) * nextPageSize
      )
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // This can come from your database or API.
  const defaultValues: Partial<AppearanceFormValues> = {
    theme,
    font,
    schemeColor,
    group: 'primary',
  }

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  function onSubmit(data: AppearanceFormValues) {
    if (data.font != font) setFont(data.font)
    if (data.theme != theme) setTheme(data.theme)
    if (data.schemeColor != schemeColor)
      setSchemeColor(data.schemeColor as SchemeColor)

    const palettePreset = getSchemeColorPreset(
      data.schemeColor as SchemeColor,
      resolvedTheme
    )
    const group = [
      Object.fromEntries(
        COLOR_GROUPS.map((colorGroup) => [
          colorGroup.label,
          Object.fromEntries(
            colorGroup.fields.map((field) => {
              const key = field.key as CustomColorKey

              return [
                field.label,
                customColors[key] ?? palettePreset[key] ?? '',
              ]
            })
          ),
        ])
      ),
    ]

    showSubmittedData({
      ...data,
      group,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='font'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font</FormLabel>
              <FormDescription className='font-manrope'>
                Set the font you want to use in the dashboard.
              </FormDescription>
              <FormMessage />
              <div className='relative w-max'>
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-50 appearance-none font-normal capitalize',
                      'dark:bg-background dark:hover:bg-background'
                    )}
                    {...field}
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <ChevronDownIcon className='absolute inset-e-3 top-2.5 h-4 w-4 opacity-50' />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='theme'
          render={({ field }) => (
            <FormItem>
              <div
                id={themeGroupLabelId}
                className='text-sm leading-none font-medium'
              >
                Theme
              </div>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                aria-labelledby={themeGroupLabelId}
                onValueChange={field.onChange}
                value={field.value}
                className='grid w-full max-w-md grid-cols-3 gap-4 pt-2'
              >
                {themeOptions.map((option) => (
                  <PreviewRadioGroupItem key={option.value} item={option} />
                ))}
              </RadioGroup>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='schemeColor'
          render={({ field }) => (
            <FormItem>
              <div
                id={schemeColorGroupLabelId}
                className='text-sm leading-none font-medium'
              >
                Color Scheme
              </div>
              <FormDescription className='font-manrope'>
                Choose the color scheme for the dashboard.
              </FormDescription>
              <FormMessage />
              <div
                className='relative w-full px-10 pt-2'
                role='radiogroup'
                aria-labelledby={schemeColorGroupLabelId}
              >
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='absolute top-1/2 left-0 z-10 size-8 -translate-y-1/2 rounded-full bg-background'
                  aria-label='Previous color palettes'
                  onClick={() =>
                    setPaletteStart(
                      (current) =>
                        (current - palettePageSize + paletteCount) %
                        paletteCount
                    )
                  }
                >
                  <ChevronLeft className='size-4' />
                </Button>
                <div className='grid auto-cols-[156px] grid-flow-col gap-4 pt-3 [&>button]:w-39 [&>button>div:first-child]:h-25 [&>button>div:first-child]:w-39'>
                  {visiblePaletteOptions.map((option) => {
                    const isSelected = option.value === field.value

                    return (
                      <button
                        key={option.value}
                        type='button'
                        role='radio'
                        aria-checked={isSelected}
                        className={cn(
                          'group rounded-[6px] text-start transition duration-200 ease-in outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          isSelected && '[&>div:first-child]:ring-primary'
                        )}
                        onClick={() => field.onChange(option.value)}
                      >
                        <PalettePreview
                          color={option.swatch}
                          selected={isSelected}
                        />
                        <div
                          className='mt-1 text-center text-xs font-medium'
                          style={{ color: option.swatch }}
                        >
                          {option.label}
                        </div>
                      </button>
                    )
                  })}
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='absolute top-1/2 right-0 z-10 size-8 -translate-y-1/2 rounded-full bg-background'
                  aria-label='Next color palettes'
                  onClick={() =>
                    setPaletteStart(
                      (current) => (current + palettePageSize) % paletteCount
                    )
                  }
                >
                  <ChevronRight className='size-4' />
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='group'
          render={({ field }) => (
            <ThemeColorCustomizer
              selectedGroup={field.value}
              onSelectedGroupChange={field.onChange}
            />
          )}
        />

        <Button type='submit'>Update preferences</Button>
      </form>
    </Form>
  )
}
