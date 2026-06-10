import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCountry } from '@/hooks/useCountry';

export default function Header() {
  const navigate = useNavigate();
  const { name, logout } = useAuth();
  const { country, setCountry } = useCountry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { href: '#platform', label: 'Platform' },
    { href: '#analytics', label: 'Analytics' },
    { href: '#security', label: 'Security' },
    { href: '#pricing', label: 'Pricing' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800" style={{ height: '72px' }}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⚡</span>
              </div>
              <span className="font-bold text-lg">VoltSave</span>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded text-blue-100">AI</span>
            </div>
            
            {/* Nav Links - Desktop Only */}
            <nav className="hidden md:flex gap-6 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-blue-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          
          {/* Right: User Controls + Build Info */}
          <div className="flex items-center gap-6">
                        
            {/* Currency Selector */}
            <select
              value={country.code}
              onChange={(e) => {
                const selected = e.target.value;
                const countryObj = { IN: { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹' },
                                       US: { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },
                                       GB: { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' } }[selected];
                if (countryObj) setCountry(countryObj);
              }}
              className="bg-slate-800 text-white text-sm px-3 py-1 rounded border border-slate-700 hover:border-slate-600 cursor-pointer"
            >
              <option value="US">�� USD</option>
              <option value="IN">�� INR</option>
              <option value="GB">🇬🇧 GBP</option>
            </select>
            
            {/* User Menu - Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-sm hover:text-blue-400 transition-colors">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold">
                  {name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline">{name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-sm font-semibold">Grithin</p>
                  <p className="text-xs text-slate-400">grithinms@gmail.com</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors">
                  Billing
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm border-t border-slate-700 text-red-400 hover:bg-slate-700 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-slate-800 rounded transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-800">
            <nav className="flex flex-col gap-4 text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="hover:text-blue-400 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
