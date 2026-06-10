import { motion } from "framer-motion";
import { FileSearch, Layers, GaugeCircle, ShieldCheck, Cpu, BarChart4 } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Bill ingestion & OCR",
    desc: "Hybrid pipeline parses PDFs, scans, and photographs. Per-field confidence on every extracted line item.",
    meta: "PDF · JPG · PNG · multi-page",
  },
  {
    icon: Layers,
    title: "Tariff classification",
    desc: "Detects flat, slab, time-of-use, demand-based and hybrid tariffs. Resolves provider rules from a 2,184-provider registry.",
    meta: "5 tariff models · 38 countries",
  },
  {
    icon: GaugeCircle,
    title: "Cost & waste engine",
    desc: "Computes effective rate, regional benchmarks, slab proximity and overpayment ranges with z-score normalization.",
    meta: "Region-aware · benchmarked",
  },
  {
    icon: Cpu,
    title: "Appliance reconciliation",
    desc: "Matches reported load against billed kWh to flag standby drain, hidden load and inefficient runtime patterns.",
    meta: "300+ device library",
  },
  {
    icon: BarChart4,
    title: "Recommendation rules",
    desc: "Deterministic strategy library generates findings with numeric impact. AI rewrites copy — never the numbers.",
    meta: "12 strategies · capped at 35%",
  },
  {
    icon: ShieldCheck,
    title: "Confidence framework",
    desc: "Per-stage scoring aggregates into an overall confidence band. Uncertainty is surfaced, never hidden.",
    meta: "OCR · fields · tariff · savings",
  },
];

const ProblemSection = () => {
  return (
    <section id="platform" className="py-20 md:py-24 border-b border-slate-200 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 mb-3">Platform</p>
          <h2 className="text-[28px] md:text-[34px] font-semibold tracking-tight text-slate-900 leading-tight">
            A six-stage intelligence pipeline, not a black box.
          </h2>
          <p className="mt-3 text-[14.5px] text-slate-600 leading-relaxed">
            Every analysis flows through deterministic stages with measurable inputs and confidence-scored outputs. You see the evidence behind each number.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 border border-slate-200 rounded-lg overflow-hidden bg-white">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: (i % 3) * 0.05 }}
              className="p-6 border-b border-r border-slate-200 last:border-r-0 [&:nth-child(3n)]:border-r-0 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
                  <f.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[10px] mono uppercase tracking-wider text-slate-500">stage / 0{i + 1}</span>
              </div>
              <h3 className="text-[14.5px] font-semibold text-slate-900 mb-1.5">{f.title}</h3>
              <p className="text-[12.5px] text-slate-600 leading-relaxed">{f.desc}</p>
              <p className="mt-3 text-[10.5px] mono text-slate-500 pt-2.5 border-t border-slate-100">{f.meta}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
