import { motion } from "framer-motion";
import { Search, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE } from "@/hooks/useApi";
import { useCountry } from "@/hooks/useCountry";

const POPULAR_STATES = ["Kerala", "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat"];

const FALLBACK_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry", "Jammu & Kashmir", "Ladakh",
];

interface ApiState {
  code: string;
  name: string;
}

interface StateSelectorProps {
  onSelect: (state: string) => void;
}

const StateSelector = ({ onSelect }: StateSelectorProps) => {
  const { country } = useCountry();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [allStates, setAllStates] = useState<string[]>(FALLBACK_STATES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/providers/states?country=${country.code}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (data.states && data.states.length > 0) {
          setAllStates(data.states.map((s: ApiState) => s.name).sort());
        }
      } catch {
        // Keep fallback
      } finally {
        setLoading(false);
      }
    };
    fetchStates();
  }, [country.code]);

  const filtered = allStates.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const popular = POPULAR_STATES.filter((s) => allStates.includes(s));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <div className="glass-card p-6 md:p-8">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search your state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors text-sm"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading states...
          </div>
        )}

        {!search && !loading && popular.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Popular States
            </p>
            <div className="grid grid-cols-3 gap-2">
              {popular.map((state) => (
                <button
                  key={state}
                  onClick={() => setSelected(state)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    selected === state
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {search ? "Results" : "All States"}
            </p>
            <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No states found</p>
              )}
              {filtered.map((state) => (
                <button
                  key={state}
                  onClick={() => setSelected(state)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-sm transition-colors ${
                    selected === state
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {state}
                  {selected === state && (
                    <span className="ml-auto text-xs font-medium text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <motion.button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            selected
              ? "bg-primary text-primary-foreground hover:brightness-110"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
          whileHover={selected ? { scale: 1.01 } : {}}
          whileTap={selected ? { scale: 0.99 } : {}}
        >
          Next — Select Provider
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StateSelector;
