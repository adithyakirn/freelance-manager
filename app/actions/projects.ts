"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const status = (formData.get("status") as string) || "ongoing";
  const clientEmail = formData.get("clientEmail") as string;
  const clientSource = formData.get("clientSource") as string;
  const workType = formData.get("workType") as string;
  const quotationFile = formData.get("quotation") as File | null;
  const logoFile = formData.get("logo") as File | null;

  let quotationUrl = null;
  let logoUrl = null;

  // Helper to upload file
  async function uploadFile(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from("project-files")
      .upload(path, file);

    if (error) {
      console.error("Upload error:", error);
      throw new Error("File upload failed");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-files").getPublicUrl(path);

    return publicUrl;
  }

  try {
    if (quotationFile && quotationFile.size > 0) {
      const path = `quotations/${Date.now()}-${quotationFile.name}`;
      quotationUrl = await uploadFile(quotationFile, path);
    }

    if (logoFile && logoFile.size > 0) {
      const path = `logos/${Date.now()}-${logoFile.name}`;
      logoUrl = await uploadFile(logoFile, path);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const referralName = formData.get("referralName") as string;

    const { error } = await supabase.from("projects").insert({
      name,
      status,
      user_id: user.id,
      client_details: {
        email: clientEmail,
        referral_name: clientSource === "referral" ? referralName : undefined,
      },
      client_source: clientSource || null,
      work_type: workType || null,
      quotation_url: quotationUrl,
      logo_url: logoUrl,
    });

    if (error) {
      console.error("DB Error:", error);
      throw new Error("Failed to create project");
    }
  } catch (error) {
    console.error(error);
    // throw error; // Or handle gracefully
  }

  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/projects");
}
