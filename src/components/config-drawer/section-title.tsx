import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function SectionTitle({
  title,
  showReset = false,
  onReset,
  resetAriaLabel,
  className,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
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
