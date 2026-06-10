import { motion } from "framer-motion";
import { Users, IndianRupee, Globe, Shield } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Bills analyzed" },
  { icon: IndianRupee, value: "₹25L+", label: "Saved by users" },
  { icon: Globe, value: "150+", label: "Utility providers" },
  { icon: Shield, value: "100%", label: "Data encrypted" },
];

const SocialProof = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-6 text-center"
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <p className="text-2xl md:text-3xl font-extrabold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
