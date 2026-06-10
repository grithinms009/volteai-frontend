// API response types matching the backend contract

export interface ApiCheck {
  name: string;
  pass: boolean;
  reason: string;
  suggestion?: string | null;
  overcharge?: number | null;
}

export interface ApiSlab {
  label: string;
  rate: number;
  isCurrent: boolean;
}

export interface ApiSavingsOpportunity {
  title: string;
  description?: string;
  savingsPerMonth: number;
  investment: number;
  paybackMonths: number;
  effort: 'zero' | 'low' | 'medium' | 'high';
  category: string;
  annualReturn?: string;
  paybackYears?: number;
  subsidy?: number;
}

export interface ApiRecommendation {
  priority: number;
  title: string;
  description: string;
  impact: string;
  category: string;
  effort: string;
}

export interface ApiApplianceItem {
  name: string;
  kWh: number;
  pct: number;
  wattage: number;
  recommendation: string;
}

export interface ApiApplianceHealthItem {
  appliance: string;
  status: string;
  icon?: string;
  healthLabel: string;
  recommendation: string;
  maintenanceTip?: string;
  efficiencyDrop?: string;
  urgency: 'now' | 'soon' | 'routine' | 'none';
}

export interface ApiMaintenanceTask {
  task: string;
  frequency: string;
  nextDue: string;
  appliance: string;
}

export interface ApiMonthlyTrendPoint {
  month: string;
  units: number;
  bill?: number;
  estimated?: boolean;
  isCurrentMonth?: boolean;
}

export interface ApiAlert {
  severity: 'high' | 'medium' | 'low';
  type: string;
  message: string;
}

export interface ApiActionPlanItem {
  rank: number;
  title: string;
  description: string;
  savingsPerMonth: number;
  investment: number;
  paybackMonths: number;
  roi: string;            // e.g. "23%" or "Instant" for zero-investment items
  effort: 'zero' | 'low' | 'medium' | 'high';
  category: string;
}

// Full analysis result — matches what ProcessingScreen receives via status polling
// and what the /api/bills/:id/analysis endpoint returns inside the `analysis` key.
export interface ApiResult {
  // ── Paid/unlock state ─────────────────────────────────────────
  paid: boolean;

  // ── AI Narrative (Ollama-generated plain-text summary) ────────
  aiNarrative?: string | null;

  // ── Grade & extraction method ─────────────────────────────────
  billGrade?: 'A' | 'B' | 'C' | 'D' | 'F';
  extractionMethod?: 'groq' | 'ollama' | 'regex' | 'failed';

  // ── Action Plan (top 5, sorted by savings — gated by paid) ────
  actionPlan?: ApiActionPlanItem[];

  // ── Top-level metadata ────────────────────────────────────────
  billId?: string;
  status?: string;
  confidence?: string;
  analysisVersion?: string;
  analysisDate?: string;
  confidenceLevel?: string;

  // ── Flat / legacy fields (always present) ─────────────────────
  providerName?: string;
  providerId?: string;
  providerState?: string;
  providerWebsite?: string;
  unitsConsumed?: number;
  totalAmount?: number;
  tariffModel?: string;

  effectiveRate?: number;
  effectiveRateCurrency?: string;
  rateVsRegionAvg?: number;
  rateStatus?: string;

  usageIntensity?: string;
  usageRatio?: number;
  dailyUnits?: number;
  dailyCost?: number;

  efficiencyScore?: number;
  fixedChargePct?: number;
  energyChargePct?: number;
  taxPct?: number;

  monthlySavingsEstimate?: number;
  annualSavingsEstimate?: number;
  potentialSavingsPct?: number;

  slabOptimization?: {
    currentSlab: string;
    targetSlab: string;
    unitsToReduce: number;
    currentBill: number;
    optimizedBill: number;
    savings: number;
    savingsPct: number;
  };

  savingsBreakdown?: { category: string; savings: number; description: string }[];

  topIssues?: {
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    actionable?: boolean;
  }[];

  recommendations?: string[];

  recommendationsDetailed?: ApiRecommendation[];

  deviceBreakdown?: { device: string; units: number; percentage: number }[];

  monthlyTrend?: ApiMonthlyTrendPoint[];

  // ── Engine 1: Bill Accuracy & Fraud Detection ──────────────────
  billAccuracy?: {
    meterReadingValid: boolean;
    tariffCalculationCorrect: boolean;
    overchargeAmount: number;
    fraudScore: number;
    billHealthScore: number;
    overallStatus: string;
    daysUntilDue?: number;
    dueDateStatus?: 'ok' | 'soon' | 'urgent' | 'overdue';
    checks: ApiCheck[];
  };

  // ── Engine 2: Effective Rate Analysis ─────────────────────────
  effectiveRateAnalysis?: {
    effectiveRate: number;
    effectiveRateCurrency: string;
    regionAvgRate: number;
    nationalAvgRate: number;
    ratePercentile: number;
    rateStatus: string;
    rateStatusLabel: string;
    rateComparison: { vs_region: string; vs_national: string; vs_metro: string };
    rateInsights: string[];
  };

  // ── Engine 3: Appliance Breakdown ─────────────────────────────
  applianceBreakdown?: {
    appliances: ApiApplianceItem[];
    totalActual: number;
    phantomLoadKWh: number;
    phantomLoadPct: number;
    phantomLoadCost: number;
    isEstimated: boolean;
    reconciliationStatus: string;
    topConsumer: string;
    suggestion: string;
  };

  // ── Engine 4: Usage Patterns ──────────────────────────────────
  usagePatterns?: {
    dailyAvg: number;
    dailyCost: number;
    weekdayAvg: number;
    weekendAvg: number;
    weekendIncrease: number;
    peakHours: string;
    offPeakHours: string;
    monthlyTrend: string;
    trendIcon?: string;
    consistencyScore: number;
    anomalies: string[];
    historicalSummary?: {
      months: number;
      avgUnits: number;
      minUnits: number;
      maxUnits: number;
      trendPct: string;
    };
    monthlyTrendChart?: ApiMonthlyTrendPoint[];
    insights: string[];
  };

  // ── Engine 5: Tariff Intelligence ─────────────────────────────
  tariffIntelligence?: {
    tariffModel: string;
    tariffExplanation?: string;
    currentSlab: string;
    currentSlabRate: number;
    slabBoundaryRisk: number;
    slabBoundaryRiskAmount?: number;
    slabAlert?: string;
    nextSlabInfo?: {
      label: string;
      rate: number;
      unitsAway: number;
      additionalCost: number;
    };
    optimalUnitsTarget?: number;
    previousSlabOpportunity?: { label: string; rate: number; unitsToReduce: number; savings: number } | null;
    hasTod?: boolean;
    allSlabs?: ApiSlab[];
  };

  // ── Engine 6: Savings Opportunities ──────────────────────────
  savingsOpportunities?: {
    conservative: { total: number; opportunities: ApiSavingsOpportunity[] };
    medium: { total: number; opportunities: ApiSavingsOpportunity[] };
    large: { total: number; opportunities: ApiSavingsOpportunity[] };
    totalSavingsPotential: number;
    monthlySavingsPotential: number;
    quickWins: ApiSavingsOpportunity[];
  };

  // ── Engine 7: Recommendations ─────────────────────────────────
  recommendationsData?: {
    topRecommendations: ApiRecommendation[];
    allRecommendations?: ApiRecommendation[];
    byCategory?: Record<string, ApiRecommendation[]>;
    totalRecommendations: number;
  };

  // ── Engine 8: Comparisons ─────────────────────────────────────
  comparisons?: {
    peerComparison?: {
      peerAvgUnits: number;
      yourUnits: number;
      vsPercent: number;
      ranking: string;
      rankingLabel: string;
      percentile: number;
      peerAvgBill: number;
      yourBill: number;
      message: string;
    };
    regionalBenchmark?: {
      state: string;
      stateAvgUnits: number;
      yourUnits: number;
      diffPct: number;
    };
    nationalBenchmark?: {
      country: string;
      nationalAvgUnits: number;
      yourUnits: number;
      diffPct: number;
      interpretation: string;
    };
    globalBenchmark?: {
      perCapitaUsage: number;
      globalMiddleIncomeAvg: number;
      diffPct: number;
      context: string;
    };
  };

  // ── Engine 9: Predictions ────────────────────────────────────
  predictions?: {
    nextMonthEstimate?: {
      month: string;
      units: number;
      bill: number;
      confidence: string;
      note?: string;
    };
    annualProjection?: { units: number; bill: number; note?: string };
    rateIncreaseProjection?: { year: number; rate: number; annualBill: number }[];
    consumptionTrend?: string;
    trendNote?: string;
    solarBreakeven?: {
      years: number;
      capacity: string;
      investmentRequired: number;
      annualSavings: number;
    };
    seasonalForecast?: ApiMonthlyTrendPoint[];
    insights?: string[];
  };

  // ── Engine 10: Appliance Health ───────────────────────────────
  applianceHealth?: {
    applianceHealth: ApiApplianceHealthItem[];
    urgentItems?: { appliance: string; status: string; urgency: string }[];
    maintenanceCalendar?: ApiMaintenanceTask[];
    totalUrgentCount: number;
    overallHealthScore: number;
  };

  // ── Cross-engine alerts ────────────────────────────────────────
  alerts?: ApiAlert[];

  totalSavingsPotential?: number;
  topRecommendations?: ApiRecommendation[];
}

// Shape returned by the payment endpoints
export interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  paid: boolean;
}
