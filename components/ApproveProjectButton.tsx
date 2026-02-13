"use client";

import { approveProject } from "@/app/actions/project-updates";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "./ui/ConfirmModal";

export function ApproveProjectButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveProject(projectId);
    } catch (error) {
      console.error("Error approving project:", error);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="btn-primary flex items-center gap-2 w-full lg:w-auto justify-center bg-green-600 hover:bg-green-700 ring-green-600"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Approve & Start Project
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleApprove}
        title="Approve Project"
        message="Are you sure you want to approve this project? It will be moved to 'Ongoing' status and work can begin."
        confirmText="Approve & Start"
        variant="success"
        loading={loading}
      />
    </>
  );
}
