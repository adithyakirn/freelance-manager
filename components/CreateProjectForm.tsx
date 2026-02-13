"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createProject } from "@/app/actions/projects";
import { Upload, FileText, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full mt-6" size="lg" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Project...
        </>
      ) : (
        "Create Project"
      )}
    </Button>
  );
}

export function CreateProjectForm() {
  const [quotationName, setQuotationName] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "quotation" | "logo",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "quotation") setQuotationName(file.name);
      else setLogoName(file.name);
    }
  };

  return (
    <form action={createProject} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-300">
          Project Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Website Redesign"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="text-sm font-medium text-gray-300">
          Status
        </label>
        <select
          name="status"
          className={cn(
            "flex h-11 w-full rounded-[var(--radius-md)] border border-white/10 bg-[#1C1C1E] px-3 py-2 text-sm shadow-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D53231] focus-visible:border-[#D53231] disabled:cursor-not-allowed disabled:opacity-50 text-white",
          )}
        >
          <option className="bg-[#1C1C1E]" value="ongoing">
            Ongoing
          </option>
          <option className="bg-[#1C1C1E]" value="pending">
            Pending Confirmation
          </option>
          <option className="bg-[#1C1C1E]" value="completed">
            Completed
          </option>
        </select>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="clientEmail"
          className="text-sm font-medium text-gray-300"
        >
          Client Email (Optional)
        </label>
        <Input
          id="clientEmail"
          name="clientEmail"
          type="email"
          placeholder="client@example.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="clientSource"
            className="text-sm font-medium text-gray-300"
          >
            Client Source
          </label>
          <select
            name="clientSource"
            className={cn(
              "flex h-11 w-full rounded-[var(--radius-md)] border border-white/10 bg-[#1C1C1E] px-3 py-2 text-sm shadow-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D53231] focus-visible:border-[#D53231] disabled:cursor-not-allowed disabled:opacity-50 text-white",
            )}
          >
            <option className="bg-[#1C1C1E]" value="">
              Select source...
            </option>
            <option className="bg-[#1C1C1E]" value="referral">
              Referral
            </option>
            <option className="bg-[#1C1C1E]" value="social_media">
              Social Media
            </option>
            <option className="bg-[#1C1C1E]" value="linkedin">
              LinkedIn
            </option>
            <option className="bg-[#1C1C1E]" value="instagram">
              Instagram
            </option>
            <option className="bg-[#1C1C1E]" value="cold_outreach">
              Cold Outreach
            </option>
            <option className="bg-[#1C1C1E]" value="upwork">
              Upwork
            </option>
            <option className="bg-[#1C1C1E]" value="fiverr">
              Fiverr
            </option>
            <option className="bg-[#1C1C1E]" value="website">
              Website
            </option>
            <option className="bg-[#1C1C1E]" value="repeat_client">
              Repeat Client
            </option>
            <option className="bg-[#1C1C1E]" value="other">
              Other
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="workType"
            className="text-sm font-medium text-gray-300"
          >
            Type of Work
          </label>
          <select
            name="workType"
            className={cn(
              "flex h-11 w-full rounded-[var(--radius-md)] border border-white/10 bg-[#1C1C1E] px-3 py-2 text-sm shadow-none transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D53231] focus-visible:border-[#D53231] disabled:cursor-not-allowed disabled:opacity-50 text-white",
            )}
          >
            <option className="bg-[#1C1C1E]" value="">
              Select type...
            </option>
            <option className="bg-[#1C1C1E]" value="web_development">
              Web Development
            </option>
            <option className="bg-[#1C1C1E]" value="mobile_app">
              Mobile App
            </option>
            <option className="bg-[#1C1C1E]" value="ui_ux_design">
              UI/UX Design
            </option>
            <option className="bg-[#1C1C1E]" value="logo_design">
              Logo Design
            </option>
            <option className="bg-[#1C1C1E]" value="branding">
              Branding
            </option>
            <option className="bg-[#1C1C1E]" value="ecommerce">
              E-commerce
            </option>
            <option className="bg-[#1C1C1E]" value="saas">
              SaaS
            </option>
            <option className="bg-[#1C1C1E]" value="wordpress">
              WordPress
            </option>
            <option className="bg-[#1C1C1E]" value="maintenance">
              Maintenance
            </option>
            <option className="bg-[#1C1C1E]" value="consulting">
              Consulting
            </option>
            <option className="bg-[#1C1C1E]" value="other">
              Other
            </option>
          </select>
        </div>
      </div>

      {/* File Uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Quotation (PDF)
          </label>
          <div
            className={`relative border border-dashed border-white/10 bg-[#1C1C1E]/50 rounded-xl p-6 hover:bg-[#1C1C1E] transition-colors text-center cursor-pointer group ${quotationName ? "border-[#D53231]/50 bg-[#D53231]/5" : ""}`}
          >
            <input
              type="file"
              name="quotation"
              accept=".pdf,.doc,.docx"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e, "quotation")}
            />
            <div className="w-12 h-12 rounded-full bg-[#1C1C1E] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FileText
                className={`h-5 w-5 transition-colors ${quotationName ? "text-[#D53231]" : "text-gray-400 group-hover:text-white"}`}
              />
            </div>
            <span
              className={`text-sm transition-colors block truncate px-2 ${quotationName ? "text-[#D53231] font-medium" : "text-gray-400 group-hover:text-white"}`}
            >
              {quotationName || "Upload Document"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Logo (Image)
          </label>
          <div
            className={`relative border border-dashed border-white/10 bg-[#1C1C1E]/50 rounded-xl p-6 hover:bg-[#1C1C1E] transition-colors text-center cursor-pointer group ${logoName ? "border-[#D53231]/50 bg-[#D53231]/5" : ""}`}
          >
            <input
              type="file"
              name="logo"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFileChange(e, "logo")}
            />
            <div className="w-12 h-12 rounded-full bg-[#1C1C1E] flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon
                className={`h-5 w-5 transition-colors ${logoName ? "text-[#D53231]" : "text-gray-400 group-hover:text-white"}`}
              />
            </div>
            <span
              className={`text-sm transition-colors block truncate px-2 ${logoName ? "text-[#D53231] font-medium" : "text-gray-400 group-hover:text-white"}`}
            >
              {logoName || "Upload Logo"}
            </span>
          </div>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
