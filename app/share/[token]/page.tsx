import { getProjectByToken } from "@/app/actions/share";
import { fetchGitHubCommits } from "@/app/actions/git";
import { notFound } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Activity,
  Layers,
  PartyPopper,
  Wrench,
  GitCommit,
  DollarSign,
  ChevronUp,
} from "lucide-react";

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

// Component for collapsible phase item
function PhaseItem({
  phase,
  isCurrentPhase,
}: {
  phase: any;
  isCurrentPhase: boolean;
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden transition-all ${
        isCurrentPhase
          ? "bg-blue-500/10 border border-blue-500/20"
          : "bg-white/5"
      }`}
    >
      <div className="p-3 flex items-center gap-3">
        {phase.is_completed ? (
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        ) : isCurrentPhase ? (
          <Wrench className="w-5 h-5 text-blue-400 shrink-0 animate-pulse" />
        ) : (
          <Clock className="w-5 h-5 text-gray-500 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-sm font-medium ${
                phase.is_completed ? "text-gray-400 line-through" : "text-white"
              }`}
            >
              {phase.name}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                phase.is_completed
                  ? "bg-green-500/20 text-green-400"
                  : isCurrentPhase
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {phase.is_completed
                ? "Done"
                : isCurrentPhase
                  ? "In Progress"
                  : "Upcoming"}
            </span>
          </div>
        </div>
      </div>

      {/* Description / Features - Only show if it exists */}
      {phase.description && (
        <div className="px-3 pb-3 ml-8">
          <p className="text-xs text-gray-400 line-clamp-2">
            {phase.description}
          </p>
        </div>
      )}
    </div>
  );
}

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

  // Sort phases by created_at
  const sortedPhases = [...(project.phases || [])].sort(
    (a: any, b: any) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  // Calculate stats
  const totalPhases = sortedPhases.length;
  const completedPhases = sortedPhases.filter(
    (p: any) => p.is_completed,
  ).length;
  const progressPercent =
    totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  // Status logic
  const allPhasesCompleted = totalPhases > 0 && completedPhases === totalPhases;
  const currentPhaseIndex = sortedPhases.findIndex((p: any) => !p.is_completed);
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
  const totalPaid = payments.reduce(
    (acc: number, p: any) => acc + Number(p.amount),
    0,
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-4 lg:p-8 flex justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column: Project Status & Phases (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Status Cards */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#FF7A00] to-[#CC6200] flex items-center justify-center text-2xl font-bold text-white font-display shrink-0 overflow-hidden">
                  {project.logo_url ? (
                    <img
                      src={project.logo_url}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    project.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white font-display">
                    {project.name}
                  </h1>
                  <span
                    className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      allPhasesCompleted
                        ? "bg-green-500/20 text-green-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {allPhasesCompleted ? "Completed" : "Ongoing"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Bar */}
            <div
              className={`px-6 py-4 border-b border-white/5 ${
                allPhasesCompleted ? "bg-green-500/5" : "bg-blue-500/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {allPhasesCompleted ? (
                  <PartyPopper className="w-5 h-5 text-green-400 shrink-0" />
                ) : (
                  <Activity className="w-5 h-5 text-blue-400 shrink-0" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${allPhasesCompleted ? "text-green-300" : "text-blue-300"}`}
                  >
                    {currentStatusText}
                  </p>
                  {project.progress_status && !allPhasesCompleted && (
                    <p className="text-xs text-gray-400 mt-1">
                      {project.progress_status}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Completion</span>
                <span className="text-sm font-semibold text-white">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    allPhasesCompleted
                      ? "bg-linear-to-r from-green-500 to-green-400"
                      : "bg-linear-to-r from-[#FF7A00] to-[#FF9A40]"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Total Phases</p>
                  <p className="text-xl font-bold text-white">{totalPhases}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Completed</p>
                  <p className="text-xl font-bold text-green-400">
                    {completedPhases}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Commits Section */}
          {commits.length > 0 && (
            <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden p-6">
              <h3 className="text-lg font-semibold text-white font-display mb-4 flex items-center gap-2">
                <GitCommit className="w-5 h-5 text-gray-400" />
                Recent Updates
              </h3>
              <div className="space-y-4">
                {commits.map((commit: any) => (
                  <div key={commit.sha} className="flex gap-3 relative group">
                    <div className="absolute left-[5px] top-8 bottom-0 w-px bg-white/5 group-last:hidden"></div>
                    <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-white/10 shrink-0 border border-white/5 group-hover:bg-[#FF7A00] group-hover:border-[#FF7A00] transition-colors"></div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm text-white font-medium line-clamp-1">
                        {commit.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={
                            commit.author.avatar_url ||
                            `https://ui-avatars.com/api/?name=${commit.author.name}`
                          }
                          alt={commit.author.name}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-xs text-gray-500">
                          {commit.author.name}
                        </span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-600">
                          {formatDate(commit.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Phases List & Payments */}
        <div className="space-y-6">
          {/* Phases List */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden p-6">
            <h3 className="text-lg font-semibold text-white font-display mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-400" />
              Roadmap
            </h3>
            <div className="space-y-2">
              {sortedPhases.map((phase: any, index: number) => {
                const isCurrent = currentPhaseIndex === index;
                return (
                  <PhaseItem
                    key={phase.id}
                    phase={phase}
                    isCurrentPhase={isCurrent}
                  />
                );
              })}
            </div>
          </div>

          {/* Payments List */}
          <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white font-display flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                Payments
              </h3>
              <span className="text-sm font-bold text-green-400">
                {formatCurrency(totalPaid)}
              </span>
            </div>

            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <div>
                      <p className="text-sm font-medium text-white capitalize">
                        {payment.type === "phase_payment"
                          ? "Phase Completion"
                          : payment.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(payment.date)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {formatCurrency(Number(payment.amount))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic text-center py-4">
                No payments recorded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
