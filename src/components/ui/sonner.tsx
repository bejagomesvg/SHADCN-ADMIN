import { type CSSProperties } from 'react'
import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      richColors
      className='toaster group [&_div[data-content]]:w-full'
      style={
        {
          '--normal-bg': 'var(--card)',
          '--normal-text': 'var(--card-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'var(--card)',
          '--success-text': 'oklch(0.596 0.145 163.225)',
          '--success-border':
            'color-mix(in oklch, oklch(0.596 0.145 163.225) 24%, var(--border))',
          '--error-bg': 'var(--card)',
          '--error-text': 'var(--destructive)',
          '--error-border': 'color-mix(in oklch, var(--destructive) 28%, var(--border))',
          '--warning-bg': 'var(--card)',
          '--warning-text': 'var(--chart-4)',
          '--warning-border': 'color-mix(in oklch, var(--chart-4) 28%, var(--border))',
          '--info-bg': 'var(--card)',
          '--info-text': 'var(--primary)',
          '--info-border': 'color-mix(in oklch, var(--primary) 24%, var(--border))',
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'border shadow-lg',
          success:
            'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-400',
          error:
            'border-destructive/30 bg-destructive/10 text-destructive',
          warning:
            'border-[color:var(--chart-4)]/30 bg-[color:var(--chart-4)]/10 text-[color:var(--chart-4)]',
          info:
            'border-primary/25 bg-primary/10 text-primary',
          title: 'text-sm font-medium',
          description: 'text-sm text-muted-foreground',
          actionButton:
            'bg-primary text-primary-foreground hover:bg-primary/90',
          cancelButton:
            'bg-muted text-muted-foreground hover:bg-muted/80',
        },
      }}
      {...props}
    />
  )
}
