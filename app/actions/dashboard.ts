export async function getDashboardStats() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("status");

  if (error) {
    console.error("Error fetching project stats:", error);
    return null;
  }

  const { data: payments, error: paymentError } = await supabase
    .from("payments")
    .select("amount");

  const totalRevenue =
    payments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  const activeProjects = projects.filter((p) => p.status === "ongoing").length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed",
  ).length;
  const pendingProjects = projects.filter((p) => p.status === "pending").length;

  return {
    totalRevenue,
    activeProjects,
    completedProjects,
    pendingProjects,
    graphData: [], // Placeholder until real time-series implementation
  };
}

import { createClient } from "@/utils/supabase/server";
