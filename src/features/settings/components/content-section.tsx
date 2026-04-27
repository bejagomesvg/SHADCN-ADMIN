import * as React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

type ContentSectionProps = {
  title: string
  desc: string
  contentClassName?: string
  children: React.ReactNode
}

export function ContentSection({
  title,
  desc,
  contentClassName,
  children,
}: ContentSectionProps) {
  const [isStuck, setIsStuck] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Verifica se é desktop para alinhar o rootMargin com md:top-16 (64px) ou top-12 (48px)
    const isDesktop = window.matchMedia('(min-width: 768px)').matches
    const offset = isDesktop ? '64px' : '48px'

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Se o sentinela não estiver intersectando, significa que rolamos a página
        // e o cabeçalho atingiu a posição sticky
        setIsStuck(!entry.isIntersecting)
      },
      {
        // rootMargin dinâmico para compensar a altura exata da navbar
        rootMargin: `-${offset} 0px 0px 0px`,
        threshold: [0],
      }
    )

    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className='relative flex w-full scroll-mt-16 flex-col'>
      <div ref={sentinelRef} className='absolute top-0 h-px w-full' />
      <div
        className={cn(
          'sticky top-12 z-10 flex-none pb-3 transition-all duration-200 md:top-16',
          isStuck && 'bg-background/20 shadow backdrop-blur-lg'
        )}
      >
        <h3 className='text-lg font-medium'>{title}</h3>
        <p className='text-sm text-muted-foreground'>{desc}</p>
      </div>
      <Separator />
      <div className='w-full scroll-smooth pe-4 pt-4'>
        <div className={cn('-mx-1 px-1.5 lg:max-w-xl', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}
