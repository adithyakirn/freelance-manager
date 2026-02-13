import { GlassCard } from "@/components/ui/GlassCard";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  HelpCircle,
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 text-foreground">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-display">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Profile Settings */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold font-display">Profile</h3>
                <p className="text-xs text-muted-foreground">
                  Manage your personal information
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm">Admin User</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm">admin@freelance.com</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Role</span>
                <span className="text-sm">Freelancer</span>
              </div>
            </div>
          </GlassCard>

          {/* Notification Settings */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="font-semibold font-display">Notifications</h3>
                <p className="text-xs text-muted-foreground">
                  Configure notification preferences
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">
                  Email Notifications
                </span>
                <span className="text-sm text-green-400">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">
                  Payment Reminders
                </span>
                <span className="text-sm text-green-400">Enabled</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  Project Updates
                </span>
                <span className="text-sm text-green-400">Enabled</span>
              </div>
            </div>
          </GlassCard>

          {/* Security Settings */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold font-display">Security</h3>
                <p className="text-xs text-muted-foreground">
                  Manage your security settings
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Password</span>
                <span className="text-sm">••••••••</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">
                  Two-Factor Auth
                </span>
                <span className="text-sm text-muted-foreground">Disabled</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">
                  Last Login
                </span>
                <span className="text-sm">Today</span>
              </div>
            </div>
          </GlassCard>

          {/* Appearance Settings */}
          <GlassCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold font-display">Appearance</h3>
                <p className="text-xs text-muted-foreground">
                  Customize the look and feel
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">Theme</span>
                <span className="text-sm">Dark</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-muted-foreground">
                  Accent Color
                </span>
                <span className="text-sm text-[#D53231]">Red</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Currency</span>
                <span className="text-sm">₹ INR</span>
              </div>
            </div>
          </GlassCard>
        </div>

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
    </MainLayout>
  );
}
