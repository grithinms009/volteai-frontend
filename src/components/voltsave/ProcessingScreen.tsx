import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, X, Loader2, Sparkles, Brain, BarChart3, Target, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiCall } from '@/hooks/useApi';
import { toast } from 'sonner';

interface ProcessingScreenProps {
  billId: string | null;
  onComplete: (result: any) => void;
  onError: () => void;
}

const ANALYSIS_STEPS = [
  { text: 'Extracting bill data via OCR...', icon: FileCheck },
  { text: 'Identifying tariff structure...', icon: BarChart3 },
  { text: 'Analyzing consumption patterns...', icon: Brain },
  { text: 'Detecting peak usage windows...', icon: Target },
  { text: 'Generating savings recommendations...', icon: Sparkles },
];

const MIN_DISPLAY_TIME_MS = 5000; // Minimum 5 seconds display

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
  currentBill: 7800,
  optimizedBill: 6000,
  peakWasteHours: 4.2,
  topIssues: [
    { title: 'High usage during peak hours (6–9 PM)', description: 'Heavy appliances running during expensive peak window.', severity: 'high' },
    { title: 'Idle devices consuming 340W standby', description: 'Multiple devices left on standby mode.', severity: 'high' },
    { title: 'AC running at suboptimal temperature', description: 'AC set below 24°C increases consumption by 6% per degree.', severity: 'medium' },
    { title: 'Old refrigerator model detected', description: 'Older models consume 30-40% more energy.', severity: 'medium' },
    { title: 'No solar optimization', description: 'Peak usage doesn\'t align with solar generation hours.', severity: 'low' },
  ],
  recommendations: [
    { text: 'Set AC to 24°C (save ₹400/mo)', icon: '❄️' },
    { text: 'Use smart plugs for idle devices', icon: '🔌' },
    { text: 'Shift heavy loads to off-peak hours', icon: '⏰' },
    { text: 'Replace old refrigerator with 5-star rated', icon: '⭐' },
    { text: 'Install LED lighting throughout', icon: '💡' },
    { text: 'Use ceiling fans with AC to reduce load', icon: '🌀' },
  ],
  highConsumptionDevices: [
    { name: 'Air Conditioner', kwh: 180, percentage: 38 },
    { name: 'Water Heater', kwh: 95, percentage: 20 },
    { name: 'Refrigerator', kwh: 72, percentage: 15 },
    { name: 'Washing Machine', kwh: 45, percentage: 9 },
  ],
  monthlyUsage: [
    { month: 'Jul', current: 320, optimized: 280 },
    { month: 'Aug', current: 380, optimized: 310 },
    { month: 'Sep', current: 350, optimized: 290 },
    { month: 'Oct', current: 290, optimized: 250 },
    { month: 'Nov', current: 260, optimized: 230 },
    { month: 'Dec', current: 300, optimized: 260 },
    { month: 'Jan', current: 340, optimized: 280 },
    { month: 'Feb', current: 360, optimized: 300 },
    { month: 'Mar', current: 320, optimized: 270 },
    { month: 'Apr', current: 280, optimized: 240 },
    { month: 'May', current: 310, optimized: 260 },
    { month: 'Jun', current: 290, optimized: 250 },
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
  const [progress, setProgress] = useState(0);
  
  const startTimeRef = useRef(Date.now());
  const pendingResultRef = useRef<any>(null);
  const hasCompletedRef = useRef(false);

  // Smooth progress animation
  useEffect(() => {
    if (status !== 'processing') return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        const increment = Math.random() * 3 + 1;
        return Math.min(prev + increment, 95);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [status]);

  // Animate steps with professional timing
  useEffect(() => {
    if (status !== 'processing') return;

    const stepDuration = 900;
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < ANALYSIS_STEPS.length) {
          setCompletedSteps(c => [...c, prev]);
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [status]);

  // Handle completion with minimum delay
  const handleCompletion = (result: any) => {
    if (hasCompletedRef.current) return;
    
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = MIN_DISPLAY_TIME_MS - elapsed;

    if (remaining > 0) {
      pendingResultRef.current = result;
      setTimeout(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          setProgress(100);
          setTimeout(() => onComplete(result), 300);
        }
      }, remaining);
    } else {
      hasCompletedRef.current = true;
      setProgress(100);
      setTimeout(() => onComplete(result), 300);
    }
  };

  // Poll backend status
  useEffect(() => {
    if (!billId || billId === 'demo') return;

    const pollStatus = async () => {
      try {
        const response = await apiCall(`/api/bills/${billId}/status`);
        
        if (response.status === 'completed') {
          setStatus('completed');
          handleCompletion(response.analysisResult);
        } else if (response.status === 'failed') {
          setStatus('failed');
          setErrorMessage(response.error || 'Analysis failed');
        }
      } catch (err: any) {
        console.error('Polling error:', err);
      }
    };

    const interval = setInterval(pollStatus, 3000);
    pollStatus();

    return () => clearInterval(interval);
  }, [billId]);

  // Handle demo mode with minimum delay
  useEffect(() => {
    if (billId === 'demo') {
      const timer = setTimeout(() => {
        setStatus('completed');
        handleCompletion(DEMO_RESULT);
      }, Math.max(MIN_DISPLAY_TIME_MS, ANALYSIS_STEPS.length * 900 + 500));

      return () => clearTimeout(timer);
    }
  }, [billId]);

  if (status === 'failed') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-8"
          >
            <X className="w-12 h-12 text-destructive" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Analysis Failed</h2>
          <p className="text-foreground/60 mb-8 text-base">{errorMessage || 'Something went wrong while analyzing your bill'}</p>
          <Button onClick={onError} variant="outline" size="lg" className="px-8">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-lg">
        {/* Animated Icon */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 3.77} 377`}
              className="transition-all duration-300"
            />
          </svg>
          
          {/* Center icon */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-4 rounded-full gradient-cta flex items-center justify-center shadow-xl shadow-primary/30"
          >
            <Zap className="w-12 h-12 text-white" />
          </motion.div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/60"
              initial={{ 
                x: 64, 
                y: 64,
                opacity: 0 
              }}
              animate={{ 
                x: 64 + Math.cos(i * 60 * Math.PI / 180) * 70,
                y: 64 + Math.sin(i * 60 * Math.PI / 180) * 70,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Analyzing Your Bill
          </h2>
          <p className="text-foreground/50 text-sm sm:text-base">
            {billId === 'demo' ? 'Using demo data for preview' : 'AI is processing your electricity bill'}
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground/60">Progress</span>
            <span className="text-primary font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Steps checklist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 sm:p-8 space-y-4"
        >
          {ANALYSIS_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = index === currentStep && !isCompleted;
            const StepIcon = step.icon;

            return (
              <motion.div
                key={step.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                  ${isCompleted 
                    ? 'bg-accent/10 border border-accent/20' 
                    : isCurrent 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'bg-muted/20 border border-transparent'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                  ${isCompleted 
                    ? 'bg-accent text-white' 
                    : isCurrent 
                      ? 'bg-primary text-white' 
                      : 'bg-muted/50 text-foreground/40'
                  }
                `}>
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span className={`
                  text-sm sm:text-base font-medium transition-colors duration-300
                  ${isCompleted ? 'text-accent' : isCurrent ? 'text-white' : 'text-foreground/40'}
                `}>
                  {step.text}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tip */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-foreground/40 text-sm mt-6"
        >
          💡 Tip: Upload clearer bills for more accurate analysis
        </motion.p>
      </div>
    </div>
  );
}
