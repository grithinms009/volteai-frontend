import { motion } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess?: () => void;
}

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: '',
    description: 'Basic analysis for everyone',
    features: [
      { text: 'Bill summary', included: true },
      { text: 'Efficiency score', included: true },
      { text: 'Top 2 issues', included: true },
      { text: 'Savings estimate', included: true },
      { text: 'Full analysis', included: false },
      { text: 'PDF report', included: false },
    ],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    name: 'Full Report',
    price: '₹199',
    period: '(One-time)',
    description: 'Complete analysis for this bill',
    popular: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'All issues & recommendations', included: true },
      { text: 'Appliance breakdown', included: true },
      { text: 'Downloadable PDF report', included: true },
      { text: 'Region-specific tips', included: true },
    ],
    cta: 'Unlock Now →',
    disabled: false,
  },
  {
    name: 'Pro',
    price: '₹499',
    period: '/month',
    description: 'Unlimited reports & monitoring',
    features: [
      { text: 'Unlimited reports', included: true },
      { text: 'Monthly bill monitoring', included: true },
      { text: 'Trend comparison', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Coming Soon',
    disabled: true,
    comingSoon: true,
  },
];

export default function PricingModal({ isOpen, onClose, onUnlockSuccess }: PricingModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = async () => {
    setIsProcessing(true);
    // Simulate payment processing (bypassed for testing)
    toast.info('Processing payment...');
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Payment successful! Full report unlocked.');
      if (onUnlockSuccess) {
        onUnlockSuccess();
      }
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-card p-6 sm:p-8"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/60 hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Choose Your Plan
          </h2>
          <p className="text-foreground/60">
            Unlock your complete energy savings report
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                glass-card p-6 flex flex-col
                ${plan.popular ? 'ring-2 ring-primary relative' : ''}
              `}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Most Popular
                </span>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-foreground/50">{plan.period}</span>
                </div>
                <p className="text-sm text-foreground/50 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-accent shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-foreground/30 shrink-0" />
                    )}
                    <span className={feature.included ? 'text-foreground/80' : 'text-foreground/40'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={plan.popular ? handleUnlock : undefined}
                disabled={plan.disabled || (plan.popular && isProcessing)}
                className={`
                  w-full
                  ${plan.popular 
                    ? 'gradient-cta text-white' 
                    : plan.comingSoon 
                      ? 'bg-muted text-muted-foreground'
                      : 'variant-outline'
                  }
                `}
              >
                {plan.popular && isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  plan.cta
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
