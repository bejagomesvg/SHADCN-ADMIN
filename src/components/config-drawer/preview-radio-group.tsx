import { type SVGProps } from 'react'
import { Item } from '@radix-ui/react-radio-group'
import { CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export type PreviewRadioItem = {
  value: string
  label: string
  icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
}

export function PreviewRadioGroupItem({ item }: { item: PreviewRadioItem }) {
  return (
    <Item
      value={item.value}
      className='group outline-none transition duration-200 ease-in'
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'relative rounded-[6px] ring-[1px] ring-border',
          'group-data-[state=checked]:ring-primary',
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
          className='fill-muted-foreground stroke-muted-foreground'
          aria-hidden='true'
        />
      </div>
      <div
        className='mt-1 text-center text-xs leading-4 transition-colors group-data-[state=checked]:font-medium group-data-[state=checked]:text-primary'
        id={`${item.value}-description`}
        aria-live='polite'
      >
        {item.label}
      </div>
    </Item>
  )
}
