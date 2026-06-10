import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, TrendingUp, AlertTriangle,
  DollarSign, Target, Star, Download, Share2
} from "lucide-react";
import type { ApiResult } from "@/types/analysis";
import BillChat from "./BillChat";

interface ProfessionalResultsDashboardProps {
  result: ApiResult | null;
  onUnlock?: () => void;
  billId?: string | null;
  onRefetch?: () => void;
}


const ProfessionalResultsDashboard: React.FC<ProfessionalResultsDashboardProps> = ({ 
  result, 
  onUnlock,
  billId,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'recommendations' | 'chat'>('summary');

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const gradeColor = (g?: string) => ({ A: 'text-green-400 bg-green-500/20 border-green-500/50', B: 'text-teal-400 bg-teal-500/20 border-teal-500/50', C: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50', D: 'text-orange-400 bg-orange-500/20 border-orange-500/50', F: 'text-red-400 bg-red-500/20 border-red-500/50' }[g ?? ''] ?? 'text-slate-400 bg-slate-700 border-slate-600');

  const extractionLabel = (m?: string) => ({ groq: 'AI Extracted', ollama: 'AI Extracted', regex: 'Auto-detected', failed: 'Partial Extract' }[m ?? ''] ?? null);

  const fmtDays = (n: number) => n === 0 ? 'Due TODAY' : n < 0 ? `${Math.abs(n)}d overdue` : `${n}d left`;

  const handlePdfDownload = () => {
    if (!billId || billId === 'demo') return;
    const token = localStorage.getItem('token');
    window.open(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/api/reports/${billId}/download?token=${token}`, '_blank');
  };


  // ── Loading guard ──────────────────────────────────────────────
  if (!result) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Loading Analysis...</h1>
          <p className="text-slate-400">Please wait while we process your electricity bill</p>
        </div>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────
  const monthlyWaste = result.savingsOpportunities?.monthlySavingsPotential ?? result.monthlySavingsEstimate ?? 0;
  const trendData = result.usagePatterns?.monthlyTrendChart ?? result.monthlyTrend ?? [];
  const appliances = result.applianceBreakdown?.appliances ?? [];
  const quickWins = result.savingsOpportunities?.quickWins ?? [];
  const mediumItems = result.savingsOpportunities?.medium?.opportunities ?? [];
  const largeItems = result.savingsOpportunities?.large?.opportunities ?? [];
  const topRecs = result.recommendationsData?.topRecommendations ?? result.recommendationsDetailed ?? [];
  const checks = result.billAccuracy?.checks ?? [];
  const healthItems = result.applianceHealth?.applianceHealth ?? [];

  const dueDateStatus = result.billAccuracy?.dueDateStatus;
  const daysUntilDue  = result.billAccuracy?.daysUntilDue;
  const showDueAlert  = dueDateStatus === 'urgent' || dueDateStatus === 'overdue';

  // ── Locked preview ───────────────────────────────────────────
  if (!result.paid) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl p-8 border border-slate-700"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Your Energy Analysis is Ready</h1>
              <p className="text-slate-400">Unlock to see 50+ insights across 10 intelligence engines</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{fmt(result.effectiveRate ?? 0)}/kWh</p>
                <p className="text-sm text-slate-400">Effective Rate</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{fmt(monthlyWaste)}/mo</p>
                <p className="text-sm text-slate-400">Monthly Savings Potential</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{result.efficiencyScore ?? 0}/100</p>
                <p className="text-sm text-slate-400">Efficiency Score</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {(result.alerts ?? []).slice(0, 3).map((alert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm">{alert.message}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={onUnlock}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all"
              >
                Unlock Full Report — {fmt(199)}
              </button>
              <p className="text-sm text-slate-400 mt-2">
                Detailed appliance analysis, all 10 engines, PDF download
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const effScore = result.efficiencyScore ?? 0;
  const effColor = effScore >= 80 ? 'text-green-400' : effScore >= 60 ? 'text-orange-400' : 'text-red-400';
  const rateComp = result.effectiveRateAnalysis?.rateComparison;

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── Sticky Bill Summary Card ─────────────────────────── */}
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">

            <div className="flex items-center gap-3">
              {result.billGrade && (
                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black flex-shrink-0 ${gradeColor(result.billGrade)}`}>
                  {result.billGrade}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-slate-400 text-xs truncate">{result.providerName ?? 'Provider'}</p>
                <div className="flex gap-1 flex-wrap mt-0.5">
                  {extractionLabel(result.extractionMethod) && (
                    <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded">{extractionLabel(result.extractionMethod)}</span>
                  )}
                  {showDueAlert && daysUntilDue != null && (
                    <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded animate-pulse">📅 {fmtDays(daysUntilDue)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="border-l border-slate-700 pl-4">
              <p className="text-slate-400 text-xs">Monthly Bill</p>
              <p className="text-2xl font-bold text-white">{fmt(result.totalAmount ?? 0)}</p>
            </div>

            <div className="border-l border-slate-700 pl-4">
              <p className="text-slate-400 text-xs">Savings Potential</p>
              <p className="text-2xl font-bold text-green-400">{fmt(monthlyWaste)}/mo</p>
              <p className="text-green-400 text-xs">↓ {result.potentialSavingsPct ?? 0}% reduction</p>
            </div>

            <div className="border-l border-slate-700 pl-4">
              <p className="text-slate-400 text-xs">Efficiency Score</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${effScore >= 80 ? 'bg-green-400' : effScore >= 60 ? 'bg-orange-400' : 'bg-red-400'}`} style={{ width: `${effScore}%` }} />
                </div>
                <span className={`font-bold ${effColor}`}>{effScore}</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Global warning banners ─────────────────────────────── */}
      {result.confidenceLevel === 'low' && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 text-center text-yellow-300 text-xs">
          ⚠️ AI couldn't extract all fields — some values may be estimated
        </div>
      )}

      {/* ── Tab Navigation ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 border-b border-slate-700">
        <div className="flex gap-6 overflow-x-auto">
          {(['summary', 'details', 'recommendations', 'chat'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 font-semibold text-sm capitalize whitespace-nowrap transition ${
                activeTab === tab ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'summary' ? '📊 Summary' : tab === 'details' ? '🔍 Detailed Analysis' : tab === 'recommendations' ? '💡 Recommendations' : '💬 Ask AI'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* ════════════ SUMMARY TAB ════════════ */}
        {activeTab === 'summary' && (
          <div className="space-y-10">

            {/* AI Narrative Summary */}
            {result.aiNarrative && (
              <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 border border-blue-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🤖</span>
                  <h3 className="font-semibold text-blue-300 text-sm">AI Analysis Summary</h3>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-auto">Powered by Llama</span>
                </div>
                <div className="text-slate-300 text-sm leading-relaxed space-y-2">
                  {result.aiNarrative.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Alerts Banner */}
            {(result.alerts ?? []).length > 0 && (
              <div className="space-y-2">
                {(result.alerts ?? []).map((alert, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                    alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                  }`}>
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {alert.message}
                  </div>
                ))}
              </div>
            )}

            {/* Key Metrics Grid */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Key Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-blue-500 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Effective Rate</p>
                  <p className="text-2xl font-bold text-white">{fmt(result.effectiveRate ?? 0)}<span className="text-sm text-slate-400">/kWh</span></p>
                  {rateComp && (
                    <div className="mt-2 text-xs space-y-0.5">
                      <p className="text-slate-400">vs Region: <span className="text-orange-400 font-medium">{rateComp.vs_region}</span></p>
                      <p className="text-slate-400">vs National: <span className="text-blue-400 font-medium">{rateComp.vs_national}</span></p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-blue-500 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Units Consumed</p>
                  <p className="text-2xl font-bold text-white">{result.unitsConsumed ?? 0}<span className="text-sm text-slate-400"> kWh</span></p>
                  <p className="text-slate-400 text-xs mt-2">Daily avg: {result.dailyUnits ?? result.usagePatterns?.dailyAvg ?? 0} kWh</p>
                  <p className="text-slate-400 text-xs">Daily cost: {fmt(result.dailyCost ?? result.usagePatterns?.dailyCost ?? 0)}</p>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-blue-500 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Tariff</p>
                  <p className="text-xl font-bold text-white capitalize">{result.tariffModel ?? result.tariffIntelligence?.tariffModel ?? 'Tiered'}</p>
                  {result.tariffIntelligence?.currentSlab && (
                    <p className="text-slate-400 text-xs mt-2">Current slab: <span className="text-white font-medium">{result.tariffIntelligence.currentSlab}</span></p>
                  )}
                  {result.tariffIntelligence?.slabBoundaryRisk != null && result.tariffIntelligence.slabBoundaryRisk > 70 && (
                    <p className="text-orange-400 text-xs mt-1 animate-pulse">🔥 Slab risk {result.tariffIntelligence.slabBoundaryRisk}/100 — {result.tariffIntelligence.slabAlert}</p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30 p-5">
                  <p className="text-slate-400 text-xs mb-1">Savings Potential</p>
                  <p className="text-2xl font-bold text-green-400">{fmt(monthlyWaste)}<span className="text-sm text-slate-400">/mo</span></p>
                  <p className="text-green-400 text-xs mt-2">Annual: {fmt(monthlyWaste * 12)}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{quickWins.length} quick wins available</p>
                </div>

              </div>
            </div>

            {/* Usage Trend Chart */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Usage Trend</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h3 className="text-base font-semibold text-white mb-4">Monthly Consumption (kWh)</h3>
                  {trendData.length > 0 ? (
                    <>
                      <div className="h-40 flex items-end gap-1 px-2">
                        {trendData.map((pt, i) => {
                          const max = Math.max(...trendData.map(p => p.units));
                          const pct = max > 0 ? (pt.units / max) * 100 : 0;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <span className="text-[9px] text-slate-400">{pt.units}</span>
                              <div
                                className={`w-full rounded-t transition-all ${pt.isCurrentMonth ? 'bg-blue-400' : pt.estimated ? 'bg-slate-600' : 'bg-blue-500'}`}
                                style={{ height: `${pct}%`, minHeight: 4 }}
                              />
                              <span className="text-[9px] text-slate-400">{pt.month}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-4 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500 inline-block"/> Actual</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-400 inline-block"/> Current</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-slate-600 inline-block"/> Estimated</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500 text-sm">No trend data available</p>
                  )}
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
                  <h3 className="text-base font-semibold text-white">Pattern Insights</h3>
                  {(result.usagePatterns?.insights ?? []).map((insight, i) => (
                    <div key={i} className="p-3 bg-slate-900/50 rounded-lg text-xs text-slate-300">💡 {insight}</div>
                  ))}
                  {result.usagePatterns?.weekendIncrease != null && (
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-300">
                      📅 Weekend usage {result.usagePatterns.weekendIncrease}% higher than weekdays
                    </div>
                  )}
                  {result.usagePatterns?.consistencyScore != null && (
                    <div className="text-xs text-slate-400">
                      Consistency: <span className="text-white font-medium">{result.usagePatterns.consistencyScore}/100</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Bill Accuracy */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Bill Accuracy Check</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Composition */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h3 className="text-base font-semibold text-white mb-4">Bill Composition</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Energy', pct: result.energyChargePct ?? 76, color: 'bg-blue-500' },
                      { label: 'Taxes', pct: result.taxPct ?? 15, color: 'bg-orange-500' },
                      { label: 'Fixed', pct: result.fixedChargePct ?? 9, color: 'bg-green-500' },
                    ].map(({ label, pct, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">{label}</span>
                          <span className="text-white font-medium">{pct.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Bill Health</span>
                      <span className={`font-bold ${(result.billAccuracy?.billHealthScore ?? 100) >= 90 ? 'text-green-400' : 'text-orange-400'}`}>
                        {result.billAccuracy?.billHealthScore ?? 100}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checks */}
                <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h3 className="text-base font-semibold text-white mb-4">Verification Results</h3>
                  <div className="space-y-3">
                    {checks.map((check, i) => (
                      <div key={i} className={`flex gap-3 p-3 rounded-lg border ${check.pass ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/10 border-red-500/30'}`}>
                        <span className="text-lg flex-shrink-0">{check.pass ? '✓' : '✗'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm">{check.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5 truncate">{check.reason}</p>
                          {check.suggestion && <p className="text-yellow-400 text-xs mt-0.5">{check.suggestion}</p>}
                        </div>
                        <span className={`text-xs font-bold flex-shrink-0 ${check.pass ? 'text-green-400' : 'text-red-400'}`}>
                          {check.pass ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                    ))}
                    {(result.billAccuracy?.overchargeAmount ?? 0) === 0 ? (
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-xs text-green-400">
                        ✓ No overcharges detected — your bill is accurate
                      </div>
                    ) : (
                      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30 text-xs text-red-400">
                        ⚠ Overcharge of {fmt(result.billAccuracy!.overchargeAmount)} detected — raise a dispute
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ════════════ DETAILS TAB ════════════ */}
        {activeTab === 'details' && (
          <div className="space-y-10">

            {/* Appliance Breakdown */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Appliance Breakdown</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h3 className="text-base font-semibold text-white mb-5">Estimated Usage by Appliance</h3>
                  {appliances.length > 0 ? (
                    <div className="space-y-4">
                      {appliances.map((ap, i) => {
                        const colors = ['from-blue-500 to-blue-400', 'from-orange-500 to-orange-400', 'from-green-500 to-emerald-400', 'from-cyan-400 to-blue-400', 'from-yellow-400 to-amber-400', 'from-purple-500 to-purple-400', 'from-slate-500 to-slate-400'];
                        return (
                          <div key={ap.name}>
                            <div className="flex justify-between mb-1.5">
                              <div>
                                <p className="font-medium text-white text-sm">{ap.name}</p>
                                <p className="text-slate-400 text-xs">{ap.wattage}W</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-white text-sm">{ap.kWh} kWh</p>
                                <p className="text-slate-400 text-xs">{ap.pct}%</p>
                              </div>
                            </div>
                            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`} style={{ width: `${ap.pct}%` }} />
                            </div>
                            {ap.recommendation && (
                              <p className="text-slate-500 text-xs mt-1">💡 {ap.recommendation}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No appliance data available</p>
                  )}

                  {result.applianceBreakdown?.phantomLoadCost != null && (
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-xs text-orange-300">
                      ⚡ Phantom/standby load: {fmt(result.applianceBreakdown.phantomLoadCost)}/mo — use smart power strips
                    </div>
                  )}
                </div>

                {/* Appliance Health */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h3 className="text-base font-semibold text-white mb-4">Appliance Health</h3>
                  {healthItems.length > 0 ? (
                    <div className="space-y-3">
                      {healthItems.map((item, i) => {
                        const isUrgent = item.urgency === 'now' || item.urgency === 'soon';
                        const isRoutine = item.urgency === 'routine';
                        return (
                          <div key={i} className={`p-4 rounded-lg border ${isUrgent ? 'bg-orange-500/10 border-orange-500/30' : isRoutine ? 'bg-blue-500/10 border-blue-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-white text-sm">{item.appliance}</p>
                                <p className={`text-xs mt-0.5 ${isUrgent ? 'text-orange-400' : isRoutine ? 'text-blue-400' : 'text-green-400'}`}>{item.healthLabel}</p>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isUrgent ? 'bg-orange-500/20 text-orange-400' : isRoutine ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                {item.urgency.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs mt-2">{item.recommendation}</p>
                            {item.efficiencyDrop && (
                              <p className="text-red-400 text-xs mt-1">📉 {item.efficiencyDrop}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No health data available</p>
                  )}
                </div>

              </div>
            </div>

            {/* Tariff Slabs */}
            {result.tariffIntelligence?.allSlabs && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Tariff Structure</h2>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {result.tariffIntelligence.allSlabs.map((slab, i) => (
                      <div key={i} className={`p-3 rounded-lg border text-center ${slab.isCurrent ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-700/50 border-slate-600 text-slate-300'}`}>
                        <p className="text-xs mb-1">{slab.label}</p>
                        <p className="font-bold">₹{slab.rate}</p>
                        {slab.isCurrent && <p className="text-[10px] mt-1 text-blue-400">← You are here</p>}
                      </div>
                    ))}
                  </div>
                  {result.tariffIntelligence.slabAlert && (
                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm text-orange-300">
                      ⚠ {result.tariffIntelligence.slabAlert}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Predictions */}
            {result.predictions && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Predictions & Forecasts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.predictions.nextMonthEstimate && (
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                      <p className="text-slate-400 text-xs mb-1">Next Month ({result.predictions.nextMonthEstimate.month})</p>
                      <p className="text-2xl font-bold text-white">{fmt(result.predictions.nextMonthEstimate.bill)}</p>
                      <p className="text-slate-400 text-xs mt-1">{result.predictions.nextMonthEstimate.units} kWh</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded mt-2 inline-block ${result.predictions.nextMonthEstimate.confidence === 'high' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {result.predictions.nextMonthEstimate.confidence} confidence
                      </span>
                    </div>
                  )}
                  {result.predictions.annualProjection && (
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                      <p className="text-slate-400 text-xs mb-1">Annual Projection</p>
                      <p className="text-2xl font-bold text-white">{fmt(result.predictions.annualProjection.bill)}</p>
                      <p className="text-slate-400 text-xs mt-1">{result.predictions.annualProjection.units} kWh</p>
                    </div>
                  )}
                  {result.predictions.solarBreakeven && (
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/30 p-5">
                      <p className="text-slate-400 text-xs mb-1">☀ Solar Breakeven</p>
                      <p className="text-2xl font-bold text-yellow-400">{result.predictions.solarBreakeven.years} yrs</p>
                      <p className="text-slate-400 text-xs mt-1">Saves {fmt(result.predictions.solarBreakeven.annualSavings)}/yr</p>
                      <p className="text-slate-400 text-xs">Investment: {fmt(result.predictions.solarBreakeven.investmentRequired)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ════════════ RECOMMENDATIONS TAB ════════════ */}
        {activeTab === 'recommendations' && (
          <div className="space-y-10">

            {/* Action Plan */}
            {(result.actionPlan ?? []).length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Action Plan</h2>
                <p className="text-slate-400 text-sm mb-5">Ranked by monthly savings — implement in order</p>
                <div className="space-y-4">
                  {(result.actionPlan ?? []).map((item) => {
                    const effortColors: Record<string,string> = { zero: 'bg-green-500/20 text-green-400', low: 'bg-yellow-500/20 text-yellow-400', medium: 'bg-orange-500/20 text-orange-400', high: 'bg-red-500/20 text-red-400' };
                    return (
                      <div key={item.rank} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm flex-shrink-0">#{item.rank}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${effortColors[item.effort] ?? ''}`}>
                                {item.effort === 'zero' ? 'FREE' : item.effort.toUpperCase()}
                              </span>
                              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{item.category.replace(/_/g, ' ')}</span>
                            </div>
                            <h4 className="font-bold text-white">{item.title}</h4>
                            <p className="text-slate-400 text-sm mt-0.5">{item.description}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-green-400">{fmt(item.savingsPerMonth)}</p>
                            <p className="text-slate-400 text-xs">/month</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                          <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400">Investment</p>
                            <p className="font-bold text-white">{item.investment === 0 ? 'Free' : fmt(item.investment)}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400">Payback</p>
                            <p className="font-bold text-white">{item.paybackMonths === 0 ? 'Instant' : item.paybackMonths < 12 ? `${item.paybackMonths} mo` : `${(item.paybackMonths/12).toFixed(1)} yrs`}</p>
                          </div>
                          <div className="bg-slate-700/50 rounded p-2">
                            <p className="text-slate-400">ROI</p>
                            <p className="font-bold text-green-400">{item.roi}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Wins */}
            {quickWins.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Quick Wins — Zero or Low Investment</h2>
                <p className="text-slate-400 text-sm mb-5">Implement immediately for immediate savings</p>
                <div className="space-y-4">
                  {quickWins.map((item, i) => (
                    <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-green-500/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded font-bold">#{i + 1}</span>
                            <span className={`text-xs px-2 py-0.5 rounded font-bold ${item.effort === 'zero' ? 'bg-green-500/20 text-green-400' : item.effort === 'low' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-orange-500/20 text-orange-400'}`}>
                              {item.effort === 'zero' ? 'FREE' : item.effort.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="font-bold text-white">{item.title}</h4>
                          {item.description && <p className="text-slate-400 text-sm mt-1">{item.description}</p>}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-green-400">{fmt(item.savingsPerMonth)}</p>
                          <p className="text-slate-400 text-xs">per month</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-slate-400">Investment</p>
                          <p className="font-bold text-white">{item.investment === 0 ? 'Free' : fmt(item.investment)}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-slate-400">Annual Saving</p>
                          <p className="font-bold text-green-400">{fmt(item.savingsPerMonth * 12)}</p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2">
                          <p className="text-slate-400">Payback</p>
                          <p className="font-bold text-white">{item.paybackMonths === 0 ? 'Immediate' : `${item.paybackMonths} mo`}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/40 p-5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-green-400">Implement all quick wins</p>
                      <p className="text-slate-400 text-sm">Combined monthly saving</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">{fmt(quickWins.reduce((s, w) => s + w.savingsPerMonth, 0))}/mo</p>
                      <p className="text-slate-400 text-xs">{fmt(quickWins.reduce((s, w) => s + w.savingsPerMonth, 0) * 12)}/year</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Medium Investment */}
            {mediumItems.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Medium Investment</h2>
                <p className="text-slate-400 text-sm mb-5">Small upgrades with strong ROI</p>
                <div className="space-y-3">
                  {mediumItems.map((item, i) => (
                    <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{item.title}</h4>
                        {item.description && <p className="text-slate-400 text-sm mt-1">{item.description}</p>}
                        <p className="text-yellow-400 text-xs mt-2">Investment: {fmt(item.investment)} · Payback: {item.paybackMonths} months</p>
                      </div>
                      <p className="text-xl font-bold text-green-400 flex-shrink-0">{fmt(item.savingsPerMonth)}/mo</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Large Investment */}
            {largeItems.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Large Investment</h2>
                <p className="text-slate-400 text-sm mb-5">Capital investments with long-term returns</p>
                <div className="space-y-3">
                  {largeItems.map((item, i) => (
                    <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{item.title}</h4>
                        {item.description && <p className="text-slate-400 text-sm mt-1">{item.description}</p>}
                        <p className="text-blue-400 text-xs mt-2">Investment: {fmt(item.investment)} · Payback: ~{Math.round(item.paybackMonths / 12)} years</p>
                      </div>
                      <p className="text-xl font-bold text-green-400 flex-shrink-0">{fmt(item.savingsPerMonth)}/mo</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Personalised Recommendations */}
            {topRecs.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Top Personalised Recommendations</h2>
                <div className="space-y-4">
                  {topRecs.slice(0, 5).map((rec, i) => (
                    <div key={i} className={`bg-slate-800 border-l-4 rounded-xl border border-slate-700 p-5 ${i === 0 ? 'border-l-red-500' : i === 1 ? 'border-l-orange-500' : 'border-l-blue-500'}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">Priority {rec.priority}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${rec.effort === 'zero' ? 'bg-green-500/20 text-green-400' : rec.effort === 'low' ? 'bg-yellow-500/20 text-yellow-400' : rec.effort === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'}`}>
                              {rec.effort === 'zero' ? 'No effort' : `${rec.effort} effort`}
                            </span>
                          </div>
                          <h4 className="font-bold text-white">{rec.title}</h4>
                          <p className="text-slate-400 text-sm mt-1">{rec.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-green-400">{rec.impact}</p>
                          <p className="text-slate-400 text-xs">savings</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ════════════ CHAT TAB ════════════ */}
        {activeTab === 'chat' && (
          <div>
            {billId && billId !== 'demo' ? (
              <BillChat billId={billId} />
            ) : (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-10 text-center">
                <p className="text-slate-400 text-sm">Chat is available after uploading a real bill.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── Bottom CTAs ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 border-t border-slate-700 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handlePdfDownload}
            disabled={!billId || billId === 'demo'}
            className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition text-left disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 mb-2 text-blue-400" />
            <p className="font-bold text-white text-sm">Download PDF Report</p>
            <p className="text-slate-400 text-xs mt-1">Full analysis as shareable PDF</p>
          </button>
          <button className="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition text-left">
            <Share2 className="w-5 h-5 mb-2 text-purple-400" />
            <p className="font-bold text-white text-sm">Share Analysis</p>
            <p className="text-slate-400 text-xs mt-1">Send to electrician or family</p>
          </button>
          <button className="p-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl text-left">
            <Star className="w-5 h-5 mb-2 text-white" />
            <p className="font-bold text-white text-sm">Upgrade to Pro</p>
            <p className="text-blue-100 text-xs mt-1">Monthly tracking + unlimited analyses</p>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProfessionalResultsDashboard;
