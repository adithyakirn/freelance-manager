import { getProjectByToken } from "@/app/actions/share";
import { notFound } from "next/navigation";
import {
  CheckCircle,
  Clock,
  Activity,
  Layers,
  PartyPopper,
  Wrench,
} from "lucide-react";

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

  // Calculate phase progress based on is_completed field
  const totalPhases = project.phases?.length || 0;
  const completedPhases =
    project.phases?.filter((p: any) => p.is_completed).length || 0;
  const progressPercent =
    totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  // Derive current status from phases
  const allPhasesCompleted = totalPhases > 0 && completedPhases === totalPhases;
  const currentPhase = project.phases?.find((p: any) => !p.is_completed);
  const currentStatusText = allPhasesCompleted
    ? "Project Completed! 🎉"
    : currentPhase?.name
      ? `Working on: ${currentPhase.name}`
      : project.progress_status || "In Progress";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="p-6 lg:p-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#CC6200] flex items-center justify-center text-2xl font-bold text-white font-display shrink-0 overflow-hidden">
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
                <h1 className="text-xl lg:text-2xl font-bold text-white font-display">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
          </div>

          {/* Current Status - Derived from phases */}
          <div
            className={`px-6 lg:px-8 py-4 border-b border-white/5 ${
              allPhasesCompleted ? "bg-green-500/5" : "bg-blue-500/5"
            }`}
          >
            <div className="flex items-center gap-3">
              {allPhasesCompleted ? (
                <PartyPopper className="w-5 h-5 text-green-400 shrink-0" />
              ) : (
                <Wrench className="w-5 h-5 text-blue-400 shrink-0" />
              )}
              <p
                className={`text-sm font-medium ${allPhasesCompleted ? "text-green-300" : "text-blue-300"}`}
              >
                {currentStatusText}
              </p>
            </div>
            {/* Show phase description if available */}
            {currentPhase?.description && !allPhasesCompleted && (
              <p className="text-xs text-gray-400 mt-2 ml-8">
                {currentPhase.description}
              </p>
            )}
          </div>

          {/* Custom progress note if set */}
          {project.progress_status && !allPhasesCompleted && (
            <div className="px-6 lg:px-8 py-3 bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-gray-400 shrink-0" />
                <p className="text-xs text-gray-400">
                  {project.progress_status}
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="p-6 lg:p-8 space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Project Progress</span>
                <span className="text-sm font-semibold text-white">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    allPhasesCompleted
                      ? "bg-gradient-to-r from-green-500 to-green-400"
                      : "bg-gradient-to-r from-[#FF7A00] to-[#FF9A40]"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Phase Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    Total Phases
                  </span>
                </div>
                <p className="text-2xl font-bold text-white font-display">
                  {totalPhases}
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    Completed
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-400 font-display">
                  {completedPhases}
                </p>
              </div>
            </div>

            {/* Phase List */}
            {project.phases && project.phases.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                  Phase Status
                </p>
                {project.phases.map((phase: any, index: number) => {
                  const isCurrentPhase =
                    !phase.is_completed &&
                    project.phases.findIndex((p: any) => !p.is_completed) ===
                      index;

                  return (
                    <div
                      key={phase.id}
                      className={`p-3 rounded-xl ${
                        isCurrentPhase
                          ? "bg-blue-500/10 border border-blue-500/20"
                          : "bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {phase.is_completed ? (
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        ) : isCurrentPhase ? (
                          <Wrench className="w-5 h-5 text-blue-400 shrink-0 animate-pulse" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-500 shrink-0" />
                        )}
                        <span
                          className={`text-sm flex-1 ${phase.is_completed ? "text-gray-400 line-through" : "text-white"}`}
                        >
                          {phase.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
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
                      {/* Show features for current phase */}
                      {isCurrentPhase &&
                        phase.description &&
                        (() => {
                          const features = phase.description
                            .split(",")
                            .map((f: string) => f.trim())
                            .filter((f: string) => f.length > 0);
                          const completedFeatures =
                            phase.completed_features || [];
                          if (features.length === 0) return null;

                          return (
                            <div className="mt-3 ml-8 space-y-1.5">
                              {features.map((feature: string, i: number) => {
                                const isFeatureCompleted =
                                  completedFeatures.includes(feature);
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2"
                                  >
                                    {isFeatureCompleted ? (
                                      <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded-full border border-gray-500 shrink-0" />
                                    )}
                                    <span
                                      className={`text-xs ${isFeatureCompleted ? "text-gray-400 line-through" : "text-gray-300"}`}
                                    >
                                      {feature}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 lg:px-8 py-4 bg-white/5 text-center">
            <p className="text-xs text-gray-500">
              Powered by{" "}
              <span className="text-[#FF7A00] font-semibold">FreelanceMgr</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
