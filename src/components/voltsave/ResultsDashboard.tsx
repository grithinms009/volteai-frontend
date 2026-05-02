import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Lock, TrendingDown, AlertTriangle, Share2, Download, 
  Zap, Info, ChevronRight, DollarSign, BarChart3, Clock, Cpu,
  Flame, Droplets, Wind, WashingMachine, CheckCircle, XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { API_BASE } from '@/hooks/useApi';

interface AnalysisResult {
  effectiveRate: number;
  effectiveRateCurrency: string;
  rateVsRegionAvg: number;
  rateStatus: 'above_average' | 'average' | 'below_average';
  usageIntensity: string;
  efficiencyScore: number;
  monthlySavingsEstimate: number;
  annualSavingsEstimate: number;
  potentialSavingsPct: number;
  currentBill?: number;
  optimizedBill?: number;
  peakWasteHours?: number;
  topIssues: Array<{ title: string; description: string; severity: 'high' | 'medium' | 'low' }>;
  recommendations: Array<{ text: string; icon?: string } | string>;
  highConsumptionDevices?: Array<{ name: string; kwh: number; percentage: number }>;
  monthlyUsage?: Array<{ month: string; current: number; optimized?: number }>;
  tariffModel: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  paid?: boolean;
}

interface ResultsDashboardProps {
  result: AnalysisResult;
  billId: string | null;
  onUnlock: () => void;
}

const DEVICE_ICONS: Record<string, React.ElementType> = {
  'Air Conditioner': Wind,
  'Water Heater': Flame,
  'Refrigerator': Droplets,
  'Washing Machine': WashingMachine,
};

// Heat map data (simulated weekly pattern)
const HEAT_MAP_DATA = [
  { day: 'Mon', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,3,4,5,5,4,3,2,1,1] },
  { day: 'Tue', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,3,4,5,5,4,3,2,1,1] },
  { day: 'Wed', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,3,4,4,5,4,3,2,1,1] },
  { day: 'Thu', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,3,4,5,5,4,3,2,1,1] },
  { day: 'Fri', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,4,4,5,5,4,3,2,1,1] },
  { day: 'Sat', hours: [1,1,1,1,1,1,1,2,2,3,3,3,3,3,3,3,4,4,4,3,2,2,1,1] },
  { day: 'Sun', hours: [1,1,1,1,1,1,1,2,2,3,3,3,3,3,3,3,3,4,4,3,2,2,1,1] },
];

const HEAT_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

export default function ResultsDashboard({ result, billId, onUnlock }: ResultsDashboardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const isPaid = result.paid || false;

  // Animate efficiency score
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = result.efficiencyScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= result.efficiencyScore) {
        setAnimatedScore(result.efficiencyScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.efficiencyScore]);

  const currentBill = result.currentBill || Math.round(result.monthlySavingsEstimate * 100 / result.potentialSavingsPct);
  const optimizedBill = result.optimizedBill || (currentBill - result.monthlySavingsEstimate);
  const peakWasteHours = result.peakWasteHours || 4.2;

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-red-500';
    if (score < 70) return 'text-orange-400';
    return 'text-cyan-400';
  };

  const getScoreStroke = (score: number) => {
    if (score < 40) return '#ef4444';
    if (score < 70) return '#f97316';
    return '#22d3ee';
  };

  const handleDownload = async () => {
    if (!billId || billId === 'demo') {
      toast.info('Download available for real bills only');
      return;
    }
    
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/reports/${billId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voltsave-report-${billId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Report downloaded!');
    } catch (err) {
      toast.error('Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My VoltSave AI Report',
        text: `I could save ₹${result.monthlySavingsEstimate}/month on my electricity bill!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const monthlyUsage = result.monthlyUsage || [
    { month: 'Jul', current: 320 }, { month: 'Aug', current: 380 }, { month: 'Sep', current: 350 },
    { month: 'Oct', current: 290 }, { month: 'Nov', current: 260 }, { month: 'Dec', current: 300 },
    { month: 'Jan', current: 340 }, { month: 'Feb', current: 360 }, { month: 'Mar', current: 320 },
    { month: 'Apr', current: 280 }, { month: 'May', current: 310 }, { month: 'Jun', current: 290 },
  ];

  const highConsumptionDevices = result.highConsumptionDevices || [
    { name: 'Air Conditioner', kwh: 180, percentage: 38 },
    { name: 'Water Heater', kwh: 95, percentage: 20 },
    { name: 'Refrigerator', kwh: 72, percentage: 15 },
    { name: 'Washing Machine', kwh: 45, percentage: 9 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-10 sm:mb-14">
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-5"
        >
          <CheckCircle2 className="w-4 h-4" />
          Analysis Complete
        </motion.span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
          Your Energy Report
        </h1>
        <span className={`
          inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium
          ${result.confidenceLevel === 'high' 
            ? 'bg-accent/20 text-accent' 
            : 'bg-primary/20 text-primary'
          }
        `}>
          <Info className="w-3.5 h-3.5" />
          {result.confidenceLevel === 'high' ? 'High Confidence Analysis' : 'Estimated Analysis'}
        </span>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
        {/* Monthly Savings */}
        <div className="glass-card p-5 sm:p-6 text-center group hover:border-accent/30 transition-all duration-300">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent">₹{result.monthlySavingsEstimate.toLocaleString()}</p>
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-foreground/50 mt-2">Monthly Savings</p>
        </div>

        {/* Reduction */}
        <div className="glass-card p-5 sm:p-6 text-center group hover:border-accent/30 transition-all duration-300">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent">{result.potentialSavingsPct}%</p>
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-foreground/50 mt-2">Reduction</p>
        </div>

        {/* Efficiency */}
        <div className="glass-card p-5 sm:p-6 text-center group hover:border-primary/30 transition-all duration-300">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{result.efficiencyScore}/100</p>
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-foreground/50 mt-2">Efficiency</p>
        </div>

        {/* Peak Waste */}
        <div className="glass-card p-5 sm:p-6 text-center group hover:border-red-500/30 transition-all duration-300">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
          </div>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-400">{peakWasteHours} hrs</p>
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-foreground/50 mt-2">Peak Waste</p>
        </div>
      </motion.div>

      {/* Current vs Optimized */}
      <motion.div variants={itemVariants} className="glass-card p-6 sm:p-8 mb-8 sm:mb-10">
        <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-6 sm:mb-8">
          Current vs Optimized
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {/* Current Bar */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 sm:h-48 w-20 sm:w-24 flex items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t-lg"
              />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-red-400 mt-4">₹{currentBill.toLocaleString()}</p>
            <p className="text-xs text-foreground/50 mt-1">Current</p>
          </div>

          {/* Optimized Bar */}
          <div className="flex flex-col items-center">
            <div className="relative h-40 sm:h-48 w-20 sm:w-24 flex items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(optimizedBill / currentBill) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg"
              />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-400 mt-4">₹{optimizedBill.toLocaleString()}</p>
            <p className="text-xs text-foreground/50 mt-1">Optimized</p>
          </div>

          {/* Savings */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.8 }}
              className="flex items-center gap-2"
            >
              <TrendingDown className="w-6 h-6 text-green-400" />
              <span className="text-2xl sm:text-3xl font-bold text-green-400">₹{result.monthlySavingsEstimate.toLocaleString()}</span>
            </motion.div>
            <p className="text-xs text-foreground/50 mt-2">Saved / mo</p>
          </div>
        </div>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
        {/* Monthly Usage Chart */}
        <div className="glass-card p-6 sm:p-8">
          <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-6">
            Monthly Usage (kWh)
          </h3>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUsage} barGap={2}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--foreground) / 0.5)', fontSize: 11 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--foreground) / 0.5)', fontSize: 11 }}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="current" radius={[4, 4, 0, 0]} maxBarSize={24}>
                  {monthlyUsage.map((_, index) => (
                    <Cell key={index} fill={index % 3 === 0 ? '#ef4444' : index % 3 === 1 ? '#3b82f6' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Heat Map */}
        <div className="glass-card p-6 sm:p-8">
          <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-6">
            Energy Heat Map
          </h3>
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              {/* Time labels */}
              <div className="flex mb-2 pl-10">
                {['0:00', '6:00', '12:00', '18:00', ''].map((time, i) => (
                  <span key={i} className="flex-1 text-[10px] text-foreground/40">{time}</span>
                ))}
              </div>
              
              {/* Heat map grid */}
              {HEAT_MAP_DATA.map((row, rowIndex) => (
                <div key={row.day} className="flex items-center gap-1 mb-1">
                  <span className="w-8 text-[10px] text-foreground/50 shrink-0">{row.day}</span>
                  <div className="flex gap-[2px] flex-1">
                    {row.hours.map((value, colIndex) => (
                      <motion.div
                        key={colIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (rowIndex * 24 + colIndex) * 0.005 }}
                        className="flex-1 h-5 sm:h-6 rounded-sm"
                        style={{ backgroundColor: HEAT_COLORS[value - 1] }}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-[10px] text-foreground/50">Low</span>
                <div className="flex gap-1">
                  {HEAT_COLORS.map((color, i) => (
                    <div key={i} className="w-5 h-3 rounded-sm" style={{ backgroundColor: color }} />
                  ))}
                </div>
                <span className="text-[10px] text-foreground/50">High</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
        {/* Top Waste Reasons */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
              Top Waste Reasons
            </h3>
          </div>
          <div className="space-y-4">
            {result.topIssues.slice(0, 3).map((issue, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  issue.severity === 'high' ? 'bg-red-500' : issue.severity === 'medium' ? 'bg-orange-400' : 'bg-blue-400'
                }`} />
                <p className="text-sm text-foreground/80">{issue.title}</p>
              </motion.div>
            ))}
            {!isPaid && result.topIssues.length > 3 && (
              <div className="flex items-center gap-2 text-foreground/40 text-sm pt-2">
                <Lock className="w-3.5 h-3.5" />
                <span>+{result.topIssues.length - 3} more in full report</span>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-4 h-4 text-accent" />
            <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
              Recommendations
            </h3>
          </div>
          <div className="space-y-4">
            {result.recommendations.slice(0, 2).map((rec, index) => {
              const recText = typeof rec === 'string' ? rec : rec.text;
              const recIcon = typeof rec === 'string' ? '💡' : (rec.icon || '💡');
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-base shrink-0">{recIcon}</span>
                  <p className="text-sm text-foreground/80">{recText}</p>
                </motion.div>
              );
            })}
            {!isPaid && result.recommendations.length > 2 && (
              <div className="flex items-center gap-2 text-foreground/40 text-sm pt-2">
                <Lock className="w-3.5 h-3.5" />
                <span>+{result.recommendations.length - 2} strategies in full report</span>
              </div>
            )}
          </div>
        </div>

        {/* Efficiency Score Gauge */}
        <div className="glass-card p-6 sm:p-8 flex flex-col items-center justify-center">
          <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-6 self-start">
            Efficiency Score
          </h3>
          <div className="relative w-36 h-36 sm:w-44 sm:h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle 
                cx="50" cy="50" r="42" 
                fill="none" 
                stroke="hsl(var(--muted))" 
                strokeWidth="8" 
              />
              {/* Progress circle */}
              <motion.circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={getScoreStroke(result.efficiencyScore)}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 264" }}
                animate={{ strokeDasharray: `${result.efficiencyScore * 2.64} 264` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ filter: `drop-shadow(0 0 8px ${getScoreStroke(result.efficiencyScore)}40)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl sm:text-5xl font-bold ${getScoreColor(result.efficiencyScore)}`}>
                {animatedScore}
              </span>
              <span className="text-sm text-foreground/50">/ 100</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* High Consumption Devices */}
      <motion.div variants={itemVariants} className="glass-card p-6 sm:p-8 mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-6">
          <Cpu className="w-4 h-4 text-primary" />
          <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
            High-Consumption Devices
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highConsumptionDevices.map((device, index) => {
            const DeviceIcon = DEVICE_ICONS[device.name] || Zap;
            return (
              <motion.div
                key={device.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="glass-card p-5 text-center hover:border-primary/30 transition-all"
              >
                <DeviceIcon className="w-6 h-6 text-foreground/40 mx-auto mb-3" />
                <p className="text-xs text-foreground/60 mb-1">{device.name}</p>
                <p className="text-xl sm:text-2xl font-bold text-red-400">{device.kwh} kWh</p>
                <p className="text-[10px] text-foreground/40 mt-1">{device.percentage}% of total</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Premium Unlock CTA */}
      {!isPaid && (
        <motion.div
          variants={itemVariants}
          className="glass-card p-8 sm:p-10 text-center gradient-mesh relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{ 
              background: [
                'radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, hsl(var(--primary)) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <Lock className="w-14 h-14 text-primary mx-auto mb-5 relative z-10" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 relative z-10">
            Unlock Your Full Report
          </h3>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto relative z-10">
            See all {result.topIssues.length} issues, {result.recommendations.length} savings strategies, 
            detailed appliance breakdown, and download your personalized PDF report.
          </p>
          <Button
            onClick={onUnlock}
            size="lg"
            className="gradient-cta text-white px-10 py-6 text-base font-semibold relative z-10 shadow-lg shadow-primary/20"
          >
            Unlock Full Report — ₹199
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-sm text-foreground/50 mt-5 relative z-10">
            Or subscribe for ₹499/month — unlimited reports
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      {isPaid && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
        >
          <Button variant="outline" onClick={handleShare} className="gap-2 px-8 py-6">
            <Share2 className="w-5 h-5" />
            Share Report
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading} className="gap-2 px-8 py-6 gradient-cta text-white">
            {isDownloading ? (
              <Zap className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            Download PDF
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
