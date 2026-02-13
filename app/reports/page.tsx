import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/server";
import {
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  Calendar,
  PieChart,
  ArrowUpRight,
} from "lucide-react";
import { GenerateReportButton } from "@/components/GenerateReportButton";

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

  // Report data for download
  const reportData = {
    totalProjects,
    completedProjects,
    ongoingProjects,
    pendingProjects,
    totalReceived,
    totalPending,
    totalValue,
    collectionRate,
    clientSources,
    workTypes,
    revenueByWorkType,
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 text-foreground">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Analytics and insights for your freelance business
          </p>
        </div>
        <GenerateReportButton reportData={reportData} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Total Projects
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold font-display">
                {totalProjects}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                {ongoingProjects} ongoing • {completedProjects} completed
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Total Revenue
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-green-400 font-display">
                {formatCurrency(totalReceived)}
              </h3>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {collectionRate.toFixed(1)}% collection rate
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Pending Payments
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-yellow-400 font-display">
                {formatCurrency(totalPending)}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                From {pendingProjects} pending projects
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Total Value
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold font-display">
                {formatCurrency(totalValue)}
              </h3>
              <p className="text-xs text-muted-foreground mt-2">
                Across all projects
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {/* Client Sources */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold font-display">Client Sources</h3>
          </div>
          <div className="space-y-3">
            {topSources.length > 0 ? (
              topSources.map(([source, count]) => {
                const percentage = (count / totalProjects) * 100;
                return (
                  <div key={source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 truncate mr-2">
                        {formatLabel(source)}
                      </span>
                      <span className="text-gray-400 shrink-0">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">No data available</p>
            )}
          </div>
        </GlassCard>

        {/* Work Types */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold font-display">Work Types</h3>
          </div>
          <div className="space-y-3">
            {topWorkTypes.length > 0 ? (
              topWorkTypes.map(([type, count]) => {
                const percentage = (count / totalProjects) * 100;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 truncate mr-2">
                        {formatLabel(type)}
                      </span>
                      <span className="text-gray-400 shrink-0">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">No data available</p>
            )}
          </div>
        </GlassCard>

        {/* Revenue by Work Type */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="font-semibold font-display">Revenue by Type</h3>
          </div>
          <div className="space-y-3">
            {topRevenueTypes.length > 0 ? (
              topRevenueTypes.map(([type, revenue]) => {
                const percentage =
                  totalReceived > 0 ? (revenue / totalReceived) * 100 : 0;
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 truncate mr-2">
                        {formatLabel(type)}
                      </span>
                      <span className="text-gray-400 shrink-0">
                        {formatCurrency(revenue)}
                      </span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">No data available</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Project Status Overview */}
      <GlassCard>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-[#D53231]" />
          <h3 className="font-semibold font-display">
            Project Status Overview
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 lg:p-6 bg-green-500/5 rounded-xl border border-green-500/10">
            <div className="text-2xl lg:text-4xl font-bold text-green-400 font-display mb-1">
              {completedProjects}
            </div>
            <div className="text-xs lg:text-sm text-muted-foreground">
              Completed
            </div>
          </div>
          <div className="text-center p-4 lg:p-6 bg-blue-500/5 rounded-xl border border-blue-500/10">
            <div className="text-2xl lg:text-4xl font-bold text-blue-400 font-display mb-1">
              {ongoingProjects}
            </div>
            <div className="text-xs lg:text-sm text-muted-foreground">
              Ongoing
            </div>
          </div>
          <div className="text-center p-4 lg:p-6 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
            <div className="text-2xl lg:text-4xl font-bold text-yellow-400 font-display mb-1">
              {pendingProjects}
            </div>
            <div className="text-xs lg:text-sm text-muted-foreground">
              Pending
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
