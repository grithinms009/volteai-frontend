import { motion } from 'framer-motion';
import { Upload, ScanLine, FileText } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Bill',
    description: 'Drag & drop your electricity bill — PDF, JPG, or PNG.',
  },
  {
    number: '02',
    icon: ScanLine,
    title: 'AI Analyzes Usage',
    description: 'Our AI scans line items, usage patterns, and tariff structures.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Get Savings Plan',
    description: 'Receive personalized recommendations and your efficiency score.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            How it works
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="glass-card p-8 relative z-10">
                {/* Step Number */}
                <span className="text-5xl font-bold text-primary/20 absolute top-4 right-4">
                  {step.number}
                </span>

                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
