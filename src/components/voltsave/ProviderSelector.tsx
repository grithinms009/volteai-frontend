import { motion } from "framer-motion";
import { Zap, ChevronLeft, ChevronRight, Info, SkipForward, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE } from "@/hooks/useApi";
import { useCountry } from "@/hooks/useCountry";

export interface Provider {
  id: string;
  name: string;
  shortName: string;
  state: string;
  stateCode: string;
  tariffType: string;
  slabCount: number;
  lowestRate: number;
  highestRate: number;
  avgMonthlyUnits: number;
  hasPeakHours: boolean;
}

interface ProviderSelectorProps {
  state: string;
  onSelect: (provider: Provider) => void;
  onBack: () => void;
  onSkip: () => void;
}

const ProviderSelector = ({ state, onSelect, onBack, onSkip }: ProviderSelectorProps) => {
  const [selected, setSelected] = useState<Provider | null>(null);
  const [showTariff, setShowTariff] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { country } = useCountry();

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${API_BASE}/api/providers?country=${country.code}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const all: Provider[] = data.providers ?? [];
        // Filter to selected state
        const forState = all.filter(
          (p) => p.state?.toLowerCase() === state.toLowerCase()
        );
        setProviders(forState);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [state, country.code]);

  const noProviders = !loading && !error && providers.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card p-6 md:p-8">
        {/* Back breadcrumb */}
        <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
          <button onClick={onBack} className="hover:text-foreground transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            {state}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading providers for {state}...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <p>Could not load providers. You can skip and let AI auto-detect.</p>
          </div>
        )}

        {/* No providers found */}
        {noProviders && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <p>No providers listed for <strong className="text-foreground">{state}</strong> yet.</p>
            <p className="mt-1">AI will auto-detect your provider from the bill.</p>
          </div>
        )}

        {/* Provider cards */}
        {!loading && providers.length > 0 && (
          <div className="space-y-3">
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                whileHover={{ scale: 1.005 }}
                onClick={() => setSelected(provider)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selected?.id === provider.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground text-sm">{provider.shortName}</p>
                        {provider.hasPeakHours && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            Time-of-Use
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{provider.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTariff(showTariff === provider.id ? null : provider.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {selected?.id === provider.id && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg flex-shrink-0">
                        Selected ✓
                      </span>
                    )}
                  </div>
                </div>

                {showTariff === provider.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-border grid grid-cols-3 gap-3"
                  >
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Tariff Type</p>
                      <p className="text-sm font-medium text-foreground capitalize">{provider.tariffType} ({provider.slabCount} slabs)</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Rate Range</p>
                      <p className="text-sm font-medium text-foreground">
                        {country.symbol}{provider.lowestRate} – {country.symbol}{provider.highestRate}/unit
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Avg. Usage</p>
                      <p className="text-sm font-medium text-foreground">{provider.avgMonthlyUnits} units/mo</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Actions */}
        {!loading && (
          <div className="mt-5 flex flex-col gap-2.5">
            <motion.button
              onClick={() => selected && onSelect(selected)}
              disabled={!selected && !noProviders && !error}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                selected || noProviders || error
                  ? "bg-primary text-primary-foreground hover:brightness-110"
                  : "bg-secondary text-muted-foreground cursor-not-allowed"
              }`}
              whileHover={selected || noProviders || error ? { scale: 1.01 } : {}}
              whileTap={selected || noProviders || error ? { scale: 0.99 } : {}}
            >
              {noProviders || error ? "Continue — AI will detect provider" : "Next — Upload Bill"}
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            {!noProviders && !error && (
              <button
                onClick={onSkip}
                className="w-full py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center justify-center gap-2 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                Skip — AI will detect from bill
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProviderSelector;
