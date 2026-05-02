import { motion } from "framer-motion";
import { Zap, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  onAuthClick: () => void;
  onPricingClick?: () => void;
}

const COUNTRIES = [
  { code: "IN", name: "India", flag: "🇮🇳", currency: "INR", symbol: "₹" },
  { code: "US", name: "United States", flag: "🇺🇸", currency: "USD", symbol: "$" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", currency: "GBP", symbol: "£" },
  { code: "DE", name: "Germany", flag: "🇩🇪", currency: "EUR", symbol: "€" },
  { code: "AU", name: "Australia", flag: "🇦🇺", currency: "AUD", symbol: "A$" },
  { code: "JP", name: "Japan", flag: "🇯🇵", currency: "JPY", symbol: "¥" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", currency: "BRL", symbol: "R$" },
  { code: "CA", name: "Canada", flag: "🇨🇦", currency: "CAD", symbol: "C$" },
];

const Navbar = ({ onAuthClick, onPricingClick }: NavbarProps) => {
  const { isAuthenticated, name, logout } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountry, setShowCountry] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Auto-detect location via timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzMap: Record<string, string> = {
        "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
        "America/New_York": "US", "America/Chicago": "US", "America/Los_Angeles": "US", "America/Denver": "US",
        "Europe/London": "GB",
        "Europe/Berlin": "DE", "Europe/Frankfurt": "DE",
        "Australia/Sydney": "AU", "Australia/Melbourne": "AU",
        "Asia/Tokyo": "JP",
        "America/Sao_Paulo": "BR",
        "America/Toronto": "CA", "America/Vancouver": "CA",
      };
      const code = tzMap[tz];
      if (code) {
        const found = COUNTRIES.find(c => c.code === code);
        if (found) {
          setSelectedCountry(found);
          localStorage.setItem('currency', JSON.stringify({ code: found.currency, symbol: found.symbol }));
        }
      }
    } catch {}
  }, []);

  const handleCountryChange = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setShowCountry(false);
    localStorage.setItem('currency', JSON.stringify({ code: country.currency, symbol: country.symbol }));
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">VoltSave AI</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Country selector */}
          <div className="relative">
            <button
              onClick={() => setShowCountry(!showCountry)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <span className="text-base">{selectedCountry.flag}</span>
              <span className="hidden sm:inline">{selectedCountry.currency}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showCountry ? 'rotate-180' : ''}`} />
            </button>

            {showCountry && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCountry(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 w-52 glass-card p-1.5 z-50 max-h-72 overflow-y-auto"
                >
                  {COUNTRIES.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountryChange(country)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        selectedCountry.code === country.code
                          ? 'bg-primary/20 text-foreground'
                          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{country.flag}</span>
                      <span className="font-medium">{country.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{country.symbol}</span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* Auth / User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{name || 'User'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-44 glass-card p-1.5 z-50"
                  >
                    <a
                      href="/dashboard"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      My Reports
                    </a>
                    {onPricingClick && (
                      <button
                        onClick={() => { setShowUserMenu(false); onPricingClick(); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        Pricing
                      </button>
                    )}
                    <button
                      onClick={() => { setShowUserMenu(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
