import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'Mon',
    clicks: 420,
    uniques: 310,
  },
  {
    name: 'Tue',
    clicks: 610,
    uniques: 455,
  },
  {
    name: 'Wed',
    clicks: 540,
    uniques: 390,
  },
  {
    name: 'Thu',
    clicks: 780,
    uniques: 565,
  },
  {
    name: 'Fri',
    clicks: 690,
    uniques: 510,
  },
  {
    name: 'Sat',
    clicks: 360,
    uniques: 255,
  },
  {
    name: 'Sun',
    clicks: 480,
    uniques: 335,
  },
]

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Area
          type='monotone'
          dataKey='clicks'
          stroke='currentColor'
          className='text-primary'
          fill='currentColor'
          fillOpacity={0.15}
          isAnimationActive={false}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          stroke='currentColor'
          className='text-muted-foreground'
          fill='currentColor'
          fillOpacity={0.1}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
