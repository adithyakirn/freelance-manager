import { GlassCard } from "@/components/ui/GlassCard";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
export default function NewProjectPage() {
  return (
    <div className="min-h-screen pb-20">
      <main className="container mx-auto px-4 py-8 pt-16 lg:pt-8 max-w-2xl">
        <Link
          href="/projects"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Link>

        <GlassCard className="p-8">
          <h1 className="text-2xl font-bold text-white mb-6">
            Create New Project
          </h1>

          <CreateProjectForm />
        </GlassCard>
      </main>
    </div>
  );
}
