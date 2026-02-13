"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { addPhase, markPhasePaid } from "@/app/actions/phases";
import { deletePhase } from "@/app/actions/delete";
import { Check, Plus, DollarSign, Clock, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Phase {
  id: string;
  name: string;
  amount: number;
  status: string;
}

interface PhasesSectionProps {
  projectId: string;
  phases: Phase[];
}

export function PhasesSection({ projectId, phases }: PhasesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [phaseName, setPhaseName] = useState("");
  const [phaseAmount, setPhaseAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPhase = async () => {
    if (!phaseName || !phaseAmount) return;
    setLoading(true);
    await addPhase(projectId, phaseName, parseFloat(phaseAmount));
    setPhaseName("");
    setPhaseAmount("");
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

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {phases.map((phase, index) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    phase.status === "paid"
                      ? "bg-green-500/10"
                      : "bg-[#FF7A00]/10"
                  }`}
                >
                  {phase.status === "paid" ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-[#FF7A00]" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-white">{phase.name}</h4>
                  <p className="text-sm text-gray-500">
                    ₹{Number(phase.amount).toLocaleString("en-IN")}
                  </p>
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

                <button
                  onClick={() => handleDelete(phase.id)}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Phase"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
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
                placeholder="Phase Name (e.g., Advance Payment)"
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
