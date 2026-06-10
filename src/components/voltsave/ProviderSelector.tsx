import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Building2, ChevronRight, SkipForward, Zap } from "lucide-react";
import { apiCall } from "@/hooks/useApi";
import { useCountry } from "@/hooks/useCountry";

export interface Provider {
  id: string;
  name: string;
  shortName?: string;
  state?: string;
  stateCode?: string;
  tariffType?: string;
  slabCount?: number;
  lowestRate?: number;
  highestRate?: number;
  avgMonthlyUnits?: number;
  hasPeakHours?: boolean;
}

interface Props {
  state: string;
  onSelect: (p: Provider) => void;
  onSkip: () => void;
}

const ProviderSelector = ({ state, onSelect, onSkip }: Props) => {
  const { country } = useCountry();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<Provider | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiCall<{ providers: Provider[] }>(`/api/providers?country=${country.code}`)
      .then((r) => {
        if (cancelled) return;
        const all = r?.providers || [];
        const forState = all.filter((p) => !state || p.state === state);
        setProviders(forState.length ? forState : all);
      })
      .catch(() => setProviders([]))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [country.code, state]);

  return (
    <section className="wizard-section">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="wizard-title">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">Select your electricity provider</h2>
          <p className="text-xs text-muted-foreground">{state} • we'll match the right slab structure</p>
        </motion.div>

        <div className="glass-card p-4">
          {loading ? (
            <p className="text-xs text-muted-foreground text-center py-8">Loading providers…</p>
          ) : providers.length ? (
            <div className="space-y-2 max-h-[48svh] overflow-y-auto pr-1">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPicked(p)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left border transition-all ${
                    picked?.id === p.id
                      ? "bg-primary/10 border-primary/50"
                      : "bg-secondary/30 border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    picked?.id === p.id ? "bg-primary/20" : "bg-secondary"
                  }`}>
                    <Building2 className={`w-4 h-4 ${picked?.id === p.id ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      {p.tariffType && <span>{p.tariffType}</span>}
                      {typeof p.lowestRate === "number" && typeof p.highestRate === "number" && (
                        <span>• ₹{p.lowestRate}–{p.highestRate}/unit</span>
                      )}
                      {p.hasPeakHours && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/15 text-primary"><Zap className="w-2.5 h-2.5"/>Peak</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No providers found for {state}. You can skip and continue.
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={onSkip}
              className="px-4 py-2.5 rounded-lg text-sm text-muted-foreground border border-border hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" /> Skip
            </button>
            <button
              disabled={!picked}
              onClick={() => picked && onSelect(picked)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                picked
                  ? "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_20px_hsla(217,91%,60%,0.15)]"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              }`}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderSelector;