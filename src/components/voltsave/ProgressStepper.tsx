import { motion } from 'framer-motion';
import { Check, User, Upload, Settings, FileText } from 'lucide-react';

type StepId = 'signin' | 'upload' | 'setup' | 'results';

interface ProgressStepperProps {
  currentStep: StepId;
}

const steps: { id: StepId; label: string; icon: typeof User }[] = [
  { id: 'signin', label: 'Sign In', icon: User },
  { id: 'upload', label: 'Upload Bill', icon: Upload },
  { id: 'setup', label: 'Setup Details', icon: Settings },
  { id: 'results', label: 'Results', icon: FileText },
];

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-colors duration-300
                    ${isCompleted 
                      ? 'bg-primary text-primary-foreground' 
                      : isActive 
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' 
                        : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </motion.div>
                <span className={`
                  mt-2 text-xs font-medium
                  ${isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-4 transition-colors duration-300
                  ${index < currentIndex ? 'bg-primary' : 'bg-muted'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
