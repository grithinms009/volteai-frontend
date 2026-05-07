import { motion } from "framer-motion";
import {
  TrendingDown, AlertTriangle, CheckCircle, Zap, Lock, Share2, Download,
  BarChart3, Cpu, Clock, DollarSign,
} from "lucide-react";
import SavingsScore from "./SavingsScore";
import EnergyHeatMap from "./EnergyHeatMap";
import UsageChart from "./UsageChart";
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE } from "@/hooks/useApi";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } },
};

interface AnalysisResult {
  efficiencyScore: number;
  monthlySavingsEstimate: number;
  potentialSavingsPct: number;
  currentBill?: number;
  optimizedBill?: number;
  peakWasteHours?: number;
  topIssues: Array<{ title: string; description: string; severity: string }>;
  recommendations: Array<{ text: string; icon?: string } | string>;
  highConsumptionDevices?: Array<{ name: string; kwh: number; percentage: number }>;
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
  const isPaid = result.paid || false;

  const currentBill = result.currentBill || Math.round(result.monthlySavingsEstimate * 100 / result.potentialSavingsPct);
  const optimizedBill = result.optimizedBill || (currentBill - result.monthlySavingsEstimate);
  const peakWasteHours = result.peakWasteHours || 4.2;

  const highConsumptionDevices = result.highConsumptionDevices || [
    { name: 'Air Conditioner', kwh: 180, percentage: 38 },
    { name: 'Water Heater', kwh: 95, percentage: 20 },
    { name: 'Refrigerator', kwh: 72, percentage: 15 },
    { name: 'Washing Machine', kwh: 45, percentage: 9 },
  ];

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

  return (
    <section className="py-8 sm:py-10 pb-24 md:pb-16">
      <motion.div
        className="container mx-auto px-4 max-w-5xl"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <p className="text-xs font-medium text-accent mb-1.5 uppercase tracking-wider">Analysis Complete</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Your Energy Report</h2>
        </motion.div>

        {/* Primary stats row */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { icon: DollarSign, label: "Monthly Savings", value: `₹${result.monthlySavingsEstimate.toLocaleString()}`, color: "text-accent" },
            { icon: TrendingDown, label: "Reduction", value: `${result.potentialSavingsPct}%`, color: "text-accent" },
            { icon: BarChart3, label: "Efficiency", value: `${result.efficiencyScore}/100`, color: "text-primary" },
            { icon: Clock, label: "Peak Waste", value: `${peakWasteHours} hrs`, color: "text-destructive" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-xl md:text-2xl font-extrabold text-foreground tabular-nums">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Bill comparison */}
        <motion.div variants={fadeUp} className="glass-card p-6 mb-6">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Current vs Optimized
          </h4>
          <div className="flex items-end gap-6 justify-center">
            <div className="text-center">
              <div className="w-16 bg-destructive/30 rounded-t-lg mx-auto" style={{ height: 120 }} />
              <p className="text-sm font-bold text-foreground mt-2">₹{currentBill.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Current</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 bg-accent/40 rounded-t-lg mx-auto" 
                style={{ height: Math.round((optimizedBill / currentBill) * 120) }} 
              />
              <p className="text-sm font-bold text-accent mt-2">₹{optimizedBill.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Optimized</p>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex items-center gap-1 text-accent mb-1">
                <TrendingDown className="w-4 h-4" />
                <span className="text-lg font-bold">₹{result.monthlySavingsEstimate.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Saved / mo</p>
            </div>
          </div>
        </motion.div>

        {/* Chart + Heat Map */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <motion.div variants={fadeUp} className="glass-card p-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Monthly Usage (kWh)
            </h4>
            <UsageChart />
          </motion.div>
          <motion.div variants={fadeUp} className="glass-card p-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Energy Heat Map
            </h4>
            <EnergyHeatMap />
          </motion.div>
        </div>

        {/* Problems + Recommendations + Score */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <motion.div variants={fadeUp} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Top Waste Reasons
              </h4>
            </div>
            <ul className="space-y-2.5">
              {(isPaid ? result.topIssues : result.topIssues.slice(0, 3)).map((issue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    issue.severity === 'high' ? 'bg-destructive' : 'bg-orange-400'
                  }`} />
                  {issue.title}
                </li>
              ))}
              {!isPaid && result.topIssues.length > 3 && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground/50 italic">
                  <Lock className="w-3 h-3 mt-1 flex-shrink-0" />
                  +{result.topIssues.length - 3} more in full report
                </li>
              )}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-accent" />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Recommendations
              </h4>
            </div>
            <ul className="space-y-2.5">
              {(isPaid ? result.recommendations : result.recommendations.slice(0, 2)).map((rec, i) => {
                const recText = typeof rec === 'string' ? rec : rec.text;
                const recIcon = typeof rec === 'string' ? '💡' : (rec.icon || '💡');
                return (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="text-sm">{recIcon}</span>
                    {recText}
                  </li>
                );
              })}
              {!isPaid && result.recommendations.length > 2 && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground/50 italic">
                  <Lock className="w-3 h-3 mt-1 flex-shrink-0" />
                  +{result.recommendations.length - 2} strategies in full report
                </li>
              )}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-5 flex flex-col items-center justify-center">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Efficiency Score
            </h4>
            <SavingsScore score={result.efficiencyScore} />
          </motion.div>
        </div>

        {/* High-consumption devices */}
        <motion.div variants={fadeUp} className="glass-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-destructive" />
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              High-Consumption Devices
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {highConsumptionDevices.map((d) => (
              <div key={d.name} className="p-3 rounded-xl bg-secondary/30 border border-border text-center">
                <p className="text-sm font-medium text-foreground">{d.name}</p>
                <p className="text-lg font-bold text-destructive tabular-nums">{d.kwh} kWh</p>
                <p className="text-xs text-muted-foreground">{d.percentage}% of total</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Premium CTA */}
        {!isPaid && (
          <motion.div variants={fadeUp} className="glass-card p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-primary" />
                <h4 className="text-lg font-bold text-foreground">Unlock Full Optimization Plan</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                Detailed appliance analysis, full savings timeline, peak-hour strategy, and downloadable PDF report
              </p>
              <motion.button
                onClick={onUnlock}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Zap className="w-4 h-4" />
                Unlock Full Report — ₹199
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Actions row */}
        <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-6">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button 
            onClick={handleDownload}
            disabled={isDownloading || !isPaid}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ResultsDashboard;
