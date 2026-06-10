import { ArrowRight, Terminal } from "lucide-react";

interface FinalCTAProps {
  onUpload: () => void;
}

const FinalCTA = ({ onUpload }: FinalCTAProps) => {
  return (
    <section className="relative border-b border-slate-200 bg-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 grid-bg-dark opacity-60 pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 py-16 md:py-20 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-3">Get started</p>
          <h2 className="text-[28px] md:text-[36px] font-semibold tracking-tight leading-tight">
            Run your first bill analysis in under 60 seconds.
          </h2>
          <p className="mt-3 text-[14.5px] text-slate-300 leading-relaxed max-w-xl">
            No credit card. No integration. Upload a bill — see effective rate, tariff classification, and recovery opportunities with confidence scores.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={onUpload}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-md bg-white text-slate-900 text-[13px] font-semibold hover:bg-slate-100 transition-colors"
            >
              Start an analysis
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a href="#docs" className="inline-flex items-center gap-2 px-4 h-10 rounded-md border border-slate-700 text-[13px] font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
              Read the docs
            </a>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="rounded-md border border-slate-700 bg-slate-950/60 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] mono text-slate-400">voltsave.cli — analyze</span>
            </div>
            <pre className="p-4 text-[11.5px] mono leading-6 text-slate-300">
{`$ voltsave analyze bill-aug.pdf
  ✓ ocr           confidence 0.96
  ✓ extraction    18/18 fields
  ✓ provider      kseb (IN-KL) · fuzzy 0.91
  ✓ tariff        slab/4-tier · conf 0.94
  ✓ cost engine   eff. ₹6.42/kWh (+9.8%)
  ✓ savings       ₹1,810/mo · 12.2k/yr
→ report ready: vs-28471.pdf`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
