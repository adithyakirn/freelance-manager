"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProject(projectId: string) {
  const supabase = await createClient();

  // Delete related data first (phases, designs, files) if not cascaded
  // Assuming cascade delete is set up in DB, but let's be safe or rely on it.
  // Ideally, Supabase foreign keys with ON DELETE CASCADE handles this.

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Error deleting project:", error);
    throw new Error("Failed to delete project");
  }

  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/projects"); // Redirect to list after delete
}

export async function deletePhase(phaseId: string, projectId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("phases").delete().eq("id", phaseId);

  if (error) {
    console.error("Error deleting phase:", error);
    throw new Error("Failed to delete phase");
  }

  revalidatePath(`/projects/${projectId}`);
}
