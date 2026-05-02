import { motion } from "framer-motion";

const HEAT_MAP_DATA = [
  { day: 'Mon', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,3,4,5,5,4,3,2,1,1] },
  { day: 'Tue', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,3,4,5,5,4,3,2,1,1] },
  { day: 'Wed', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,3,4,4,5,4,3,2,1,1] },
  { day: 'Thu', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,3,4,5,5,4,3,2,1,1] },
  { day: 'Fri', hours: [1,1,1,1,1,1,2,3,3,2,2,2,2,2,3,4,4,5,5,4,3,2,1,1] },
  { day: 'Sat', hours: [1,1,1,1,1,1,1,2,2,3,3,3,3,3,3,3,4,4,4,3,2,2,1,1] },
  { day: 'Sun', hours: [1,1,1,1,1,1,1,2,2,3,3,3,3,3,3,3,3,4,4,3,2,2,1,1] },
];

const HEAT_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

const EnergyHeatMap = () => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[400px]">
        {/* Time labels */}
        <div className="flex mb-2 pl-8">
          {['0:00', '6:00', '12:00', '18:00', ''].map((time, i) => (
            <span key={i} className="flex-1 text-[10px] text-muted-foreground">{time}</span>
          ))}
        </div>
        
        {/* Heat map grid */}
        {HEAT_MAP_DATA.map((row, rowIndex) => (
          <div key={row.day} className="flex items-center gap-1 mb-1">
            <span className="w-7 text-[10px] text-muted-foreground shrink-0">{row.day}</span>
            <div className="flex gap-[2px] flex-1">
              {row.hours.map((value, colIndex) => (
                <motion.div
                  key={colIndex}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + (rowIndex * 24 + colIndex) * 0.003 }}
                  className="flex-1 h-4 rounded-sm"
                  style={{ backgroundColor: HEAT_COLORS[value - 1] }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <span className="text-[10px] text-muted-foreground">Low</span>
          <div className="flex gap-1">
            {HEAT_COLORS.map((color, i) => (
              <div key={i} className="w-4 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
};

export default EnergyHeatMap;
