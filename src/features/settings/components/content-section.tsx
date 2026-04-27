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
  const [stuckStyle, setStuckStyle] = React.useState<React.CSSProperties>({})
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isStuckRef = React.useRef(false)

  const getSidebarInset = React.useCallback((): Element | null => {
    let el: Element | null = containerRef.current
    while (el && el.getAttribute('data-slot') !== 'sidebar-inset') {
      el = el.parentElement
    }
    return el
  }, [])

  const computeStuckStyle = React.useCallback(() => {
    if (!containerRef.current) return
    const inset = getSidebarInset()
    if (!inset) return

    const insetRect = inset.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    const offsetLeft = containerRect.left - insetRect.left

    setStuckStyle({
      marginInlineStart: `-${offsetLeft}px`,
      width: `${insetRect.width}px`,
      paddingInline: `${offsetLeft}px`,
    })
  }, [getSidebarInset])

  React.useEffect(() => {
    if (!fixed) return

    const mq = window.matchMedia('(min-width: 768px)')

    const createObserver = () => {
      const offset = mq.matches ? '64px' : '48px'

      const observer = new IntersectionObserver(
        ([entry]) => {
          const stuck = !entry.isIntersecting
          isStuckRef.current = stuck
          setIsStuck(stuck)
          if (stuck) computeStuckStyle()
          else setStuckStyle({})
        },
        { rootMargin: `-${offset} 0px 0px 0px`, threshold: [0] }
      )

      if (sentinelRef.current) observer.observe(sentinelRef.current)
      return observer
    }

    let observer = createObserver()

    const onBreakpoint = () => {
      observer.disconnect()
      observer = createObserver()
    }

    mq.addEventListener('change', onBreakpoint)

    const resizeObserver = new ResizeObserver(() => {
      if (isStuckRef.current) computeStuckStyle()
    })

    const inset = getSidebarInset()
    if (inset) {
      resizeObserver.observe(inset)
    } else {
      resizeObserver.observe(document.documentElement)
    }

    return () => {
      observer.disconnect()
      mq.removeEventListener('change', onBreakpoint)
      resizeObserver.disconnect()
      isStuckRef.current = false
      setIsStuck(false)
      setStuckStyle({})
    }
  }, [fixed, computeStuckStyle, getSidebarInset])

  return (
    <div ref={containerRef} className='relative flex w-full scroll-mt-16 flex-col'>
      {fixed && (
        <div ref={sentinelRef} className='absolute top-0 h-px w-full' />
      )}
      <div
        ref={headerRef}
        style={fixed && isStuck ? stuckStyle : undefined}
        className={cn(
          'flex-none py-3',
          fixed && 'sticky top-12 z-10 md:top-16',
          fixed && isStuck && 'bg-background/80 shadow backdrop-blur supports-backdrop-filter:bg-background/60'
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
            fixed && isStuck && 'text-accent-foreground'
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
