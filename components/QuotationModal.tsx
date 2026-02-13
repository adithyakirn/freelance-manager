"use client";

import { useState } from "react";
import { X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface QuotationModalProps {
  url: string;
}

export function QuotationModal({ url }: QuotationModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn-outline flex items-center gap-2 w-full lg:w-auto justify-center"
      >
        <FileText className="h-4 w-4" />
        View Quotation
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {typeof document !== "undefined" &&
              createPortal(
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-4 md:inset-10 z-[101] flex flex-col pointer-events-none"
                  >
                    <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl flex flex-col h-full pointer-events-auto overflow-hidden shadow-2xl">
                      {/* Header */}
                      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#1A1A1A]">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <h3 className="font-semibold text-white">
                            Quotation
                          </h3>
                        </div>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 bg-neutral-900 relative">
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(
                            url,
                          )}&embedded=true`}
                          className="w-full h-full border-none"
                          title="Project Quotation"
                        />
                      </div>
                    </div>
                  </motion.div>
                </>,
                document.body,
              )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}
