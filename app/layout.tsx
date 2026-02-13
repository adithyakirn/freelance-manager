import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";

// Body & Display font - Poppins (used throughout)
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Freelance Manager",
  description: "Manage your freelance business with style",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          poppins.variable,
          "min-h-screen bg-background font-sans antialiased text-foreground",
        )}
      >
        {/* Background Glow Effects */}
        <div className="bg-glow" />
        <div className="bg-glow-secondary" />

        {children}
      </body>
    </html>
  );
}
