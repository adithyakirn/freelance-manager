"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Trash2 } from "lucide-react";

type ConfirmVariant = "danger" | "success" | "warning";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  loading?: boolean;
}

const variantStyles: Record<
  ConfirmVariant,
  { icon: React.ReactNode; buttonClass: string; iconBg: string }
> = {
  danger: {
    icon: <Trash2 className="w-5 h-5 text-red-500" />,
    buttonClass:
      "bg-red-600 hover:bg-red-500 shadow-[0_4px_12px_rgba(239,68,68,0.3)]",
    iconBg: "bg-red-500/10 border border-red-500/20",
  },
  success: {
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    buttonClass:
      "bg-green-600 hover:bg-green-500 shadow-[0_4px_12px_rgba(34,197,94,0.3)]",
    iconBg: "bg-green-500/10 border border-green-500/20",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    buttonClass:
      "bg-yellow-600 hover:bg-yellow-500 shadow-[0_4px_12px_rgba(234,179,8,0.3)]",
    iconBg: "bg-yellow-500/10 border border-yellow-500/20",
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmModalProps) {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
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
            <div className="glass-card p-0 overflow-hidden">
              {/* Content */}
              <div className="p-6">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-2xl ${styles.iconBg}`}>
                    {styles.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white font-display">
                      {title}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Message */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6 pl-[60px]">
                  {message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 pl-[60px]">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="btn-outline flex-1 text-sm py-3 disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-50 ${styles.buttonClass}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
