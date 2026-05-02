import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface HeroSectionProps {
  onStartClick: () => void;
}

const HeroSection = ({ onStartClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Light streak */}
      <motion.div
        className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[1.1] text-balance mb-6">
            <span className="text-gradient">Find how much money you're wasting on electricity.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Upload your bill and get instant AI savings insights. Works globally with 150+ utility providers.
          </p>

          <motion.button
            onClick={onStartClick}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg bg-primary text-primary-foreground overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.2)] hover:shadow-[0_0_40px_rgba(59,130,246,0.35)] transition-shadow duration-500"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Zap className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Check My Savings</span>
          </motion.button>

          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Results in 30 seconds
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
