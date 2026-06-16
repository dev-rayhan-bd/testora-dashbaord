import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export interface ValidationSummaryData {
  totalRows: number;
  validRows: number;
  warnings: Array<{ row: number; level: string; message: string; field?: string }>;
  errors: Array<{ row: number; level: string; message: string; field?: string }>;
}

type Props = {
  summary: ValidationSummaryData;
};

export default function ValidationSummarySection({ summary }: Props) {
  const { totalRows, validRows, warnings, errors } = summary;
  const warningsCount = warnings?.length ?? 0;
  const errorsCount = errors?.length ?? 0;

  const allIssues = [
    ...(errors || []).map((e) => ({ ...e, severity: "error" as const })),
    ...(warnings || []).map((w) => ({ ...w, severity: "warning" as const })),
  ];

  return (
    <section className="space-y-3">
      {/* Title */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[#3f5f7a]">Validation Summary</h3>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[#dce7f2] bg-white p-3">
          <p className="text-[10px] font-semibold tracking-wide text-[#90a3b6] uppercase">
            Total Rows
          </p>
          <p className="mt-1 text-2xl font-bold text-[#3f5f7a]">{totalRows}</p>
        </div>
        <div className="rounded-lg border border-[#d0ecd9] bg-[#f0fbf5] p-3">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#3ea666]" />
            <p className="text-[10px] font-semibold tracking-wide text-[#3ea666] uppercase">
              Valid
            </p>
          </div>
          <p className="mt-1 text-2xl font-bold text-[#2d7a52]">{validRows}</p>
        </div>
        <div className="rounded-lg border border-[#f0dfb9] bg-[#fffbea] p-3">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-[#c48a2e]" />
            <p className="text-[10px] font-semibold tracking-wide text-[#c48a2e] uppercase">
              Warnings
            </p>
          </div>
          <p className="mt-1 text-2xl font-bold text-[#9a6820]">{warningsCount}</p>
        </div>
        <div className="rounded-lg border border-[#f4d7d7] bg-[#fdeeee] p-3">
          <div className="flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5 text-[#db6f6f]" />
            <p className="text-[10px] font-semibold tracking-wide text-[#db6f6f] uppercase">
              Errors
            </p>
          </div>
          <p className="mt-1 text-2xl font-bold text-[#b04040]">{errorsCount}</p>
        </div>
      </div>

      {/* Issue list */}
      {allIssues.length > 0 && (
        <div className="rounded-lg border border-[#dce7f2] bg-white p-4">
          <h4 className="mb-3 text-xs font-semibold text-[#3f5f7a]">
            Issues Detected ({allIssues.length})
          </h4>
          <div className="space-y-2">
            {allIssues.map((issue, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-2.5 rounded-md border p-2.5 text-xs",
                  issue.severity === "error"
                    ? "border-[#f4d7d7] bg-[#fdf5f5]"
                    : "border-[#f0dfb9] bg-[#fffbea]"
                )}
              >
                {issue.severity === "error" ? (
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#db6f6f]" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#c48a2e]" />
                )}
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "font-semibold",
                      issue.severity === "error" ? "text-[#b04040]" : "text-[#8a6120]"
                    )}
                  >
                    Row {issue.row} {issue.field ? `· ${issue.field}` : ""}
                  </span>
                  <span
                    className={cn(
                      "ml-1.5",
                      issue.severity === "error" ? "text-[#c05050]" : "text-[#9a6820]"
                    )}
                  >
                    — {issue.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
