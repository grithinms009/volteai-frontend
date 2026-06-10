import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FileText, Zap, TrendingDown } from "lucide-react";

const LiveDemoPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timers = [
      setTimeout(() => setDemoStep(1), 600),
      setTimeout(() => setDemoStep(2), 2000),
      setTimeout(() => setDemoStep(3), 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">See it in action</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Watch the AI work</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card p-8 md:p-12 relative overflow-hidden"
        >
          {/* Glow effect */}
          {demoStep === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: "0 0 60px rgba(34,197,94,0.15), inset 0 0 60px rgba(34,197,94,0.05)" }}
            />
          )}

          <div className="relative z-10 flex flex-col items-center gap-8">
            {/* Step 1: Bill upload */}
            <motion.div
              className="flex items-center gap-4 w-full max-w-md"
              animate={{ opacity: demoStep >= 1 ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${demoStep >= 1 ? 'bg-primary/20' : 'bg-secondary'}`}>
                <FileText className={`w-6 h-6 transition-colors duration-500 ${demoStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">electricity_bill_march.pdf</p>
                <div className="h-1.5 rounded-full bg-secondary mt-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: demoStep >= 1 ? "100%" : "0%" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Step 2: Scanning */}
            <motion.div
              className="w-full max-w-md h-16 rounded-xl bg-secondary/50 border border-border relative overflow-hidden"
              animate={{ opacity: demoStep >= 2 ? 1 : 0.3 }}
              transition={{ duration: 0.5 }}
            >
              {demoStep >= 2 && demoStep < 3 && (
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                  animate={{ x: ["-100%", "400%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              )}
              <div className="flex items-center justify-center h-full gap-2">
                <Zap className={`w-5 h-5 transition-colors duration-500 ${demoStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium text-muted-foreground">
                  {demoStep < 2 ? "Waiting..." : demoStep < 3 ? "AI analyzing usage patterns..." : "Analysis complete"}
                </span>
              </div>
            </motion.div>

            {/* Step 3: Result */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={demoStep >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-accent" />
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Potential Savings Found</span>
              </div>
              <motion.p
                className="text-5xl md:text-6xl font-extrabold glow-text"
                initial={{ scale: 0.8 }}
                animate={demoStep >= 3 ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                ₹1,820<span className="text-2xl text-muted-foreground font-medium">/month</span>
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveDemoPreview;
