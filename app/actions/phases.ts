"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPhase(
  projectId: string,
  name: string,
  amount: number,
  description?: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("User not authenticated");
    return;
  }

  const { error } = await supabase.from("phases").insert({
    project_id: projectId,
    user_id: user.id,
    name,
    amount,
    description: description || null,
    status: "pending",
    is_completed: false,
  });

  if (error) console.error("Error adding phase:", error);
  revalidatePath(`/projects/${projectId}`);
}

export async function markPhasePaid(
  phaseId: string,
  projectId: string,
  amount: number,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // 1. Update phase status
  const { error: phaseError } = await supabase
    .from("phases")
    .update({ status: "paid" })
    .eq("id", phaseId);

  if (phaseError) throw new Error("Failed to update phase");

  // 2. Record payment
  const { error: paymentError } = await supabase.from("payments").insert({
    project_id: projectId,
    user_id: user.id,
    amount: amount,
    type: "phase_payment",
  });

  if (paymentError) console.error("Payment record error:", paymentError);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/"); // Update dashboard revenue
}

// Toggle phase completion status
export async function togglePhaseCompleted(
  phaseId: string,
  projectId: string,
  isCompleted: boolean,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("phases")
    .update({ is_completed: isCompleted })
    .eq("id", phaseId);

  if (error) console.error("Error toggling phase:", error);
  revalidatePath(`/projects/${projectId}`);
}

// Update phase description
export async function updatePhaseDescription(
  phaseId: string,
  projectId: string,
  description: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("phases")
    .update({ description })
    .eq("id", phaseId);

  if (error) console.error("Error updating description:", error);
  revalidatePath(`/projects/${projectId}`);
}

// Toggle individual feature completion within a phase
export async function toggleFeatureCompleted(
  phaseId: string,
  projectId: string,
  featureName: string,
  isCompleted: boolean,
) {
  const supabase = await createClient();

  // Get current completed features
  const { data: phase } = await supabase
    .from("phases")
    .select("completed_features")
    .eq("id", phaseId)
    .single();

  let completedFeatures: string[] = phase?.completed_features || [];

  if (isCompleted) {
    // Add to completed
    if (!completedFeatures.includes(featureName)) {
      completedFeatures.push(featureName);
    }
  } else {
    // Remove from completed
    completedFeatures = completedFeatures.filter((f) => f !== featureName);
  }

  const { error } = await supabase
    .from("phases")
    .update({ completed_features: completedFeatures })
    .eq("id", phaseId);

  if (error) console.error("Error toggling feature:", error);
  revalidatePath(`/projects/${projectId}`);
}
