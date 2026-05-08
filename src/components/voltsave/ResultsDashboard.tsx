import { motion } from "framer-motion";
import {
  TrendingDown, AlertTriangle, CheckCircle, Zap, Lock, Share2, Download,
  BarChart3, Cpu, Clock, DollarSign, Sun, ArrowRight, ChevronDown, ChevronUp,
} from "lucide-react";
import SavingsScore from "./SavingsScore";
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE } from "@/hooks/useApi";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from "recharts";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45 } },
};

const SEVERITY_COLOR: Record<string, string> = {
  high: "text-destructive",
  medium: "text-orange-400",
  low: "text-accent",
};
const SEVERITY_DOT: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-orange-400",
  low: "bg-accent",
};
const SEVERITY_EMOJI: Record<string, string> = {
  high: "🔴",
  medium: "🟡",
  low: "🟢",
};

const PIE_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

interface AnalysisResult {
  // Legacy / demo fields
  provider?: string;
  state?: string;
  billingMonth?: string;
  totalUnits?: number;
  effectiveRate?: number;
  effectiveRateCurrency?: string;
  rateVsRegionAvg?: number;
  rateVsRegionAvgPct?: number;
  efficiencyScore: number;
  monthlySavingsEstimate: number;
  potentialSavingsPct: number;
  currentBill?: number;
  optimizedBill?: number;
  peakWasteHours?: number;
  usageVsAvgPct?: number;
  avgRegionalUsage?: number;
  // API fields
  providerName?: string;
  providerId?: string;
  providerState?: string;
  providerWebsite?: string;
  rateStatus?: string;
  usageIntensity?: string;
  usageRatio?: number;
  dailyUnits?: number;
  dailyCost?: number;
  annualSavingsEstimate?: number;
  // Slab optimization — two possible shapes (API vs demo)
  slabOptimization?: {
    currentSlab: string; targetSlab: string;
    unitsToReduce: number; savings: number;
  };
  slabAlert?: {
    currentUnits: number; currentSlab: string; currentRate: number;
    targetUnits: number; targetSlab: string; targetRate: number;
    unitsToReduce: number; potentialSaving: number;
  };
  findings?: Array<{ severity: string; title: string; description: string }>;
  topIssues: Array<{ title: string; description: string; severity: string; actionable?: boolean }>;
  recommendations: Array<{ text: string; icon?: string } | string>;
  // Device breakdown — two shapes (API vs demo)
  deviceBreakdown?: Array<{ device: string; units: number; percentage: number }>;
  highConsumptionDevices?: Array<{ name: string; kwh: number; percentage: number }>;
  // Monthly trend — two shapes (API vs demo)
  monthlyTrend?: Array<{ month: string; units: number; estimated?: boolean }>;
  monthlyProjection?: Array<{ month: string; units: number }>;
  billBreakdown?: {
    slabs: Array<{ range: string; units: number; rate: number; amount: number }>;
    energyCharge: number; fixedCharge: number; fuelSurcharge: number;
    electricityDuty: number; total: number;
  };
  solar?: {
    recommendedKw: number; estimatedCostMin: number; estimatedCostMax: number;
    subsidy: number; subsidyScheme: string; netCostMin: number; netCostMax: number;
    monthlyGeneration: number; monthlySavingsMin: number; monthlySavingsMax: number;
    paybackYears: string; netMeteringRate: number;
  };
  confidenceLevel?: string;
  paid?: boolean;
  [key: string]: any;
}

interface ResultsDashboardProps {
  result: AnalysisResult;
  billId: string | null;
  onUnlock: () => void;
}

const ResultsDashboard = ({ result, billId, onUnlock }: ResultsDashboardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedFinding, setExpandedFinding] = useState<number | null>(null);
  const isPaid = result.paid || false;

  // Normalize provider info (API uses providerName/providerState; demo uses provider/state)
  const providerName = result.providerName ?? result.provider;
  const providerState = result.providerState ?? result.state;

  // Normalize slab alert (API uses slabOptimization; demo uses slabAlert)
  const slabAlert = result.slabAlert ?? (result.slabOptimization ? {
    currentUnits: result.totalUnits ?? 0,
    currentSlab: result.slabOptimization.currentSlab,
    currentRate: 0,
    targetUnits: 0,
    targetSlab: result.slabOptimization.targetSlab,
    targetRate: 0,
    unitsToReduce: result.slabOptimization.unitsToReduce,
    potentialSaving: result.slabOptimization.savings,
  } : undefined);

  // Normalize device list (API uses deviceBreakdown; demo uses highConsumptionDevices)
  const highConsumptionDevices = result.highConsumptionDevices
    ?? result.deviceBreakdown?.map(d => ({ name: d.device, kwh: d.units, percentage: d.percentage }))
    ?? [];

  // Normalize monthly data (API uses monthlyTrend; demo uses monthlyProjection)
  const monthlyData = result.monthlyProjection ?? result.monthlyTrend ?? [];

  const currentBill = result.currentBill ?? Math.round((result.monthlySavingsEstimate * 100) / (result.potentialSavingsPct || 1));
  const optimizedBill = result.optimizedBill ?? (currentBill - result.monthlySavingsEstimate);
  const peakWasteHours = result.peakWasteHours ?? 4.2;

  const pieData = highConsumptionDevices.map(d => ({ name: d.name, value: d.percentage }));

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
    } catch {
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

  return (
    <section className="py-8 sm:py-10 pb-28 md:pb-16">
      <motion.div className="container mx-auto px-4 max-w-4xl" variants={stagger} initial="hidden" animate="show">

        {/* Header */}
        <motion.div variants={fadeUp} className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-1">Analysis Complete</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Your Energy Report</h2>
            {(providerName || result.billingMonth) && (
              <p className="text-sm text-muted-foreground mt-1">
                {[providerName, providerState, result.billingMonth].filter(Boolean).join(' • ')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading || !isPaid}
              className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* KPI Stats */}
        <motion.div variants={fadeUp} className={`grid gap-3 mb-6 ${result.dailyCost ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'}`}>
          <div className="glass-card p-4 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1.5 text-accent" />
            <p className="text-xl md:text-2xl font-extrabold text-foreground tabular-nums">₹{result.monthlySavingsEstimate.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Monthly Savings</p>
            {result.annualSavingsEstimate && (
              <p className="text-[10px] text-accent mt-0.5">₹{result.annualSavingsEstimate.toLocaleString()}/yr</p>
            )}
          </div>
          <div className="glass-card p-4 text-center">
            <BarChart3 className="w-5 h-5 mx-auto mb-1.5 text-primary" />
            <p className="text-xl md:text-2xl font-extrabold text-foreground tabular-nums">{result.efficiencyScore}/100</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Efficiency Score</p>
          </div>
          {result.effectiveRate && (
            <div className="glass-card p-4 text-center">
              <Zap className="w-5 h-5 mx-auto mb-1.5 text-orange-400" />
              <p className="text-xl md:text-2xl font-extrabold text-foreground tabular-nums">₹{result.effectiveRate}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Per Unit</p>
              {result.rateVsRegionAvgPct && (
                <p className="text-[10px] text-destructive mt-0.5">+{result.rateVsRegionAvgPct}% vs avg</p>
              )}
            </div>
          )}
          {result.dailyCost && (
            <div className="glass-card p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1.5 text-blue-400" />
              <p className="text-xl md:text-2xl font-extrabold text-foreground tabular-nums">₹{result.dailyCost}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Daily Cost</p>
              {result.dailyUnits && (
                <p className="text-[10px] text-muted-foreground mt-0.5">{result.dailyUnits} units/day</p>
              )}
            </div>
          )}
          {!result.effectiveRate && !result.dailyCost && (
            <div className="glass-card p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1.5 text-destructive" />
              <p className="text-xl md:text-2xl font-extrabold text-foreground tabular-nums">{peakWasteHours} hrs</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Peak Waste</p>
            </div>
          )}
        </motion.div>

        {/* Slab Alert */}
        {slabAlert && (
          <motion.div variants={fadeUp} className="mb-6 glass-card p-5 border border-orange-500/30 bg-orange-500/5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">⚠️ Slab Optimization Opportunity</h4>
            </div>
            <p className="text-sm text-foreground mb-3">
              You're just <span className="font-bold text-orange-400">{slabAlert.unitsToReduce} units away</span> from dropping to a lower tariff slab!
            </p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Current Slab</p>
                {slabAlert.currentUnits > 0 && <p className="text-sm font-bold text-foreground">{slabAlert.currentUnits} units</p>}
                <p className="text-xs text-muted-foreground">{slabAlert.currentSlab}{slabAlert.currentRate > 0 ? ` @ ₹${slabAlert.currentRate}/unit` : ''}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Target Slab</p>
                {slabAlert.targetUnits > 0 && <p className="text-sm font-bold text-accent">{slabAlert.targetUnits} units</p>}
                <p className="text-xs text-muted-foreground">{slabAlert.targetSlab}{slabAlert.targetRate > 0 ? ` @ ₹${slabAlert.targetRate}/unit` : ''}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/10">
              <span className="text-sm text-foreground">💰 Potential Savings</span>
              <span className="font-bold text-accent">₹{slabAlert.potentialSaving}/month</span>
            </div>
          </motion.div>
        )}

        {/* Key Findings */}
        {result.findings && result.findings.length > 0 && (
          <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">🔍 Key Findings</h4>
            </div>
            <div className="divide-y divide-border">
              {result.findings.map((f, i) => (
                <div key={i} className="py-3">
                  <button
                    className="w-full flex items-center gap-3 text-left"
                    onClick={() => setExpandedFinding(expandedFinding === i ? null : i)}
                  >
                    <span>{SEVERITY_EMOJI[f.severity]}</span>
                    <span className={`text-sm font-medium flex-1 ${SEVERITY_COLOR[f.severity]}`}>{f.title}</span>
                    {expandedFinding === i
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  </button>
                  {expandedFinding === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-muted-foreground mt-2 pl-7"
                    >
                      {f.description}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-accent" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">💡 Top Recommendations</h4>
          </div>
          <ul className="space-y-2.5">
            {(isPaid ? result.recommendations : result.recommendations.slice(0, 3)).map((rec, i) => {
              const recText = typeof rec === 'string' ? rec : rec.text;
              const recIcon = typeof rec === 'string' ? '💡' : (rec.icon ?? '💡');
              return (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="text-base flex-shrink-0">{recIcon}</span>
                  <span>{i + 1}. {recText}</span>
                </li>
              );
            })}
            {!isPaid && result.recommendations.length > 3 && (
              <li className="flex items-center gap-2 text-sm text-muted-foreground/50 italic pt-1">
                <Lock className="w-3 h-3 flex-shrink-0" />
                +{result.recommendations.length - 3} more recommendations in full report
              </li>
            )}
          </ul>
        </motion.div>

        {/* Device Breakdown: Pie (free preview) */}
        <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-destructive" />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">📊 Device Consumption</h4>
            </div>
            {isPaid ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={10}>
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="relative h-[200px] flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-8 border-primary/30 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border-8 border-accent/30 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 text-center">
                  <p className="text-xs text-muted-foreground">🔒 Full breakdown in premium report</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                    🔵 AC: 38% &nbsp; 🟢 Fridge: 15% &nbsp; 🟡 Lights: 12%
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Efficiency Score */}
          <div className="glass-card p-5 flex flex-col items-center justify-center">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Efficiency Score</h4>
            <SavingsScore score={result.efficiencyScore} />
            {result.totalUnits && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                {result.totalUnits} units used
                {result.avgRegionalUsage && (
                  <span className="text-destructive"> ({result.usageVsAvgPct}% above avg {result.avgRegionalUsage})</span>
                )}
              </p>
            )}
          </div>
        </motion.div>

        {/* Bill comparison */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Current vs Optimized Bill</h4>
          <div className="flex items-end gap-8 justify-center">
            <div className="text-center">
              <div className="w-16 bg-destructive/30 rounded-t-lg mx-auto" style={{ height: 120 }} />
              <p className="text-sm font-bold text-foreground mt-2">₹{currentBill.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <div className="flex flex-col items-center gap-1 text-accent pb-2">
              <TrendingDown className="w-5 h-5" />
              <span className="text-lg font-bold">₹{result.monthlySavingsEstimate.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">saved/mo</span>
            </div>
            <div className="text-center">
              <div className="w-16 bg-accent/40 rounded-t-lg mx-auto" style={{ height: Math.max(30, Math.round((optimizedBill / currentBill) * 120)) }} />
              <p className="text-sm font-bold text-accent mt-2">₹{optimizedBill.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Optimized</p>
            </div>
          </div>
        </motion.div>

        {/* ---- PAID SECTIONS ---- */}
        {isPaid && (
          <>
            {/* Slab breakdown table */}
            {result.billBreakdown && (
              <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">📊 Bill Breakdown</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                        <th className="text-left pb-2">Slab</th>
                        <th className="text-right pb-2">Units</th>
                        <th className="text-right pb-2">Rate (₹)</th>
                        <th className="text-right pb-2">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {result.billBreakdown.slabs.map((slab, i) => (
                        <tr key={i} className={i === result.billBreakdown!.slabs.length - 1 ? "text-orange-400" : "text-foreground"}>
                          <td className="py-2">{slab.range}</td>
                          <td className="py-2 text-right tabular-nums">{slab.units}</td>
                          <td className="py-2 text-right tabular-nums">{slab.rate.toFixed(2)}</td>
                          <td className="py-2 text-right tabular-nums">{slab.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-border">
                      <tr className="text-muted-foreground text-xs">
                        <td colSpan={3} className="py-1.5">Energy Charge</td>
                        <td className="text-right tabular-nums">₹{result.billBreakdown.energyCharge.toFixed(2)}</td>
                      </tr>
                      <tr className="text-muted-foreground text-xs">
                        <td colSpan={3} className="py-1.5">Fixed Charge</td>
                        <td className="text-right tabular-nums">₹{result.billBreakdown.fixedCharge.toFixed(2)}</td>
                      </tr>
                      <tr className="text-muted-foreground text-xs">
                        <td colSpan={3} className="py-1.5">Fuel Surcharge</td>
                        <td className="text-right tabular-nums">₹{result.billBreakdown.fuelSurcharge.toFixed(2)}</td>
                      </tr>
                      <tr className="text-muted-foreground text-xs">
                        <td colSpan={3} className="py-1.5">Electricity Duty (10%)</td>
                        <td className="text-right tabular-nums">₹{result.billBreakdown.electricityDuty.toFixed(2)}</td>
                      </tr>
                      <tr className="text-foreground font-bold border-t border-border">
                        <td colSpan={3} className="py-2">TOTAL</td>
                        <td className="text-right tabular-nums text-accent">₹{result.billBreakdown.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Solar Potential */}
            {result.solar && (
              <motion.div variants={fadeUp} className="glass-card p-5 mb-6 border border-yellow-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">☀️ Solar Potential Analysis</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Recommended System", value: `${result.solar.recommendedKw} kW` },
                    { label: "Net Cost (after subsidy)", value: `₹${(result.solar.netCostMin / 1000).toFixed(0)}k–${(result.solar.netCostMax / 1000).toFixed(0)}k` },
                    { label: "Monthly Generation", value: `${result.solar.monthlyGeneration} units` },
                    { label: "Payback Period", value: `${result.solar.paybackYears} years` },
                  ].map((s) => (
                    <div key={s.label} className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-center">
                      <p className="text-sm font-bold text-foreground">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-secondary/30 text-sm text-muted-foreground space-y-1">
                  <p>🏛️ <strong className="text-foreground">{result.solar.subsidyScheme}</strong> subsidy: ₹{(result.solar.subsidy / 1000).toFixed(0)}k</p>
                  <p>⚡ {providerName ?? 'Utility'} net metering buyback: ₹{result.solar.netMeteringRate}/unit</p>
                  <p>💰 Monthly savings: ₹{result.solar.monthlySavingsMin}–₹{result.solar.monthlySavingsMax}</p>
                </div>
              </motion.div>
            )}

            {/* Monthly Projection */}
            {monthlyData.length > 0 && (
              <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">📈 Monthly Projection (units)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(v: any) => [`${v} units`, "Usage"]}
                    />
                    <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                      {monthlyData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.units > 220 ? "#ef4444" : entry.units > 190 ? "#f59e0b" : "#22c55e"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  💡 Peak usage expected in summer months — plan cooling strategies in advance
                </p>
              </motion.div>
            )}
            {/* Provider info */}
            {(providerName || result.providerWebsite) && (
              <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">🏢 Your Provider</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">{providerName}</p>
                    {providerState && <p className="text-xs text-muted-foreground mt-0.5">State: {providerState}</p>}
                    {result.confidenceLevel && (
                      <p className="text-xs text-accent mt-0.5">Confidence: {result.confidenceLevel}</p>
                    )}
                  </div>
                  {result.providerWebsite && (
                    <a
                      href={result.providerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                      Official Website →
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* All issues */}
            <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">All Issues Detected</h4>
              </div>
              <ul className="space-y-2.5">
                {result.topIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_DOT[issue.severity] ?? 'bg-muted'}`} />
                    <div>
                      <p>{issue.title}</p>
                      <p className="text-xs text-muted-foreground">{issue.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Download */}
            <motion.div variants={fadeUp} className="text-center mb-6">
              <button
                onClick={handleDownload}
                disabled={isDownloading || billId === 'demo'}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-semibold text-sm disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download PDF Report'}
              </button>
              {billId === 'demo' && (
                <p className="text-xs text-muted-foreground mt-2">PDF download available for real bills</p>
              )}
            </motion.div>
          </>
        )}

        {/* Premium CTA (unpaid) */}
        {!isPaid && (
          <motion.div variants={fadeUp} className="glass-card p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10 text-center">
              <Lock className="w-6 h-6 mx-auto mb-3 text-primary" />
              <h4 className="text-lg font-bold text-foreground mb-1">🔓 Unlock Full Report</h4>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Complete slab-by-slab breakdown, all {result.recommendations.length} recommendations, solar analysis, monthly projections & PDF download
              </p>
              <ul className="text-sm text-muted-foreground mb-6 space-y-1.5 text-left max-w-xs mx-auto">
                {[
                  `Complete slab-by-slab breakdown`,
                  `All ${result.recommendations.length} personalized recommendations`,
                  'Solar rooftop potential analysis',
                  'Monthly trend projections',
                  'Downloadable PDF report',
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <motion.button
                onClick={onUnlock}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:brightness-110 transition-all shadow-[0_0_20px_hsla(217,91%,60%,0.2)]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-4 h-4" />
                Unlock for ₹99
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

      </motion.div>
    </section>
  );
};

export default ResultsDashboard;
