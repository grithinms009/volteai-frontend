import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinalCTAProps {
  onStartClick: () => void;
}

export default function FinalCTA({ onStartClick }: FinalCTAProps) {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Upload your bill. Find your savings.
          </h2>
          <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto">
            Get your AI-powered electricity savings report in 30 seconds.
          </p>
          <Button
            onClick={onStartClick}
            size="lg"
            className="gradient-cta text-white hover:opacity-90 text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/20"
          >
            <Zap className="w-5 h-5 mr-2" />
            Check My Savings
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
