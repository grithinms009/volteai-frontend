# VoltSave AI - Backend Requirements Document

## Overview
This document outlines the backend API requirements for the VoltSave AI comprehensive energy analysis system, implementing 10 analysis engines to provide detailed insights and recommendations.

## API Endpoints

### 1. Bill Analysis & OCR
```typescript
POST /api/bills/analyze
Content-Type: multipart/form-data

Request:
{
  file: File (PDF/JPG/PNG),
  providerId?: string,
  countryCode: string,
  appliances?: ApplianceInput[],
  userProfile?: UserProfile
}

Response:
{
  billId: string,
  status: "processing" | "completed" | "failed",
  analysisResult?: ComprehensiveAnalysisResult,
  ocrData?: OCRData,
  confidence: number
}
```

### 2. Analysis Status Check
```typescript
GET /api/bills/{billId}/status

Response:
{
  billId: string,
  status: "processing" | "completed" | "failed",
  progress: number, // 0-100
  currentStep: string,
  analysisResult?: ComprehensiveAnalysisResult,
  error?: string
}
```

### 3. Full Analysis Report
```typescript
GET /api/bills/{billId}/full-report

Response:
{
  billId: string,
  analysisResult: ComprehensiveAnalysisResult,
  pdfUrl: string,
  shareableLink: string,
  createdAt: string
}
```

## Data Models

### OCR Data Structure
```typescript
interface OCRData {
  // Basic Information
  accountNumber: string;
  customerName: string;
  address: string;
  billingPeriod: {
    from: string;
    to: string;
  };
  meterNumber: string;
  meterType: "single" | "three";
  
  // Readings
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  
  // Charges
  fixedCharge: number;
  energyCharges: Array<{
    slab: string;
    units: number;
    rate: number;
    amount: number;
  }>;
  fuelSurcharge: number;
  electricityDuty: number;
  gst: number;
  latePaymentPenalty?: number;
  securityDeposit?: number;
  
  // Totals
  totalAmount: number;
  dueDate: string;
  
  // Payment History (if available)
  last6MonthsBills?: Array<{
    month: string;
    units: number;
    amount: number;
  }>;
}
```

### Comprehensive Analysis Result
```typescript
interface ComprehensiveAnalysisResult {
  // Engine 1: Bill Accuracy & Fraud Detection
  billAnalysis: {
    effectiveRate: number; // ₹/kWh all-inclusive
    tariffModel: string; // "slab_4tier", "flat_rate", "tod"
    anomalyScore: number; // 0-100
    anomalies: string[];
    overchargeAmount?: number;
    meterValidation: {
      isNormal: boolean;
      variance: number; // % from expected
      explanation: string;
    };
    tariffVerification: {
      isCorrect: boolean;
      issues: string[];
      correctAmount?: number;
    };
  };
  
  // Engine 2: Appliance-Level Breakdown
  applianceBreakdown: {
    [appliance: string]: {
      kWh: number;
      percentage: number;
      recommendation: string;
      age?: number;
      efficiency?: string; // "1_star" to "5_star"
      replacementSavings?: number; // per month
      replacementCost?: number;
    };
  };
  phantomLoad: {
    monthlyCost: number;
    annualCost: number;
    devices: string[];
    totalWatts: number;
  };
  
  // Engine 3: Usage Pattern Analysis
  usagePatterns: {
    daily: {
      peakHours: string[]; // ["6PM-9PM", "12PM-3PM"]
      offPeakHours: string[];
      averageHourly: number;
      consistencyScore: number; // 0-100
      hourlyData?: number[]; // 24-hour array
    };
    weekly: {
      weekdayAvg: number;
      weekendAvg: number;
      variation: number; // % difference
      mostUsedDay: string;
      leastUsedDay: string;
    };
    monthly: {
      summer: number; // Mar-May avg
      winter: number; // Nov-Feb avg
      monsoon: number; // Jun-Sep avg
      variation: number;
      monthlyData?: number[]; // 12-month array
    };
    anomalies: Array<{
      month: string;
      issue: string;
      confidence: number;
      severity: "low" | "medium" | "high";
    }>;
  };
  
  // Engine 4: Cost Optimization & Savings
  costOptimization: {
    quickWins: Array<{
      title: string;
      savingsPerMonth: number;
      investment: number;
      paybackMonths: number;
      priority: number;
      difficulty: "Easy" | "Medium" | "Hard";
      description: string;
    }>;
    mediumInvestment: Array<{
      title: string;
      savingsPerMonth: number;
      investment: number;
      paybackMonths: number;
      description: string;
    }>;
    largeInvestment: Array<{
      title: string;
      savingsPerMonth: number;
      investment: number;
      paybackYears: number;
      subsidy?: number;
      description: string;
      roi: number; // annual ROI %
    }>;
    behavioralChanges: Array<{
      title: string;
      savingsPerMonth: number;
      description: string;
      implementation: string;
    }>;
    totalSavingsPotential: {
      conservative: number; // per month
      aggressive: number; // per month
      timeframe: string;
    };
  };
  
  // Engine 5: Tariff & Subsidy Intelligence
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
      switchCost?: number;
    }>;
    rateForecast: {
      sixMonths: number;
      twelveMonths: number;
      annualIncrease: number;
      confidence: number;
    };
    demandCharge?: {
      currentPeak: number; // kW
      reductionPotential: number;
      savings: number;
      recommendation: string;
    };
  };
  
  // Engine 6: Financial & Budgeting
  financialInsights: {
    monthlyBudget: {
      fixed: number; // non-negotiable
      variable: number; // negotiable
      controllable: number; // % of bill
      recommended: number;
      savings: number;
    };
    spendingComparison: {
      yourSpending: number;
      similarHousehold: number;
      variance: number; // %
      reason: string;
      peerGroupSize: number;
    };
    annualProjection: {
      current: number;
      withIncrease: number;
      withOptimization: number;
      savings: number;
      fiveYearProjection: number;
    };
    paymentAlerts: {
      dueDate: string;
      daysUntilDue: number;
      lateFee: number;
      autopayAvailable: boolean;
    };
  };
  
  // Engine 7: Recommendations Engine
  recommendations: {
    priority1: Array<{
      title: string;
      savings: number;
      investment: number;
      payback: string;
      difficulty: "Easy" | "Medium" | "Hard";
      impact: "High" | "Medium" | "Low";
      description: string;
    }>;
    priority2: Array<{
      title: string;
      savings: number;
      investment: number;
      payback: string;
      description: string;
    }>;
    priority3: Array<{
      title: string;
      savings: number;
      investment: number;
      payback: string;
      description: string;
    }>;
    personalized: string[];
    seasonal: {
      current: string;
      recommendations: string[];
      nextSeason: string[];
    };
    implementationPlan: {
      month1: string[];
      month3: string[];
      month6: string[];
      year1: string[];
    };
  };
  
  // Engine 8: Comparative & Benchmarking
  benchmarking: {
    peerComparison: {
      yourConsumption: number;
      peerAverage: number;
      peerMedian: number;
      variance: number;
      percentile: number; // 0-100
      reason: string;
      peerGroup: {
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
      developedCountriesAvg: number;
      rank: string;
    };
    regionalInsights: {
      stateName: string;
      rating: number; // 1-5
      cheapestState: { name: string; rate: number };
      mostExpensive: { name: string; rate: number };
      subsidyProgram: string;
    };
    topPerformers: Array<{
      state: string;
      avgConsumption: number;
      avgRate: number;
      efficiency: number;
    }>;
  };
  
  // Engine 9: AI Insights
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
      schedule: Array<{
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
      urgency: "Low" | "Medium" | "High";
      optimalReplacementTime: string;
    }>;
    anomalies: Array<{
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
```

### User Input Models
```typescript
interface ApplianceInput {
  appliance: string;
  wattage: number;
  hoursPerDay: number;
  age?: number;
  starRating?: number;
  season?: "summer" | "winter" | "all";
}

interface UserProfile {
  occupants: number;
  homeSize: number; // sq ft
  workFromHome: boolean;
  usagePattern: "early_riser" | "night_owl" | "inconsistent";
  seasonalVariation: "high" | "medium" | "low";
  weekendPattern: "home_more" | "same" | "away_more";
  vacationPeriods?: Array<{
    from: string;
    to: string;
  }>;
}
```

## Database Schema

### Bills Table
```sql
CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES providers(id),
  file_url TEXT,
  ocr_data JSONB,
  analysis_result JSONB,
  status TEXT DEFAULT 'processing',
  confidence DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  paid BOOLEAN DEFAULT FALSE
);
```

### Providers Table
```sql
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  tariff_structure JSONB NOT NULL,
  historical_rates JSONB,
  subsidy_programs JSONB,
  is_active BOOLEAN DEFAULT TRUE
);
```

### Regional Data Table
```sql
CREATE TABLE regional_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  avg_consumption DECIMAL(10,2),
  avg_rate DECIMAL(10,2),
  weather_data JSONB,
  economic_indicators JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### User Appliance Profiles
```sql
CREATE TABLE user_appliances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  appliance TEXT NOT NULL,
  wattage INTEGER NOT NULL,
  hours_per_day DECIMAL(3,1),
  age INTEGER,
  star_rating INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Processing Pipeline

### 1. OCR Processing
- Use Tesseract or Google Vision API for text extraction
- Implement template matching for known bill formats
- Confidence scoring for each extracted field
- Manual review queue for low confidence (<80%)

### 2. Data Validation
- Cross-check extracted data against known patterns
- Validate meter reading arithmetic
- Check tariff application logic
- Flag inconsistencies for manual review

### 3. Analysis Engines (Sequential Processing)

#### Engine 1: Bill Accuracy
- Validate meter readings against historical data
- Recalculate charges based on tariff
- Detect duplicate charges
- Calculate effective rate

#### Engine 2: Appliance Breakdown
- Use ML model to estimate appliance usage
- Cross-reference with user-provided data
- Calculate phantom load
- Estimate appliance age efficiency

#### Engine 3: Usage Patterns
- Analyze hourly/daily/monthly patterns
- Detect anomalies and outliers
- Predict future usage trends
- Identify seasonal variations

#### Engine 4: Cost Optimization
- Calculate savings scenarios
- ROI analysis for investments
- Behavioral change impact
- Payback period calculations

#### Engine 5: Tariff Intelligence
- Compare with alternative tariffs
- Forecast rate increases
- Identify subsidy eligibility
- Demand charge optimization

#### Engine 6: Financial Analysis
- Budget breakdown
- Peer comparisons
- Annual projections
- Payment optimization

#### Engine 7: Recommendations
- Prioritize by ROI and difficulty
- Personalized suggestions
- Implementation timeline
- Seasonal recommendations

#### Engine 8: Benchmarking
- Regional comparisons
- Global context
- Peer group analysis
- Performance ranking

#### Engine 9: AI Insights
- Behavioral nudges
- Predictive alerts
- Smart scheduling
- Device lifecycle

### 4. Report Generation
- Compile all engine results
- Generate visualizations
- Create PDF report
- Generate shareable link

## External APIs & Services

### 1. OCR Services
- Google Cloud Vision API
- AWS Textract
- Azure Form Recognizer

### 2. Weather Data
- OpenWeatherMap API
- WeatherAPI.com
- Regional weather stations

### 3. Tariff Databases
- State electricity board APIs
- Regulatory commission data
- Historical rate archives

### 4. Economic Data
- RBI inflation rates
- State economic indicators
- Energy market prices

## Performance Requirements

### 1. Response Times
- OCR Processing: <30 seconds
- Full Analysis: <2 minutes
- Status Check: <500ms
- PDF Generation: <10 seconds

### 2. Throughput
- 100 concurrent analyses
- 1000 analyses per hour
- 99.9% uptime

### 3. Storage
- Bill files: 10MB per bill
- Analysis results: 500KB per bill
- User data: 1MB per user
- Regional cache: 100MB

## Security Requirements

### 1. Data Protection
- Encrypt all PII at rest
- Secure file storage with signed URLs
- Auto-delete files after 30 days
- GDPR/CCPA compliance

### 2. API Security
- JWT authentication
- Rate limiting: 100 requests/minute
- Input validation and sanitization
- SQL injection prevention

### 3. Privacy
- Anonymize benchmarking data
- Opt-out for data sharing
- Audit logging for all access
- Data retention policies

## Monitoring & Analytics

### 1. System Metrics
- Processing queue depth
- OCR accuracy rates
- Analysis success rates
- API response times

### 2. Business Metrics
- Conversion rate (free to paid)
- User satisfaction scores
- Recommendation implementation
- Cost savings achieved

### 3. Error Tracking
- Failed OCR extractions
- Analysis timeouts
- API errors
- User-reported issues

## Deployment Architecture

### 1. Microservices
- OCR Service (Python)
- Analysis Engine (Node.js)
- Report Generation (Go)
- API Gateway (Kong/Nginx)

### 2. Infrastructure
- Kubernetes cluster
- Auto-scaling groups
- CDN for static assets
- Managed databases

### 3. CI/CD Pipeline
- Automated testing
- Blue-green deployments
- Rollback capabilities
- Feature flags

## Testing Strategy

### 1. Unit Tests
- All calculation functions
- Data validation logic
- ML model predictions
- API endpoints

### 2. Integration Tests
- End-to-end analysis flow
- External API integrations
- Database operations
- File processing

### 3. Performance Tests
- Load testing with 1000 concurrent users
- Stress testing beyond capacity
- Memory usage profiling
- Database query optimization

### 4. User Acceptance Tests
- Real bill samples
- User journey testing
- Accessibility compliance
- Cross-browser compatibility

## Future Enhancements

### Phase 2 (3-6 months)
- Computer vision for appliance photos
- Smart meter integration
- Real-time usage monitoring
- Mobile app SDK

### Phase 3 (6-12 months)
- IoT device integration
- Predictive maintenance
- Energy trading platform
- B2B utility APIs

### Phase 4 (12+ months)
- Grid integration
- Demand response programs
- Carbon footprint tracking
- Renewable energy integration
