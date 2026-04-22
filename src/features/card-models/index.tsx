import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'

type PreviewVariant = {
  title: string
  description: string
  sidebar?: 'wide' | 'rail' | 'floating' | 'right' | 'none'
  content:
    | 'analytics'
    | 'cards'
    | 'table'
    | 'kanban'
    | 'calendar'
    | 'chat'
    | 'settings'
    | 'billing'
    | 'login'
    | 'monitoring'
    | 'files'
    | 'commerce'
  tone?: 'neutral' | 'primary' | 'dark'
  compact?: boolean
}

type PreviewPalette = {
  accent: string
  accentMuted: string
  canvas: string
  panel: string
  panelSoft: string
  line: string
  sidebar: string
  sidebarText: string
  stroke: string
}

const adminPreviews: PreviewVariant[] = [
  {
    title: 'Analytics Overview',
    description: 'Sidebar, KPIs e chart',
    sidebar: 'wide',
    content: 'analytics',
    tone: 'primary',
  },
  {
    title: 'Default Dashboard',
    description: 'Metric cards e lista',
    sidebar: 'wide',
    content: 'cards',
  },
  {
    title: 'Compact Dashboard',
    description: 'Menu rail e conteudo denso',
    sidebar: 'rail',
    content: 'analytics',
    compact: true,
  },
  {
    title: 'Full Width',
    description: 'Sem sidebar fixa',
    sidebar: 'none',
    content: 'table',
  },
  {
    title: 'Floating Sidebar',
    description: 'Sidebar destacada',
    sidebar: 'floating',
    content: 'cards',
    tone: 'primary',
  },
  {
    title: 'Right Sidebar',
    description: 'Navegacao a direita',
    sidebar: 'right',
    content: 'analytics',
  },
  {
    title: 'Users Table',
    description: 'Tabela administrativa',
    sidebar: 'wide',
    content: 'table',
  },
  {
    title: 'Dense Table',
    description: 'Tabela compacta',
    sidebar: 'rail',
    content: 'table',
    compact: true,
  },
  {
    title: 'Kanban Board',
    description: 'Pipeline por colunas',
    sidebar: 'wide',
    content: 'kanban',
  },
  {
    title: 'Project Board',
    description: 'Cards de tarefas',
    sidebar: 'floating',
    content: 'kanban',
  },
  {
    title: 'Calendar',
    description: 'Agenda e eventos',
    sidebar: 'wide',
    content: 'calendar',
  },
  {
    title: 'Schedule',
    description: 'Calendario compacto',
    sidebar: 'rail',
    content: 'calendar',
    compact: true,
  },
  {
    title: 'Chat Admin',
    description: 'Lista e conversa',
    sidebar: 'wide',
    content: 'chat',
  },
  {
    title: 'Inbox',
    description: 'Mensagens em painel',
    sidebar: 'none',
    content: 'chat',
  },
  {
    title: 'Settings Page',
    description: 'Formulario e grupos',
    sidebar: 'wide',
    content: 'settings',
  },
  {
    title: 'Settings Split',
    description: 'Tabs laterais',
    sidebar: 'rail',
    content: 'settings',
  },
  {
    title: 'Billing',
    description: 'Planos e faturas',
    sidebar: 'wide',
    content: 'billing',
    tone: 'primary',
  },
  {
    title: 'Finance',
    description: 'Resumo financeiro',
    sidebar: 'floating',
    content: 'billing',
  },
  {
    title: 'Login Split',
    description: 'Auth com preview',
    sidebar: 'none',
    content: 'login',
  },
  {
    title: 'Auth Card',
    description: 'Formulario central',
    sidebar: 'none',
    content: 'login',
    compact: true,
  },
  {
    title: 'Monitoring',
    description: 'Servidores e alertas',
    sidebar: 'wide',
    content: 'monitoring',
    tone: 'dark',
  },
  {
    title: 'Ops Console',
    description: 'Eventos em tempo real',
    sidebar: 'rail',
    content: 'monitoring',
    tone: 'dark',
  },
  {
    title: 'File Manager',
    description: 'Pastas e arquivos',
    sidebar: 'wide',
    content: 'files',
  },
  {
    title: 'Storage',
    description: 'Grade de documentos',
    sidebar: 'floating',
    content: 'files',
  },
  {
    title: 'Ecommerce',
    description: 'Pedidos e receita',
    sidebar: 'wide',
    content: 'commerce',
  },
  {
    title: 'Orders',
    description: 'Catalogo e tabela',
    sidebar: 'right',
    content: 'commerce',
  },
  {
    title: 'CRM',
    description: 'Funil comercial',
    sidebar: 'wide',
    content: 'kanban',
    tone: 'primary',
  },
  {
    title: 'Reports',
    description: 'Charts e indicadores',
    sidebar: 'none',
    content: 'analytics',
    tone: 'primary',
  },
]

function PreviewShell({
  children,
  variant,
}: {
  children: ReactNode
  variant: PreviewVariant
}) {
  const palette = getPreviewPalette(variant)
  const rightSidebar = variant.sidebar === 'right'
  const hasWideSidebar =
    variant.sidebar === 'wide' || variant.sidebar === 'right'
  const hasRail = variant.sidebar === 'rail'
  const hasFloating = variant.sidebar === 'floating'
  const contentX = hasWideSidebar || hasFloating ? 27 : hasRail ? 12 : 7
  const contentW = rightSidebar
    ? 47
    : hasWideSidebar || hasFloating
      ? 47
      : hasRail
        ? 61
        : 66

  return (
    <svg
      viewBox='0 0 80 52'
      role='img'
      aria-label={`${variant.title} preview`}
      className='h-full w-full rounded-md'
    >
      <g transform='translate(5.6 3.64) scale(0.86)'>
        <rect
          x={0.5}
          y={0.5}
          width={79}
          height={51}
          rx={4}
          strokeWidth={0.8}
          className='fill-card stroke-border transition-colors duration-300 group-hover:fill-accent group-hover:stroke-primary/30'
        />
      {hasWideSidebar && !rightSidebar && (
        <Sidebar
          x={5}
          width={17}
          fill={palette.sidebar}
          muted={palette.sidebarText}
        />
      )}
      {hasWideSidebar && rightSidebar && (
        <Sidebar
          x={58}
          width={17}
          fill={palette.sidebar}
          muted={palette.sidebarText}
        />
      )}
      {hasRail && (
        <RailSidebar fill={palette.sidebar} muted={palette.sidebarText} />
      )}
      {hasFloating && (
        <Sidebar
          x={5}
          width={18}
          fill={palette.sidebar}
          muted={palette.sidebarText}
          floating
        />
      )}

      <rect
        x={contentX}
        y={6}
        width={contentW - 12}
        height={3.5}
        rx={1.5}
        fill={palette.line}
        opacity={1}
      />
      <circle
        cx={contentX + contentW - 4}
        cy={7.5}
        r={2.5}
        fill={palette.panel}
      />
      <rect
        x={contentX + contentW - 10}
        y={7.5}
        width={4}
        height={0.8}
        rx={0.4}
        fill={palette.line}
        opacity={0.4}
      />

      <rect
        x={contentX}
        y={variant.compact ? 13 : 14}
        width={variant.compact ? 13 : 18}
        height={3}
        rx={1.2}
        fill={palette.panel}
      />
      {!variant.compact && (
        <rect
          x={contentX}
          y={19}
          width={31}
          height={2.2}
          rx={1.1}
          fill={palette.line}
        />
      )}
      {children}
      </g>
    </svg>
  )
}

function getPreviewPalette(variant: PreviewVariant): PreviewPalette {
  if (variant.tone === 'dark') {
    return {
      accent: 'var(--primary)',
      accentMuted: 'var(--accent)',
      canvas: 'var(--background)',
      panel: 'color-mix(in oklab, var(--muted) 74%, var(--foreground))',
      panelSoft: 'var(--muted)',
      line: 'color-mix(in oklab, var(--border) 70%, var(--foreground))',
      sidebar: 'color-mix(in oklab, var(--primary) 82%, var(--foreground))',
      sidebarText: 'var(--primary-foreground)',
      stroke: 'var(--border)',
    }
  }

  return {
    accent: 'var(--primary)',
    accentMuted: 'var(--accent)',
    canvas: 'var(--background)',
    panel: 'color-mix(in oklab, var(--muted) 68%, var(--foreground))',
    panelSoft: 'var(--muted)',
    line: 'var(--border)',
    sidebar: 'var(--primary)',
    sidebarText: 'var(--primary-foreground)',
    stroke: 'var(--border)',
  }
}

function Sidebar({
  x,
  width,
  fill,
  muted,
  floating = false,
}: {
  x: number
  width: number
  fill: string
  muted: string
  floating?: boolean
}) {
  return (
    <g>
      <g className='transition-all duration-300 group-hover:opacity-100'>
        <rect
          x={x}
          y={floating ? 6 : 1.5}
          width={width}
          height={floating ? 40 : 49}
          rx={2}
          fill={fill}
          opacity={0.85}
        />
        <circle
          cx={x + 4}
          cy={floating ? 11 : 7}
          r={1.8}
          fill={muted}
          opacity={0.8}
        />
        <rect
          x={x + 7.5}
          y={floating ? 10 : 6.5}
          width={width - 11}
          height={2}
          rx={1}
          fill={muted}
          opacity={0.7}
        />
      </g>
      {[0, 1, 2, 3, 4].map((item) => (
        <g
          key={item}
          opacity={item === 0 ? 0.8 : 0.4}
          className={cn(
            'transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-80',
            item === 1 && 'delay-50',
            item === 2 && 'delay-100',
            item === 3 && 'delay-150',
            item === 4 && 'delay-200'
          )}
        >
          <rect
            x={x + 3}
            y={(floating ? 18 : 15) + item * 6}
            width={item === 2 ? width - 8 : width - 6}
            height={1.8}
            rx={0.9}
            fill={muted}
          />
        </g>
      ))}
    </g>
  )
}

function RailSidebar({ fill, muted }: { fill: string; muted: string }) {
  return (
    <g>
      <rect
        x={4}
        y={6}
        width={5}
        height={40}
        rx={2.5}
        fill={fill}
        opacity={0.82}
      />
      {[0, 1, 2, 3, 4].map((item) => (
        <circle
          key={item}
          cx='6.5'
          cy={10 + item * 8}
          r={1}
          fill={muted}
          opacity={0.75}
        />
      ))}
    </g>
  )
}

function Rect({
  x,
  y,
  w,
  h,
  fill = 'currentColor',
  opacity = 1,
  className,
}: {
  x: number
  y: number
  w: number
  h: number
  fill?: string
  opacity?: number
  className?: string
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={1.6}
      fill={fill}
      opacity={opacity}
      className={className}
    />
  )
}

function Dots({
  x,
  y,
  fill = 'currentColor',
}: {
  x: number
  y: number
  fill?: string
}) {
  return (
    <g opacity={0.55}>
      <circle cx={x} cy={y} r={1} fill={fill} />
      <circle cx={x + 4} cy={y} r={1} fill={fill} />
      <circle cx={x + 8} cy={y} r={1} fill={fill} />
    </g>
  )
}

function Bars({
  x,
  y,
  fill = 'currentColor',
}: {
  x: number
  y: number
  fill?: string
}) {
  return (
    <g>
      {[16, 9, 24, 14, 30].map((height, index) => (
        <rect
          key={`${height}-${index}`}
          x={x + index * 4}
          y={y + 30 - height}
          width={2.4}
          height={height}
          rx={1}
          fill={fill}
          opacity={0.3 + index * 0.1}
          className={cn(
            'transition-all duration-500 ease-in-out group-hover:opacity-80',
            index === 0 && 'delay-0',
            index === 1 && 'delay-50',
            index === 2 && 'delay-100',
            index === 3 && 'delay-150',
            index === 4 && 'delay-200'
          )}
        />
      ))}
    </g>
  )
}

function PreviewContent({ variant }: { variant: PreviewVariant }) {
  const palette = getPreviewPalette(variant)
  const x =
    variant.sidebar === 'right'
      ? 8
      : variant.sidebar === 'rail'
        ? 13
        : variant.sidebar === 'none'
          ? 8
          : 28
  const w =
    variant.sidebar === 'right'
      ? 45
      : variant.sidebar === 'rail'
        ? 58
        : variant.sidebar === 'none'
          ? 64
          : 45

  if (variant.content === 'analytics') {
    return (
      <g>
        <g className='transition-all duration-300 group-hover:opacity-90'>
          <Rect
            x={x}
            y={24}
            w={w * 0.3}
            h={8}
            fill={palette.panel}
            className='transition-all group-hover:opacity-80'
          />
          <Rect
            x={x + w * 0.35}
            y={24}
            w={w * 0.3}
            h={8}
            fill={palette.panel}
            className='transition-all delay-75 group-hover:opacity-80'
          />
          <Rect
            x={x + w * 0.7}
            y={24}
            w={w * 0.3}
            h={8}
            fill={palette.panel}
            className='transition-all delay-150 group-hover:opacity-80'
          />
        </g>
        <path
          d={`M ${x} 48 Q ${x + w * 0.25} 35, ${x + w * 0.5} 45 T ${x + w} 35`}
          fill='none'
          stroke={palette.accent}
          strokeWidth={2.2}
          strokeLinecap='round'
          opacity='0.55'
          className='transition-all duration-700 group-hover:opacity-90'
        />
      </g>
    )
  }

  if (variant.content === 'cards') {
    return (
      <g>
        <g className='transition-all duration-300'>
          <Rect
            x={x}
            y={24}
            w={w * 0.45}
            h={11}
            fill={palette.panel}
            className='transition-transform duration-300 group-hover:-translate-y-0.5'
          />
          <Rect
            x={x + w * 0.55}
            y={24}
            w={w * 0.45}
            h={11}
            fill={palette.panelSoft}
            className='transition-transform delay-75 duration-300 group-hover:-translate-y-0.5'
          />
          <Rect
            x={x}
            y={38}
            w={w * 0.45}
            h={11}
            fill={palette.panelSoft}
            className='transition-transform delay-100 duration-300 group-hover:-translate-y-0.5'
          />
          <Rect
            x={x + w * 0.55}
            y={38}
            w={w * 0.45}
            h={11}
            fill={palette.panel}
            className='transition-transform delay-150 duration-300 group-hover:-translate-y-0.5'
          />
        </g>
        <circle
          cx={x + w - 8}
          cy='29.5'
          r={3.5}
          fill={palette.accent}
          opacity={0.65}
          className='transition-all duration-500 group-hover:opacity-90'
        />
      </g>
    )
  }

  if (variant.content === 'table') {
    return (
      <g>
        {[0, 1, 2, 3, 4].map((row) => (
          <g key={row} opacity={row === 0 ? 0.55 : 0.35}>
            <Rect
              x={x}
              y={24 + row * 5.5}
              w={w}
              h={2.2}
              fill={row === 0 ? palette.accent : palette.panel}
              className='transition-all duration-300 group-hover:opacity-80'
            />
            <Rect
              x={x}
              y={26.8 + row * 5.5}
              w={w}
              h={0.6}
              fill={palette.line}
              opacity={0.7}
            />
          </g>
        ))}
      </g>
    )
  }

  if (variant.content === 'kanban') {
    return (
      <g>
        {[0, 1, 2].map((column) => (
          <g key={column}>
            <Rect
              x={x + column * (w / 3 + 1)}
              y={24}
              w={w / 3 - 2}
              h={3}
              opacity={0.5}
              fill={column === 0 ? palette.accent : palette.panel}
              className='transition-all group-hover:opacity-80'
            />
            <Rect
              x={x + column * (w / 3 + 1)}
              y={29}
              w={w / 3 - 2}
              h={6}
              opacity={0.28}
              fill={palette.panel}
              className='transition-transform duration-300 group-hover:-translate-y-0.5'
            />
            <Rect
              x={x + column * (w / 3 + 1)}
              y={37}
              w={w / 3 - 2}
              h={6}
              opacity={0.34}
              fill={palette.panelSoft}
              className='transition-transform delay-75 duration-300 group-hover:-translate-y-0.5'
            />
          </g>
        ))}
      </g>
    )
  }

  if (variant.content === 'calendar') {
    return (
      <g>
        {[0, 1, 2, 3, 4, 5].map((col) =>
          [0, 1, 2].map((row) => (
            <rect
              key={`${col}-${row}`}
              x={x + col * (w / 6.5)}
              y={24 + row * 7}
              width={4.5}
              height={5}
              rx={1}
              fill={col === 2 && row === 1 ? palette.accent : palette.panel}
              opacity={col === 2 && row === 1 ? 0.75 : 0.5}
              className='transition-all duration-300 group-hover:opacity-80'
            />
          ))
        )}
      </g>
    )
  }

  if (variant.content === 'chat') {
    return (
      <g>
        <Rect
          x={x}
          y={24}
          w={w * 0.6}
          h={4}
          fill={palette.accent}
          opacity={0.55}
          className='transition-transform duration-300 group-hover:translate-x-1'
        />
        <Rect
          x={x + w * 0.4}
          y={30}
          w={w * 0.6}
          h={4}
          fill={palette.panel}
          opacity={0.45}
          className='transition-transform duration-300 group-hover:-translate-x-1'
        />
        <Rect
          x={x}
          y={36}
          w={w * 0.5}
          h={4}
          fill={palette.accent}
          opacity={0.45}
          className='transition-transform duration-300 group-hover:translate-x-1'
        />

        <rect
          x={x}
          y={44.5}
          width={w}
          height={4.5}
          rx={1.5}
          fill='none'
          stroke={palette.panel}
          strokeWidth={0.8}
          opacity={0.65}
          className='transition-all group-hover:opacity-90'
        />
      </g>
    )
  }

  if (variant.content === 'settings') {
    return (
      <g>
        <Rect
          x={x}
          y={24}
          w={w * 0.25}
          h={3}
          opacity={0.5}
          fill={palette.accent}
          className='transition-all group-hover:opacity-80'
        />
        <Rect
          x={x}
          y={29}
          w={w * 0.25}
          h={3}
          fill={palette.panel}
          opacity={0.45}
        />
        <Rect
          x={x + w * 0.3}
          y={24}
          w={w * 0.7}
          h={4}
          fill={palette.panel}
          opacity={0.35}
        />
        <Rect
          x={x + w * 0.3}
          y={31}
          w={w * 0.6}
          h={4}
          fill={palette.panel}
          opacity={0.35}
        />
        <Rect
          x={x + w * 0.3}
          y={38}
          w={w * 0.7}
          h={10}
          fill={palette.panelSoft}
          opacity={0.45}
          className='transition-all group-hover:opacity-40'
        />
      </g>
    )
  }

  if (variant.content === 'billing') {
    return (
      <g>
        <Rect
          x={x}
          y={23}
          w={w - 8}
          h={10}
          fill={palette.panelSoft}
          opacity={0.7}
        />
        <Rect
          x={x + 4}
          y={27}
          w={18}
          h={3}
          fill={palette.accent}
          opacity={0.65}
        />
        <Rect x={x} y={37} w={20} h={7} fill={palette.panel} opacity={0.65} />
        <Rect
          x={x + 24}
          y={37}
          w={20}
          h={7}
          fill={palette.panelSoft}
          opacity={0.75}
        />
      </g>
    )
  }

  if (variant.content === 'login') {
    return (
      <g>
        <g opacity='0.3'>
          <rect
            x={x + w * 0.2}
            y={23}
            width={w * 0.6}
            height={23}
            rx={2}
            fill={palette.panel}
          />
        </g>
        <g opacity='0.5'>
          <Rect
            x={x + w * 0.3}
            y={28}
            w={w * 0.4}
            h={2.5}
            fill={palette.panelSoft}
          />
          <Rect
            x={x + w * 0.3}
            y={33}
            w={w * 0.4}
            h={2.5}
            fill={palette.panelSoft}
          />
          <Rect
            x={x + w * 0.35}
            y={39}
            w={w * 0.3}
            h={3}
            fill={palette.accent}
            opacity={0.8}
          />
        </g>
      </g>
    )
  }

  if (variant.content === 'monitoring') {
    return (
      <g>
        <Rect x={x} y={23} w={w} h={5} fill={palette.panel} opacity={0.75} />
        <Rect
          x={x}
          y={31}
          w={w}
          h={5}
          fill={palette.panelSoft}
          opacity={0.85}
        />
        <Rect x={x} y={39} w={w} h={5} fill={palette.accent} opacity={0.45} />
        <Dots x={x + w - 12} y={25.5} fill={palette.line} />
        <Dots x={x + w - 12} y={33.5} fill={palette.line} />
        <Dots x={x + w - 12} y={41.5} fill={palette.line} />
      </g>
    )
  }

  if (variant.content === 'files') {
    return (
      <g>
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <Rect
            key={item}
            x={x + (item % 3) * (w / 3.2)}
            y={24 + Math.floor(item / 3) * 12}
            w={w / 3.8}
            h={9}
            opacity={item === 0 ? 0.5 : 0.28}
            fill={item === 0 ? palette.accent : palette.panel}
            className='transition-all duration-300 group-hover:opacity-75'
          />
        ))}
      </g>
    )
  }

  return (
    <g>
      <g opacity='0.4'>
        <Rect x={x} y={24} w={w * 0.4} h={15} fill={palette.panel} />
        <Rect
          x={x + w * 0.45}
          y={24}
          w={w * 0.55}
          h={15}
          fill={palette.panelSoft}
        />
      </g>
      <Rect x={x} y={42} w={w} h={5} fill={palette.panel} opacity={0.25} />
      <Bars x={x + w - 18} y={16} fill={palette.accent} />
    </g>
  )
}

function AdminPreviewCard({ variant }: { variant: PreviewVariant }) {
  return (
    <Card className='group overflow-hidden rounded-lg border-border/60 bg-card p-0 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg'>
      <CardContent className='p-2.5 pb-3'>
        <div
          className={cn(
            'aspect-video overflow-hidden rounded-md border border-border/70 bg-card transition-colors duration-300 ease-in-out group-hover:border-primary/30 group-hover:bg-accent/40'
          )}
        >
          <PreviewShell variant={variant}>
            <PreviewContent variant={variant} />
          </PreviewShell>
        </div>
        <div className='mt-2.5 flex items-start justify-between gap-3 px-1'>
          <div className='min-w-0'>
            <div className='truncate text-sm leading-none font-semibold'>
              {variant.title}
            </div>
            <div className='mt-1 truncate text-xs leading-tight text-muted-foreground'>
              {variant.description}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CardModels() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ConfigDrawer />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Cards</h2>
            <p className='text-muted-foreground'>
              Uma coleção de previews para usar como referencia visual.
            </p>
          </div>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {adminPreviews.map((variant) => (
            <AdminPreviewCard key={variant.title} variant={variant} />
          ))}
        </div>
      </Main>
    </>
  )
}
