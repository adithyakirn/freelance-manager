import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/server";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Calendar,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

// Helper to format currency
function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Helper to format label
function formatLabel(value: string | null) {
  if (!value) return "Not specified";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function ReportsPage() {
  const supabase = await createClient();

  // Fetch all projects with phases and payments
  const { data: projects } = await supabase
    .from("projects")
    .select("*, phases(*), payments(*)");

  // Calculate metrics
  const totalProjects = projects?.length || 0;
  const completedProjects =
    projects?.filter((p) => p.status === "completed").length || 0;
  const ongoingProjects =
    projects?.filter((p) => p.status === "ongoing").length || 0;
  const pendingProjects =
    projects?.filter((p) => p.status === "pending").length || 0;

  // Financial calculations
  const totalValue =
    projects?.reduce((sum, p) => {
      const phaseTotal =
        p.phases?.reduce(
          (pSum: number, phase: any) => pSum + Number(phase.amount || 0),
          0,
        ) || 0;
      return sum + phaseTotal;
    }, 0) || 0;

  const totalReceived =
    projects?.reduce((sum, p) => {
      const payments =
        p.payments?.reduce(
          (pSum: number, payment: any) => pSum + Number(payment.amount || 0),
          0,
        ) || 0;
      return sum + payments;
    }, 0) || 0;

  const totalPending = totalValue - totalReceived;
  const collectionRate =
    totalValue > 0 ? (totalReceived / totalValue) * 100 : 0;

  // Client source breakdown
  const clientSources =
    projects?.reduce((acc: Record<string, number>, p) => {
      const source = p.client_source || "unspecified";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {}) || {};

  // Work type breakdown
  const workTypes =
    projects?.reduce((acc: Record<string, number>, p) => {
      const type = p.work_type || "unspecified";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}) || {};

  // Revenue by work type
  const revenueByWorkType =
    projects?.reduce((acc: Record<string, number>, p) => {
      const type = p.work_type || "unspecified";
      const revenue =
        p.payments?.reduce(
          (sum: number, payment: any) => sum + Number(payment.amount || 0),
          0,
        ) || 0;
      acc[type] = (acc[type] || 0) + revenue;
      return acc;
    }, {}) || {};

  // Sort for top sources and work types
  const topSources = Object.entries(clientSources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topWorkTypes = Object.entries(workTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topRevenueTypes = Object.entries(revenueByWorkType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="min-h-screen pb-20">
        <main className="container mx-auto px-4 py-8 pt-16 lg:pt-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#D53231]/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-[#D53231]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Reports</h1>
              <p className="text-sm text-gray-400">
                Analytics and insights for your freelance business
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Total Projects
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {totalProjects}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                {ongoingProjects} ongoing • {completedProjects} completed
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold text-green-400">
                    {formatCurrency(totalReceived)}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                <ArrowUpRight className="w-3 h-3 text-green-400" />
                <span className="text-green-400">
                  {collectionRate.toFixed(1)}%
                </span>
                <span className="text-gray-400">collection rate</span>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Pending Payments
                  </p>
                  <h3 className="text-2xl font-bold text-yellow-400">
                    {formatCurrency(totalPending)}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                From {pendingProjects} pending projects
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Total Value
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {formatCurrency(totalValue)}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Across all projects
              </div>
            </GlassCard>
          </div>

          {/* Breakdown Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Client Sources */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold text-white">Client Sources</h3>
              </div>
              <div className="space-y-3">
                {topSources.length > 0 ? (
                  topSources.map(([source, count]) => {
                    const percentage = (count / totalProjects) * 100;
                    return (
                      <div key={source}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">
                            {formatLabel(source)}
                          </span>
                          <span className="text-gray-400">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No data available</p>
                )}
              </div>
            </GlassCard>

            {/* Work Types */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Work Types</h3>
              </div>
              <div className="space-y-3">
                {topWorkTypes.length > 0 ? (
                  topWorkTypes.map(([type, count]) => {
                    const percentage = (count / totalProjects) * 100;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">
                            {formatLabel(type)}
                          </span>
                          <span className="text-gray-400">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No data available</p>
                )}
              </div>
            </GlassCard>

            {/* Revenue by Work Type */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-white">Revenue by Type</h3>
              </div>
              <div className="space-y-3">
                {topRevenueTypes.length > 0 ? (
                  topRevenueTypes.map(([type, revenue]) => {
                    const percentage =
                      totalReceived > 0 ? (revenue / totalReceived) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">
                            {formatLabel(type)}
                          </span>
                          <span className="text-gray-400">
                            {formatCurrency(revenue)}
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-sm">No data available</p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Project Status Overview */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-[#D53231]" />
              <h3 className="font-semibold text-white">
                Project Status Overview
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {completedProjects}
                </div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
              <div className="text-center p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {ongoingProjects}
                </div>
                <div className="text-sm text-gray-400">Ongoing</div>
              </div>
              <div className="text-center p-4 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {pendingProjects}
                </div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </MainLayout>
  );
}
