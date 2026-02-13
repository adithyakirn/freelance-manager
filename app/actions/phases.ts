"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addPhase(
  projectId: string,
  name: string,
  amount: number,
) {
  const supabase = await createClient();

  const { error } = await supabase.from("phases").insert({
    project_id: projectId,
    name,
    amount,
    status: "pending",
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

  // 1. Update phase status
  const { error: phaseError } = await supabase
    .from("phases")
    .update({ status: "paid" })
    .eq("id", phaseId);

  if (phaseError) throw new Error("Failed to update phase");

  // 2. Record payment
  const { error: paymentError } = await supabase.from("payments").insert({
    project_id: projectId,
    amount: amount,
    type: "phase_payment",
  });

  if (paymentError) console.error("Payment record error:", paymentError);

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/"); // Update dashboard revenue
}
