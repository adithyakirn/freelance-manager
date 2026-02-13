import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";
import { ThemeProvider } from "@/components/theme-provider";

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
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          poppins.variable,
          "min-h-screen bg-background font-sans antialiased text-foreground",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Background Glow Effects */}
          <div className="bg-glow" />
          <div className="bg-glow-secondary" />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
