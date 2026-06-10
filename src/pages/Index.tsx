import { useState, useCallback } from "react";
import { apiCall } from "@/hooks/useApi";
import type { ApiResult } from "@/types/analysis";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/voltsave/Navbar";
import HeroSection from "@/components/voltsave/HeroSection";
import ProblemSection from "@/components/voltsave/ProblemSection";
import HowItWorks from "@/components/voltsave/HowItWorks";
import ResultsPreview from "@/components/voltsave/ResultsPreview";
import FinalCTA from "@/components/voltsave/FinalCTA";
import Footer from "@/components/voltsave/Footer";
import UploadSection from "@/components/voltsave/UploadSection";
import SetupDetails from "@/components/voltsave/SetupDetails";
import ProcessingScreen from "@/components/voltsave/ProcessingScreen";
import ResultsDashboard from "@/components/voltsave/ResultsDashboard";
import ProfessionalResultsDashboard from "@/components/voltsave/ProfessionalResultsDashboard";
import ProgressStepper from "@/components/voltsave/ProgressStepper";
import PricingModal from "@/components/voltsave/PricingModal";
import StateSelector from "@/components/voltsave/StateSelector";
import ProviderSelector, { Provider } from "@/components/voltsave/ProviderSelector";
import { useAuth } from "@/hooks/useAuth";

type AppStep = "landing" | "state" | "provider" | "upload" | "setup" | "processing" | "results";

const STEP_INDEX: Record<AppStep, number> = {
  landing: 0, state: 0, provider: 1, upload: 2, setup: 2, processing: 3, results: 3,
};

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<AppStep>("landing");
  const [showPricing, setShowPricing] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [billId, setBillId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ApiResult | null>(null);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleCTAClick = useCallback(() => {
    if (isAuthenticated) { setStep("state"); scrollTop(); }
    else { setStep("state"); scrollTop(); } // Navbar handles auth gating
  }, [isAuthenticated]);

  const handleStateSelect = useCallback((s: string) => {
    setSelectedState(s); setStep("provider"); scrollTop();
  }, []);

  const handleProviderSelect = useCallback((p: Provider) => {
    setSelectedProvider(p); setStep("upload"); scrollTop();
  }, []);

  const handleProviderSkip = useCallback(() => {
    setSelectedProvider(null); setStep("upload"); scrollTop();
  }, []);

  const handleUploadContinue = useCallback((info: { billId: string; isDemo: boolean }) => {
    setBillId(info.billId);
    setIsDemo(info.isDemo);
    try { localStorage.setItem('lastBillId', info.billId); } catch {}
    setStep("setup"); scrollTop();
  }, []);

  const handleSetupContinue = useCallback(() => {
    setStep("processing"); scrollTop();
  }, []);

  const handleProcessingComplete = useCallback((result: ApiResult) => {
    setAnalysisResult(result); setStep("results");
  }, []);

  const handleProcessingError = useCallback(() => {
    setStep("upload");
  }, []);

  const handleUnlockSuccess = useCallback(async () => {
    if (!billId || billId === "demo" || isDemo) {
      setAnalysisResult((r: ApiResult | null) => r ? { ...r, paid: true } : r);
      return;
    }
    try {
      const data = await apiCall<{ analysis: ApiResult; paid: boolean }>(`/api/bills/${billId}/analysis`);
      setAnalysisResult({ ...(data.analysis ?? data), paid: true });
    } catch {
      // Fallback: just flip the paid flag locally
      setAnalysisResult((r: ApiResult | null) => r ? { ...r, paid: true } : r);
    }
  }, [billId, isDemo]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-14">
        {step !== "landing" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-14 z-40"
          >
            <ProgressStepper currentStep={STEP_INDEX[step]} />
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div key="landing" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <HeroSection onAnalyze={handleCTAClick} />
              <ProblemSection />
              <HowItWorks />
              <ResultsPreview />
              <FinalCTA onUpload={handleCTAClick} />
              <Footer />
            </motion.div>
          )}

          {step === "state" && (
            <motion.div key="state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <StateSelector onSelect={handleStateSelect} />
            </motion.div>
          )}

          {step === "provider" && selectedState && (
            <motion.div key="provider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ProviderSelector
                state={selectedState}
                onSelect={handleProviderSelect}
                onSkip={handleProviderSkip}
              />
            </motion.div>
          )}

          {step === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <UploadSection
                onStartAnalysis={handleUploadContinue}
                providerId={selectedProvider?.id ?? null}
              />
            </motion.div>
          )}

          {step === "setup" && (
            <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <SetupDetails onContinue={handleSetupContinue} />
            </motion.div>
          )}

          {step === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <ProcessingScreen
                billId={billId}
                isDemo={isDemo}
                onComplete={handleProcessingComplete}
                onError={handleProcessingError}
              />
            </motion.div>
          )}

          {step === "results" && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <ProfessionalResultsDashboard
                result={analysisResult}
                billId={billId}
                onUnlock={() => setShowPricing(true)}
                onRefetch={handleUnlockSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
        billId={billId}
        isDemo={isDemo}
        onUnlockSuccess={handleUnlockSuccess}
      />

      {step === "results" && !analysisResult?.paid && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-border md:hidden z-50"
        >
          <button
            onClick={() => setShowPricing(true)}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          >
            ⚡ Unlock Full Report — ₹199
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Index;
