import { motion } from "framer-motion";
import { Check, MapPin, Building2, Upload, BarChart3 } from "lucide-react";

const STEPS = [
  { label: "Select State", icon: MapPin },
  { label: "Provider", icon: Building2 },
  { label: "Upload Bill", icon: Upload },
  { label: "Results", icon: BarChart3 },
];

interface ProgressStepperProps {
  currentStep: number; // 0-3
}

const ProgressStepper = ({ currentStep }: ProgressStepperProps) => {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-2">
      <div className="flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute top-3 left-[10%] right-[10%] h-px bg-border" />
        <motion.div
          className="absolute top-3 left-[10%] h-px bg-primary origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStep / (STEPS.length - 1) }}
          style={{ width: "80%" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-1">
              <motion.div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-300 ${
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
                  <Check className="w-3 h-3 text-primary-foreground" />
                ) : (
                  <step.icon className={`w-3 h-3 ${active ? "text-primary" : "text-muted-foreground"}`} />
                )}
              </motion.div>
              <span
                className={`text-[10px] font-medium transition-colors hidden sm:block ${
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
