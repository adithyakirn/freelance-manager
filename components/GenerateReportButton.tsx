"use client";

import { useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";

interface ReportData {
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  pendingProjects: number;
  totalReceived: number;
  totalPending: number;
  totalValue: number;
  collectionRate: number;
  clientSources: Record<string, number>;
  workTypes: Record<string, number>;
  revenueByWorkType: Record<string, number>;
}

interface GenerateReportButtonProps {
  reportData: ReportData;
}

function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatLabel(value: string | null) {
  if (!value) return "Not specified";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function GenerateReportButton({
  reportData,
}: GenerateReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<"csv" | "text">("csv");

  const generateCSVReport = () => {
    const rows = [
      ["FREELANCE BUSINESS REPORT"],
      [
        `Generated on: ${new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      ],
      [""],
      ["=== PROJECT OVERVIEW ==="],
      ["Metric", "Value"],
      ["Total Projects", reportData.totalProjects.toString()],
      ["Completed Projects", reportData.completedProjects.toString()],
      ["Ongoing Projects", reportData.ongoingProjects.toString()],
      ["Pending Projects", reportData.pendingProjects.toString()],
      [""],
      ["=== FINANCIAL SUMMARY ==="],
      ["Metric", "Value"],
      ["Total Revenue Received", formatCurrency(reportData.totalReceived)],
      ["Pending Payments", formatCurrency(reportData.totalPending)],
      ["Total Project Value", formatCurrency(reportData.totalValue)],
      ["Collection Rate", `${reportData.collectionRate.toFixed(1)}%`],
      [""],
      ["=== CLIENT SOURCES ==="],
      ["Source", "Count", "Percentage"],
    ];

    // Add client sources
    Object.entries(reportData.clientSources).forEach(([source, count]) => {
      const percentage = ((count / reportData.totalProjects) * 100).toFixed(1);
      rows.push([formatLabel(source), count.toString(), `${percentage}%`]);
    });

    rows.push([""]);
    rows.push(["=== WORK TYPES ==="]);
    rows.push(["Type", "Count", "Revenue"]);

    // Add work types with revenue
    Object.entries(reportData.workTypes).forEach(([type, count]) => {
      const revenue = reportData.revenueByWorkType[type] || 0;
      rows.push([formatLabel(type), count.toString(), formatCurrency(revenue)]);
    });

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    return csvContent;
  };

  const generateTextReport = () => {
    const lines = [
      "╔════════════════════════════════════════════════════════════════╗",
      "║              FREELANCE BUSINESS REPORT                        ║",
      "╚════════════════════════════════════════════════════════════════╝",
      "",
      `Generated on: ${new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "                    📊 PROJECT OVERVIEW",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `  Total Projects:     ${reportData.totalProjects}`,
      `  ├─ Completed:       ${reportData.completedProjects}`,
      `  ├─ Ongoing:         ${reportData.ongoingProjects}`,
      `  └─ Pending:         ${reportData.pendingProjects}`,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "                    💰 FINANCIAL SUMMARY",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      `  Total Revenue:      ${formatCurrency(reportData.totalReceived)}`,
      `  Pending Payments:   ${formatCurrency(reportData.totalPending)}`,
      `  Total Value:        ${formatCurrency(reportData.totalValue)}`,
      `  Collection Rate:    ${reportData.collectionRate.toFixed(1)}%`,
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "                    👥 CLIENT SOURCES",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
    ];

    // Add client sources
    Object.entries(reportData.clientSources).forEach(([source, count]) => {
      const percentage = ((count / reportData.totalProjects) * 100).toFixed(1);
      lines.push(
        `  ${formatLabel(source).padEnd(20)} ${count.toString().padStart(3)} projects (${percentage}%)`,
      );
    });

    lines.push("");
    lines.push(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );
    lines.push("                    💼 WORK TYPES & REVENUE");
    lines.push(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );
    lines.push("");

    // Add work types with revenue
    Object.entries(reportData.workTypes).forEach(([type, count]) => {
      const revenue = reportData.revenueByWorkType[type] || 0;
      lines.push(
        `  ${formatLabel(type).padEnd(20)} ${count.toString().padStart(3)} projects → ${formatCurrency(revenue)}`,
      );
    });

    lines.push("");
    lines.push(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );
    lines.push("                    Generated by FreelanceMgr");
    lines.push(
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    );

    return lines.join("\n");
  };

  const handleDownload = async () => {
    setIsGenerating(true);

    // Small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    const content =
      reportType === "csv" ? generateCSVReport() : generateTextReport();
    const fileExtension = reportType === "csv" ? "csv" : "txt";
    const mimeType = reportType === "csv" ? "text/csv" : "text/plain";

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `freelance-report-${new Date().toISOString().split("T")[0]}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Report Type Selector */}
      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
        <button
          onClick={() => setReportType("csv")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            reportType === "csv"
              ? "bg-[#D53231] text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          CSV
        </button>
        <button
          onClick={() => setReportType("text")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            reportType === "text"
              ? "bg-[#D53231] text-white"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Text
        </button>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="btn-primary flex items-center gap-2 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Report
          </>
        )}
      </button>
    </div>
  );
}
