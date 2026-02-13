"use client";

import { useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { ConfirmModal } from "./ui/ConfirmModal";
import {
  Plus,
  Receipt,
  ArrowDownLeft,
  Trash2,
  Loader2,
  Upload,
  ExternalLink,
  Banknote,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  addAdvancePayment,
  deletePayment,
  type Payment,
} from "@/app/actions/payments";
import { createClient } from "@/utils/supabase/client";

interface PaymentsSectionProps {
  projectId: string;
  payments: Payment[];
  totalAdvances: number;
}

export function PaymentsSection({
  projectId,
  payments: initialPayments,
  totalAdvances: initialTotal,
}: PaymentsSectionProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [totalAdvances, setTotalAdvances] = useState(initialTotal);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const uploadReceipt = async (file: File): Promise<string | null> => {
    const supabase = createClient();
    const fileName = `receipts/${projectId}/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(fileName);

    return publicUrl;
  };

  const handleAddPayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    setLoading(true);

    let uploadedUrl = receiptUrl;

    // Upload receipt if file selected
    if (receiptFile) {
      setUploading(true);
      const url = await uploadReceipt(receiptFile);
      if (url) uploadedUrl = url;
      setUploading(false);
    }

    const result = await addAdvancePayment(
      projectId,
      Number(amount),
      notes || undefined,
      uploadedUrl || undefined,
    );

    if (result.success) {
      // Add to local state
      const newPayment: Payment = {
        id: crypto.randomUUID(),
        project_id: projectId,
        amount: Number(amount),
        type: "advance",
        notes: notes || null,
        receipt_url: uploadedUrl || null,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      setPayments([newPayment, ...payments]);
      setTotalAdvances(totalAdvances + Number(amount));

      // Reset form
      setAmount("");
      setNotes("");
      setReceiptUrl("");
      setReceiptFile(null);
      setShowAddModal(false);
    }

    setLoading(false);
  };

  const handleDeletePayment = async () => {
    if (!selectedPayment) return;

    setLoading(true);
    const result = await deletePayment(selectedPayment.id, projectId);

    if (result.success) {
      setPayments(payments.filter((p) => p.id !== selectedPayment.id));
      if (selectedPayment.type === "advance") {
        setTotalAdvances(totalAdvances - Number(selectedPayment.amount));
      }
    }

    setLoading(false);
    setShowDeleteConfirm(false);
    setSelectedPayment(null);
  };

  return (
    <>
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Banknote className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-white font-display">
                Payments
              </h3>
              <p className="text-xs text-gray-500">
                Total Advances: ₹{totalAdvances.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Advance
          </button>
        </div>

        {/* Payment History */}
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {payments.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm">
              No payments recorded yet
            </p>
          ) : (
            payments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-400">
                      +₹{Number(payment.amount).toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-gray-500 capitalize px-2 py-0.5 rounded-full bg-white/5">
                      {payment.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {new Date(
                        payment.created_at || payment.date,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {payment.notes && (
                      <span className="text-xs text-gray-400 truncate">
                        • {payment.notes}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {payment.receipt_url && (
                    <a
                      href={payment.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                      title="View Receipt"
                    >
                      <Receipt className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowDeleteConfirm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="Delete Payment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            />
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
                    <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                      <Banknote className="w-5 h-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Add Advance Payment
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Amount *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="10000"
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Notes Input */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g., Initial deposit via UPI"
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Receipt Upload */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      UPI Receipt (optional)
                    </label>
                    {receiptFile ? (
                      <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <Receipt className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="text-sm text-green-400 truncate flex-1">
                          {receiptFile.name}
                        </span>
                        <button
                          onClick={() => setReceiptFile(null)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 p-4 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-green-500/50 transition-colors">
                        <Upload className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-400">
                          Upload payment screenshot
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Or paste URL */}
                  {!receiptFile && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Or paste receipt URL
                      </label>
                      <input
                        type="url"
                        value={receiptUrl}
                        onChange={(e) => setReceiptUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:outline-none transition-colors"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                    disabled={loading}
                    className="btn-outline flex-1 py-3 text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPayment}
                    disabled={loading || !amount}
                    className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-green-600 hover:bg-green-500 transition-colors disabled:opacity-50 shadow-[0_4px_12px_rgba(34,197,94,0.3)]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {uploading ? "Uploading..." : "Adding..."}
                      </span>
                    ) : (
                      "Add Payment"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedPayment(null);
        }}
        onConfirm={handleDeletePayment}
        title="Delete Payment"
        message={`Are you sure you want to delete this ₹${selectedPayment?.amount.toLocaleString("en-IN")} payment? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
    </>
  );
}
