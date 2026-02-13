import { GlassCard } from "@/components/ui/GlassCard";
import { PerformanceChart, BarChart } from "@/components/Charts";
import { getDashboardStats } from "@/app/actions/dashboard";
import {
  TrendingUp,
  Briefcase,
  CheckCircle,
  Clock,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import MainLayout from "@/components/MainLayout";

export default async function Home() {
  const stats = await getDashboardStats();
  const supabase = await createClient();

  const data = stats || {
    totalRevenue: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingProjects: 0,
    graphData: [],
  };

  // Fetch recent updates
  const { data: recentProjects } = await supabase
    .from("projects")
    .select("name, status, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  // Line chart data
  const lineChartData = [
    { label: "Jan", value: 0 },
    { label: "Feb", value: data.totalRevenue },
    { label: "Mar", value: 0 },
  ];

  const barChartData = [
    { label: "Ongoing", value: data.activeProjects },
    { label: "Pending", value: data.pendingProjects },
    { label: "Done", value: data.completedProjects },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen p-4 lg:p-6 pt-16 lg:pt-8 text-foreground max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/projects/new">
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Project</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Main Stats - Red "Featured" Card logic from reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {/* Featured Card - Revenue (Like "Wallet Value" in Ref) */}
          <GlassCard
            variant="featured"
            className="md:col-span-2 lg:col-span-1 flex flex-col justify-between"
          >
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Total Revenue
              </p>
              <h3 className="text-3xl font-bold">
                ₹{data.totalRevenue.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-md">
              <TrendingUp className="w-3 h-3 text-white" />
              <span>+12.5%</span>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Active
                </p>
                <h3 className="text-2xl font-bold font-display">
                  {data.activeProjects}
                </h3>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Projects
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Completed
                </p>
                <h3 className="text-2xl font-bold font-display">
                  {data.completedProjects}
                </h3>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Paid
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Pending
                </p>
                <h3 className="text-2xl font-bold font-display">
                  {data.pendingProjects}
                </h3>
                <p className="text-xs text-white/40 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Awaiting
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            <PerformanceChart
              data={lineChartData}
              title="Revenue Growth"
              subtitle="Monthly Income"
            />
            <BarChart
              data={barChartData}
              title="Project Status"
              subtitle="Overview"
            />
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            <GlassCard className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-display">
                  Recent Activity
                </h3>
                <Link
                  href="/projects"
                  className="text-sm text-[#D53231] hover:text-white transition-colors"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {recentProjects && recentProjects.length > 0 ? (
                  recentProjects.map((p: any, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#1C1C1E] flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate text-white">
                          {p.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          New project
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">Create</p>
                        <span className="text-xs text-muted-foreground block">
                          {new Date(p.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
