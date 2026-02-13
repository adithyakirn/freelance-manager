"use client";

import { deleteProject } from "@/app/actions/delete";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "./ui/ConfirmModal";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error("Error deleting project:", error);
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
        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Delete Project"
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Trash2 className="h-5 w-5" />
        )}
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this ENTIRE project? This action cannot be undone and all associated data will be permanently removed."
        confirmText="Delete Project"
        variant="danger"
        loading={loading}
      />
    </>
  );
}
