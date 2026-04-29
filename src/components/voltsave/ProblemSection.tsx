import { motion } from 'framer-motion';
import { Search, Clock, Plug } from 'lucide-react';

const problems = [
  {
    icon: Search,
    title: 'Hidden Charges',
    description: 'Utility bills are filled with surcharges, taxes, and fees that most people never notice or question.',
  },
  {
    icon: Clock,
    title: 'Peak Hour Misuse',
    description: 'Running heavy appliances during peak hours costs 2-3x more. Most users have no idea when peak hours are.',
  },
  {
    icon: Plug,
    title: 'Inefficient Devices',
    description: 'Old appliances and always-on devices silently drain power, adding hundreds to your annual bill.',
  },
];

export default function ProblemSection() {
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
            The Problem
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Most people overpay 20–40% on electricity
          </h2>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-8 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <problem.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {problem.title}
              </h3>
              <p className="text-foreground/60 leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
