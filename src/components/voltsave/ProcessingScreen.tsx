import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { apiCall } from "@/hooks/useApi";
import { toast } from "sonner";

interface ProcessingScreenProps {
  billId: string | null;
  onComplete: (result: any) => void;
  onError: () => void;
}

const STEPS = [
  "Extracting bill data via OCR...",
  "Identifying tariff structure...",
  "Analyzing consumption patterns...",
  "Detecting peak usage windows...",
  "Generating savings recommendations...",
];

const MIN_DISPLAY_TIME_MS = 5000;

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
  ],
  recommendations: [
    { text: 'Set AC to 24°C (save ₹400/mo)', icon: '🌡️' },
    { text: 'Use smart plugs for idle devices', icon: '🔌' },
    { text: 'Shift heavy loads to off-peak hours', icon: '⏰' },
    { text: 'Replace old refrigerator with 5-star rated', icon: '⭐' },
  ],
  highConsumptionDevices: [
    { name: 'Air Conditioner', kwh: 180, percentage: 38 },
    { name: 'Water Heater', kwh: 95, percentage: 20 },
    { name: 'Refrigerator', kwh: 72, percentage: 15 },
    { name: 'Washing Machine', kwh: 45, percentage: 9 },
  ],
  tariffModel: 'flat',
  confidenceLevel: 'high',
  paid: false,
};

const ProcessingScreen = ({ billId, onComplete, onError }: ProcessingScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const startTimeRef = useRef(Date.now());
  const hasCompletedRef = useRef(false);

  // Handle completion with minimum delay
  const handleCompletion = (result: any) => {
    if (hasCompletedRef.current) return;
    
    const elapsed = Date.now() - startTimeRef.current;
    const remaining = MIN_DISPLAY_TIME_MS - elapsed;

    if (remaining > 0) {
      setTimeout(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete(result);
        }
      }, remaining);
    } else {
      hasCompletedRef.current = true;
      onComplete(result);
    }
  };

  // Animate steps
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

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
          toast.error(response.error || 'Analysis failed');
          onError();
        }
      } catch (err: any) {
        console.error('Polling error:', err);
      }
    };

    const interval = setInterval(pollStatus, 3000);
    pollStatus();

    return () => clearInterval(interval);
  }, [billId]);

  // Handle demo mode
  useEffect(() => {
    if (billId === 'demo') {
      const timer = setTimeout(() => {
        setStatus('completed');
        handleCompletion(DEMO_RESULT);
      }, Math.max(MIN_DISPLAY_TIME_MS, STEPS.length * 700 + 500));

      return () => clearTimeout(timer);
    }
  }, [billId]);

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-lg text-center">
        {/* Scan visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative glass-card p-12 mb-8 overflow-hidden"
        >
          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-full"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.15) 50%, transparent 100%)',
              }}
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-0 left-0 w-px h-full bg-primary"
              animate={{ x: ['-10px', '500px'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Pulsing icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            <span className="text-3xl">⚡</span>
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">AI Neural Scan</h2>
          <p className="text-muted-foreground">
            {billId === 'demo' ? 'Analyzing demo bill' : 'Analyzing your electricity bill'}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: i <= currentStep ? 1 : 0.3,
                x: i <= currentStep ? 0 : -20,
              }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3 text-left"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300 ${
                i < currentStep ? 'bg-accent' : i === currentStep ? 'bg-primary animate-pulse' : 'bg-muted'
              }`} />
              <span className={`text-sm transition-colors duration-300 ${
                i <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
              {i < currentStep && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="text-accent text-xs ml-auto"
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessingScreen;
