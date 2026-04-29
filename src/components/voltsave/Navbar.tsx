import { useState, useEffect } from 'react';
import { Zap, ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  onAuthClick: () => void;
  onPricingClick?: () => void;
}

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export default function Navbar({ onAuthClick, onPricingClick }: NavbarProps) {
  const { isAuthenticated, name, logout } = useAuth();
  const [currency, setCurrency] = useState(currencies[0]);

  // Auto-detect currency from timezone
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone.includes('India') || timezone.includes('Kolkata') || timezone.includes('Mumbai')) {
      setCurrency(currencies[0]); // INR
    } else if (timezone.includes('America') || timezone.includes('US')) {
      setCurrency(currencies[1]); // USD
    } else if (timezone.includes('Europe')) {
      setCurrency(currencies[2]); // EUR
    } else if (timezone.includes('London') || timezone.includes('UK')) {
      setCurrency(currencies[3]); // GBP
    }
    
    // Store in localStorage for use across app
    localStorage.setItem('currency', JSON.stringify(currency));
  }, []);

  const handleCurrencyChange = (curr: typeof currencies[0]) => {
    setCurrency(curr);
    localStorage.setItem('currency', JSON.stringify(curr));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">VoltSave AI</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                  {currency.symbol} {currency.code}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                {currencies.map((curr) => (
                  <DropdownMenuItem
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr)}
                    className={currency.code === curr.code ? 'bg-primary/10' : ''}
                  >
                    <span className="font-medium">{curr.symbol}</span>
                    <span className="ml-2">{curr.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Button */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-foreground/80 hover:text-foreground">
                    <User className="w-4 h-4 mr-2" />
                    {name || 'User'}
                    <ChevronDown className="ml-1 w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem onClick={logout}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={onAuthClick}
                className="gradient-cta text-white hover:opacity-90"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
