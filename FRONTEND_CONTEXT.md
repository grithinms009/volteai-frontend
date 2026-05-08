# VoltSave AI — Frontend Codebase Context

> Pass this document to any AI assistant (Lovable, Cursor, etc.) to get accurate help with this codebase.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript (Vite) |
| Styling | TailwindCSS + custom CSS variables (`glass-card`, `gradient-cta`) |
| Animations | framer-motion |
| Icons | lucide-react |
| Charts | recharts (`BarChart`, `PieChart`, `Cell`) |
| Toasts | sonner |
| Router | React Router v6 |
| State | useState / Context (no Redux) |
| API | Custom `fetch` wrapper in `src/hooks/useApi.ts` |

---

## Project Structure

```
src/
├── App.tsx                          # Root — wraps CountryProvider + QueryClientProvider + Router
├── pages/
│   └── Index.tsx                    # Main page — state machine for entire app flow
├── components/voltsave/
│   ├── Navbar.tsx                   # Top nav — country/currency selector + auth menu
│   ├── HeroSection.tsx              # Landing hero
│   ├── ProblemSection.tsx           # Landing section
│   ├── HowItWorks.tsx               # Landing section
│   ├── ResultsPreview.tsx           # Landing section
│   ├── FinalCTA.tsx                 # Landing CTA
│   ├── AuthModal.tsx                # Login / register modal
│   ├── ProgressStepper.tsx          # 4-step wizard stepper (State → Provider → Upload → Results)
│   ├── StateSelector.tsx            # Step 1: pick Indian state (fetches from API, fallback list)
│   ├── ProviderSelector.tsx         # Step 2: pick electricity provider (fetches from API)
│   ├── UploadSection.tsx            # Step 3: upload bill PDF/image or load demo
│   ├── SetupDetails.tsx             # Step 4: select appliances + profile type
│   ├── ProcessingScreen.tsx         # Animated analysis progress + backend polling
│   ├── ResultsDashboard.tsx         # Full results page (free preview + paid full report)
│   ├── PricingModal.tsx             # Unlock full report modal (₹99, simulated payment)
│   ├── SavingsScore.tsx             # Circular efficiency score gauge
│   ├── UsageChart.tsx               # Small usage bar chart
│   └── EnergyHeatMap.tsx            # Energy heat map component
└── hooks/
    ├── useApi.ts                    # fetch wrapper with auth token injection
    ├── useAuth.ts                   # localStorage-based auth (token, userId, userName)
    └── useCountry.tsx               # React Context for selected country/currency
```

---

## App Flow (State Machine in `Index.tsx`)

```
AppStep = "landing" | "state" | "provider" | "upload" | "setup" | "processing" | "results"
```

```
landing → [CTA click]
  → if authenticated → "state"
  → else → show AuthModal → on success → "state"

"state"      → StateSelector    → handleStateSelect()   → "provider"
"provider"   → ProviderSelector → handleProviderSelect() → "upload"
                               → onSkip()               → "upload" (providerId = null)
"upload"     → UploadSection   → handleUploadContinue() → "setup"
"setup"      → SetupDetails    → handleSetupContinue()  → "processing"
"processing" → ProcessingScreen → handleProcessingComplete(result) → "results"
                               → handleProcessingError()           → "upload"
"results"    → ResultsDashboard → onUnlock() → show PricingModal
                                             → onUnlockSuccess() → result.paid = true
```

**Key state in `Index.tsx`:**
```ts
step: AppStep
billId: string | null          // set after upload; "demo" for demo bill
isDemo: boolean
analysisResult: any            // full API result object
selectedState: string | null   // e.g. "Kerala"
selectedProvider: Provider | null  // { id, name, shortName, ... }
country: Country               // from useCountry() context
```

---

## Authentication (`useAuth.ts`)

Simple localStorage-based — **no React state**, reads on every render.

```ts
const { token, userId, name, isAuthenticated, logout, setAuth } = useAuth();

// setAuth() saves to localStorage:
setAuth(token, userId, name);
// stores: token, userId, userName

// logout() clears all and redirects to /
```

---

## Country / Currency Context (`useCountry.tsx`)

Wraps the entire app in `App.tsx` via `<CountryProvider>`.

```ts
const { country, setCountry } = useCountry();

// country shape:
{
  code: "IN",          // ISO country code
  name: "India",
  flag: "🇮🇳",
  currency: "INR",
  symbol: "₹"
}
```

**Auto-detection:** On first visit, timezone → country mapping. If user explicitly picks a country, saved to `localStorage` with `userPicked: true` flag.

**Available countries:** IN, US, GB, DE, AU, JP, BR, CA

---

## API Helper (`useApi.ts`)

```ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://95.217.223.40:3000';

// JSON call (auto-injects Bearer token from localStorage)
const data = await apiCall('/api/bills/demo/status');
const data = await apiCall('/api/auth/login', { method: 'POST', body: JSON.stringify({...}) });

// File upload (multipart/form-data, no Content-Type header)
const data = await apiUpload('/api/bills/upload', formData);
```

On 401 → clears auth and redirects to `/`.

---

## API Endpoints Used

### Auth
```
POST /api/auth/register    { email, password, name }  → { token, userId, name }
POST /api/auth/login       { email, password }         → { token, userId, name }
```

### Providers & States
```
GET /api/providers/states?country=IN
  → { states: [{ code: "KL", name: "Kerala" }, ...] }

GET /api/providers?country=IN
  → { providers: [{ id, name, shortName, state, stateCode, tariffType,
                    slabCount, lowestRate, highestRate, avgMonthlyUnits, hasPeakHours }] }

GET /api/providers/:id
  → { id, name, state, slabs, fixedCharges, tips, education: { howSlabsWork, ... } }

GET /api/providers/:id/calculate?units=250
  → { breakdown, effectiveRate, currentSlab, optimization: { targetSlab, savings, ... } }
```

### Bills
```
POST /api/bills/upload
  FormData: { file, profileType, countryCode, providerId? }
  → { billId, status: "processing" }

GET /api/bills/:id/status    (Authorization required)
  → { billId, status: "processing"|"completed"|"failed", analysisResult }

POST /api/bills/:id/bypass-payment   (dev only — marks bill as paid)
```

### Report
```
GET /api/reports/:id/download   (Authorization + paid required)
  → PDF blob
```

---

## `analysisResult` Shape (from API `/api/bills/:id/status`)

```ts
{
  // Provider info
  providerName: string;      // e.g. "Kerala State Electricity Board"
  providerId: string;        // e.g. "kseb"
  providerState: string;     // e.g. "Kerala"
  providerWebsite: string;   // e.g. "https://wss.kseb.in/"

  // Bill metrics
  effectiveRate: number;           // ₹ per unit
  effectiveRateCurrency: "INR";
  rateVsRegionAvg: number;         // absolute diff
  rateVsRegionAvgPct: number;      // % above/below avg
  rateStatus: "above_average" | "below_average" | "average";
  usageIntensity: "high" | "medium" | "low";
  usageRatio: number;              // e.g. 1.35 = 35% above avg
  dailyUnits: number;
  dailyCost: number;               // ₹/day
  totalUnits?: number;

  // Scores
  efficiencyScore: number;         // 0–100
  monthlySavingsEstimate: number;  // ₹
  annualSavingsEstimate: number;   // ₹
  potentialSavingsPct: number;     // %
  currentBill?: number;
  optimizedBill?: number;

  // Slab optimization alert
  slabOptimization?: {
    currentSlab: string;
    targetSlab: string;
    unitsToReduce: number;
    savings: number;               // ₹/month
  };

  // Issues & recommendations
  topIssues: Array<{
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
    actionable?: boolean;
  }>;
  recommendations: string[];       // plain strings from API

  // Device breakdown
  deviceBreakdown: Array<{
    device: string;
    units: number;
    percentage: number;
  }>;

  // Monthly trend
  monthlyTrend: Array<{
    month: string;       // "Jan", "Feb", ...
    units: number;
    estimated?: boolean;
  }>;

  confidenceLevel: "high" | "medium" | "low";
  paid: boolean;
}
```

> **Note:** `ResultsDashboard` normalizes both API and demo data shapes:
> - `providerName` OR `provider` → `providerName`
> - `slabOptimization` OR `slabAlert` → unified `slabAlert`
> - `deviceBreakdown` OR `highConsumptionDevices` → `highConsumptionDevices`
> - `monthlyTrend` OR `monthlyProjection` → `monthlyData`

---

## `ResultsDashboard` — Free vs Paid

### Free (all users)
- KPI cards: Monthly Savings, Efficiency Score, Per Unit Rate, Daily Cost
- Slab Optimization Alert (if applicable)
- Key Findings (expandable accordion, from `topIssues` + `findings`)
- Top 3 recommendations
- Device consumption preview (blurred pie)
- Bill comparison bar (current vs optimized)
- Unlock CTA card

### Paid (after `result.paid === true`)
- Full device **Pie Chart** (recharts)
- Slab-by-slab **Bill Breakdown Table** with all charges
- **Solar Potential** card (PM Surya Ghar subsidy, net metering, payback)
- **Monthly Projection** bar chart (color-coded green/yellow/red)
- All issues list with descriptions
- Provider info card with official website link
- PDF **Download** button (calls `/api/reports/:id/download`)

---

## Payment Flow (Simulated)

`PricingModal` simulates payment — no real gateway.

```
User clicks "Unlock for ₹99"
  → calls POST /api/bills/:id/bypass-payment  (best-effort, dev only)
  → toast.success("Payment successful!")
  → calls onUnlockSuccess()
    → Index.tsx: setAnalysisResult({ ...result, paid: true })
    → ResultsDashboard re-renders with paid content unlocked
```

`billId` is saved to `localStorage` as `lastBillId` after upload for use by PricingModal.

---

## ProgressStepper Steps

| Step index | Label | AppStep(s) |
|---|---|---|
| 0 | Select State | `"state"` |
| 1 | Provider | `"provider"` |
| 2 | Upload Bill | `"upload"`, `"setup"` |
| 3 | Results | `"processing"`, `"results"` |

---

## Demo Mode

- `UploadSection` has a "Try with demo bill" button
- Sets `billId = "demo"`, `isDemo = true`
- `ProcessingScreen` detects `billId === "demo"` and uses `DEMO_RESULT` (hardcoded rich Indian tariff data — KSEB, Kerala, 215 units, full slab/solar/monthly data)
- PDF download is disabled for demo bills

---

## CSS Conventions

Custom utility classes used throughout (defined in `App.css` / `index.css`):

```css
.glass-card        /* dark glassmorphism card */
.gradient-cta      /* primary gradient button bg */
```

Colors use HSL CSS variables: `hsl(var(--primary))`, `hsl(var(--accent))`, `hsl(var(--destructive))`, etc.

---

## Environment Variables

```env
VITE_API_URL=https://api.voltsave.in    # production
# defaults to http://95.217.223.40:3000 if not set
```
