"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export interface ValidationIssueItem {
  row?: number;
  rowNumber?: number;
  level?: string;
  field?: string;
  message: string;
  severity?: "error" | "warning";
}

export interface ValidationSummaryData {
  totalRows?: number;
  validRows?: number;
  warnings?: ValidationIssueItem[];
  errors?: ValidationIssueItem[];
  issues?: ValidationIssueItem[];
}

type Props = {
  summary: ValidationSummaryData;
};

export default function ValidationSummarySection({ summary }: Props) {
  const errorsList: ValidationIssueItem[] = [
    ...(summary.errors || []).map((e) => ({ ...e, severity: "error" as const })),
    ...(summary.issues || []).map((i) => ({ ...i, severity: "error" as const })),
  ];
  const warningsList: ValidationIssueItem[] = (summary.warnings || []).map((w) => ({
    ...w,
    severity: "warning" as const,
  }));

  const allIssues = [...errorsList, ...warningsList];
  const totalRows = summary.totalRows ?? (allIssues.length > 0 ? allIssues.length : 0);
  const validRows = summary.validRows ?? Math.max(0, totalRows - errorsList.length);

  return (
    <section className="space-y-3.5">
      {/* Title */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-[#273d52]">Import Validation Results</h3>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-2xs">
          <p className="text-[10px] font-bold tracking-wider text-[#8da2b5] uppercase">
            Total Rows
          </p>
          <p className="mt-1 text-2xl font-extrabold text-[#273d52]">{totalRows}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase">
              Valid Questions
            </p>
          </div>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{validRows}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <p className="text-[10px] font-bold tracking-wider text-amber-700 uppercase">
              Warnings
            </p>
          </div>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">{warningsList.length}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            <p className="text-[10px] font-bold tracking-wider text-rose-700 uppercase">
              Issues Found
            </p>
          </div>
          <p className="mt-1 text-2xl font-extrabold text-rose-700">{errorsList.length}</p>
        </div>
      </div>

      {/* Issue list */}
      {allIssues.length > 0 && (
        <div className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-2xs">
          <h4 className="mb-3 text-xs font-bold text-[#273d52]">
            Detected Issues ({allIssues.length})
          </h4>
          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {allIssues.map((issue, i) => {
              const rowNum = issue.rowNumber ?? issue.row;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg border p-2.5 text-xs transition-colors",
                    issue.severity === "error"
                      ? "border-rose-200 bg-[#fff5f5]"
                      : "border-amber-200 bg-[#fffbea]"
                  )}
                >
                  {issue.severity === "error" ? (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "font-bold",
                        issue.severity === "error" ? "text-rose-800" : "text-amber-800"
                      )}
                    >
                      {rowNum !== undefined ? `Row ${rowNum}` : "General"}
                      {issue.field ? ` · Field: ${issue.field}` : ""}
                    </span>
                    <span
                      className={cn(
                        "ml-1.5",
                        issue.severity === "error" ? "text-rose-700" : "text-amber-700"
                      )}
                    >
                      — {issue.message}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
