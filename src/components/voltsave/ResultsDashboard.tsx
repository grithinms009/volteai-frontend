import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Lock, TrendingUp, TrendingDown, 
  AlertCircle, Share2, Download, Zap, AlertTriangle,
  Info, ChevronRight, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
  topIssues: Array<{ title: string; description: string; severity: 'high' | 'medium' | 'low' }>;
  recommendations: string[];
  tariffModel: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  paid?: boolean;
}

interface ResultsDashboardProps {
  result: AnalysisResult;
  billId: string | null;
  onUnlock: () => void;
}

const SEVERITY_COLORS = {
  high: 'bg-destructive/20 text-destructive border-destructive/30',
  medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export default function ResultsDashboard({ result, billId, onUnlock }: ResultsDashboardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const isPaid = result.paid || false;

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-destructive';
    if (score < 70) return 'text-orange-400';
    return 'text-accent';
  };

  const handleDownload = async () => {
    if (!billId || billId === 'demo') {
      toast.info('Download available for real bills only');
      return;
    }
    
    setIsDownloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/reports/${billId}/download`, {
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
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
          <CheckCircle2 className="w-4 h-4" />
          Analysis Complete
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Your Energy Report
        </h1>
        <span className={`
          inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
          ${result.confidenceLevel === 'high' 
            ? 'bg-accent/20 text-accent' 
            : 'bg-primary/20 text-primary'
          }
        `}>
          <Info className="w-3 h-3" />
          {result.confidenceLevel === 'high' ? 'High Confidence' : 'Estimated'}
        </span>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 text-center"
        >
          <p className="text-3xl font-bold text-accent">₹{result.monthlySavingsEstimate}/mo</p>
          <p className="text-sm text-foreground/60 mt-1">Monthly Savings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 text-center"
        >
          <p className="text-3xl font-bold text-accent">{result.potentialSavingsPct}%</p>
          <p className="text-sm text-foreground/60 mt-1">Possible Reduction</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 text-center"
        >
          <p className={`text-3xl font-bold ${getScoreColor(result.efficiencyScore)}`}>
            {result.efficiencyScore}/100
          </p>
          <p className="text-sm text-foreground/60 mt-1">Efficiency Score</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 text-center"
        >
          <p className={`text-3xl font-bold ${result.rateStatus === 'above_average' ? 'text-destructive' : 'text-accent'}`}>
            {result.rateStatus === 'above_average' ? 'Above Avg' : 'Good Rate'}
          </p>
          <p className="text-sm text-foreground/60 mt-1">Rate Status</p>
        </motion.div>
      </div>

      {/* Bill Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Bill Comparison</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground/60">Current</span>
              <span className="text-white">₹{Math.round(result.monthlySavingsEstimate * 100 / result.potentialSavingsPct)}</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-destructive/60 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground/60">Optimized</span>
              <span className="text-accent font-medium">
                ₹{Math.round(result.monthlySavingsEstimate * 100 / result.potentialSavingsPct - result.monthlySavingsEstimate)}
              </span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full" 
                style={{ width: `${100 - result.potentialSavingsPct}%` }} 
              />
            </div>
          </div>
        </div>
        <p className="text-center text-foreground/60 mt-4">
          You could save <span className="text-accent font-semibold">₹{result.monthlySavingsEstimate}/month</span>
        </p>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Issues */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Issues</h3>
          <div className="space-y-4">
            {result.topIssues.slice(0, 2).map((issue, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${
                    issue.severity === 'high' ? 'text-destructive' : 'text-orange-400'
                  }`} />
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border mb-2 ${SEVERITY_COLORS[issue.severity]}`}>
                      {issue.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                    </span>
                    <h4 className="font-medium text-white mb-1">{issue.title}</h4>
                    <p className="text-sm text-foreground/60">{issue.description}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Locked issues */}
            {!isPaid && result.topIssues.slice(2).map((_, index) => (
              <div key={`locked-issue-${index}`} className="relative p-4 bg-muted/30 rounded-lg overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-background/50 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-foreground/40 mx-auto mb-2" />
                    <span className="text-sm text-foreground/60">Premium</span>
                  </div>
                </div>
                <div className="h-20" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
          <div className="space-y-3">
            {result.recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 text-sm font-medium">
                  {index + 1}
                </span>
                <Lightbulb className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80">{rec}</p>
              </div>
            ))}
            
            {/* Locked recommendations */}
            {!isPaid && result.recommendations.slice(2).map((_, index) => (
              <div key={`locked-rec-${index}`} className="relative p-3 bg-muted/30 rounded-lg overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-background/50 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-5 h-5 text-foreground/40 mx-auto mb-1" />
                    <span className="text-xs text-foreground/60">Premium</span>
                  </div>
                </div>
                <div className="h-12" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Efficiency Score Gauge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="glass-card p-8 text-center mb-8"
      >
        <h3 className="text-lg font-semibold text-white mb-6">Efficiency Score</h3>
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={result.efficiencyScore < 40 ? 'hsl(var(--destructive))' : result.efficiencyScore < 70 ? '#f97316' : 'hsl(var(--accent))'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${result.efficiencyScore * 2.83} ${283}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${getScoreColor(result.efficiencyScore)}`}>
              {result.efficiencyScore}
            </span>
            <span className="text-sm text-foreground/60">/100</span>
          </div>
        </div>
        <p className="text-foreground/60 mt-4">
          {result.efficiencyScore < 40 
            ? 'Your energy usage needs significant improvement' 
            : result.efficiencyScore < 70 
              ? 'There\'s room for improvement in your energy usage'
              : 'Great job! Your energy efficiency is excellent'}
        </p>
      </motion.div>

      {/* Premium Unlock CTA */}
      {!isPaid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-8 text-center gradient-mesh"
        >
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">
            Unlock Your Full Report
          </h3>
          <p className="text-foreground/60 mb-6 max-w-lg mx-auto">
            See all {result.topIssues.length} issues, {result.recommendations.length} savings strategies, and download your personalized PDF report.
          </p>
          <Button
            onClick={onUnlock}
            size="lg"
            className="gradient-cta text-white px-8"
          >
            Unlock Full Report — ₹199
          </Button>
          <p className="text-sm text-foreground/50 mt-4">
            Or subscribe for ₹499/month — unlimited reports
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      {isPaid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-4 mt-8"
        >
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading} className="gap-2">
            {isDownloading ? (
              <Zap className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Download PDF
          </Button>
        </motion.div>
      )}
    </div>
  );
}
