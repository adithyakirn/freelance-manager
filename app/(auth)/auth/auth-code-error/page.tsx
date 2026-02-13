import { GlassCard } from "@/components/ui/GlassCard";
import Link from "next/link";

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[hsl(var(--primary)/0.2)] via-background to-background">
      <GlassCard className="p-8 max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold font-display text-destructive">
          Authentication Error
        </h1>
        <p className="text-muted-foreground">
          {error ||
            "There was a problem signing you in. The verification code may have expired or is invalid."}
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center h-10 px-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
