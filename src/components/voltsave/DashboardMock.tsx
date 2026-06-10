import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Activity, Zap } from "lucide-react";

/**
 * Realistic enterprise analytics dashboard mock — used in the hero and
 * "Deep product preview" sections. No real data; visually dense.
 */
const DashboardMock = () => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-24px_rgba(15,23,42,0.18)] overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mono">
          <Activity className="w-3 h-3 text-emerald-600" />
          analytics.voltsave.ai / bills / aug-2025
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500 mono">LIVE</span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
          />
        </div>
      </div>

      {/* Header strip */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Bill #VS-28471</p>
          <p className="text-[15px] font-semibold text-slate-900 mt-0.5">Kerala State Electricity Board · Residential</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Analysis complete</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 mono">conf 0.92</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 border-b border-slate-200 divide-x divide-slate-200">
        <Kpi label="Effective rate" value="₹6.42" unit="/kWh" delta="+9.8%" up />
        <Kpi label="Monthly bill" value="₹7,820" unit="" delta="+12.4%" up />
        <Kpi label="Est. waste" value="₹1,810" unit="/mo" delta="−23%" />
        <Kpi label="Efficiency" value="68" unit="/100" delta="+4 pts" />
      </div>

      {/* Body grid */}
      <div className="grid grid-cols-12 gap-px bg-slate-200">
        {/* Chart */}
        <div className="col-span-8 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[12px] font-semibold text-slate-900">Daily consumption · last 30 days</p>
              <p className="text-[11px] text-slate-500">kWh per day · peak vs off-peak</p>
            </div>
            <div className="flex gap-1">
              <span className="text-[10px] text-slate-500 mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">7D</span>
              <span className="text-[10px] text-white mono px-1.5 py-0.5 rounded bg-slate-900">30D</span>
              <span className="text-[10px] text-slate-500 mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">90D</span>
            </div>
          </div>
          <BarChart />
          <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-900" /> Peak</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-300" /> Off-peak</span>
            <span className="ml-auto mono">avg 7.2 kWh/day</span>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-4 bg-white">
          <div className="p-4 border-b border-slate-200">
            <p className="text-[12px] font-semibold text-slate-900 mb-2.5">Tariff breakdown</p>
            <TariffRow label="Slab 1 · 0–50" units="50" rate="3.15" />
            <TariffRow label="Slab 2 · 51–100" units="50" rate="3.70" />
            <TariffRow label="Slab 3 · 101–200" units="100" rate="4.80" />
            <TariffRow label="Slab 4 · 201–250" units="15" rate="6.40" highlight />
          </div>
          <div className="p-4">
            <p className="text-[12px] font-semibold text-slate-900 mb-2">Top recommendations</p>
            <Reco icon={AlertTriangle} tone="warning" title="Slab boundary risk" detail="15 kWh into Slab 4 · save ₹380/mo" />
            <Reco icon={Zap} tone="info" title="Shift AC to off-peak" detail="6–9 PM load · save ₹420/mo" />
            <Reco icon={CheckCircle2} tone="success" title="Standby cleanup" detail="340 W idle load · save ₹210/mo" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Kpi = ({ label, value, unit, delta, up }: { label: string; value: string; unit: string; delta: string; up?: boolean }) => (
  <div className="px-4 py-3">
    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
    <p className="text-[19px] font-semibold text-slate-900 mt-1 tnum">
      {value}<span className="text-[12px] text-slate-500 font-normal ml-0.5">{unit}</span>
    </p>
    <p className={`text-[11px] mt-0.5 flex items-center gap-1 mono ${up ? "text-rose-600" : "text-emerald-600"}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {delta}
    </p>
  </div>
);

const BarChart = () => {
  const data = [4.8,5.2,6.1,7.4,6.8,5.9,5.3,6.2,7.1,8.4,9.2,7.8,6.5,5.8,6.4,7.2,8.1,9.4,8.8,7.6,6.9,7.3,8.5,9.6,8.2,7.4,6.8,7.5,8.9,7.2];
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] h-28">
      {data.map((v, i) => {
        const peak = i % 7 >= 4;
        return (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ duration: 0.6, delay: i * 0.015, ease: "easeOut" }}
            className={`flex-1 rounded-sm ${peak ? "bg-slate-900" : "bg-slate-300"}`}
          />
        );
      })}
    </div>
  );
};

const TariffRow = ({ label, units, rate, highlight }: { label: string; units: string; rate: string; highlight?: boolean }) => (
  <div className={`flex items-center justify-between py-1.5 text-[11px] ${highlight ? "bg-amber-50 -mx-2 px-2 rounded" : ""}`}>
    <span className="text-slate-600">{label}</span>
    <div className="flex items-center gap-3">
      <span className="mono text-slate-500">{units} kWh</span>
      <span className="mono font-semibold text-slate-900 w-12 text-right">₹{rate}</span>
    </div>
  </div>
);

const Reco = ({ icon: Icon, tone, title, detail }: { icon: any; tone: "warning" | "info" | "success"; title: string; detail: string }) => {
  const tones = {
    warning: "text-amber-700 bg-amber-50 border-amber-200",
    info: "text-sky-700 bg-sky-50 border-sky-200",
    success: "text-emerald-700 bg-emerald-50 border-emerald-200",
  };
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-slate-100 last:border-0">
      <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11.5px] font-semibold text-slate-900 leading-tight">{title}</p>
        <p className="text-[10.5px] text-slate-500 mt-0.5">{detail}</p>
      </div>
    </div>
  );
};

export default DashboardMock;