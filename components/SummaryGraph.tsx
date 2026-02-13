"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";

interface DataPoint {
  label: string;
  value: number;
}

interface SummaryGraphProps {
  data: DataPoint[];
  title?: string;
}

export function SummaryGraph({
  data,
  title = "Revenue Trend",
}: SummaryGraphProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 100);

  return (
    <GlassCard className="w-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <select className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary">
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="relative h-64 w-full flex items-end justify-between gap-2">
        {/* Y-Axis Lines (Background) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full border-t border-white/5 h-0" />
          ))}
        </div>

        {data.map((point, index) => (
          <div
            key={index}
            className="relative flex-1 flex flex-col items-center group h-full justify-end"
          >
            <div className="w-full flex justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8">
              <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                ${point.value.toLocaleString()}
              </span>
            </div>

            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(point.value / maxValue) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1, type: "spring" }}
              className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-primary/20 to-primary relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>

            <div className="mt-4 text-xs text-gray-400 font-medium">
              {point.label}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
