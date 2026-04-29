import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileText, Shield, Trash2, Lock, Loader2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { apiUpload } from '@/hooks/useApi';
import { toast } from 'sonner';

interface UploadSectionProps {
  onContinue: (billId: string | null, isDemo: boolean) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export default function UploadSection({ onContinue }: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a PDF, JPG, or PNG file';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 200);
    return interval;
  };

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }
    setSelectedFile(file);
    setUploadProgress(0);
    
    // Simulate visual progress
    const interval = simulateProgress();
    setTimeout(() => clearInterval(interval), 1500);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const clearSelection = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const handleContinue = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', userId || '');
      formData.append('profileType', 'home');

      const response = await apiUpload('/api/bills/upload', formData);
      toast.success('Bill uploaded successfully!');
      onContinue(response.billId, false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload bill');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDemo = () => {
    toast.info('Using demo bill for preview');
    onContinue('demo', true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Upload Area */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-colors
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {!selectedFile ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="text-white font-medium mb-2">
                  Drop your electricity bill here
                </p>
                <p className="text-foreground/50 text-sm mb-4">
                  or click to browse
                </p>
                <p className="text-foreground/40 text-xs">
                  PDF, JPG, or PNG (max 10MB)
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button variant="outline" className="mt-4" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </>
            ) : (
              <div className="text-left">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-foreground/50">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="mt-3">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-foreground/50 mt-1">
                        {uploadProgress === 100 ? 'Ready to upload' : 'Processing...'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground/50" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Demo link */}
          <button
            onClick={handleDemo}
            className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Try with a demo bill
          </button>
        </div>

        {/* Right - Trust Indicators */}
        <div className="space-y-4">
          <div className="glass-card p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-white">Encrypted upload</h3>
              <p className="text-sm text-foreground/50">
                Your bill is encrypted in transit and at rest
              </p>
            </div>
          </div>

          <div className="glass-card p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-white">Auto-deleted after analysis</h3>
              <p className="text-sm text-foreground/50">
                We delete your bill data after generating the report
              </p>
            </div>
          </div>

          <div className="glass-card p-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-white">Never shared</h3>
              <p className="text-sm text-foreground/50">
                Your data is never sold or shared with third parties
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex justify-center">
        <Button
          onClick={handleContinue}
          disabled={!selectedFile || isUploading}
          size="lg"
          className="gradient-cta text-white px-12"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  );
}
