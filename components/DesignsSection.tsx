"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Upload, Image as ImageIcon, Plus, Loader2, X } from "lucide-react";
import { addDesign } from "@/app/actions/project-updates";
import { createClient } from "@/utils/supabase/client";

interface Design {
  id: string;
  name: string;
  url: string;
}

interface DesignsSectionProps {
  projectId: string;
  designs: Design[];
}

const loginTypes = [
  { name: "Admin Login", key: "admin" },
  { name: "User Login", key: "user" },
  { name: "Client Portal", key: "client" },
];

export function DesignsSection({ projectId, designs }: DesignsSectionProps) {
  return (
    <div className="space-y-3">
      {/* Predefined Logins */}
      {loginTypes.map((login) => {
        const design = designs?.find(
          (d: any) => d.name === login.key || d.login_type === login.key,
        );

        return (
          <GlassCard
            key={login.key}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h4 className="font-medium text-white">{login.name}</h4>
                <p className="text-sm text-gray-500">
                  {design ? "Design uploaded" : "No design yet"}
                </p>
              </div>
            </div>

            {design ? (
              <a
                href={design.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#FF7A00] hover:underline"
              >
                View
              </a>
            ) : (
              <AddDesignButton projectId={projectId} loginType={login.key} />
            )}
          </GlassCard>
        );
      })}

      {/* Custom Designs */}
      {designs
        ?.filter(
          (d: any) =>
            !loginTypes.some((t) => t.key === d.login_type || t.key === d.name),
        )
        .map((design: any) => (
          <GlassCard
            key={design.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-white">
                  {design.title || "Custom Design"}
                </h4>
                <p className="text-sm text-gray-500">Manual Entry</p>
              </div>
            </div>

            <a
              href={design.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#FF7A00] hover:underline"
            >
              View
            </a>
          </GlassCard>
        ))}

      <AddCustomDesignButton projectId={projectId} />
    </div>
  );
}

function AddDesignButton({
  projectId,
  loginType,
}: {
  projectId: string;
  loginType: string;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const supabase = createClient();
    const fileName = `designs/${projectId}/${Date.now()}_${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(fileName);

      await addDesign(projectId, "", publicUrl, loginType);
    } catch (error) {
      console.error("Error uploading design:", error);
      alert("Failed to upload design");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label
      className={`btn-outline text-sm py-2 px-4 cursor-pointer ${
        isUploading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isUploading ? (
        <Loader2 className="w-4 h-4 mr-1 inline animate-spin" />
      ) : (
        <Upload className="w-4 h-4 mr-1 inline" />
      )}
      {isUploading ? "Uploading..." : "Upload"}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
      />
    </label>
  );
}

function AddCustomDesignButton({ projectId }: { projectId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!file || !title) return;
    setLoading(true);

    const supabase = createClient();
    const fileName = `designs/${projectId}/${Date.now()}_${file.name}`;

    try {
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(fileName, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("uploads").getPublicUrl(fileName);

      await addDesign(projectId, title, publicUrl, "custom");
      setShowForm(false);
      setTitle("");
      setFile(null);
    } catch (error) {
      console.error("Error adding custom design:", error);
      alert("Failed to add design");
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <div className="p-4 border border-dashed border-white/10 rounded-xl space-y-3">
        <input
          type="text"
          placeholder="Design Title"
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:outline-none transition-colors"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {file ? (
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <ImageIcon className="w-5 h-5 text-blue-500 shrink-0" />
            <span className="text-sm text-blue-400 truncate flex-1">
              {file.name}
            </span>
            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-3 p-4 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-400">Upload design image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && setFile(e.target.files[0])
              }
              className="hidden"
            />
          </label>
        )}

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowForm(false)}
            className="text-sm text-gray-400 hover:text-white px-3 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading || !file || !title}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Design"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full py-3 border border-dashed border-white/10 rounded-xl text-gray-500 hover:text-white hover:border-white/20 transition-colors flex items-center justify-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Custom Design
    </button>
  );
}
