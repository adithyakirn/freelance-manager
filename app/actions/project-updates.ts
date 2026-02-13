"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveProject(projectId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ status: "ongoing" })
    .eq("id", projectId);

  if (error) {
    console.error("Error approving project:", error);
    throw new Error("Failed to approve project");
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/");
}

export async function updateGitInfo(
  projectId: string,
  repo: string,
  lastCommitMsg: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      git_repo: repo,
      last_commit_msg: lastCommitMsg,
      last_commit_date: new Date().toISOString(),
    })
    .eq("id", projectId);

  if (error) {
    console.error("Error updating git info:", error);
    throw new Error("Failed to update git info");
  }

  revalidatePath(`/projects/${projectId}`);
}

export async function addDesign(
  projectId: string,
  title: string,
  url: string,
  loginType: string,
) {
  const supabase = await createClient();

  const { error } = await supabase.from("designs").insert({
    project_id: projectId,
    title: title || loginType, // Fallback if no specific title
    url,
    login_type: loginType, // Keep this for backward compatibility or categorization
  });

  if (error) {
    console.error("Error adding design:", error);
    throw new Error("Failed to add design");
  }

  revalidatePath(`/projects/${projectId}`);
}
