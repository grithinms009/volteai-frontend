import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SavingsScoreProps {
  score: number;
}

const SavingsScore = ({ score }: SavingsScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = (s: number) => {
    if (s < 40) return { stroke: '#ef4444', text: 'text-red-500' };
    if (s < 70) return { stroke: '#f97316', text: 'text-orange-400' };
    return { stroke: '#22d3ee', text: 'text-cyan-400' };
  };

  const colors = getColor(score);
  const circumference = 2 * Math.PI * 42;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle 
          cx="50" cy="50" r="42" 
          fill="none" 
          stroke="hsl(var(--muted))" 
          strokeWidth="8" 
        />
        {/* Progress circle */}
        <motion.circle
          cx="50" cy="50" r="42"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ strokeDasharray: "0 264" }}
          animate={{ strokeDasharray }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${colors.stroke}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${colors.text}`}>
          {animatedScore}
        </span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
};

export default SavingsScore;
