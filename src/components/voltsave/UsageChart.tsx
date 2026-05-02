import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const USAGE_DATA = [
  { month: 'Jul', current: 320 },
  { month: 'Aug', current: 380 },
  { month: 'Sep', current: 350 },
  { month: 'Oct', current: 290 },
  { month: 'Nov', current: 260 },
  { month: 'Dec', current: 300 },
  { month: 'Jan', current: 340 },
  { month: 'Feb', current: 360 },
  { month: 'Mar', current: 320 },
  { month: 'Apr', current: 280 },
  { month: 'May', current: 310 },
  { month: 'Jun', current: 290 },
];

const COLORS = ['#ef4444', '#3b82f6', '#22c55e'];

const UsageChart = () => {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={USAGE_DATA} barGap={2}>
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            width={35}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`${value} kWh`, 'Usage']}
          />
          <Bar dataKey="current" radius={[3, 3, 0, 0]} maxBarSize={20}>
            {USAGE_DATA.map((_, index) => (
              <Cell key={index} fill={COLORS[index % 3]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
