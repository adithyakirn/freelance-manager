"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/utils/supabase/client";
import { Calendar, Plus, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "@/components/MainLayout";

interface Project {
  id: string;
  name: string;
  status: string;
  created_at: string;
  client_details: { email: string } | null;
}

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const tabs = ["ongoing", "pending", "completed"];

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", activeTab)
        .order("created_at", { ascending: false });

      if (data) setProjects(data);
      setLoading(false);
    }

    fetchProjects();
  }, [activeTab]);

  return (
    <MainLayout>
      <div className="min-h-screen p-4 lg:p-6 pt-16 lg:pt-8 text-foreground max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage Work</p>
          </div>
          <Link href="/projects/new">
            <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
              <Plus className="w-5 h-5" />
              New Project
            </button>
          </Link>
        </div>

        {/* Tabs - Pill Style */}
        <div className="flex items-center gap-2 p-1 bg-[#1C1C1E] rounded-full w-full sm:w-fit mb-8 overflow-x-auto">
          {tabs.map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full capitalize font-medium text-sm transition-all font-display whitespace-nowrap ${
                activeTab === status
                  ? "bg-[#D53231] text-white shadow-md"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1C1C1E] rounded-3xl p-6 h-[220px] animate-pulse"
              />
            ))
          ) : projects.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href={`/projects/${project.id}`}>
                    <GlassCard
                      hoverEffect
                      className="h-full group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#1C1C1E] flex items-center justify-center text-lg font-bold text-white font-display border border-white/5">
                            {project.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span
                            className={`badge ${
                              project.status === "ongoing"
                                ? "badge-orange"
                                : project.status === "completed"
                                  ? "badge-green"
                                  : "badge-yellow"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#D53231] transition-colors font-display">
                          {project.name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <User className="w-4 h-4" />
                          <span className="truncate">
                            {project.client_details?.email ||
                              "No client details"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          {new Date(project.created_at).toLocaleDateString(
                            "en-IN",
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#1C1C1E] flex items-center justify-center group-hover:bg-[#D53231] transition-colors">
                          <ArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full">
              <GlassCard className="text-center py-20 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[#1C1C1E] flex items-center justify-center mb-6">
                  <Plus className="w-8 h-8 text-white/50" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-display text-white">
                  No {activeTab} projects
                </h3>
                <p className="text-muted-foreground mb-8">
                  Create your first project to get started
                </p>
                <Link href="/projects/new">
                  <button className="btn-primary">Create Project</button>
                </Link>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
