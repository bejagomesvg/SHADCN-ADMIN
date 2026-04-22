import { useState } from 'react'
import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SCHEME_COLOR_OPTIONS } from '@/context/theme-constants'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import { SectionTitle } from './section-title'

const PALETTE_PAGE_SIZE = 3

const getPaletteStart = (schemeColor: string) => {
  const selectedIndex = SCHEME_COLOR_OPTIONS.findIndex(
    (option) => option.value === schemeColor
  )
  const safeIndex = selectedIndex >= 0 ? selectedIndex : 0

  return Math.floor(safeIndex / PALETTE_PAGE_SIZE) * PALETTE_PAGE_SIZE
}

function PalettePreview({
  color,
  selected,
}: {
  color: string
  selected: boolean
}) {
  return (
    <div
      className={cn(
        'relative h-16 overflow-visible rounded-[6px] ring-1 ring-border transition duration-200 ease-in',
        selected && 'shadow-2xl ring-primary'
      )}
    >
      <CircleCheck
        className={cn(
          'absolute top-0 right-0 z-10 size-6 translate-x-1/2 -translate-y-1/2 fill-primary stroke-white',
          !selected && 'hidden'
        )}
        aria-hidden='true'
      />
      <div className='flex h-full gap-1 overflow-hidden rounded-[6px] bg-card p-1.5'>
        <div
          className='flex w-6 shrink-0 flex-col gap-1 rounded-sm p-1'
          style={{ backgroundColor: color }}
        >
          <span className='size-1.5 rounded-full bg-white/85' />
          <span className='h-1 rounded-full bg-white/70' />
          <span className='h-1 rounded-full bg-white/60' />
          <span className='h-1 rounded-full bg-white/50' />
        </div>
        <div className='flex min-w-0 flex-1 flex-col gap-1 py-0.5'>
          <div className='flex items-center gap-1.5'>
            <span
              className='h-1.5 w-10 rounded-full'
              style={{ backgroundColor: color, opacity: 0.55 }}
            />
            <span
              className='ms-auto size-3 rounded-full'
              style={{ backgroundColor: color, opacity: 0.5 }}
            />
          </div>
          <span className='h-1.5 w-8 rounded-full bg-muted-foreground/15' />
          <div className='mt-auto grid grid-cols-3 items-end gap-1'>
            <span
              className='h-2 rounded-sm'
              style={{ backgroundColor: color, opacity: 0.35 }}
            />
            <span
              className='h-3.5 rounded-sm'
              style={{ backgroundColor: color, opacity: 0.45 }}
            />
            <span
              className='h-5 rounded-sm'
              style={{ backgroundColor: color, opacity: 0.6 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SchemeColorConfig() {
  const {
    customColors,
    defaultSchemeColor,
    resetCustomColors,
    schemeColor,
    setSchemeColor,
  } = useTheme()
  const [paletteStart, setPaletteStart] = useState(() =>
    getPaletteStart(schemeColor)
  )
  const paletteCount = SCHEME_COLOR_OPTIONS.length
  const visiblePaletteOptions = Array.from(
    { length: PALETTE_PAGE_SIZE },
    (_, offset) => SCHEME_COLOR_OPTIONS[(paletteStart + offset) % paletteCount]
  )
  const hasCustomColors = Object.keys(customColors).length > 0

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Color'
        showReset={hasCustomColors || schemeColor !== defaultSchemeColor}
        onReset={() => {
          setSchemeColor(defaultSchemeColor)
          setPaletteStart(getPaletteStart(defaultSchemeColor))
          resetCustomColors()
        }}
        resetAriaLabel='Reset scheme color configuration'
      />
      <div className='max-w-md space-y-4'>
        <div className='space-y-1'>
          <div className='relative' aria-label='Select color palette'>
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='absolute top-1/2 -left-4 z-10 size-8 -translate-y-1/2 rounded-full bg-background shadow-sm'
              aria-label='Previous color palettes'
              onClick={() =>
                setPaletteStart(
                  (current) =>
                    (current - PALETTE_PAGE_SIZE + paletteCount) % paletteCount
                )
              }
            >
              <ChevronLeft className='size-4' />
            </Button>
            <div className='grid grid-cols-3 gap-4'>
              {visiblePaletteOptions.map((option) => {
                const isSelected = option.value === schemeColor

                return (
                  <button
                    key={option.value}
                    type='button'
                    className='group rounded-[6px] text-start transition duration-200 ease-in outline-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                    onClick={() => {
                      resetCustomColors()
                      setSchemeColor(option.value)
                    }}
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
              className='absolute top-1/2 -right-4 z-10 size-8 -translate-y-1/2 rounded-full bg-background shadow-sm'
              aria-label='Next color palettes'
              onClick={() =>
                setPaletteStart(
                  (current) => (current + PALETTE_PAGE_SIZE) % paletteCount
                )
              }
            >
              <ChevronRight className='size-4' />
            </Button>
          </div>
        </div>
      </div>
      <div id='scheme-color-description' className='sr-only'>
        Select the color palette used by the interface
      </div>
    </div>
  )
}
