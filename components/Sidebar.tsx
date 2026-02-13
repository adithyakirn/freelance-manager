"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Lightbulb,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PieChart,
  User,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Finances", href: "/finances", icon: DollarSign },
  { name: "Motivation", href: "/motivation", icon: Lightbulb },
];

const otherItems = [
  { name: "Reports", href: "/reports", icon: PieChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setUserProfile(
          profile || {
            email: user.email,
            full_name: user.user_metadata?.full_name,
          },
        );
      }
    }
    getUser();
  }, []);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="h-20 flex items-center px-6 mb-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary)/0.1)] flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          {(!collapsed || isMobile) && (
            <span className="font-bold text-foreground text-xl font-display tracking-tight">
              Freelance<span className="text-[hsl(var(--primary))]">Mgr</span>
            </span>
          )}
        </Link>
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "sidebar-item relative group",
                  isActive && "active",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-[#D53231]"
                      : "text-gray-500 group-hover:text-white",
                  )}
                >
                  <Icon className="w-full h-full" />
                </div>
                {(!collapsed || isMobile) && (
                  <span
                    className={cn(
                      "font-medium",
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-white",
                    )}
                  >
                    {item.name}
                  </span>
                )}

                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#D53231] shadow-[0_0_10px_#D53231]" />
                )}
              </div>
            </Link>
          );
        })}

        <div className="my-6 border-t border-white/5 mx-4" />

        {otherItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "sidebar-item relative group",
                  isActive && "active",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-[#D53231]"
                      : "text-gray-500 group-hover:text-white",
                  )}
                >
                  <Icon className="w-full h-full" />
                </div>
                {(!collapsed || isMobile) && (
                  <span
                    className={cn(
                      "font-medium",
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-white",
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Collapse - Desktop only */}
      {!isMobile && (
        <div className="p-4 border-t border-white/5">
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl bg-[#1C1C1E]",
              collapsed && "justify-center p-2",
            )}
          >
            {!userProfile ? (
              // Loading Skeleton
              <>
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
                {!collapsed && (
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3.5 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                  </div>
                )}
              </>
            ) : (
              // Real Data
              <>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {userProfile.avatar_url ? (
                    <img
                      src={userProfile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {userProfile.full_name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userProfile.email}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-[#1C1C1E] text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden sidebar fixed left-0 top-0 h-screen w-[280px] z-50 flex flex-col bg-[#000000]"
          >
            <SidebarContent isMobile />
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="sidebar hidden lg:flex fixed left-0 top-0 h-screen z-40 flex-col bg-[#000000]"
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}
