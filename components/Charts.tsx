"use client";

import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";

interface DataPoint {
  label: string;
  value: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
}

export function PerformanceChart({
  data,
  title = "Performance Insights",
  subtitle = "Crypto Analytics",
}: PerformanceChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 100);
  const minValue = Math.min(...data.map((d) => d.value));
  const range = maxValue - minValue || 1;

  // Create SVG path for line chart
  const width = 100;
  const height = 60;
  const padding = 5;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y =
      height -
      padding -
      ((point.value - minValue) / range) * (height - 2 * padding);
    return { x, y, value: point.value, label: point.label };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area path (for gradient fill under line)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <GlassCard className="col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground font-light uppercase tracking-wider mb-1">
            {subtitle}
          </p>
          <h3 className="text-lg font-bold text-white font-display">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-light text-gray-400 focus:outline-none focus:border-[#D53231]">
            <option>12 months</option>
            <option>6 months</option>
            <option>30 days</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D53231" />
              <stop offset="100%" stopColor="#ff453a" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(213, 50, 49, 0.3)" />
              <stop offset="100%" stopColor="rgba(213, 50, 49, 0)" />
            </linearGradient>
          </defs>

          {/* Grid lines - optional, keeping subtle */}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + (i / 3) * (height - 2 * padding)}
              x2={width - padding}
              y2={padding + (i / 3) * (height - 2 * padding)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.3"
            />
          ))}

          {/* Area fill */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            d={areaPath}
            fill="url(#areaGradient)"
          />

          {/* Line */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              cx={point.x}
              cy={point.y}
              r="1.2"
              fill="#D53231"
              stroke="#000000"
              strokeWidth="0.3"
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs font-light text-muted-foreground">
          {data.map((point, index) => (
            <span key={index}>{point.label}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#D53231]" />
          <span className="text-xs font-light text-muted-foreground">
            Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-light text-muted-foreground">
            Low Risk
          </span>
          <div className="h-1 w-20 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-[#D53231] w-[34%]" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// Bar Chart Component
interface BarChartProps {
  data: DataPoint[];
  title?: string;
  subtitle?: string;
}

export function BarChart({
  data,
  title = "Market Dynamics",
  subtitle = "Wallet Breakdown",
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-muted-foreground font-light uppercase tracking-wider mb-1">
            {subtitle}
          </p>
          <h3 className="text-lg font-bold text-white font-display">{title}</h3>
        </div>
        <button className="text-xs font-light text-muted-foreground hover:text-white transition-colors">
          Download Report
        </button>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((point, index) => {
          const height = (point.value / maxValue) * 100;
          const isHighlighted = index === data.length - 2; // Second to last

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full rounded-t-md ${
                  isHighlighted
                    ? "bg-gradient-to-t from-[#D53231] to-[#ff453a]"
                    : "bg-[#1C1C1E] border-t border-x border-white/5"
                }`}
              />
              <span className="text-xs font-light text-muted-foreground">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
