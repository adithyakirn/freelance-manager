"use client";

import { useState } from "react";
import {
  CheckCircle,
  Clock,
  Wrench,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Phase {
  id: string;
  name: string;
  amount: number;
  status: string;
  description?: string;
  is_completed?: boolean;
  completed_features?: string[];
  created_at: string;
}

interface SharedPhaseListProps {
  phases: Phase[];
  currentPhaseId: string | null;
}

export function SharedPhaseList({
  phases,
  currentPhaseId,
}: SharedPhaseListProps) {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>(
    {},
  );

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const getFeatures = (description?: string): string[] => {
    if (!description) return [];
    return description
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  };

  const isStrictlyCompleted = (phase: Phase) => {
    const features = getFeatures(phase.description);
    if (features.length === 0) return phase.is_completed;
    const completedFeatures = phase.completed_features || [];
    return completedFeatures.length === features.length;
  };

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => {
        const isCurrent = phase.id === currentPhaseId;
        const features = getFeatures(phase.description);
        const completedFeatures = phase.completed_features || [];
        const isCompleted = isStrictlyCompleted(phase);
        const isExpanded = expandedPhases[phase.id] || isCurrent;

        // Simplify status logic
        // "Done" if strictly completed
        // "In Progress" if strictly incomplete AND current
        // "Upcoming" if strictly incomplete AND NOT current

        return (
          <div
            key={phase.id}
            className={`rounded-xl overflow-hidden transition-all border ${
              isCurrent
                ? "bg-blue-500/10 border-blue-500/20"
                : "bg-white/5 border-white/5"
            }`}
          >
            <div
              className="p-4 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => togglePhase(phase.id)}
            >
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              ) : isCurrent ? (
                <Wrench className="w-5 h-5 text-blue-400 shrink-0 animate-pulse" />
              ) : (
                <Clock className="w-5 h-5 text-gray-500 shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-medium ${
                      isCompleted ? "text-gray-400 line-through" : "text-white"
                    }`}
                  >
                    {phase.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                        isCompleted
                          ? "bg-green-500/20 text-green-400"
                          : isCurrent
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {isCompleted
                        ? "Done"
                        : isCurrent
                          ? "In Progress"
                          : "Upcoming"}
                    </span>
                    {features.length > 0 && (
                      <span className="text-gray-500">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox List / Features */}
            <AnimatePresence>
              {isExpanded && features.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 ml-4 sm:ml-12 md:ml-16 lg:ml-17 border-t border-white/5 mt-0 pt-3 space-y-2">
                    {features
                      .sort((a, b) => {
                        const isACompleted = completedFeatures.includes(a);
                        const isBCompleted = completedFeatures.includes(b);
                        // Sort completed first: if A is done and B is not, A (-1) comes first.
                        if (isACompleted && !isBCompleted) return -1;
                        if (!isACompleted && isBCompleted) return 1;
                        return 0;
                      })
                      .map((feature, i) => {
                        const isFeatureCompleted =
                          completedFeatures.includes(feature);
                        return (
                          <div key={i} className="flex items-start gap-3">
                            <div
                              className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center shrink-0 ${
                                isFeatureCompleted
                                  ? "bg-green-500 border-green-500"
                                  : "border-gray-600"
                              }`}
                            >
                              {isFeatureCompleted && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm leading-tight ${
                                isFeatureCompleted
                                  ? "text-gray-500 line-through"
                                  : "text-gray-300"
                              }`}
                            >
                              {feature}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
