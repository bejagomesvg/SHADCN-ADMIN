import * as React from 'react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

type ContentSectionProps = {
  title: string
  desc: string
  contentClassName?: string
  fixed?: boolean
  children: React.ReactNode
}

export function ContentSection({
  title,
  desc,
  fixed = true,
  contentClassName,
  children,
}: ContentSectionProps) {
  const [isStuck, setIsStuck] = React.useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Se não estiver no modo fixo, apenas encerramos o efeito sem mexer no estado aqui
    if (!fixed) return

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

    return () => {
      observer.disconnect()
      setIsStuck(false) // O reset acontece de forma segura na desmontagem ou mudança de prop
    }
  }, [fixed])

  return (
    <div className='relative flex w-full scroll-mt-16 flex-col'>
      {fixed && (
        <div ref={sentinelRef} className='absolute top-0 h-px w-full' />
      )}
      <div
        className={cn(
          'flex-none px-4 py-3',
          fixed && 'sticky top-12 z-10 md:top-16',
          fixed && isStuck && 'bg-background/20 shadow backdrop-blur-lg'
        )}
      >
        <h3
          className={cn(
            'text-lg font-medium',
            fixed && isStuck && 'text-primary'
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-sm text-muted-foreground',
            fixed && isStuck && 'text-secondary'
          )}
        >
          {desc}
        </p>
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
