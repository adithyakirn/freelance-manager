import { GlassCard } from "@/components/ui/GlassCard";
import { Image as ImageIcon } from "lucide-react";

interface Design {
  id: string;
  name: string;
  url: string;
  login_type?: string;
  title?: string;
}

interface SharedDesignsSectionProps {
  designs: Design[];
}

const loginTypes = [
  { name: "Admin Login", key: "admin" },
  { name: "User Login", key: "user" },
  { name: "Client Portal", key: "client" },
];

export function SharedDesignsSection({ designs }: SharedDesignsSectionProps) {
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
                  {design ? "Design available" : "No design yet"}
                </p>
              </div>
            </div>

            {design && (
              <a
                href={design.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#FF7A00] hover:underline"
              >
                View
              </a>
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
    </div>
  );
}
