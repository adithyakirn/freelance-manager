"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { User, Bell, Shield, Palette, HelpCircle, Save } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { updateProfile } from "@/app/actions/settings";

const accentColors = [
  { name: "Red", value: "0 72.2% 50.6%", hex: "#D53231" },
  { name: "Blue", value: "221.2 83.2% 53.3%", hex: "#3b82f6" },
  { name: "Green", value: "142.1 76.2% 36.3%", hex: "#22c55e" },
  { name: "Purple", value: "262.1 83.3% 57.8%", hex: "#a855f7" },
  { name: "Orange", value: "24.6 95% 53.1%", hex: "#f97316" },
];

export function SettingsForm({ userProfile }: { userProfile: any }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accent, setAccent] = useState(accentColors[0].value);
  const [isLoading, setIsLoading] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Try to load saved accent from local storage
    const savedAccent = localStorage.getItem("accent-color");
    if (savedAccent) {
      setAccent(savedAccent);
      document.documentElement.style.setProperty("--primary", savedAccent);
    }
  }, []);

  const handleAccentChange = (colorValue: string) => {
    setAccent(colorValue);
    document.documentElement.style.setProperty("--primary", colorValue);
    localStorage.setItem("accent-color", colorValue);
  };

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Profile Settings */}
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold font-display">Profile</h3>
            <p className="text-xs text-muted-foreground">
              Manage your personal information
            </p>
          </div>
        </div>
        <form
          className="space-y-4"
          action={async (formData) => {
            setIsLoading(true);
            await updateProfile(formData);
            setIsLoading(false);
          }}
        >
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Full Name</label>
            <input
              name="fullName"
              defaultValue={userProfile?.full_name || ""}
              placeholder="Your Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <input
              name="email"
              defaultValue={userProfile?.email || ""}
              readOnly
              className="opacity-50 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))]">
            <span className="text-sm text-muted-foreground">Theme</span>
            <div className="flex items-center gap-2 bg-[hsl(var(--input))] p-1 rounded-lg">
              <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-md transition-all ${
                  theme === "light"
                    ? "bg-[hsl(var(--background))] shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-md transition-all ${
                  theme === "dark"
                    ? "bg-[hsl(var(--background))] shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dark
              </button>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <span className="text-sm text-muted-foreground block">
              Accent Color
            </span>
            <div className="flex flex-wrap gap-3">
              {accentColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleAccentChange(color.value)}
                  className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                    accent === color.value
                      ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                      : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
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
        <div className="space-y-3 opacity-50 pointer-events-none">
          {/* Mocked for now */}
          <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))]">
            <span className="text-sm text-muted-foreground">
              Email Notifications
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
        <p className="text-xs text-center text-muted-foreground mt-2">
          Coming Soon
        </p>
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
          <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))]">
            <span className="text-sm text-muted-foreground">
              Authenticated as
            </span>
            <span className="text-sm">{userProfile?.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">Provider</span>
            <span className="text-sm">Google</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
