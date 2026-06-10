import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, X, Shield, Trash2, EyeOff, Zap } from "lucide-react";
import { useState, useCallback } from "react";
import { apiUpload } from "@/hooks/useApi";
import { useCountry } from "@/hooks/useCountry";
import { toast } from "sonner";

interface UploadSectionProps {
  onStartAnalysis: (info: { billId: string; isDemo: boolean }) => void;
  providerId?: string | null;
  profileType?: string;
}

const UploadSection = ({ onStartAnalysis, providerId, profileType = "home" }: UploadSectionProps) => {
  const { country } = useCountry();
  const [billFile, setBillFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [isDemoFile, setIsDemoFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const simulateUpload = useCallback((file: File) => {
    setBillFile(file);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploaded(true);
          return 100;
        }
        return prev + Math.random() * 18 + 5;
      });
    }, 120);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) simulateUpload(file);
    },
    [simulateUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) simulateUpload(file);
    },
    [simulateUpload]
  );

  const handleTryDemo = useCallback(() => {
    const demoFile = new File(["demo"], "demo-electricity-bill.pdf", { type: "application/pdf" });
    setIsDemoFile(true);
    simulateUpload(demoFile);
  }, [simulateUpload]);

  const clearFile = useCallback(() => {
    setBillFile(null);
    setUploaded(false);
    setUploadProgress(0);
    setIsDemoFile(false);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!uploaded || !billFile) return;
    if (isDemoFile) {
      try { localStorage.setItem("lastBillId", "demo"); } catch {}
      onStartAnalysis({ billId: "demo", isDemo: true });
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("file", billFile);
      fd.append("profileType", profileType);
      fd.append("countryCode", country.code);
      if (providerId) fd.append("providerId", providerId);
      const res = await apiUpload<{ billId: string; status: string }>("/api/bills/upload", fd);
      try { localStorage.setItem("lastBillId", res.billId); } catch {}
      onStartAnalysis({ billId: res.billId, isDemo: false });
    } catch (err: any) {
      // Backend unreachable (likely offline or mixed-content) — fall back to demo so the user can proceed.
      toast.message("Backend unreachable — continuing in demo mode", {
        description: "We'll show a sample analysis so you can preview the full flow.",
      });
      try { localStorage.setItem("lastBillId", "demo"); } catch {}
      onStartAnalysis({ billId: "demo", isDemo: true });
    } finally {
      setSubmitting(false);
    }
  }, [uploaded, billFile, isDemoFile, providerId, profileType, country.code, onStartAnalysis]);

  return (
    <section className="wizard-section">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="wizard-title"
        >
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-1 text-foreground">
            Upload Your Electricity Bill
          </h2>
          <p className="text-muted-foreground text-xs">
            Drag & drop your bill to begin AI analysis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-4"
        >
          {/* Progress bar */}
          {billFile && !uploaded && (
            <div className="h-1 w-full bg-secondary rounded-full mb-5 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min(uploadProgress, 100)}%` }}
              />
            </div>
          )}

          <AnimatePresence mode="wait">
            {!billFile ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-primary/30 hover:border-primary/60"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload
                  className={`w-8 h-8 mx-auto mb-2 transition-colors ${
                    dragOver ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <p className="text-sm font-semibold text-foreground mb-1">
                  Drop your electricity bill here
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, JPG or PNG • Max 10MB
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
              >
                <motion.div
                  initial={{ scale: 1 }}
                  animate={uploaded ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {uploaded ? (
                    <CheckCircle className="w-9 h-9 text-accent" />
                  ) : (
                    <FileText className="w-9 h-9 text-primary" />
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate text-sm">
                    {billFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {uploaded
                      ? "Upload complete"
                      : `Uploading... ${Math.min(Math.round(uploadProgress), 100)}%`}
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Try demo */}
          {!billFile && (
            <button
              onClick={handleTryDemo}
              className="w-full mt-3 py-2.5 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              Try with a demo bill
            </button>
          )}

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
            {[
              { icon: Shield, label: "Encrypted upload" },
              { icon: Trash2, label: "Auto-deleted after analysis" },
              { icon: EyeOff, label: "Never shared" },
            ].map((t) => (
              <div key={t.label} className="flex flex-col items-center gap-1.5 text-center">
                <t.icon className="w-4 h-4 text-accent" />
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {t.label}
                </span>
              </div>
            ))}
          </div>

          {/* Continue */}
          <motion.button
            onClick={handleContinue}
            disabled={!uploaded || submitting}
            className={`w-full mt-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
              uploaded
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsla(217,91%,60%,0.15)] hover:brightness-110"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
            whileHover={uploaded ? { scale: 1.01 } : {}}
            whileTap={uploaded ? { scale: 0.99 } : {}}
          >
            {submitting ? "Uploading…" : uploaded ? "Continue to Setup" : "Upload a bill to continue"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadSection;
