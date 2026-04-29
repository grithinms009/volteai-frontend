import { motion } from 'framer-motion';
import { FileText, Users, Coins, Database, Lock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const chartData = [
  { month: 'Aug', value: 100 },
  { month: 'Sep', value: 150 },
  { month: 'Oct', value: 120 },
  { month: 'Nov', value: 200 },
  { month: 'Dec', value: 280 },
  { month: 'Jan', value: 320 },
  { month: 'Feb', value: 290 },
  { month: 'Mar', value: 340 },
  { month: 'Apr', value: 380 },
  { month: 'May', value: 360 },
  { month: 'Jun', value: 400 },
];

const stats = [
  { icon: FileText, value: '10,000+', label: 'Bills analyzed' },
  { icon: Coins, value: '₹25L+', label: 'Saved by users' },
  { icon: Database, value: '150+', label: 'Utility providers' },
  { icon: Lock, value: '100%', label: 'Data encrypted' },
];

export default function ResultsPreview() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Dashboard Preview
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            See what you'll get
          </h2>
        </motion.div>

        {/* Preview Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-6 sm:p-8 mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Efficiency Score Gauge */}
            <div className="glass-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-sm text-foreground/60 mb-4">Efficiency Score</h3>
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${68 * 2.83} ${283}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">68</span>
                  <span className="text-sm text-foreground/60">/100</span>
                </div>
              </div>
            </div>

            {/* Monthly Savings Card */}
            <div className="glass-card p-6 flex flex-col justify-center">
              <h3 className="text-sm text-foreground/60 mb-2">Monthly Savings</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-accent">₹1,800</span>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">23% reduction possible</span>
              </div>
            </div>

            {/* Usage Trend Chart */}
            <div className="glass-card p-6">
              <h3 className="text-sm text-foreground/60 mb-4">Usage Trend</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-card px-6 py-3 flex items-center gap-3"
            >
              <stat.icon className="w-5 h-5 text-primary" />
              <span className="font-semibold text-white">{stat.value}</span>
              <span className="text-sm text-foreground/60">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
