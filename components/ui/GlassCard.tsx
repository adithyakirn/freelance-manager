"use client";

import { cn } from "@/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noPadding?: boolean;
  variant?: "default" | "featured";
}

export function GlassCard({
  children,
  className,
  hoverEffect = false,
  noPadding = false,
  variant = "default",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-card",
        variant === "featured" && "card-featured",
        // Ensure background is solid for default cards if not strictly set in CSS
        variant === "default" && "bg-[#000000]",
        !noPadding && "p-6",
        hoverEffect && "cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
