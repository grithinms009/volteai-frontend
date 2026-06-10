import type { ApiResult } from '@/types/analysis';

export const DEMO_RESULT: ApiResult = {
  paid: false,
  confidenceLevel: "high",
  billGrade: "C",
  extractionMethod: "groq",
  analysisVersion: "3.0",
  analysisDate: new Date().toISOString(),

  // Flat / legacy
  providerName: "Kerala State Electricity Board",
  providerId: "kseb",
  providerState: "Kerala",
  providerWebsite: "https://wss.kseb.in/",
  unitsConsumed: 245,
  totalAmount: 1580,
  tariffModel: "tiered",
  effectiveRate: 6.45,
  effectiveRateCurrency: "INR",
  rateVsRegionAvg: 12.3,
  rateStatus: "average",
  usageIntensity: "medium",
  usageRatio: 1.05,
  dailyUnits: 8.2,
  dailyCost: 53,
  efficiencyScore: 68,
  fixedChargePct: 8.2,
  energyChargePct: 76.5,
  taxPct: 15.3,
  monthlySavingsEstimate: 680,
  annualSavingsEstimate: 8160,
  potentialSavingsPct: 43,

  slabOptimization: {
    currentSlab: "201-300 units",
    targetSlab: "101-200 units",
    unitsToReduce: 45,
    currentBill: 1580,
    optimizedBill: 1210,
    savings: 370,
    savingsPct: 23,
  },

  topIssues: [
    { title: "🚨 Reduce 45 units to save ₹370/mo", description: "You're close to a slab boundary", severity: "high", actionable: true },
    { title: "AC temperature too low", description: "Set at 18°C instead of 26°C", severity: "medium", actionable: true },
    { title: "Standby load detected", description: "~₹150/month phantom drain", severity: "medium", actionable: true },
  ],

  recommendations: [
    "Reduce 45 units to drop to a cheaper slab — saves ₹370/mo",
    "Set AC to 24-26°C (not 18-20°C) — saves ₹126/mo",
    "Use smart power strips to eliminate phantom loads — saves ₹95/mo",
  ],

  recommendationsDetailed: [
    { priority: 1, title: "🚨 Reduce 45 units — save ₹370/month", description: "You are very close to the next slab boundary", impact: "₹370/month", category: "slab_optimization", effort: "medium" },
    { priority: 2, title: "Optimize AC temperature", description: "Set AC to 24-26°C", impact: "₹126/month", category: "appliance", effort: "zero" },
  ],

  deviceBreakdown: [
    { device: "Air Conditioner", units: 93, percentage: 38 },
    { device: "Water Heater", units: 44, percentage: 18 },
    { device: "Refrigerator", units: 37, percentage: 15 },
    { device: "Lighting", units: 29, percentage: 12 },
    { device: "Washing Machine", units: 17, percentage: 7 },
    { device: "TV & Entertainment", units: 15, percentage: 6 },
    { device: "Other", units: 10, percentage: 4 },
  ],

  monthlyTrend: [
    { month: "Jan", units: 177, estimated: true },
    { month: "Feb", units: 172, estimated: true },
    { month: "Mar", units: 188, estimated: true },
    { month: "Apr", units: 210, estimated: true },
    { month: "May", units: 245, estimated: false },
    { month: "Jun", units: 319, estimated: true },
  ],

  // Engine 1
  billAccuracy: {
    meterReadingValid: true,
    tariffCalculationCorrect: true,
    overchargeAmount: 0,
    fraudScore: 0,
    billHealthScore: 100,
    overallStatus: "healthy",
    daysUntilDue: 12,
    dueDateStatus: "ok",
    checks: [
      { name: "Meter Reading Validity", pass: true, reason: "Consumption 245 kWh is within expected range (±15% of regional avg 200 units)" },
      { name: "Tariff Calculation", pass: true, reason: "Bill matches expected tariff within 10%", overcharge: null, suggestion: null },
      { name: "Fixed Charge Validity", pass: true, reason: "Fixed charge ₹130 matches expected ₹130" },
      { name: "Outstanding Arrears", pass: true, reason: "No outstanding arrears", suggestion: null },
    ],
  },

  // Engine 2
  effectiveRateAnalysis: {
    effectiveRate: 6.45,
    effectiveRateCurrency: "INR",
    regionAvgRate: 5.74,
    nationalAvgRate: 6.0,
    ratePercentile: 62,
    rateStatus: "average",
    rateStatusLabel: "Average",
    rateComparison: { vs_region: "+12.3%", vs_national: "+7.5%", vs_metro: "-10.4%" },
    rateInsights: [
      "Your effective rate: ₹6.45/unit",
      "Regional average: ₹5.74/unit",
      "Your rate is in line with the regional average",
    ],
  },

  // Engine 3
  applianceBreakdown: {
    appliances: [
      { name: "Air Conditioner", kWh: 93, pct: 38, wattage: 1500, recommendation: "Set to 24-26°C, clean filters monthly" },
      { name: "Water Heater", kWh: 44, pct: 18, wattage: 2000, recommendation: "Install timer — limit to 30 min/day" },
      { name: "Refrigerator", kWh: 37, pct: 15, wattage: 150, recommendation: "Keep at 3-5°C, defrost regularly" },
      { name: "Lighting", kWh: 29, pct: 12, wattage: 100, recommendation: "Replace all bulbs with LED" },
      { name: "Washing Machine", kWh: 17, pct: 7, wattage: 500, recommendation: "Always run full loads" },
      { name: "TV & Entertainment", kWh: 15, pct: 6, wattage: 120, recommendation: "Enable power-saving mode" },
      { name: "Fan & Cooling", kWh: 10, pct: 4, wattage: 75, recommendation: "Use ceiling fans alongside AC" },
    ],
    totalActual: 245,
    phantomLoadKWh: 20,
    phantomLoadPct: 8,
    phantomLoadCost: 130,
    isEstimated: true,
    reconciliationStatus: "estimated",
    topConsumer: "Air Conditioner",
    suggestion: "Enter your actual appliance list for a precise breakdown",
  },

  // Engine 4
  usagePatterns: {
    dailyAvg: 8.2,
    dailyCost: 53,
    weekdayAvg: 7.5,
    weekendAvg: 9.9,
    weekendIncrease: 32,
    peakHours: "14:00-21:00",
    offPeakHours: "22:00-07:00",
    monthlyTrend: "stable",
    trendIcon: "➡️",
    consistencyScore: 81,
    anomalies: [],
    historicalSummary: { months: 4, avgUnits: 231, minUnits: 177, maxUnits: 319, trendPct: "2.3" },
    monthlyTrendChart: [
      { month: "Jan", units: 177, estimated: true },
      { month: "Feb", units: 172, estimated: true },
      { month: "Mar", units: 188, estimated: true },
      { month: "Apr", units: 210, estimated: true },
      { month: "May", units: 245, estimated: false },
      { month: "Jun", units: 319, estimated: true },
    ],
    insights: [
      "Weekend usage is 32% higher — likely increased home occupancy",
      "Peak consumption occurs between 14:00-21:00",
    ],
  },

  // Engine 5
  tariffIntelligence: {
    tariffModel: "tiered",
    tariffExplanation: "Slab/Tiered tariff: You pay progressively higher rates as consumption increases.",
    currentSlab: "201-300 units",
    currentSlabRate: 5.8,
    slabBoundaryRisk: 85,
    slabBoundaryRiskAmount: 0,
    slabAlert: "Only 45 more units will push you to the next slab (₹7.1/unit vs current ₹5.8/unit)",
    nextSlabInfo: { label: "301-500 units", rate: 7.1, unitsAway: 45, additionalCost: 320 },
    optimalUnitsTarget: 299,
    previousSlabOpportunity: { label: "101-200 units", rate: 4.6, unitsToReduce: 45, savings: 370 },
    hasTod: false,
    allSlabs: [
      { label: "0-100 units", rate: 3.15, isCurrent: false },
      { label: "101-200 units", rate: 4.6, isCurrent: false },
      { label: "201-300 units", rate: 5.8, isCurrent: true },
      { label: "301-500 units", rate: 7.1, isCurrent: false },
      { label: "500+ units", rate: 7.9, isCurrent: false },
    ],
  },

  // Engine 6
  savingsOpportunities: {
    conservative: {
      total: 591,
      opportunities: [
        { title: "Set AC to 24-26°C", description: "Every 1°C increase saves 3-5% on cooling costs", savingsPerMonth: 126, investment: 0, paybackMonths: 0, effort: "zero", category: "behavior" },
        { title: "Eliminate phantom / standby loads", description: "Use smart strips to cut idle device drain", savingsPerMonth: 95, investment: 500, paybackMonths: 6, effort: "low", category: "behavior" },
        { title: "Reduce 45 units to drop a slab", description: "Drop from Slab 3 to Slab 2 and save significantly", savingsPerMonth: 370, investment: 0, paybackMonths: 0, effort: "medium", category: "slab_optimization" },
      ],
    },
    medium: {
      total: 316,
      opportunities: [
        { title: "Switch all lights to LED", description: "75% less power, 25x longer lifespan", savingsPerMonth: 126, investment: 2000, paybackMonths: 16, effort: "low", category: "appliance_upgrade" },
        { title: "Install AC timer or smart thermostat", description: "Automate AC scheduling to peak-cool hours only", savingsPerMonth: 190, investment: 3000, paybackMonths: 16, effort: "low", category: "smart_tech" },
      ],
    },
    large: {
      total: 869,
      opportunities: [
        { title: "2kW Rooftop Solar Installation", description: "Kerala has excellent solar potential (4.5 kWh/m²/day)", savingsPerMonth: 869, investment: 120000, paybackMonths: 138, effort: "high", category: "renewable" },
      ],
    },
    totalSavingsPotential: 22812,
    monthlySavingsPotential: 1051,
    quickWins: [
      { title: "Set AC to 24-26°C", savingsPerMonth: 126, investment: 0, paybackMonths: 0, effort: "zero", category: "behavior" },
      { title: "Eliminate phantom / standby loads", savingsPerMonth: 95, investment: 500, paybackMonths: 6, effort: "low", category: "behavior" },
      { title: "Reduce 45 units to drop a slab", savingsPerMonth: 370, investment: 0, paybackMonths: 0, effort: "medium", category: "slab_optimization" },
    ],
  },

  // Engine 7
  recommendationsData: {
    topRecommendations: [
      { priority: 1, title: "🚨 Reduce 45 units — save ₹370/month", description: "You are very close to the next slab boundary. Reducing just 45 units avoids a significant rate jump.", impact: "₹370/month", category: "slab_optimization", effort: "low" },
      { priority: 2, title: "Optimize AC — your largest expense", description: "Set AC temperature to 24-26°C instead of 18-20°C.", impact: "₹126/month", category: "appliance", effort: "zero" },
      { priority: 3, title: "Eliminate phantom loads", description: "Always-on standby devices waste ₹95-150/month.", impact: "₹95/month", category: "behavior", effort: "low" },
    ],
    totalRecommendations: 12,
  },

  // Engine 8
  comparisons: {
    peerComparison: {
      peerAvgUnits: 200,
      yourUnits: 245,
      vsPercent: 22,
      ranking: "slightly_high",
      rankingLabel: "Slightly Above Average",
      percentile: 61,
      peerAvgBill: 1148,
      yourBill: 1580,
      message: "You use 22% more than similar homes in your region",
    },
    regionalBenchmark: { state: "Kerala", stateAvgUnits: 200, yourUnits: 245, diffPct: 22 },
    nationalBenchmark: { country: "India", nationalAvgUnits: 200, yourUnits: 245, diffPct: 22, interpretation: "Near national average" },
    globalBenchmark: { perCapitaUsage: 61, globalMiddleIncomeAvg: 150, diffPct: -59, context: "Within or below global middle-income average." },
  },

  // Engine 9
  predictions: {
    nextMonthEstimate: { month: "Jun", units: 319, bill: 2058, confidence: "medium", note: "Based on seasonal patterns" },
    annualProjection: { units: 2744, bill: 17699, note: "Full-year estimate using seasonal adjustment factors" },
    rateIncreaseProjection: [
      { year: 2025, rate: 6.45, annualBill: 17699 },
      { year: 2026, rate: 6.97, annualBill: 19115 },
      { year: 2027, rate: 7.55, annualBill: 20705 },
      { year: 2028, rate: 8.19, annualBill: 22477 },
    ],
    consumptionTrend: "stable",
    trendNote: "Your consumption is stable",
    solarBreakeven: { years: 11.5, capacity: "2kW", investmentRequired: 120000, annualSavings: 9734 },
    seasonalForecast: [
      { month: "Jan", units: 177, bill: 1141, isCurrentMonth: false },
      { month: "May", units: 245, bill: 1580, isCurrentMonth: true },
      { month: "Jun", units: 319, bill: 2058, isCurrentMonth: false },
    ],
    insights: ["Next month (Jun): ~319 units, ~₹2058", "Annual projection: ~₹17,699"],
  },

  // Engine 10
  applianceHealth: {
    applianceHealth: [
      { appliance: "Air Conditioner", status: "heavy_use", icon: "⚠️", healthLabel: "Heavy Usage — Service Needed", recommendation: "AC is running intensively. Service filters every 3 months.", maintenanceTip: "Clean or replace filters every 1-3 months.", efficiencyDrop: "15-25% if not serviced", urgency: "soon" },
      { appliance: "Refrigerator", status: "check_recommended", icon: "🔍", healthLabel: "Periodic Check Recommended", recommendation: "Check door seals — a worn seal wastes 25% energy.", maintenanceTip: "Clean condenser coils every 6 months.", urgency: "routine" },
      { appliance: "Lighting", status: "good", icon: "✅", healthLabel: "Good", recommendation: "LED lighting is in use. No action needed.", urgency: "none" },
    ],
    urgentItems: [{ appliance: "Air Conditioner", status: "heavy_use", urgency: "soon" }],
    maintenanceCalendar: [
      { task: "Clean AC filters", frequency: "Monthly", nextDue: "1 month", appliance: "Air Conditioner" },
      { task: "Check refrigerator door seal", frequency: "Quarterly", nextDue: "3 months", appliance: "Refrigerator" },
      { task: "Service AC", frequency: "Annually", nextDue: "12 months", appliance: "Air Conditioner" },
      { task: "Descale water heater", frequency: "Annually", nextDue: "12 months", appliance: "Water Heater" },
    ],
    totalUrgentCount: 1,
    overallHealthScore: 85,
  },

  alerts: [
    { severity: "high", type: "slab", message: "Only 45 more units will push you to the next slab (₹7.1/unit vs current ₹5.8/unit)" },
    { severity: "medium", type: "maintenance", message: "1 appliance(s) need attention — Air Conditioner" },
  ],

  totalSavingsPotential: 22812,

  actionPlan: [
    { rank: 1, title: "Reduce 45 units to drop a slab", description: "Stay below 300 units to avoid the ₹7.1/unit slab. Small daily habit changes can achieve this.", savingsPerMonth: 370, investment: 0, paybackMonths: 0, roi: "Instant", effort: "medium", category: "slab_optimization" },
    { rank: 2, title: "Set AC to 24–26°C", description: "Every 1°C lower costs 3–5% more. Raising from 18°C to 24°C saves significantly.", savingsPerMonth: 126, investment: 0, paybackMonths: 0, roi: "Instant", effort: "zero", category: "behavior" },
    { rank: 3, title: "Eliminate phantom / standby loads", description: "Smart power strips cut idle device drain completely.", savingsPerMonth: 95, investment: 500, paybackMonths: 6, roi: "200%", effort: "low", category: "behavior" },
    { rank: 4, title: "Install AC timer or smart thermostat", description: "Automate AC scheduling to peak-cool hours only.", savingsPerMonth: 190, investment: 3000, paybackMonths: 16, roi: "76%", effort: "low", category: "smart_tech" },
    { rank: 5, title: "2kW Rooftop Solar Installation", description: "Kerala has excellent solar potential (4.5 kWh/m²/day). Near-zero bills after payback.", savingsPerMonth: 869, investment: 120000, paybackMonths: 138, roi: "6%", effort: "high", category: "renewable" },
  ],
};