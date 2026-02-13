"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Upload, Image as ImageIcon, Plus } from "lucide-react";
import { addDesign } from "@/app/actions/project-updates";

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
  const [showInput, setShowInput] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!url) return;
    setLoading(true);
    await addDesign(projectId, "", url, loginType);
    setLoading(false);
    setShowInput(false);
  };

  if (showInput) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste URL"
          className="bg-neutral-800 border-none rounded px-2 py-1 text-sm text-white w-32"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="text-xs bg-[#FF7A00] text-white px-2 rounded"
        >
          {loading ? "..." : "Save"}
        </button>
        <button
          onClick={() => setShowInput(false)}
          className="text-xs text-gray-400"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowInput(true)}
      className="btn-outline text-sm py-2 px-4"
    >
      <Upload className="w-4 h-4 mr-1 inline" />
      Upload
    </button>
  );
}

function AddCustomDesignButton({ projectId }: { projectId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!url || !title) return;
    setLoading(true);
    await addDesign(projectId, title, url, "custom");
    setLoading(false);
    setShowForm(false);
    setTitle("");
    setUrl("");
  };

  if (showForm) {
    return (
      <div className="p-4 border border-dashed border-white/10 rounded-xl space-y-3">
        <input
          type="text"
          placeholder="Design Title"
          className="w-full bg-neutral-800 border-none rounded px-3 py-2 text-sm text-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL"
          className="w-full bg-neutral-800 border-none rounded px-3 py-2 text-sm text-white"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowForm(false)}
            className="text-sm text-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="btn-primary text-sm py-1 px-3"
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
