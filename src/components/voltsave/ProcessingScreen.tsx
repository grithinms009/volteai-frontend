import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { apiCall } from "@/hooks/useApi";
import { DEMO_RESULT } from "@/lib/demoResult";
import type { ApiResult } from "@/types/analysis";

interface ProcessingScreenProps {
  billId: string | null;
  isDemo?: boolean;
  onComplete: (result: ApiResult) => void;
  onError?: (err: Error) => void;
}

const STEPS = [
  { label: "Uploading bill...", progress: 10 },
  { label: "Reading bill...", progress: 35 },
  { label: "Extracting fields...", progress: 60 },
  { label: "Running analysis engines...", progress: 75 },
  { label: "Generating AI summary...", progress: 92 },
  { label: "Done!", progress: 100 },
];

const MAX_POLLS = 60; // 3 min timeout at 3s interval

const ProcessingScreen = ({ billId, isDemo, onComplete, onError }: ProcessingScreenProps) => {
  const [apiProgress, setApiProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const finished = useRef(false);

  // Drive visible step from API progress milestones
  useEffect(() => {
    const idx = STEPS.findIndex(s => apiProgress < s.progress);
    setCurrentStep(idx === -1 ? STEPS.length - 1 : Math.max(0, idx - 1));
  }, [apiProgress]);

  useEffect(() => {
    if (finished.current) return;
    if (isDemo || billId === "demo" || !billId) {
      // Simulate progress for demo
      let p = 0;
      const tick = setInterval(() => {
        p = Math.min(100, p + 14);
        setApiProgress(p);
        if (p >= 100) clearInterval(tick);
      }, 700);
      const t = setTimeout(() => {
        finished.current = true;
        clearInterval(tick);
        setApiProgress(100);
        setCurrentStep(STEPS.length - 1);
        onComplete(DEMO_RESULT);
      }, 4200);
      return () => { clearInterval(tick); clearTimeout(t); };
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      if (cancelled) return;
      attempts++;
      try {
        const r = await apiCall<any>(`/api/bills/${billId}/status`);

        // Update progress bar from API
        if (typeof r?.progress === "number") {
          setApiProgress(r.progress);
        }

        if (r?.status === "completed" && r?.analysisResult) {
          finished.current = true;
          setApiProgress(100);
          setCurrentStep(STEPS.length - 1);
          onComplete(r.analysisResult as ApiResult);
          return;
        }
        if (r?.status === "failed") {
          throw new Error(r.error || "Bill processing failed");
        }
      } catch (e: any) {
        if (attempts >= MAX_POLLS) {
          onError?.(e);
          return;
        }
      }
      if (!cancelled) setTimeout(poll, 3000);
    };

    poll();
    return () => { cancelled = true; };
  }, [billId, isDemo, onComplete, onError]);

  return (
    <section className="min-h-screen flex items-center justify-center">
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
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center glow-blue"
          >
            <span className="text-3xl">⚡</span>
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">AI Neural Scan</h2>
          <p className="text-muted-foreground">Analyzing your electricity bill</p>

          {/* Real progress bar */}
          <div className="mt-6 h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${apiProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{apiProgress}% complete</p>
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
                {step.label}
              </span>
              {i < currentStep && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-accent text-xs ml-auto">✓</motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessingScreen;
