import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/server";
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DesignsSection } from "@/components/DesignsSection";
import { PhasesSection } from "@/components/PhasesSection";
import { GitStatusCard } from "@/components/GitStatusCard";
import { ApproveProjectButton } from "@/components/ApproveProjectButton";
import { DeleteProjectButton } from "@/components/DeleteProjectButton";
import { PaymentsSection } from "@/components/PaymentsSection";
import { ShareButton } from "@/components/ShareButton";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, phases(*), designs(*)")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  // Fetch payments for this project
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  // Calculate advances total
  const totalAdvances =
    payments
      ?.filter((p: any) => p.type === "advance")
      .reduce((acc: number, p: any) => acc + Number(p.amount), 0) || 0;

  // Calculate financials
  const totalPhaseAmount = project.phases.reduce(
    (acc: number, p: any) => acc + Number(p.amount),
    0,
  );
  const totalPaidPhases = project.phases
    .filter((p: any) => p.status === "paid")
    .reduce((acc: number, p: any) => acc + Number(p.amount), 0);
  const totalReceived = totalPaidPhases + totalAdvances;
  const remaining = totalPhaseAmount - totalReceived;

  return (
    <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8">
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Projects
      </Link>

      {/* Header Section */}
      <GlassCard className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-start gap-3 lg:gap-4">
            <div className="relative w-12 lg:w-16 h-12 lg:h-16 rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#CC6200] flex items-center justify-center text-lg lg:text-2xl font-bold text-white font-display flex-shrink-0">
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
                  className={`badge flex-shrink-0 ${
                    project.status === "ongoing"
                      ? "badge-orange"
                      : project.status === "completed"
                        ? "badge-green"
                        : "badge-yellow"
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm flex items-center">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                Created on{" "}
                {new Date(project.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            {project.status === "pending" && (
              <ApproveProjectButton projectId={project.id} />
            )}
            <ShareButton
              projectId={project.id}
              initialShareEnabled={project.share_enabled}
              initialShareToken={project.share_token}
              initialProgressStatus={project.progress_status}
            />
            <DeleteProjectButton projectId={project.id} />
            {project.quotation_url && (
              <a
                href={project.quotation_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-outline flex items-center gap-2 w-full lg:w-auto justify-center">
                  <FileText className="h-4 w-4" />
                  View Quotation
                </button>
              </a>
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
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
        {/* Phases Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white font-display">
            Project Phases
          </h2>
          <PhasesSection projectId={project.id} phases={project.phases} />
        </div>

        {/* Logins / Designs Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white font-display">
            Designs & Logins
          </h2>
          <DesignsSection projectId={project.id} designs={project.designs} />
        </div>
      </div>

      {/* Payments Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white font-display">
          Payment History
        </h2>
        <PaymentsSection
          projectId={project.id}
          payments={payments || []}
          totalAdvances={totalAdvances}
        />
      </div>
    </div>
  );
}
