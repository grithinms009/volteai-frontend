import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Globe2, Activity, TrendingDown, TrendingUp, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import DashboardMock from "./DashboardMock";

interface HeroSectionProps {
  onAnalyze: () => void;
}

const HeroSection = ({ onAnalyze }: HeroSectionProps) => {
  return (
    <section className="relative border-b border-slate-200 overflow-hidden bg-white">
      {/* Operational status strip */}
      

      <div className="absolute inset-0 grid-bg opacity-[0.4] pointer-events-none [mask-image:linear-gradient(to_bottom,black_20%,transparent_90%)]" />

      <div className="relative max-w-[1320px] mx-auto px-6 pt-10 pb-12 lg:pt-12 lg:pb-16 grid lg:grid-cols-12 gap-8">
        {/* Left: copy — narrow column */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-4 lg:pt-4"
        >
          <div className="flex items-center gap-2 mb-5 text-[10.5px] mono uppercase tracking-[0.18em] text-slate-500">
            <span className="w-6 h-px bg-slate-300" />
            <span>Tariff Intelligence · v2.4</span>
          </div>
          <h1 className="text-[28px] md:text-[34px] leading-[1.12] font-semibold tracking-tight text-slate-900 text-balance">
            Enterprise-grade intelligence for electricity tariffs, usage and cost-recovery.
          </h1>
          <p className="mt-4 text-[13.5px] text-slate-600 leading-relaxed max-w-md">
            VoltSave ingests utility bills, classifies tariff structures across 38 countries, and surfaces measurable cost-recovery opportunities — with confidence-scored evidence on every insight.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <button
              onClick={onAnalyze}
              className="inline-flex items-center gap-2 px-3.5 h-9 rounded-md bg-slate-900 text-white text-[12.5px] font-semibold hover:bg-slate-800 transition-colors"
            >
              Start an analysis
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="#analytics"
              className="inline-flex items-center gap-2 px-3.5 h-9 rounded-md border border-slate-300 bg-white text-[12.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Live dashboard
            </a>
          </div>

          <div className="mt-7 grid grid-cols-3 border-t border-slate-200 pt-5">
            <Stat label="Bills processed" value="128,400" />
            <Stat label="Providers" value="2,184" />
            <Stat label="Avg. recovery" value="₹1,810" sub="/mo" />
          </div>

          <div className="mt-5 flex items-center gap-4 text-[10.5px] text-slate-500">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> SOC 2 Type II ready</span>
            <span className="flex items-center gap-1.5"><Globe2 className="w-3 h-3" /> 38 countries</span>
            <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> 99.99% SLA</span>
          </div>
        </motion.div>

        {/* Right: layered dashboard composition */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="lg:col-span-8 relative"
        >
          <div className="relative">
            <DashboardMock />

            {/* Floating panel — tariff classification */}
            <motion.div
              initial={{ opacity: 0, x: -12, y: -8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="hidden md:block absolute -left-6 top-24 w-[230px] rounded-md border border-slate-200 bg-white shadow-[0_24px_48px_-20px_rgba(15,23,42,0.25)] overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-900">Tariff classification</span>
                <span className="text-[10px] mono text-emerald-700 bg-emerald-50 px-1.5 rounded border border-emerald-200">0.94</span>
              </div>
              <div className="p-3 space-y-1.5 text-[11px]">
                <Row k="Model" v="Slab · 4-tier" />
                <Row k="Region" v="IN-KL" />
                <Row k="Provider" v="KSEB" />
                <Row k="Cycle" v="Bi-monthly" />
                <div className="pt-1.5 mt-1 border-t border-slate-100 flex items-center gap-1.5 text-[10px] mono text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> matched against 2,184 providers
                </div>
              </div>
            </motion.div>

            {/* Floating panel — savings projection */}
            <motion.div
              initial={{ opacity: 0, x: 12, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="hidden md:block absolute -right-4 top-40 w-[220px] rounded-md border border-slate-200 bg-white shadow-[0_24px_48px_-20px_rgba(15,23,42,0.25)] overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-900">Savings projection</span>
                <span className="text-[10px] mono text-slate-500">12 mo</span>
              </div>
              <div className="p-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-[20px] font-semibold text-slate-900 tnum">₹21,720</span>
                  <span className="text-[10.5px] mono text-emerald-600 flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />−23%</span>
                </div>
                <p className="text-[10.5px] text-slate-500 mt-0.5">vs current run-rate · capped at 35%</p>
                <div className="mt-2.5 h-8 flex items-end gap-[2px]">
                  {[3,4,5,6,5,7,8,9,10,11,12,14].map((v,i) => (
                    <div key={i} className="flex-1 rounded-sm bg-slate-200" style={{ height: `${v * 7}%` }}>
                      <div className="h-full rounded-sm bg-emerald-500/80" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating panel — anomaly toast */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="hidden md:block absolute -left-4 -bottom-6 w-[260px] rounded-md border border-slate-200 bg-white shadow-[0_24px_48px_-20px_rgba(15,23,42,0.25)] overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-900 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3 text-amber-600" /> Anomaly detected</span>
                <span className="text-[10px] mono text-slate-500">14:02</span>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[11.5px] text-slate-900 font-medium leading-snug">Effective rate +9.8% vs region p75</p>
                <p className="text-[10.5px] mono text-slate-500 mt-1">RATE_OUTLIER · severity HIGH</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-white">Investigate</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">Mute</span>
                </div>
              </div>
            </motion.div>

            {/* Floating panel — efficiency score ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="hidden lg:flex absolute -right-6 -bottom-4 w-[180px] rounded-md border border-slate-200 bg-white shadow-[0_24px_48px_-20px_rgba(15,23,42,0.25)] overflow-hidden flex-col"
            >
              <div className="px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-900">Efficiency</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              </div>
              <div className="p-3 flex items-center gap-3">
                <Ring value={68} />
                <div>
                  <p className="text-[10.5px] text-slate-500">Score</p>
                  <p className="text-[18px] font-semibold text-slate-900 tnum leading-none">68<span className="text-[10.5px] text-slate-400">/100</span></p>
                  <p className="text-[10px] mono text-emerald-600 mt-1 flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />+4 pts</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Live ticker strip */}
      <div className="relative border-t border-slate-200 bg-slate-50/60">
        <div className="max-w-[1320px] mx-auto px-6 h-11 flex items-center justify-between text-[11px] mono text-slate-600 overflow-hidden">
          <div className="flex items-center gap-6 whitespace-nowrap">
            <Ticker label="IN-KL eff" value="₹6.42" delta="+9.8%" up />
            <Ticker label="IN-MH eff" value="₹8.14" delta="−1.2%" />
            <Ticker label="US-CA eff" value="$0.31" delta="+2.1%" up />
            <Ticker label="EU-DE eff" value="€0.41" delta="−0.6%" />
            <Ticker label="UK-LDN eff" value="£0.27" delta="+0.4%" up />
            <Ticker label="AE-DXB eff" value="AED 0.38" delta="0.0%" />
          </div>
          <span className="hidden md:inline text-slate-500">benchmarks · synced 14:02 IST</span>
        </div>
      </div>

      {/* Logo strip */}
      <div className="relative max-w-[1320px] mx-auto px-6 py-7 border-t border-slate-200">
        <div className="flex items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 shrink-0">Trusted by analysts at</p>
          <div className="flex-1 flex flex-wrap items-center gap-x-8 gap-y-2 text-slate-400 text-[12.5px] font-semibold tracking-tight">
            <span>NORTHWIND</span>
            <span>HELIOS&nbsp;ENERGY</span>
            <span>CONTOSO</span>
            <span>GRIDLINE</span>
            <span>ATLAS&nbsp;UTILITIES</span>
            <span>VANTA&nbsp;CO</span>
            <span>MERIDIAN&nbsp;GRID</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
    <p className="text-[15.5px] font-semibold text-slate-900 mt-1 tnum">
      {value}{sub && <span className="text-[10.5px] text-slate-500 font-normal">{sub}</span>}
    </p>
  </div>
);

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-500">{k}</span>
    <span className="mono font-medium text-slate-900">{v}</span>
  </div>
);

const Ticker = ({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) => (
  <span className="flex items-center gap-1.5">
    <span className="text-slate-500">{label}</span>
    <span className="font-semibold text-slate-900">{value}</span>
    <span className={up ? "text-rose-600" : "text-emerald-600"}>{delta}</span>
    <span className="text-slate-300">·</span>
  </span>
);

const Ring = ({ value }: { value: number }) => {
  const r = 22;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} stroke="hsl(220 16% 90%)" strokeWidth="5" fill="none" />
      <motion.circle
        cx="28" cy="28" r={r}
        stroke="hsl(152 60% 38%)" strokeWidth="5" fill="none" strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: off }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
        transform="rotate(-90 28 28)"
      />
    </svg>
  );
};

export default HeroSection;
