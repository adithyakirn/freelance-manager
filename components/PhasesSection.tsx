"use client";

import { useState, useOptimistic, useTransition } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  addPhase,
  markPhasePaid,
  togglePhaseCompleted,
  updatePhaseDescription,
  toggleFeatureCompleted,
} from "@/app/actions/phases";
import { deletePhase } from "@/app/actions/delete";
import {
  Plus,
  DollarSign,
  Trash2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Square,
  CheckSquare,
  Loader2,
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
}

interface PhasesSectionProps {
  projectId: string;
  phases: Phase[];
}

export function PhasesSection({ projectId, phases }: PhasesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [phaseName, setPhaseName] = useState("");
  const [phaseAmount, setPhaseAmount] = useState("");
  const [phaseDescription, setPhaseDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState<string | null>(
    null,
  );
  const [tempDescription, setTempDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  // Optimistic state for feature toggles
  const [optimisticFeatures, setOptimisticFeatures] = useState<
    Record<string, string[]>
  >({});

  const handleAddPhase = async () => {
    if (!phaseName || !phaseAmount) return;
    setLoading(true);
    await addPhase(
      projectId,
      phaseName,
      parseFloat(phaseAmount),
      phaseDescription || undefined,
    );
    setPhaseName("");
    setPhaseAmount("");
    setPhaseDescription("");
    setShowForm(false);
    setLoading(false);
  };

  const handleMarkPaid = async (phase: Phase) => {
    await markPhasePaid(phase.id, projectId, phase.amount);
  };

  const handleDelete = async (phaseId: string) => {
    if (confirm("Are you sure you want to delete this phase?")) {
      await deletePhase(phaseId, projectId);
    }
  };

  const handleToggleComplete = async (phase: Phase) => {
    await togglePhaseCompleted(phase.id, projectId, !phase.is_completed);
  };

  const handleSaveDescription = async (phaseId: string) => {
    await updatePhaseDescription(phaseId, projectId, tempDescription);
    setEditingDescription(null);
  };

  const handleToggleFeature = (
    phase: Phase,
    feature: string,
    isCompleted: boolean,
  ) => {
    // Optimistic update - update UI immediately
    const currentFeatures =
      optimisticFeatures[phase.id] ?? phase.completed_features ?? [];
    const newFeatures = isCompleted
      ? [...currentFeatures, feature.trim()]
      : currentFeatures.filter((f) => f !== feature.trim());

    setOptimisticFeatures((prev) => ({
      ...prev,
      [phase.id]: newFeatures,
    }));

    // Then run server action in background
    startTransition(async () => {
      await toggleFeatureCompleted(
        phase.id,
        projectId,
        feature.trim(),
        isCompleted,
      );
    });
  };

  // Get completed features with optimistic state
  const getCompletedFeatures = (phase: Phase): string[] => {
    return optimisticFeatures[phase.id] ?? phase.completed_features ?? [];
  };

  // Parse features from description (comma-separated)
  const getFeatures = (description?: string): string[] => {
    if (!description) return [];
    return description
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  };

  // Calculate phase completion percentage (using optimistic state)
  const getPhaseProgress = (phase: Phase): number => {
    const features = getFeatures(phase.description);
    if (features.length === 0) return phase.is_completed ? 100 : 0;
    const completedFeatures = getCompletedFeatures(phase);
    const completed = features.filter((f) =>
      completedFeatures.includes(f),
    ).length;
    return Math.round((completed / features.length) * 100);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {phases.map((phase, index) => {
          const features = getFeatures(phase.description);
          const progress = getPhaseProgress(phase);

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="overflow-hidden">
                {/* Main Row */}
                <div className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Completion Checkbox - primary indicator */}
                    <button
                      onClick={() => handleToggleComplete(phase)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        phase.is_completed
                          ? "bg-green-500/20"
                          : "bg-white/5 hover:bg-white/10"
                      }`}
                      title={
                        phase.is_completed
                          ? "Mark incomplete"
                          : "Mark as completed"
                      }
                    >
                      {phase.is_completed ? (
                        <CheckSquare className="w-5 h-5 text-green-500" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`font-medium ${phase.is_completed ? "text-gray-400 line-through" : "text-white"}`}
                      >
                        {phase.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          ₹{Number(phase.amount).toLocaleString("en-IN")}
                        </span>
                        {features.length > 0 && (
                          <span className="text-xs text-gray-600">
                            • {progress}% done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {phase.status !== "paid" && (
                      <button
                        onClick={() => handleMarkPaid(phase)}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        <DollarSign className="w-4 h-4 mr-1 inline" />
                        Collect
                      </button>
                    )}

                    {phase.status === "paid" && (
                      <span className="badge badge-green">Paid</span>
                    )}

                    {/* Expand/Collapse for details */}
                    <button
                      onClick={() =>
                        setExpandedPhase(
                          expandedPhase === phase.id ? null : phase.id,
                        )
                      }
                      className="p-2 text-gray-500 hover:text-white transition-colors"
                      title="View details"
                    >
                      {expandedPhase === phase.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(phase.id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Phase"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details with Feature Checkboxes */}
                <AnimatePresence>
                  {expandedPhase === phase.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-white/5">
                        <div className="flex items-start gap-2">
                          <Edit3 className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                              Features / Tasks
                            </p>

                            {editingDescription === phase.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={tempDescription}
                                  onChange={(e) =>
                                    setTempDescription(e.target.value)
                                  }
                                  placeholder="Separate features with commas, e.g: Homepage, Login, Dashboard, Payment..."
                                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 resize-none"
                                  rows={2}
                                />
                                <p className="text-xs text-gray-600">
                                  Tip: Separate features with commas to create
                                  individual checkboxes
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleSaveDescription(phase.id)
                                    }
                                    className="btn-primary text-xs py-1.5 px-3"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingDescription(null)}
                                    className="btn-outline text-xs py-1.5 px-3"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : features.length > 0 ? (
                              <div className="space-y-2">
                                {features.map((feature, i) => {
                                  const completedFeatures =
                                    getCompletedFeatures(phase);
                                  const isCompleted =
                                    completedFeatures.includes(feature);
                                  return (
                                    <button
                                      key={i}
                                      onClick={() =>
                                        handleToggleFeature(
                                          phase,
                                          feature,
                                          !isCompleted,
                                        )
                                      }
                                      className="flex items-center gap-3 w-full p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                                    >
                                      {isCompleted ? (
                                        <CheckSquare className="w-4 h-4 text-green-500 shrink-0" />
                                      ) : (
                                        <Square className="w-4 h-4 text-gray-500 shrink-0" />
                                      )}
                                      <span
                                        className={`text-sm ${isCompleted ? "text-gray-500 line-through" : "text-gray-300"}`}
                                      >
                                        {feature}
                                      </span>
                                    </button>
                                  );
                                })}
                                <button
                                  onClick={() => {
                                    setEditingDescription(phase.id);
                                    setTempDescription(phase.description || "");
                                  }}
                                  className="text-xs text-gray-500 hover:text-white mt-2"
                                >
                                  + Edit features
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingDescription(phase.id);
                                  setTempDescription(phase.description || "");
                                }}
                                className="text-sm text-gray-500 hover:text-white p-2 -m-2 rounded-lg hover:bg-white/5 transition-colors italic"
                              >
                                Click to add features...
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Add Phase Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard className="space-y-4">
              <input
                type="text"
                placeholder="Phase Name (e.g., Phase 1 - Design)"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                value={phaseName}
                onChange={(e) => setPhaseName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                value={phaseAmount}
                onChange={(e) => setPhaseAmount(e.target.value)}
              />
              <div>
                <textarea
                  placeholder="Features (comma-separated) - e.g., Homepage, Login, Dashboard..."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-md px-3 py-2 text-sm text-white resize-none"
                  rows={2}
                  value={phaseDescription}
                  onChange={(e) => setPhaseDescription(e.target.value)}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Each comma-separated item becomes a checkbox
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddPhase}
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? "Adding..." : "Add Phase"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Phase
        </button>
      )}
    </div>
  );
}
