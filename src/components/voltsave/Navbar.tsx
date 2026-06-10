import { motion } from "framer-motion";
import { Activity, ChevronDown, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { COUNTRIES, useCountry } from "@/hooks/useCountry";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/voltsave/AuthModal";

const Navbar = () => {
  const { country, setCountry } = useCountry();
  const { isAuthenticated, name, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showCountry, setShowCountry] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200"
            : "bg-white border-b border-slate-200/70"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-[15px] tracking-tight text-slate-900">VoltSave</span>
              <span className="ml-1 text-[10px] font-semibold tracking-wider text-slate-500 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 uppercase">AI</span>
            </div>
            <div className="hidden md:flex items-center gap-7">
              <a href="#platform" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Platform</a>
              <a href="#analytics" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Analytics</a>
              <a href="#security" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Security</a>
              <a href="#pricing" className="text-[13px] font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowCountry(!showCountry)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm">{country.flag}</span>
                <span className="hidden sm:inline">{country.currency}</span>
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
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setCountry(c); setShowCountry(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                          country.code === c.code
                            ? 'bg-secondary text-foreground'
                            : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span className="font-medium">{c.name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{c.symbol}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-[13px] text-slate-600 truncate max-w-[120px]">{name}</span>
                <button
                  onClick={logout}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowAuth(true)}
                  className="hidden sm:inline-flex text-[13px] font-medium px-3 py-1.5 text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-md bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition-colors"
                >
                  Start analysis
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
    </>
  );
};

export default Navbar;
