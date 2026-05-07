import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/voltsave/Navbar";
import HeroSection from "@/components/voltsave/HeroSection";
import ProblemSection from "@/components/voltsave/ProblemSection";
import HowItWorks from "@/components/voltsave/HowItWorks";
import ResultsPreview from "@/components/voltsave/ResultsPreview";
import FinalCTA from "@/components/voltsave/FinalCTA";
import AuthModal from "@/components/voltsave/AuthModal";
import UploadSection from "@/components/voltsave/UploadSection";
import SetupDetails from "@/components/voltsave/SetupDetails";
import ProcessingScreen from "@/components/voltsave/ProcessingScreen";
import ResultsDashboard from "@/components/voltsave/ResultsDashboard";
import ProgressStepper from "@/components/voltsave/ProgressStepper";
import PricingModal from "@/components/voltsave/PricingModal";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type AppStep = "landing" | "upload" | "setup" | "processing" | "results";

const Index = () => {
  const [step, setStep] = useState<AppStep>("landing");
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [billId, setBillId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { isAuthenticated } = useAuth();

  const getStepperStep = (): number => {
    switch (step) {
      case "upload": return 1;
      case "setup": return 2;
      case "processing": return 3;
      case "results": return 3;
      default: return 0;
    }
  };

  const handleCTAClick = useCallback(() => {
    if (isAuthenticated) {
      setStep("upload");
    } else {
      setShowAuth(true);
    }
  }, [isAuthenticated]);

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setStep("upload");
  };

  const handleUploadContinue = (id: string | null, demo: boolean) => {
    setBillId(id);
    setIsDemo(demo);
    setStep("setup");
  };

  const handleSetupContinue = () => {
    setStep("processing");
  };

  const handleProcessingComplete = (result: any) => {
    setAnalysisResult(result);
    setStep("results");
  };

  const handleProcessingError = () => {
    setStep("upload");
    toast.error("Analysis failed. Please try again.");
  };

  const handleUnlock = () => {
    setShowPricing(true);
  };

  const handleUnlockSuccess = () => {
    // Update the analysis result to mark as paid
    if (analysisResult) {
      setAnalysisResult({ ...analysisResult, paid: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onPricingClick={() => setShowPricing(true)} 
        onAuthClick={() => setShowAuth(true)} 
        onLogoClick={() => setStep("landing")}
      />
      
      {/* Progress Stepper - only show after auth */}
      {step !== "landing" && (
        <div className="pt-20 pb-4">
          <ProgressStepper currentStep={getStepperStep()} />
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {step === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <HeroSection onStartClick={handleCTAClick} />
            <ProblemSection />
            <HowItWorks />
            <ResultsPreview />
            <FinalCTA onStartClick={handleCTAClick} />
          </motion.div>
        )}
        
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Upload Your Bill</h2>
              <p className="text-foreground/60">Upload your electricity bill for AI analysis</p>
            </div>
            <UploadSection onContinue={handleUploadContinue} />
          </motion.div>
        )}

        {step === "setup" && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Setup Details</h2>
              <p className="text-foreground/60">Tell us about your appliances for accurate analysis</p>
            </div>
            <SetupDetails onContinue={handleSetupContinue} />
          </motion.div>
        )}

        {step === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-8"
          >
            <ProcessingScreen 
              billId={billId} 
              onComplete={handleProcessingComplete}
              onError={handleProcessingError}
            />
          </motion.div>
        )}

        {step === "results" && analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <ResultsDashboard 
              result={analysisResult} 
              billId={billId}
              onUnlock={handleUnlock}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky mobile CTA for results page */}
      {step === "results" && analysisResult && !analysisResult.paid && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border md:hidden z-40">
          <button 
            onClick={handleUnlock}
            className="w-full gradient-cta text-white py-3 rounded-lg font-medium"
          >
            Unlock Full Report — ₹199
          </button>
        </div>
      )}

      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        onSuccess={handleAuthSuccess} 
      />
      
      <PricingModal 
        isOpen={showPricing} 
        onClose={() => setShowPricing(false)} 
        onUnlockSuccess={handleUnlockSuccess}
      />
    </div>
  );
};

export default Index;
