"use client";

import { GlassCard } from "./ui/GlassCard";
import { Receipt, ArrowDownLeft, Banknote } from "lucide-react";
import { motion } from "framer-motion";

interface Payment {
  id: string;
  amount: number;
  type: string;
  date: string;
  created_at?: string;
  notes?: string | null;
  receipt_url?: string | null;
}

interface SharedPaymentsSectionProps {
  payments: Payment[];
  totalAdvances: number;
}

export function SharedPaymentsSection({
  payments,
  totalAdvances,
}: SharedPaymentsSectionProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Banknote className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white font-display">
              Payment History
            </h3>
            <p className="text-xs text-gray-500">
              Total Advances: ₹{totalAdvances.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
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
              </div>
            </motion.div>
          ))
        )}
      </div>
    </GlassCard>
  );
}
