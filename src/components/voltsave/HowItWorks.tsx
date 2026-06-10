import { motion } from "framer-motion";
import { AlertOctagon, Activity, Cpu } from "lucide-react";

/**
 * Deep product preview — three realistic analytics panels.
 */
const HowItWorks = () => {
  return (
    <section id="analytics" className="py-20 md:py-24 border-b border-slate-200 bg-slate-50/60">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-3">Analytics</p>
          <h2 className="text-[28px] md:text-[34px] font-semibold tracking-tight text-slate-900 leading-tight">
            Operational panels built for analysts.
          </h2>
          <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed">
            Compact, dense, and grid-aligned. Every panel is wired to the same evidence trail you can export.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Panel 1 — usage heatmap */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <PanelHeader icon={Activity} title="Usage heatmap" subtitle="hour × weekday · last 30d" />
            <div className="p-4">
              <Heatmap />
              <div className="mt-3 flex items-center justify-between text-[10.5px] text-slate-500">
                <span className="mono">peak window 18:00–22:00</span>
                <span className="flex items-center gap-1">low <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-200" /><span className="w-2.5 h-2.5 rounded-sm bg-slate-300" /><span className="w-2.5 h-2.5 rounded-sm bg-slate-600" /><span className="w-2.5 h-2.5 rounded-sm bg-slate-900" /> high</span>
              </div>
            </div>
          </motion.div>

          {/* Panel 2 — anomaly alerts */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.05 }} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <PanelHeader icon={AlertOctagon} title="Anomaly feed" subtitle="rule engine · live" />
            <div className="divide-y divide-slate-100">
              <Anomaly time="14:02" severity="high" title="Effective rate +9.8% vs region p75" code="RATE_OUTLIER" />
              <Anomaly time="13:51" severity="med" title="Standby load 340W exceeds threshold" code="STANDBY_DRAIN" />
              <Anomaly time="13:44" severity="med" title="15 kWh into Slab 4 boundary" code="SLAB_PROXIMITY" />
              <Anomaly time="13:30" severity="low" title="Peak-hour AC duty 6.4h/day" code="PEAK_LOAD" />
              <Anomaly time="13:18" severity="low" title="Lighting load > 12% of total" code="LIGHTING_HIGH" />
            </div>
          </motion.div>

          {/* Panel 3 — appliance breakdown */}
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <PanelHeader icon={Cpu} title="Appliance breakdown" subtitle="kWh share · estimated" />
            <div className="p-4 space-y-2">
              <ApplianceRow label="Air conditioner" pct={38} kwh={82} />
              <ApplianceRow label="Water heater" pct={20} kwh={43} />
              <ApplianceRow label="Refrigerator" pct={15} kwh={32} />
              <ApplianceRow label="Washing machine" pct={9} kwh={19} />
              <ApplianceRow label="Lighting" pct={7} kwh={15} />
              <ApplianceRow label="Other / standby" pct={11} kwh={24} />
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Reconciliation Δ</span>
                <span className="mono font-semibold text-amber-700">+18.2 kWh hidden</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PanelHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) => (
  <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-700" />
      <span className="text-[12.5px] font-semibold text-slate-900">{title}</span>
    </div>
    <span className="text-[10.5px] mono text-slate-500">{subtitle}</span>
  </div>
);

const Heatmap = () => {
  // 7 days × 12 buckets
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const data = Array.from({ length: 7 }, () =>
    Array.from({ length: 12 }, () => Math.random())
  );
  // boost evening peaks
  data.forEach(row => { row[8] += 0.5; row[9] += 0.6; row[10] += 0.4; });
  const shade = (v: number) => {
    if (v < 0.3) return "bg-slate-100";
    if (v < 0.55) return "bg-slate-300";
    if (v < 0.85) return "bg-slate-600";
    return "bg-slate-900";
  };
  return (
    <div className="space-y-1">
      {data.map((row, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="w-3 text-[9.5px] text-slate-400 mono">{days[i]}</span>
          {row.map((v, j) => (
            <div key={j} className={`flex-1 h-3.5 rounded-sm ${shade(v)}`} />
          ))}
        </div>
      ))}
      <div className="flex items-center gap-1 pl-4 mt-1">
        {["00", "04", "08", "12", "16", "20"].map(h => (
          <span key={h} className="flex-1 text-[9px] mono text-slate-400 text-center">{h}</span>
        ))}
      </div>
    </div>
  );
};

const Anomaly = ({ time, severity, title, code }: { time: string; severity: "high" | "med" | "low"; title: string; code: string }) => {
  const dot = severity === "high" ? "bg-rose-500" : severity === "med" ? "bg-amber-500" : "bg-slate-400";
  return (
    <div className="px-4 py-2.5 hover:bg-slate-50/80 transition-colors">
      <div className="flex items-center gap-2 text-[11px] text-slate-500 mono">
        <span>{time}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="uppercase tracking-wider">{severity}</span>
        <span className="ml-auto">{code}</span>
      </div>
      <p className="text-[12.5px] text-slate-900 mt-0.5">{title}</p>
    </div>
  );
};

const ApplianceRow = ({ label, pct, kwh }: { label: string; pct: number; kwh: number }) => (
  <div>
    <div className="flex items-center justify-between text-[11.5px] mb-1">
      <span className="text-slate-700">{label}</span>
      <span className="mono text-slate-500">{kwh} kWh · {pct}%</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-sm overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${pct * 2.5}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="h-full bg-slate-700"
      />
    </div>
  </div>
);

export default HowItWorks;
