import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiCall } from '@/hooks/useApi';
import { toast } from 'sonner';

interface ProcessingScreenProps {
  billId: string | null;
  onComplete: (result: any) => void;
  onError: () => void;
}

const ANALYSIS_STEPS = [
  'Extracting bill data via OCR...',
  'Identifying tariff structure...',
  'Analyzing consumption patterns...',
  'Detecting peak usage windows...',
  'Generating savings recommendations...',
];

// Demo result for testing
const DEMO_RESULT = {
  effectiveRate: 9.2,
  effectiveRateCurrency: 'INR',
  rateVsRegionAvg: 8.2,
  rateStatus: 'above_average',
  usageIntensity: 'high',
  efficiencyScore: 68,
  monthlySavingsEstimate: 1800,
  annualSavingsEstimate: 21600,
  potentialSavingsPct: 23,
  topIssues: [
    { title: 'Above Average Consumption', description: 'Your usage is 34% higher than similar households in your region.', severity: 'high' },
    { title: 'High Effective Rate', description: 'You are paying ₹9.2/unit vs regional average of ₹8.5/unit.', severity: 'medium' },
    { title: 'Peak Hour Usage', description: 'Heavy appliances running during 6–10pm peak window.', severity: 'medium' },
  ],
  recommendations: [
    'Set AC temperature to 24°C — each degree lower adds 6% to consumption',
    'Shift washing machine and water heater use to before 6am or after 10pm',
    'Replace tube lights with LED — saves ₹200–400/month',
    'Unplug desktop and monitor when not in use — saves ₹150/month',
    'Check refrigerator door seal — worn seals increase consumption by 15%',
  ],
  tariffModel: 'flat',
  confidenceLevel: 'high',
  paid: false,
};

export default function ProcessingScreen({ billId, onComplete, onError }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  // Animate steps
  useEffect(() => {
    if (status !== 'processing') return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < ANALYSIS_STEPS.length) {
          setCompletedSteps(c => [...c, prev]);
          return prev + 1;
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [status]);

  // Poll backend status
  useEffect(() => {
    if (!billId || billId === 'demo') return;

    const pollStatus = async () => {
      try {
        const response = await apiCall(`/api/bills/${billId}/status`);
        
        if (response.status === 'completed') {
          setStatus('completed');
          onComplete(response.analysisResult);
        } else if (response.status === 'failed') {
          setStatus('failed');
          setErrorMessage(response.error || 'Analysis failed');
        }
      } catch (err: any) {
        // Don't fail on polling errors, keep trying
        console.error('Polling error:', err);
      }
    };

    const interval = setInterval(pollStatus, 3000);
    pollStatus(); // Initial check

    return () => clearInterval(interval);
  }, [billId, onComplete]);

  // Handle demo mode
  useEffect(() => {
    if (billId === 'demo') {
      // Wait for all animation steps to complete
      const timer = setTimeout(() => {
        setStatus('completed');
        onComplete(DEMO_RESULT);
      }, ANALYSIS_STEPS.length * 700 + 500);

      return () => clearTimeout(timer);
    }
  }, [billId, onComplete]);

  // Wait for animation to complete when real bill is done
  useEffect(() => {
    if (status === 'completed' && currentStep >= ANALYSIS_STEPS.length) {
      // Animation and data are both ready
    }
  }, [status, currentStep]);

  if (status === 'failed') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
          <p className="text-foreground/60 mb-6">{errorMessage || 'Something went wrong while analyzing your bill'}</p>
          <Button onClick={onError} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Animated Zap Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 rounded-full gradient-cta flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/30"
        >
          <Zap className="w-12 h-12 text-white" />
        </motion.div>

        {/* Scan Line Animation */}
        <div className="glass-card p-8 relative overflow-hidden mb-8">
          <div className="absolute inset-0 animate-scan-line">
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -skew-x-12" />
          </div>
          
          <h2 className="text-xl font-bold text-white text-center mb-2 relative z-10">
            Analyzing your bill...
          </h2>
          <p className="text-foreground/50 text-center text-sm relative z-10">
            {billId === 'demo' ? 'Using demo data' : 'Processing with AI'}
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {ANALYSIS_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep && !isCompleted;
            const isFuture = index > currentStep;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${isCompleted ? 'bg-accent/10' : isCurrent ? 'bg-primary/10' : 'bg-muted/30'}
                `}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center shrink-0
                  ${isCompleted 
                    ? 'bg-accent text-accent-foreground' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground animate-pulse' 
                      : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
                <span className={`
                  text-sm transition-colors
                  ${isCompleted || isCurrent ? 'text-white' : 'text-foreground/40'}
                `}>
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
