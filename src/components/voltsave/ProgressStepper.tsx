import { motion } from "framer-motion";
import { Check, MapPin, Zap, Upload, BarChart3 } from "lucide-react";

const STEPS = [
  { label: "Select State", icon: MapPin },
  { label: "Provider", icon: Zap },
  { label: "Upload Bill", icon: Upload },
  { label: "Results", icon: BarChart3 },
];

interface ProgressStepperProps {
  currentStep: number; // 0-3
}

const ProgressStepper = ({ currentStep }: ProgressStepperProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute top-5 left-[10%] right-[10%] h-px bg-border" />
        <motion.div
          className="absolute top-5 left-[10%] h-px bg-primary origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStep / (STEPS.length - 1) }}
          style={{ width: "80%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  done
                    ? "bg-primary border-primary"
                    : active
                    ? "bg-primary/20 border-primary"
                    : "bg-secondary border-border"
                }`}
                initial={false}
                animate={active ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {done ? (
                  <Check className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <step.icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </motion.div>
              <span
                className={`text-[11px] font-medium transition-colors hidden sm:block ${
                  done || active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressStepper;
