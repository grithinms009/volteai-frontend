import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
}

export const COUNTRIES: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£" },
];

const TZ_MAP: Record<string, string> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
  "America/New_York": "US", "America/Chicago": "US",
  "America/Los_Angeles": "US", "America/Denver": "US",
  "Europe/London": "GB",
  "Europe/Berlin": "DE", "Europe/Frankfurt": "DE",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU",
  "Asia/Tokyo": "JP",
  "America/Sao_Paulo": "BR",
  "America/Toronto": "CA", "America/Vancouver": "CA",
};

function detectCountry(): Country {
  try {
    // Only use saved value if user explicitly picked it (flagged with "userPicked")
    const saved = localStorage.getItem("selectedCountry");
    if (saved) {
      const parsed = JSON.parse(saved) as Country & { userPicked?: boolean };
      if (parsed.userPicked && COUNTRIES.find(c => c.code === parsed.code)) {
        return parsed;
      }
    }
    // Auto-detect via timezone
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const code = TZ_MAP[tz];
    if (code) {
      const found = COUNTRIES.find(c => c.code === code);
      if (found) return found;
    }
  } catch {}
  return COUNTRIES[0]; // fallback: India
}

interface CountryContextValue {
  country: Country;
  setCountry: (c: Country) => void;
}

const CountryContext = createContext<CountryContextValue>({
  country: COUNTRIES[0],
  setCountry: () => {},
});

export const CountryProvider = ({ children }: { children: ReactNode }) => {
  // Clean up stale entries from old localStorage format on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("selectedCountry");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.userPicked) localStorage.removeItem("selectedCountry");
      }
      // Also clean up old "currency" key format
      const oldCurrency = localStorage.getItem("currency");
      if (oldCurrency) {
        const parsed = JSON.parse(oldCurrency);
        if (!parsed.symbol) localStorage.removeItem("currency");
      }
    } catch {
      localStorage.removeItem("selectedCountry");
    }
  }, []);

  const [country, setCountryState] = useState<Country>(detectCountry);

  const setCountry = (c: Country) => {
    setCountryState(c);
    // Mark as user-picked so we remember it across refreshes
    localStorage.setItem("selectedCountry", JSON.stringify({ ...c, userPicked: true }));
    localStorage.setItem("currency", JSON.stringify({ code: c.currency, symbol: c.symbol }));
  };

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
