import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

type ContentSectionProps = {
  title: string
  desc: string
  contentClassName?: string
  children: React.JSX.Element
}

export function ContentSection({
  title,
  desc,
  contentClassName,
  children,
}: ContentSectionProps) {
  return (
    <div className='flex w-full flex-col'>
      <div className='flex-none'>
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{desc}</p>
      </div>
      <Separator className='my-4 flex-none' />
      <div className='w-full scroll-smooth pe-4'>
        <div className={cn('-mx-1 px-1.5 lg:max-w-xl', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}
