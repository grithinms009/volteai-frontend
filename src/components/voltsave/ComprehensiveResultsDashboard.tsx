import { useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Zap, 
  Shield, Home, DollarSign, PieChart, BarChart3, Activity,
  Clock, Calendar, Lightbulb, Thermometer, Wifi, Battery,
  Award, Target, Calculator, FileText, Users, Globe,
  ChevronDown, ChevronUp, Info, AlertCircle, Star, Share2
} from "lucide-react";

export interface AnalysisResult {
  // Payment Status
  paid: boolean;
  
  // Bill Analysis
  billAnalysis: {
    effectiveRate: number;
    tariffModel: string;
    anomalyScore: number;
    anomalies: string[];
    overchargeAmount?: number;
    meterValidation: {
      isNormal: boolean;
      variance: number;
      explanation: string;
    };
    tariffVerification: {
      isCorrect: boolean;
      issues: string[];
    };
  };
  
  // Appliance Breakdown
  applianceBreakdown: {
    [key: string]: {
      kWh: number;
      percentage: number;
      recommendation: string;
      age?: number;
      efficiency?: string;
      replacementSavings?: number;
      replacementCost?: number;
    };
  };
  phantomLoad: {
    monthlyCost: number;
    annualCost: number;
    devices: string[];
    totalWatts?: number;
  };
  
  // Usage Patterns
  usagePatterns: {
    daily: {
      peakHours: string[];
      offPeakHours: string[];
      averageHourly: number;
      consistencyScore: number;
    };
    weekly: {
      weekdayAvg: number;
      weekendAvg: number;
      variation: number;
      mostUsedDay?: string;
      leastUsedDay?: string;
    };
    monthly: {
      summer: number;
      winter: number;
      monsoon: number;
      variation: number;
    };
    anomalies: Array<{
      month: string;
      issue: string;
      confidence: number;
      severity?: "low" | "medium" | "high";
    }>;
  };
  
  // Cost Optimization
  costOptimization: {
    quickWins: Array<{
      title: string;
      savingsPerMonth: number;
      investment: number;
      paybackMonths: number;
      priority: number;
      difficulty?: "Easy" | "Medium" | "Hard";
      description?: string;
    }>;
    mediumInvestment: Array<{
      title: string;
      savingsPerMonth: number;
      investment: number;
      paybackMonths: number;
      description?: string;
    }>;
    largeInvestment: Array<{
      title: string;
      savingsPerMonth: number;
      investment: number;
      paybackYears: number;
      subsidy?: number;
      description?: string;
      roi?: number;
    }>;
    behavioralChanges: Array<{
      title: string;
      savingsPerMonth: number;
      description: string;
      implementation?: string;
    }>;
  };
  
  // Tariff Intelligence
  tariffIntelligence: {
    currentSubsidy?: {
      amount: number;
      eligibility: string;
      process: string;
      deadline?: string;
    };
    alternativeTariffs: Array<{
      name: string;
      monthlyCost: number;
      savings: number;
      description: string;
    }>;
    rateForecast: {
      sixMonths: number;
      twelveMonths: number;
      annualIncrease: number;
      confidence?: number;
    };
    demandCharge?: {
      currentPeak: number;
      reductionPotential: number;
      savings: number;
      recommendation?: string;
    };
  };
  
  // Financial Insights
  financialInsights: {
    monthlyBudget: {
      fixed: number;
      variable: number;
      controllable: number;
      recommended: number;
      savings: number;
    };
    spendingComparison: {
      yourSpending: number;
      similarHousehold: number;
      variance: number;
      reason: string;
      peerGroupSize?: number;
    };
    annualProjection: {
      current: number;
      withIncrease: number;
      withOptimization: number;
      savings: number;
      fiveYearProjection?: number;
    };
    paymentAlerts?: {
      dueDate: string;
      daysUntilDue: number;
      lateFee: number;
      autopayAvailable: boolean;
    };
  };
  
  // Recommendations
  recommendations: {
    priority1: Array<{
      title: string;
      savings: number;
      investment: number;
      payback: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      impact?: "High" | "Medium" | "Low";
      description?: string;
    }>;
    priority2: Array<{
      title: string;
      savings: number;
      investment: number;
      payback: string;
    }>;
    priority3: Array<{
      title: string;
      savings: number;
      investment: number;
      payback: string;
      description?: string;
    }>;
    personalized: string[];
    seasonal: {
      current: string;
      recommendations: string[];
      nextSeason?: string[];
    };
    implementationPlan?: {
      month1: string[];
      month3: string[];
      month6: string[];
      year1: string[];
    };
  };
  
  // Benchmarking
  benchmarking: {
    peerComparison: {
      yourConsumption: number;
      peerAverage: number;
      peerMedian?: number;
      variance: number;
      percentile?: number;
      reason: string;
      peerGroup?: {
        size: string;
        occupants: number;
        income: string;
        region: string;
      };
    };
    globalComparison: {
      yourRate: number;
      indiaAverage: number;
      globalAverage: number;
      developedCountriesAvg?: number;
      rank?: string;
    };
    regionalInsights: {
      stateName: string;
      rating: number;
      cheapestState: { name: string; rate: number };
      mostExpensive: { name: string; rate: number };
      subsidyProgram: string;
    };
    topPerformers?: Array<{
      state: string;
      avgConsumption: number;
      avgRate: number;
      efficiency: number;
    }>;
  };
  
  // AI Insights
  aiInsights: {
    behavioralNudges: string[];
    predictiveAlerts: Array<{
      alert: string;
      timeframe: string;
      impact: string;
      action: string;
    }>;
    smartScheduling: {
      description: string;
      savings: number;
      schedule?: Array<{
        appliance: string;
        recommendedHours: string[];
        reason: string;
      }>;
    };
    deviceLifecycle: Array<{
      device: string;
      age: number;
      lifespan: number;
      recommendation: string;
      urgency?: "Low" | "Medium" | "High";
      optimalReplacementTime?: string;
    }>;
    anomalies?: Array<{
      type: string;
      description: string;
      confidence: number;
      action: string;
    }>;
  };
  
  // Metadata
  metadata: {
    paid: boolean;
    providerName: string;
    billingPeriod: string;
    totalAmount: number;
    unitsConsumed: number;
    analysisDate: string;
    confidence: number;
    dataSources: string[];
    version: string;
  };
}

interface ComprehensiveResultsDashboardProps {
  result: AnalysisResult;
  onUnlock?: () => void;
}

const ComprehensiveResultsDashboard: React.FC<ComprehensiveResultsDashboardProps> = ({ 
  result, 
  onUnlock 
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('bill-accuracy');
  const [showFullReport, setShowFullReport] = useState(result?.paid || false);

  // Handle undefined result
  if (!result) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Loading Analysis...</h1>
          <p className="text-slate-400">Please wait while we process your electricity bill</p>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    sectionKey,
    alert = false 
  }: {
    icon: any;
    title: string;
    subtitle: string;
    sectionKey: string;
    alert?: boolean;
  }) => (
    <motion.div
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          alert ? 'bg-red-500/20' : 'bg-blue-500/20'
        }`}>
          <Icon className={`w-5 h-5 ${alert ? 'text-red-400' : 'text-blue-400'}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {alert && (
          <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            Action Required
          </span>
        )}
        {expandedSection === sectionKey ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </div>
    </motion.div>
  );

  if (!result.paid) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl p-8 border border-slate-700"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Your Energy Analysis</h1>
              <p className="text-slate-400">Get comprehensive insights and savings recommendations</p>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{formatCurrency(result.billAnalysis?.effectiveRate || 0)}/kWh</p>
                <p className="text-sm text-slate-400">Effective Rate</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {formatCurrency(result.costOptimization?.quickWins?.reduce((sum, item) => sum + item.savingsPerMonth, 0) || 0)}
                </p>
                <p className="text-sm text-slate-400">Monthly Savings Potential</p>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{result.billAnalysis?.anomalyScore || 0}%</p>
                <p className="text-sm text-slate-400">Anomaly Score</p>
              </div>
            </div>

            {/* Preview of Findings */}
            <div className="space-y-4 mb-8">
              {(result.billAnalysis?.anomalies || []).slice(0, 3).map((anomaly, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm">{anomaly}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <button
                onClick={onUnlock}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all"
              >
                Unlock Full Report - {formatCurrency(199)}
              </button>
              <p className="text-sm text-slate-400 mt-2">
                Get 50+ insights, personalized recommendations, and detailed analysis
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Comprehensive Energy Analysis</h1>
              <p className="text-slate-400">
                {result.metadata?.providerName || 'Unknown Provider'} • {result.metadata?.billingPeriod || 'Unknown Period'} • {result.metadata?.unitsConsumed || 0} kWh
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Total Bill</p>
              <p className="text-2xl font-bold">{formatCurrency(result.metadata?.totalAmount || 0)}</p>
            </div>
          </div>
        </motion.div>

        {/* Bill Accuracy & Fraud Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
        >
          <SectionHeader
            icon={Shield}
            title="Bill Accuracy & Fraud Detection"
            subtitle="Verify charges and detect anomalies"
            sectionKey="bill-accuracy"
            alert={(result.billAnalysis?.anomalyScore || 0) > 20}
          />
          
          {expandedSection === 'bill-accuracy' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 pb-6 space-y-6"
            >
              {/* Meter Reading Validation */}
              <div className={`p-4 rounded-lg ${
                result.billAnalysis?.meterValidation?.isNormal 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {result.billAnalysis?.meterValidation?.isNormal ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <h4 className="font-semibold">Meter Reading Validation</h4>
                </div>
                <p className="text-sm text-slate-300 mb-2">
                  {result.billAnalysis?.meterValidation?.explanation || ''}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span>Variance: {result.billAnalysis?.meterValidation?.variance || 0}%</span>
                  <span>Anomaly Score: {result.billAnalysis?.anomalyScore || 0}/100</span>
                </div>
              </div>

              {/* Tariff Verification */}
              <div className={`p-4 rounded-lg ${
                result.billAnalysis?.tariffVerification?.isCorrect 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {result.billAnalysis?.tariffVerification?.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <h4 className="font-semibold">Tariff Verification</h4>
                </div>
                {(result.billAnalysis?.tariffVerification?.issues?.length || 0) > 0 ? (
                  <ul className="space-y-1">
                    {result.billAnalysis?.tariffVerification?.issues?.map((issue, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-400">All charges calculated correctly</p>
                )}
                {result.billAnalysis?.overchargeAmount && (
                  <p className="text-sm text-red-400 mt-2">
                    Overcharge detected: {formatCurrency(result.billAnalysis.overchargeAmount)}
                  </p>
                )}
              </div>

              {/* Anomalies */}
              {(result.billAnalysis?.anomalies?.length || 0) > 0 && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Detected Anomalies
                  </h4>
                  <ul className="space-y-2">
                    {result.billAnalysis?.anomalies?.map((anomaly, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                        {anomaly}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Effective Rate Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
        >
          <SectionHeader
            icon={Calculator}
            title="Effective Rate Analysis"
            subtitle="Compare your rate with regional averages"
            sectionKey="effective-rate"
          />
          
          {expandedSection === 'effective-rate' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 pb-6 space-y-6"
            >
              {/* Your Effective Rate */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-xl border border-blue-500/30">
                <p className="text-sm text-slate-400 mb-2">Your Effective Rate</p>
                <p className="text-4xl font-bold mb-2">
                  {formatCurrency(result.billAnalysis?.effectiveRate || 0)}/kWh
                </p>
                <p className="text-sm text-slate-400">
                  All-inclusive rate including taxes and charges
                </p>
              </div>

              {/* Rate Comparison */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Regional Comparison</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Your Rate</span>
                      <span className="font-semibold">{formatCurrency(result.billAnalysis.effectiveRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">State Average</span>
                      <span>{formatCurrency(result.benchmarking?.globalComparison?.indiaAverage || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">National Average</span>
                      <span>{formatCurrency(result.benchmarking?.globalComparison?.globalAverage || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <h4 className="font-semibold mb-3">Rate Forecast</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Current Rate</span>
                      <span className="font-semibold">{formatCurrency(result.billAnalysis.effectiveRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">In 6 Months</span>
                      <span>{formatCurrency(result.tariffIntelligence?.rateForecast?.sixMonths || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">In 12 Months</span>
                      <span>{formatCurrency(result.tariffIntelligence?.rateForecast?.twelveMonths || 0)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Projected increase: +{result.tariffIntelligence?.rateForecast?.annualIncrease || 0}% annually
                  </p>
                </div>
              </div>

              {/* Tariff Model Info */}
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <h4 className="font-semibold mb-2">Current Tariff Model</h4>
                <p className="text-sm text-slate-300">{result.billAnalysis?.tariffModel || 'Unknown'}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Appliance-Level Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
        >
          <SectionHeader
            icon={Home}
            title="Appliance-Level Breakdown"
            subtitle="Understand your consumption by device"
            sectionKey="appliance-breakdown"
          />
          
          {expandedSection === 'appliance-breakdown' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 pb-6 space-y-6"
            >
              {/* Appliance Breakdown Chart */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(result.applianceBreakdown || {}).map(([appliance, data]) => (
                  <div key={appliance} className="p-4 bg-slate-900/50 rounded-lg text-center">
                    <h4 className="font-medium text-sm mb-2">{appliance}</h4>
                    <p className="text-2xl font-bold mb-1">{data.kWh} kWh</p>
                    <p className="text-xs text-slate-400">{data.percentage}% of total</p>
                    {data.replacementSavings && (
                      <p className="text-xs text-green-400 mt-2">
                        Save {formatCurrency(data.replacementSavings)}/mo
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Phantom Load */}
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-red-400" />
                  Phantom Load Detection
                </h4>
                <p className="text-sm text-slate-300 mb-3">
                  Devices consuming power even when not in use
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Monthly Cost</p>
                    <p className="text-lg font-semibold text-red-400">
                      {formatCurrency(result.phantomLoad.monthlyCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Annual Cost</p>
                    <p className="text-lg font-semibold text-red-400">
                      {formatCurrency(result.phantomLoad.annualCost)}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-slate-400 mb-2">Devices to unplug:</p>
                  <div className="flex flex-wrap gap-2">
                    {result.phantomLoad.devices.map((device, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-800 rounded text-xs">
                        {device}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Cost Optimization & Savings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
        >
          <SectionHeader
            icon={TrendingUp}
            title="Cost Optimization & Savings"
            subtitle="Actionable recommendations to reduce your bill"
            sectionKey="cost-optimization"
          />
          
          {expandedSection === 'cost-optimization' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 pb-6 space-y-6"
            >
              {/* Quick Wins */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  Quick Wins (No/Low Investment)
                </h4>
                <div className="space-y-3">
                  {(result.costOptimization?.quickWins || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-slate-400">
                            Investment: {formatCurrency(item.investment)} • Payback: {item.paybackMonths} months
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-400">
                            {formatCurrency(item.savingsPerMonth)}/mo
                          </p>
                          <p className="text-xs text-slate-400">Priority {item.priority}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-green-400">
                    Total Quick Wins: {formatCurrency(
                      (result.costOptimization?.quickWins || []).reduce((sum, item) => sum + item.savingsPerMonth, 0)
                    )}/month
                  </p>
                </div>
              </div>

              {/* Medium Investment */}
              <div>
                <h4 className="font-semibold mb-3">Medium Investment (₹500 - ₹10,000)</h4>
                <div className="space-y-3">
                  {(result.costOptimization?.mediumInvestment || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-slate-400">
                            Investment: {formatCurrency(item.investment)} • Payback: {item.paybackMonths} months
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-400">
                            {formatCurrency(item.savingsPerMonth)}/mo
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Large Investment */}
              <div>
                <h4 className="font-semibold mb-3">Large Investment (₹50,000+)</h4>
                <div className="space-y-3">
                  {(result.costOptimization?.largeInvestment || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-slate-400">
                            Investment: {formatCurrency(item.investment)} • Payback: {item.paybackYears} years
                          </p>
                          {item.subsidy && (
                            <p className="text-xs text-green-400">
                              Subsidy available: {formatCurrency(item.subsidy)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-purple-400">
                            {formatCurrency(item.savingsPerMonth)}/mo
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Behavioral Changes */}
              <div>
                <h4 className="font-semibold mb-3">Behavioral Changes (No Cost)</h4>
                <div className="space-y-3">
                  {(result.costOptimization?.behavioralChanges || []).map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{item.title}</h5>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-300">
                            {formatCurrency(item.savingsPerMonth)}/mo
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Recommendations Engine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
        >
          <SectionHeader
            icon={Lightbulb}
            title="AI Recommendations Engine"
            subtitle="Personalized insights based on your usage patterns"
            sectionKey="recommendations"
          />
          
          {expandedSection === 'recommendations' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 pb-6 space-y-6"
            >
              {/* Priority 1 */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">Priority 1</span>
                  Immediate Actions
                </h4>
                <div className="space-y-3">
                  {(result.recommendations?.priority1 || []).map((rec, idx) => (
                    <div key={idx} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{rec.title}</h5>
                          <p className="text-sm text-slate-400 mt-1">
                            Difficulty: {rec.difficulty} • Payback: {rec.payback}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-400">
                            {formatCurrency(rec.savings)}/mo
                          </p>
                          <p className="text-xs text-slate-400">
                            Invest: {formatCurrency(rec.investment)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority 2 */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">Priority 2</span>
                  Short-term
                </h4>
                <div className="space-y-3">
                  {(result.recommendations?.priority2 || []).map((rec, idx) => (
                    <div key={idx} className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{rec.title}</h5>
                          <p className="text-sm text-slate-400 mt-1">Payback: {rec.payback}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-yellow-400">
                            {formatCurrency(rec.savings)}/mo
                          </p>
                          <p className="text-xs text-slate-400">
                            Invest: {formatCurrency(rec.investment)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized Recommendations */}
              <div>
                <h4 className="font-semibold mb-3">Personalized for You</h4>
                <div className="space-y-2">
                  {(result.recommendations?.personalized || []).map((rec, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seasonal Recommendations */}
              <div>
                <h4 className="font-semibold mb-3">Current Season: {result.recommendations?.seasonal?.current || 'Unknown'}</h4>
                <div className="space-y-2">
                  {(result.recommendations?.seasonal?.recommendations || []).map((rec, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-300">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
        >
          <SectionHeader
            icon={Activity}
            title="AI Insights"
            subtitle="Advanced behavioral analysis and predictions"
            sectionKey="ai-insights"
          />
          
          {expandedSection === 'ai-insights' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="px-6 pb-6 space-y-6"
            >
              {/* Behavioral Nudges */}
              <div>
                <h4 className="font-semibold mb-3">Behavioral Nudges</h4>
                <div className="space-y-2">
                  {(result.aiInsights?.behavioralNudges || []).map((nudge, idx) => (
                    <div key={idx} className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-slate-300">{nudge}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Predictive Alerts */}
              <div>
                <h4 className="font-semibold mb-3">Predictive Alerts</h4>
                <div className="space-y-2">
                  {(result.aiInsights?.predictiveAlerts || []).map((alert, idx) => (
                    <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-300 font-medium">{alert.alert}</p>
                        <p className="text-xs text-slate-400 mt-1">{alert.timeframe} • {alert.impact}</p>
                        <p className="text-xs text-blue-400 mt-1">Action: {alert.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Device Lifecycle */}
              <div>
                <h4 className="font-semibold mb-3">Device Lifecycle Management</h4>
                <div className="space-y-3">
                  {(result.aiInsights?.deviceLifecycle || []).map((device, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium">{device.device}</h5>
                          <p className="text-sm text-slate-400">
                            Age: {device.age} years • Lifespan: {device.lifespan} years
                          </p>
                        </div>
                        <div className="text-right">
                          {device.age > device.lifespan ? (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">Replace Now</span>
                          ) : device.age > device.lifespan * 0.8 ? (
                            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">Plan Soon</span>
                          ) : (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Good</span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-300 mt-2">{device.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Download Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800 rounded-2xl p-6 border border-slate-700"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Download PDF Report
            </button>
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComprehensiveResultsDashboard;
