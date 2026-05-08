import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, X, Shield, Trash2, EyeOff, Zap } from "lucide-react";
import { useState, useCallback } from "react";
import { apiUpload } from "@/hooks/useApi";
import { toast } from "sonner";

interface UploadSectionProps {
  onContinue: (billId: string, isDemo: boolean) => void;
  providerId?: string;
  countryCode?: string;
}

const UploadSection = ({ onContinue, providerId, countryCode = 'IN' }: UploadSectionProps) => {
  const [billFile, setBillFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [billId, setBillId] = useState<string | null>(null);

  const simulateProgress = useCallback(() => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);
    return interval;
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setBillFile(file);
    setIsUploading(true);
    const progressInterval = simulateProgress();

    try {
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId || '');
      formData.append('profileType', 'home');
      formData.append('countryCode', countryCode);
      if (providerId) formData.append('providerId', providerId);

      const response = await apiUpload('/api/bills/upload', formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploaded(true);
      setBillId(response.billId);
      toast.success('Bill uploaded successfully!');
    } catch (err: any) {
      clearInterval(progressInterval);
      toast.error(err.message || 'Upload failed');
      setBillFile(null);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  }, [simulateProgress]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        // Validate file
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          toast.error('Please upload a PDF, JPG, or PNG file');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File size must be under 10MB');
          return;
        }
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          toast.error('Please upload a PDF, JPG, or PNG file');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File size must be under 10MB');
          return;
        }
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleTryDemo = useCallback(() => {
    setBillFile(new File(["demo"], "demo-electricity-bill.pdf", { type: "application/pdf" }));
    setUploadProgress(100);
    setUploaded(true);
    setBillId('demo');
    toast.success('Demo bill loaded!');
  }, []);

  const clearFile = useCallback(() => {
    setBillFile(null);
    setUploaded(false);
    setUploadProgress(0);
    setBillId(null);
  }, []);

  const handleContinue = () => {
    if (billId) {
      onContinue(billId, billId === 'demo');
    }
  };

  return (
    <section className="relative py-8 sm:py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-foreground">
            Upload Your Electricity Bill
          </h2>
          <p className="text-muted-foreground text-sm">
            Drag & drop your bill to begin AI analysis
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 md:p-8"
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
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
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
                  className={`w-10 h-10 mx-auto mb-3 transition-colors ${
                    dragOver ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <p className="text-base font-semibold text-foreground mb-1">
                  Drop your electricity bill here
                </p>
                <p className="text-sm text-muted-foreground">
                  PDF, JPG or PNG • Max 10MB
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border"
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
                  disabled={isUploading}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground disabled:opacity-50"
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
              className="w-full mt-4 py-2.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5" />
              Try with a demo bill
            </button>
          )}

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-border">
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
            disabled={!uploaded}
            className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              uploaded
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsla(217,91%,60%,0.15)] hover:brightness-110"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
            whileHover={uploaded ? { scale: 1.01 } : {}}
            whileTap={uploaded ? { scale: 0.99 } : {}}
          >
            {uploaded ? "Continue to Setup" : "Upload a bill to continue"}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UploadSection;
