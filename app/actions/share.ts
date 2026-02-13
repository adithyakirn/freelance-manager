"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

// Enable sharing and generate token
export async function enableSharing(
  projectId: string,
): Promise<{ success: boolean; token?: string; error?: string }> {
  const supabase = await createClient();

  // Check if project already has a token
  const { data: existing } = await supabase
    .from("projects")
    .select("share_token")
    .eq("id", projectId)
    .single();

  const token = existing?.share_token || nanoid(12);

  const { error } = await supabase
    .from("projects")
    .update({
      share_token: token,
      share_enabled: true,
    })
    .eq("id", projectId);

  if (error) {
    console.error("Error enabling sharing:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true, token };
}

// Disable sharing
export async function disableSharing(
  projectId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ share_enabled: false })
    .eq("id", projectId);

  if (error) {
    console.error("Error disabling sharing:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

// Update progress status
export async function updateProgressStatus(
  projectId: string,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ progress_status: status })
    .eq("id", projectId);

  if (error) {
    console.error("Error updating progress:", error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

// Get project by share token (for public view)
export async function getProjectByToken(token: string) {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, phases(*), payments(*), designs(*)")
    .eq("share_token", token)
    .eq("share_enabled", true)
    .single();

  if (error || !project) {
    return null;
  }

  return project;
}

// Get share status for a project
export async function getShareStatus(projectId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("share_token, share_enabled, progress_status")
    .eq("id", projectId)
    .single();

  return data;
}
