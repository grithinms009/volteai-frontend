import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, MapPin, Search } from "lucide-react";
import { apiCall } from "@/hooks/useApi";
import { useCountry } from "@/hooks/useCountry";

const FALLBACK_STATES_IN = [
  "Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal",
];

interface Props {
  onSelect: (state: string) => void;
}

const StateSelector = ({ onSelect }: Props) => {
  const { country } = useCountry();
  const [states, setStates] = useState<string[]>(country.code === "IN" ? FALLBACK_STATES_IN : []);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiCall<{ states: { code: string; name: string }[] }>(`/api/providers/states?country=${country.code}`)
      .then((r) => {
        if (cancelled) return;
        const list = (r?.states || []).map((s) => s.name).filter(Boolean);
        if (list.length) setStates(list);
      })
      .catch(() => {
        if (country.code === "IN" && !cancelled) setStates(FALLBACK_STATES_IN);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [country.code]);

  const filtered = useMemo(
    () => states.filter((s) => s.toLowerCase().includes(query.toLowerCase())),
    [states, query]
  );

  return (
    <section className="wizard-section">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="wizard-title">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">Select your state</h2>
          <p className="text-xs text-muted-foreground">We use your state to fetch the right tariff & providers</p>
        </motion.div>

        <div className="glass-card p-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${country.name} states...`}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50"
            />
          </div>

          {loading && <p className="text-xs text-muted-foreground text-center py-4">Loading states…</p>}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[44svh] overflow-y-auto pr-1">
            {filtered.map((s) => (
              <button
                key={s}
                onClick={() => setPicked(s)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all border ${
                  picked === s
                    ? "bg-primary/15 border-primary/50 text-foreground"
                    : "bg-secondary/30 border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${picked === s ? "text-primary" : ""}`} />
                <span className="truncate">{s}</span>
              </button>
            ))}
            {!loading && !filtered.length && (
              <p className="col-span-full text-xs text-muted-foreground text-center py-4">No matches</p>
            )}
          </div>

          <button
            disabled={!picked}
            onClick={() => picked && onSelect(picked)}
            className={`w-full mt-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              picked
                ? "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_20px_hsla(217,91%,60%,0.15)]"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StateSelector;