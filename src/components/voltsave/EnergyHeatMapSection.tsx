import { motion } from "framer-motion";
import EnergyHeatMap from "./EnergyHeatMap";

const EnergyHeatMapSection = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Key Feature</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Energy Heat Map
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Visualize exactly which appliances consume the most power across a typical day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6 md:p-10"
        >
          <EnergyHeatMap />
        </motion.div>
      </div>
    </section>
  );
};

export default EnergyHeatMapSection;
