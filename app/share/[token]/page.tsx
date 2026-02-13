import { getProjectByToken } from "@/app/actions/share";
import { fetchGitHubCommits } from "@/app/actions/git";
import { notFound } from "next/navigation";
import { Calendar, DollarSign, CheckCircle, Clock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SharedPhaseList } from "@/components/SharedPhaseList";
import { SharedDesignsSection } from "@/components/SharedDesignsSection";
import { SharedPaymentsSection } from "@/components/SharedPaymentsSection";
import { GitStatusCard } from "@/components/GitStatusCard";
import { QuotationModal } from "@/components/QuotationModal";

export const revalidate = 0;

// Helper for date formatting
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// PhaseItem component removed

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const project = await getProjectByToken(token);

  if (!project) {
    notFound();
  }

  // Fetch commits if repo is connected
  let commits: any[] = [];
  if (project.git_repo) {
    const commitsData = await fetchGitHubCommits(project.id, project.git_repo);
    if (commitsData.success && commitsData.commits) {
      commits = commitsData.commits.slice(0, 5); // Take top 5
    }
  }

  // Sort phases by name (numeric aware) to ensure Phase 1 comes before Phase 2
  const sortedPhases = [...(project.phases || [])].sort((a: any, b: any) =>
    a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  // Calculate stats
  const totalPhases = sortedPhases.length;

  // STRICT LOGIC: A phase is only "completed" if all its features are done
  const isPhaseStrictlyCompleted = (phase: any) => {
    const features = phase.description
      ? phase.description
          .split(",")
          .map((f: string) => f.trim())
          .filter((f: string) => f.length > 0)
      : [];
    if (features.length === 0) return phase.is_completed;
    const completedFeatures = phase.completed_features || [];
    // Strict check: ALL features must be in completed_features
    return features.every((f: string) => completedFeatures.includes(f));
  };

  const strictlyCompletedPhases = sortedPhases.filter(
    isPhaseStrictlyCompleted,
  ).length;
  const progressPercent =
    totalPhases > 0
      ? Math.round((strictlyCompletedPhases / totalPhases) * 100)
      : 0;

  // Status logic
  const allPhasesCompleted =
    totalPhases > 0 && strictlyCompletedPhases === totalPhases;

  // Find the first phase that is NOT strictly completed
  const currentPhaseIndex = sortedPhases.findIndex(
    (p: any) => !isPhaseStrictlyCompleted(p),
  );

  // If all completed, currentPhase is undefined. If none completed, it's 0.
  // If some completed, it's the first non-completed one.
  const currentPhase =
    currentPhaseIndex !== -1 ? sortedPhases[currentPhaseIndex] : null;

  const currentStatusText = allPhasesCompleted
    ? "Project Completed! 🎉"
    : currentPhase
      ? `Current Focus: ${currentPhase.name}`
      : project.progress_status || "In Progress";

  // Payments
  const payments = project.payments || [];
  const totalAdvances = payments.reduce(
    (acc: number, p: any) => acc + Number(p.amount),
    0,
  );

  // Calculate financial totals
  const totalPhaseAmount = (project.phases || []).reduce(
    (acc: number, phase: any) => acc + Number(phase.amount || 0),
    0,
  );

  const totalReceived = totalAdvances; // In this context, total received is the sum of payments
  const remaining = totalPhaseAmount - totalReceived;

  return (
    <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 bg-[#0A0A0A]">
      {/* Header Section */}
      <GlassCard className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-start gap-3 lg:gap-4">
            <div className="relative w-12 lg:w-16 h-12 lg:h-16 rounded-xl lg:rounded-2xl bg-linear-to-br from-[#FF7A00] to-[#CC6200] flex items-center justify-center text-lg lg:text-2xl font-bold text-white font-display shrink-0 overflow-hidden">
              {project.logo_url ? (
                <img
                  src={project.logo_url}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-xl lg:rounded-2xl"
                />
              ) : (
                project.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 lg:gap-3 mb-1">
                <h1 className="text-xl lg:text-2xl font-bold text-white font-display truncate">
                  {project.name}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                    project.status === "ongoing"
                      ? "bg-orange-500/20 text-orange-400"
                      : project.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {project.status.charAt(0).toUpperCase() +
                    project.status.slice(1)}
                </span>
              </div>
              <p className="text-gray-500 text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2 shrink-0" />
                Created on{" "}
                {new Date(project.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {project.quotation_url && (
              <QuotationModal url={project.quotation_url} />
            )}
          </div>
        </div>
      </GlassCard>

      {/* Financial Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 mb-3 lg:mb-4">
        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Total Value
              </p>
              <h3 className="text-lg lg:text-2xl font-bold text-white font-display">
                ₹{totalPhaseAmount.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center">
              <DollarSign className="w-4 lg:w-5 h-4 lg:h-5 text-[#FF7A00]" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Received
              </p>
              <h3 className="text-lg lg:text-2xl font-bold text-green-400 font-display">
                ₹{totalReceived.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 text-green-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Pending
              </p>
              <h3 className="text-lg lg:text-2xl font-bold text-yellow-400 font-display">
                ₹{remaining.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Clock className="w-4 lg:w-5 h-4 lg:h-5 text-yellow-500" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Git Status Card - Separate row */}
      <div className="mb-6 lg:mb-8">
        <GitStatusCard
          projectId={project.id}
          gitRepo={project.git_repo}
          lastCommitMsg={project.last_commit_msg}
          lastCommitDate={project.last_commit_date}
          readOnly={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* Phases Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white font-display">
            Project Phases
          </h2>
          <SharedPhaseList
            phases={sortedPhases}
            currentPhaseId={currentPhase?.id || null}
          />
        </div>

        {/* Logins / Designs Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white font-display">
            Designs & Logins
          </h2>
          <SharedDesignsSection designs={project.designs || []} />
        </div>
      </div>

      {/* Payments Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white font-display">
          Payment History
        </h2>
        <SharedPaymentsSection
          payments={payments || []}
          totalAdvances={totalAdvances}
        />
      </div>
    </div>
  );
}
