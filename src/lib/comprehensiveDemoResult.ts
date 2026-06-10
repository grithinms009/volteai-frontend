import type { AnalysisResult } from '@/components/voltsave/ComprehensiveResultsDashboard';

export const COMPREHENSIVE_DEMO_RESULT: AnalysisResult = {
  paid: false,
  // Engine 1: Bill Accuracy & Fraud Detection
  billAnalysis: {
    effectiveRate: 6.42,
    tariffModel: "slab_4tier",
    anomalyScore: 15,
    anomalies: [
      "Consumption jumped 40% from Aug to Sept - verify meter reading",
      "GST calculated incorrectly - you were overcharged ₹245"
    ],
    overchargeAmount: 245,
    meterValidation: {
      isNormal: false,
      variance: 40,
      explanation: "Unusual spike in consumption requires verification"
    },
    tariffVerification: {
      isCorrect: false,
      issues: [
        "GST applied at 18% instead of 5% for residential",
        "Fixed charge calculated for 31 days instead of 30"
      ]
    }
  },
  
  // Engine 2: Appliance-Level Breakdown
  applianceBreakdown: {
    "Air Conditioner": {
      kWh: 180,
      percentage: 38,
      recommendation: "Use at 26°C instead of 22°C",
      age: 5,
      efficiency: "3_star",
      replacementSavings: 600,
      replacementCost: 35000
    },
    "Water Heater": {
      kWh: 95,
      percentage: 20,
      recommendation: "Install timer for 30 min usage",
      age: 8,
      efficiency: "4_star",
      replacementSavings: 250,
      replacementCost: 8000
    },
    "Refrigerator": {
      kWh: 72,
      percentage: 15,
      recommendation: "Replace 13-year-old model",
      age: 13,
      efficiency: "2_star",
      replacementSavings: 240,
      replacementCost: 22000
    },
    "Washing Machine": {
      kWh: 45,
      percentage: 9,
      recommendation: "Use cold water cycles",
      age: 3,
      efficiency: "4_star"
    },
    "Lighting": {
      kWh: 35,
      percentage: 7,
      recommendation: "Replace remaining 5 incandescent bulbs",
      age: 0,
      efficiency: "5_star"
    },
    "Ceiling Fans": {
      kWh: 28,
      percentage: 6,
      recommendation: "Use energy-efficient models",
      age: 2,
      efficiency: "3_star"
    },
    "Other": {
      kWh: 20,
      percentage: 5,
      recommendation: "Identify and optimize miscellaneous loads"
    }
  },
  phantomLoad: {
    monthlyCost: 150,
    annualCost: 1800,
    devices: ["TV", "Microwave", "Printer", "Smart plugs", "Coffee maker"],
    totalWatts: 40
  },
  
  // Engine 3: Usage Pattern Analysis
  usagePatterns: {
    daily: {
      peakHours: ["6PM-9PM", "12PM-3PM"],
      offPeakHours: ["3AM-6AM"],
      averageHourly: 15.8,
      consistencyScore: 78
    },
    weekly: {
      weekdayAvg: 475,
      weekendAvg: 590,
      variation: 24,
      mostUsedDay: "Saturday",
      leastUsedDay: "Wednesday"
    },
    monthly: {
      summer: 580,
      winter: 320,
      monsoon: 420,
      variation: 81
    },
    anomalies: [
      {
        month: "August",
        issue: "40% consumption increase",
        confidence: 92,
        severity: "high"
      }
    ]
  },
  
  // Engine 4: Cost Optimization & Savings
  costOptimization: {
    quickWins: [
      {
        title: "Set AC to 26°C instead of 22°C",
        savingsPerMonth: 600,
        investment: 0,
        paybackMonths: 0,
        priority: 1,
        difficulty: "Easy",
        description: "Each degree saves ~6% on AC power consumption"
      },
      {
        title: "Replace 5 incandescent bulbs with LED",
        savingsPerMonth: 180,
        investment: 500,
        paybackMonths: 2.8,
        priority: 2,
        difficulty: "Easy",
        description: "LED bulbs use 75% less energy"
      },
      {
        title: "Turn off phantom loads",
        savingsPerMonth: 150,
        investment: 500,
        paybackMonths: 3.3,
        priority: 3,
        difficulty: "Easy",
        description: "Use smart power strips to cut standby power"
      }
    ],
    mediumInvestment: [
      {
        title: "Install smart thermostat",
        savingsPerMonth: 900,
        investment: 3500,
        paybackMonths: 3.9,
        description: "Automated temperature control and scheduling"
      },
      {
        title: "Apply window films (3 windows)",
        savingsPerMonth: 300,
        investment: 2500,
        paybackMonths: 8.3,
        description: "Reduce heat gain by 60%"
      },
      {
        title: "Water heater timer",
        savingsPerMonth: 200,
        investment: 800,
        paybackMonths: 4,
        description: "Limit heating to 30 minutes daily"
      }
    ],
    largeInvestment: [
      {
        title: "Rooftop solar 2kW system",
        savingsPerMonth: 3300,
        investment: 140000,
        paybackYears: 4.2,
        subsidy: 60000,
        description: "Generate 4800 kWh/year with net metering",
        roi: 23.8
      },
      {
        title: "Replace 13-year-old refrigerator",
        savingsPerMonth: 240,
        investment: 22000,
        paybackYears: 7.6,
        description: "5-star model uses 30% less power"
      }
    ],
    behavioralChanges: [
      {
        title: "Shift water heater use to 5-6 AM",
        savingsPerMonth: 200,
        description: "Use during off-peak hours when rates are lower",
        implementation: "Set timer or manual schedule"
      },
      {
        title: "Reduce AC by 1 hour daily",
        savingsPerMonth: 500,
        description: "Use fans during mild weather",
        implementation: "Set automatic shutoff after 7 hours"
      }
    ]
  },
  
  // Engine 5: Tariff & Subsidy Intelligence
  tariffIntelligence: {
    currentSubsidy: {
      amount: 150,
      eligibility: "BPL category based on income criteria",
      process: "Apply at local electricity office with income proof",
      deadline: "2024-12-31"
    },
    alternativeTariffs: [
      {
        name: "Economy 7 (Night Rate)",
        monthlyCost: 6800,
        savings: 1020,
        description: "50% cheaper rates 11PM-6AM"
      },
      {
        name: "Smart Meter Plan",
        monthlyCost: 7200,
        savings: 620,
        description: "Real-time rates with demand response"
      }
    ],
    rateForecast: {
      sixMonths: 6.64,
      twelveMonths: 6.87,
      annualIncrease: 3.5,
      confidence: 85
    },
    demandCharge: {
      currentPeak: 4.2,
      reductionPotential: 1.0,
      savings: 500,
      recommendation: "Avoid running AC, heater, and oven simultaneously"
    }
  },
  
  // Engine 6: Financial & Budgeting
  financialInsights: {
    monthlyBudget: {
      fixed: 850,
      variable: 6970,
      controllable: 89,
      recommended: 6500,
      savings: 470
    },
    spendingComparison: {
      yourSpending: 7820,
      similarHousehold: 6200,
      variance: 26,
      reason: "Higher AC usage and older appliances",
      peerGroupSize: 1247
    },
    annualProjection: {
      current: 93840,
      withIncrease: 102525,
      withOptimization: 78000,
      savings: 15840,
      fiveYearProjection: 516000
    },
    paymentAlerts: {
      dueDate: "2024-11-15",
      daysUntilDue: 5,
      lateFee: 50,
      autopayAvailable: true
    }
  },
  
  // Engine 7: Recommendations Engine
  recommendations: {
    priority1: [
      {
        title: "Set AC to 26°C instead of 22°C",
        savings: 600,
        investment: 0,
        payback: "Immediate",
        difficulty: "Easy",
        impact: "High",
        description: "Each degree above 22°C saves ~6% on AC power"
      },
      {
        title: "Fix GST overcharge",
        savings: 245,
        investment: 0,
        payback: "Immediate",
        difficulty: "Easy",
        impact: "Medium",
        description: "Contact provider to correct GST rate from 18% to 5%"
      }
    ],
    priority2: [
      {
        title: "Install smart thermostat",
        savings: 900,
        investment: 3500,
        payback: "3.9 months"
      },
      {
        title: "Replace incandescent bulbs",
        savings: 180,
        investment: 500,
        payback: "2.8 months"
      }
    ],
    priority3: [
      {
        title: "Rooftop solar installation",
        savings: 3300,
        investment: 140000,
        payback: "4.2 years"
      }
    ],
    personalized: [
      "Your AC runs 8 hours daily - consider solar + heat pump combo for maximum ROI",
      "Water heating is 20% of your bill - solar water heater would save ₹2000/month",
      "Saturday consumption spikes suggest weekend entertaining - use outdoor activities"
    ],
    seasonal: {
      current: "Winter (Nov-Feb)",
      recommendations: [
        "Minimal AC use - rely on natural heating and blankets",
        "Use sunlight for natural warming during day",
        "Check insulation to reduce heating needs"
      ],
      nextSeason: [
        "Prepare AC for summer - service and clean filters",
        "Install window films before heat arrives",
        "Plan solar installation before peak season"
      ]
    },
    implementationPlan: {
      month1: ["Set AC to 26°C", "Fix GST overcharge", "Replace bulbs"],
      month3: ["Install smart thermostat", "Apply window films", "Water heater timer"],
      month6: ["Replace refrigerator", "Install solar panels"],
      year1: ["Heat pump installation", "Battery storage", "Smart home integration"]
    }
  },
  
  // Engine 8: Comparative & Benchmarking
  benchmarking: {
    peerComparison: {
      yourConsumption: 475,
      peerAverage: 320,
      peerMedian: 310,
      variance: 48,
      percentile: 85,
      reason: "Older appliances and higher AC usage",
      peerGroup: {
        size: "1200-1500 sq ft",
        occupants: 3,
        income: "Middle",
        region: "Urban Kerala"
      }
    },
    globalComparison: {
      yourRate: 6.42,
      indiaAverage: 5.50,
      globalAverage: 10.00,
      developedCountriesAvg: 15.00,
      rank: "Cheaper than 85% of countries"
    },
    regionalInsights: {
      stateName: "Kerala",
      rating: 4.5,
      cheapestState: { name: "Chhattisgarh", rate: 2.95 },
      mostExpensive: { name: "Maharashtra", rate: 8.50 },
      subsidyProgram: "Strong BPL and solar subsidy programs"
    },
    topPerformers: [
      { state: "Kerala", avgConsumption: 320, avgRate: 6.42, efficiency: 85 },
      { state: "Gujarat", avgConsumption: 380, avgRate: 5.80, efficiency: 82 },
      { state: "Tamil Nadu", avgConsumption: 410, avgRate: 6.20, efficiency: 78 }
    ]
  },
  
  // Engine 9: AI Insights
  aiInsights: {
    behavioralNudges: [
      "You shower at 7 AM when AC is also running - shift shower to 6 AM when AC is off",
      "Saturday consumption spikes at 2 PM - AC running while you're home. Consider outdoor activity?",
      "Your TV, microwave, and printer consume ₹180/year in standby mode"
    ],
    predictiveAlerts: [
      {
        alert: "Consumption trending up +3% per month",
        timeframe: "By December",
        impact: "Bill will exceed ₹9,000/month",
        action: "Implement quick wins immediately"
      },
      {
        alert: "AC running 9 hours today (Fri) vs 6 hours (Mon)",
        timeframe: "This week",
        impact: "₹300 extra cost",
        action: "Check for guests or entertaining"
      }
    ],
    smartScheduling: {
      description: "Optimal schedule saves ₹1,200/month with zero investment",
      savings: 1200,
      schedule: [
        {
          appliance: "Water Heater",
          recommendedHours: ["5AM-6AM"],
          reason: "Off-peak rates and before AC usage"
        },
        {
          appliance: "AC",
          recommendedHours: ["11AM-5PM"],
          reason: "Cool during hottest part, off by evening"
        },
        {
          appliance: "Washing Machine",
          recommendedHours: ["6AM-8AM"],
          reason: "Off-peak rates"
        }
      ]
    },
    deviceLifecycle: [
      {
        device: "Refrigerator",
        age: 13,
        lifespan: 12,
        recommendation: "Replace immediately - consuming 30% more than new models",
        urgency: "High",
        optimalReplacementTime: "Before summer 2025"
      },
      {
        device: "Air Conditioner",
        age: 5,
        lifespan: 10,
        recommendation: "Plan replacement in 3 years for heat pump technology",
        urgency: "Low",
        optimalReplacementTime: "2027-2028"
      }
    ],
    anomalies: [
      {
        type: "Consumption Spike",
        description: "August bill 40% higher than July",
        confidence: 92,
        action: "Verify meter reading or check for continuous AC usage"
      }
    ]
  },
  
  // Metadata
  metadata: {
    paid: true,
    providerName: "KSEB (Kerala State Electricity Board)",
    billingPeriod: "Oct 2024",
    totalAmount: 7820,
    unitsConsumed: 475,
    analysisDate: "2024-11-10",
    confidence: 94,
    dataSources: ["OCR", "User Input", "Regional Data", "Historical Bills"],
    version: "2.4"
  }
};
