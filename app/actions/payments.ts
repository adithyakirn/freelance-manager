"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface Payment {
  id: string;
  project_id: string;
  amount: number;
  type: "advance" | "phase_payment" | "adhoc";
  notes: string | null;
  receipt_url: string | null;
  date: string;
  created_at: string;
}

// Add advance payment
export async function addAdvancePayment(
  projectId: string,
  amount: number,
  notes?: string,
  receiptUrl?: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from("payments").insert({
    project_id: projectId,
    amount,
    type: "advance",
    notes: notes || null,
    receipt_url: receiptUrl || null,
  });

  if (error) {
    console.error("Error adding advance payment:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/finances");
  return { success: true };
}

// Get all payments for a project
export async function getProjectPayments(
  projectId: string,
): Promise<Payment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }

  return data || [];
}

// Get total advances for a project
export async function getProjectAdvances(projectId: string): Promise<number> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("amount")
    .eq("project_id", projectId)
    .eq("type", "advance");

  if (error) {
    console.error("Error fetching advances:", error);
    return 0;
  }

  return data?.reduce((acc, p) => acc + Number(p.amount), 0) || 0;
}

// Delete a payment
export async function deletePayment(
  paymentId: string,
  projectId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId);

  if (error) {
    console.error("Error deleting payment:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/finances");
  return { success: true };
}
