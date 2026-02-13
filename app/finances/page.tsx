import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/server";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default async function FinancesPage() {
  const supabase = await createClient();

  // REAL DATA FETCHING

  // 1. Fetch completed payments (Revenue)
  const { data: payments } = await supabase
    .from("payments")
    .select("*, projects(name)")
    .order("created_at", { ascending: false });

  // 2. Fetch expenses (if you have an expenses table)
  // For now, let's assume expenses are 0 as we haven't implemented that yet,
  // or use a placeholder if the table doesn't exist.
  // const { data: expensesData } = await supabase.from("expenses").select("*");
  const expenses = 0; // Replace with real data when expenses table exists

  // 3. Fetch pending payments from Phases (Exclude phases from Pending projects)
  const { data: pendingPhases } = await supabase
    .from("phases")
    .select("amount, projects!inner(status)")
    .neq("status", "paid")
    .neq("projects.status", "pending");

  const totalRevenue =
    payments?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;
  const pendingAmount =
    pendingPhases?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;
  const profit = totalRevenue - expenses;

  return (
    <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 text-foreground">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display">Finances</h1>
        <p className="text-muted-foreground mt-1">
          Track your income, expenses, and profits
        </p>
      </div>

      {/* Stats Cards - REAL DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Total Revenue
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold font-display">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Lifetime
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Total Expenses
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold font-display">
                ₹{expenses.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Lifetime
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Net Profit
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary font-display">
                ₹{profit.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Actual
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-primary" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Pending
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-yellow-400 font-display">
                ₹{pendingAmount.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                Unpaid Phases
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Transactions - REAL DATA */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Transactions
            </p>
            <h3 className="text-lg font-semibold font-display">
              Recent Activity
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {payments && payments.length > 0 ? (
            payments.map((payment: any) => (
              <div
                key={payment.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Payment Received</h4>
                  <p className="text-xs text-muted-foreground">
                    {payment.projects?.name || "Unknown Project"} •{" "}
                    {new Date(payment.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-400">
                  +₹{Number(payment.amount).toLocaleString("en-IN")}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
