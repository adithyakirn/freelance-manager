import { GlassCard } from "@/components/ui/GlassCard";
import { HelpCircle } from "lucide-react";
import { SettingsForm } from "@/components/SettingsForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fallback if profile doesn't exist yet (should be handled by trigger, but just in case)
  const userProfile = profile || {
    full_name: user.user_metadata.full_name,
    email: user.email,
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 text-foreground">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <SettingsForm userProfile={userProfile} />

      {/* Help Section */}
      <GlassCard className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#D53231]/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[#D53231]" />
          </div>
          <div>
            <h3 className="font-semibold font-display">Help & Support</h3>
            <p className="text-xs text-muted-foreground">
              Get help with using the app
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Need help? Contact support at{" "}
          <span className="text-[#D53231]">support@freelancemgr.com</span>
        </p>
      </GlassCard>
    </div>
  );
}
