"use client";

import { useState, useEffect } from "react";
import { Share2, Copy, Check, Link2, X, Loader2, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  enableSharing,
  disableSharing,
  updateProgressStatus,
  getShareStatus,
} from "@/app/actions/share";

interface ShareButtonProps {
  projectId: string;
  initialShareEnabled?: boolean;
  initialShareToken?: string;
  initialProgressStatus?: string;
}

export function ShareButton({
  projectId,
  initialShareEnabled = false,
  initialShareToken,
  initialProgressStatus = "",
}: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [shareEnabled, setShareEnabled] = useState(initialShareEnabled);
  const [shareToken, setShareToken] = useState(initialShareToken || "");
  const [progressStatus, setProgressStatus] = useState(initialProgressStatus);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/share/${shareToken}`
      : "";

  const handleToggleShare = async () => {
    setLoading(true);

    if (shareEnabled) {
      const result = await disableSharing(projectId);
      if (result.success) {
        setShareEnabled(false);
      }
    } else {
      const result = await enableSharing(projectId);
      if (result.success && result.token) {
        setShareEnabled(true);
        setShareToken(result.token);
      }
    }

    setLoading(false);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProgress = async () => {
    setSavingStatus(true);
    await updateProgressStatus(projectId, progressStatus);
    setSavingStatus(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-outline flex items-center gap-2 text-sm"
        title="Share with Client"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden lg:inline">Share</span>
      </button>

      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
              <div className="glass-card p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <Share2 className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Share with Client
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Enable Sharing Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 mb-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Enable Sharing
                    </p>
                    <p className="text-xs text-gray-500">
                      Allow clients to view project status
                    </p>
                  </div>
                  <button
                    onClick={handleToggleShare}
                    disabled={loading}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      shareEnabled ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                    ) : (
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          shareEnabled ? "left-7" : "left-1"
                        }`}
                      />
                    )}
                  </button>
                </div>

                {/* Share Link */}
                {shareEnabled && shareToken && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">
                      Share Link
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl">
                        <Link2 className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-300 truncate">
                          {shareUrl}
                        </span>
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className={`px-4 py-3 rounded-xl transition-colors ${
                          copied
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/5 hover:bg-white/10 text-white"
                        }`}
                      >
                        {copied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress Status */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Progress Status
                    <span className="text-gray-600 ml-1">
                      (visible to client)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={progressStatus}
                      onChange={(e) => setProgressStatus(e.target.value)}
                      placeholder="e.g., Working on frontend design..."
                      className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={handleSaveProgress}
                      disabled={savingStatus}
                      className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
                    >
                      {savingStatus ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Clients can only view status — no editing capabilities
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
