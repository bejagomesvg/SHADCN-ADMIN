import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'Jan',
    total: 3240,
  },
  {
    name: 'Feb',
    total: 2860,
  },
  {
    name: 'Mar',
    total: 4120,
  },
  {
    name: 'Apr',
    total: 3580,
  },
  {
    name: 'May',
    total: 4970,
  },
  {
    name: 'Jun',
    total: 4380,
  },
  {
    name: 'Jul',
    total: 5290,
  },
  {
    name: 'Aug',
    total: 4710,
  },
  {
    name: 'Sep',
    total: 3920,
  },
  {
    name: 'Oct',
    total: 4460,
  },
  {
    name: 'Nov',
    total: 3710,
  },
  {
    name: 'Dec',
    total: 5840,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
