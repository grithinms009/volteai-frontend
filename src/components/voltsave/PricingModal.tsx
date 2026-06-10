import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Crown } from "lucide-react";
import { useState } from "react";
import { apiCall } from "@/hooks/useApi";
import { toast } from "sonner";

interface PricingModalProps {
  open: boolean;
  onClose: () => void;
  billId?: string | null;
  isDemo?: boolean;
  onUnlockSuccess?: () => void;
}

const plans = [
  {
    id: "free",
    name: "Free Preview",
    price: "₹0",
    description: "Basic savings snapshot",
    features: [
      "Efficiency score",
      "Estimated monthly savings",
      "Top 2 waste issues",
      "Limited recommendations",
    ],
    cta: "Current Plan",
    disabled: true,
  },
  {
    id: "report",
    name: "Full Report",
    price: "₹199",
    priceNote: "one-time",
    description: "Complete optimization plan",
    features: [
      "Everything in Free",
      "Detailed appliance analysis",
      "Full optimization strategy",
      "Peak-hour scheduling",
      "Downloadable PDF report",
      "Cost breakdown by device",
    ],
    cta: "Get Full Report",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "₹499",
    priceNote: "/month",
    description: "Ongoing optimization",
    features: [
      "Everything in Full Report",
      "Monthly bill tracking",
      "Real-time alerts",
      "Priority support",
      "Unlimited analyses",
    ],
    cta: "Start Pro",
  },
];

const PricingModal = ({ open, onClose, billId, isDemo, onUnlockSuccess }: PricingModalProps) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleBuy = async (planId: string) => {
    if (planId === "free") return;
    setLoadingId(planId);
    try {
      // DEV: bypass payment — try backend bypass endpoint, then unlock anyway
      if (billId && !isDemo) {
        try {
          await apiCall(`/api/bills/${billId}/bypass-payment`, { method: "POST" });
        } catch {
          // endpoint may not exist — ignore
        }
      }
      await new Promise((r) => setTimeout(r, 500));
      toast.success("Payment bypassed — full report unlocked!");
      onUnlockSuccess?.();
      onClose();
    } catch (e: any) {
      if (e?.message !== "Payment cancelled") {
        toast.error(e?.message || "Payment failed");
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="glass-card p-6 md:p-8 w-full max-w-3xl relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-1">Choose Your Plan</h3>
              <p className="text-sm text-muted-foreground">
                Unlock deeper insights and save more on electricity
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-5 border transition-all ${
                    plan.highlight
                      ? "border-primary/50 bg-primary/5 shadow-[0_0_30px_hsla(217,91%,60%,0.1)]"
                      : "border-border bg-secondary/20"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      <Crown className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                  <h4 className="text-base font-bold text-foreground mb-1">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-extrabold text-foreground">{plan.price}</span>
                    {plan.priceNote && (
                      <span className="text-xs text-muted-foreground">{plan.priceNote}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>

                  <ul className="space-y-2 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={plan.disabled}
                    onClick={() => handleBuy(plan.id)}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_15px_hsla(217,91%,60%,0.15)]"
                        : plan.disabled
                        ? "bg-secondary text-muted-foreground cursor-not-allowed"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {plan.disabled ? (
                      plan.cta
                    ) : loadingId === plan.id ? (
                      "Processing…"
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        {plan.cta}
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-muted-foreground text-center mt-6">
              All plans include encrypted data handling. Cancel anytime.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PricingModal;
