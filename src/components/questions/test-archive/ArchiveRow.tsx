"use client";

import { cn } from "@/lib/utils";
import type { TestArchiveItem } from "@/store/apis";
import { Check, Copy, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  row: TestArchiveItem;
  serialNumber: number;
  onView: (row: TestArchiveItem) => void;
  onEdit: (row: TestArchiveItem) => void;
  onDuplicate: (row: TestArchiveItem) => void;
  onDelete: (row: TestArchiveItem) => void;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onRestore?: (row: TestArchiveItem) => void;
  onPermanentDelete?: (row: TestArchiveItem) => void;
}

export default function ArchiveRow({
  row,
  serialNumber,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  isSelected,
  onSelect,
  onRestore,
  onPermanentDelete,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!row.testCode) return;
    try {
      await navigator.clipboard.writeText(row.testCode);
      setCopied(true);
      toast.success(`Copied test code: ${row.testCode}`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy test code");
    }
  };

  const examTypeLabel =
    row.examType === "matura"
      ? "Matura"
      : row.examType === "semi_matura"
      ? "Semimatura"
      : row.examType === "provime"
      ? "Entrance Exam"
      : row.examType;

  const subjectFacultyLabel =
    row.subjectName ||
    (typeof row.subject === "object" ? row.subject?.name : null) ||
    row.facultyName ||
    (typeof row.faculty === "object" ? row.faculty?.name : null) ||
    "—";

  const questionCount =
    typeof row.totalQuestions === "number"
      ? row.totalQuestions
      : Array.isArray(row.questionIds)
      ? row.questionIds.length
      : 0;

  return (
    <tr className={cn("group border-b border-[#e9eff6] text-xs text-[#526a82] transition-colors hover:bg-[#f6faff]", isSelected && "bg-[#f5f9fd]")}>
      {/* Checkbox */}
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect?.(row._id)}
          className="h-3.5 w-3.5 rounded border-[#dce7f2] accent-[#2563eb] cursor-pointer"
        />
      </td>

      {/* 1. Index */}
      <td className="px-4 py-3 font-semibold text-[#1e6fbe]">{serialNumber}</td>

      {/* 2. Title & Test Code */}
      <td className="max-w-[240px] px-4 py-3">
        <div className="font-semibold text-[#29425a] line-clamp-1">{row.title}</div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded bg-[#eef4fb] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#2d6fa8]">
            {row.testCode || "NO-CODE"}
            <button
              type="button"
              onClick={handleCopyCode}
              aria-label="Copy test code"
              className="text-[#6d8fae] hover:text-[#1e6fbe]"
            >
              {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </span>
        </div>
      </td>

      {/* 3. Exam Type */}
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium border",
            row.examType === "provime"
              ? "border-purple-200 bg-purple-50 text-purple-700"
              : row.examType === "matura"
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-teal-200 bg-teal-50 text-teal-700"
          )}
        >
          {examTypeLabel}
        </span>
      </td>

      {/* 4. Year */}
      <td className="px-4 py-3 font-mono font-medium text-[#4f6b84]">{row.year}</td>

      {/* 5. Subject / Faculty */}
      <td className="max-w-[150px] truncate px-4 py-3 text-[#405c75]">
        {subjectFacultyLabel}
      </td>

      {/* 6. Test Type */}
      <td className="px-4 py-3">
        <span
          className={cn(
            "rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize",
            row.testType === "additional"
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-sky-200 bg-sky-50 text-sky-700"
          )}
        >
          {row.testType || "official"}
        </span>
      </td>

      {/* 7. Access */}
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium capitalize",
            row.access === "premium"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-slate-200 bg-slate-50 text-slate-700"
          )}
        >
          {row.access === "premium" ? "★ Premium" : "Free"}
        </span>
      </td>

      {/* 8. Questions Count */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center justify-center rounded-full bg-[#ebf3fc] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1e6fbe]">
          {questionCount}
        </span>
      </td>

      {/* 9. Status */}
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize",
            row.status === "published"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : row.status === "draft"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-slate-200 bg-slate-100 text-slate-600"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              row.status === "published"
                ? "bg-emerald-500"
                : row.status === "draft"
                ? "bg-amber-500"
                : "bg-slate-400"
            )}
          />
          {row.status || "published"}
        </span>
      </td>

      {/* 10. Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="View Questions"
            onClick={() => onView(row)}
            className="rounded p-1 text-[#6a849d] hover:bg-[#ebf3fb] hover:text-[#1e6fbe] transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          
          {row.status === "archived" ? (
            <>
              {onRestore && (
                <button
                  type="button"
                  title="Restore Test"
                  onClick={() => onRestore(row)}
                  className="rounded p-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              )}
              {onPermanentDelete && (
                <button
                  type="button"
                  title="Permanent Delete"
                  onClick={() => onPermanentDelete(row)}
                  className="rounded p-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                title="Edit Test"
                onClick={() => onEdit(row)}
                className="rounded p-1 text-[#6a849d] hover:bg-[#ebf3fb] hover:text-[#1e6fbe] transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Duplicate Test"
                onClick={() => onDuplicate(row)}
                className="rounded p-1 text-[#6a849d] hover:bg-[#ebf3fb] hover:text-[#1e6fbe] transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Archive Test"
                onClick={() => onDelete(row)}
                className="rounded p-1 text-[#b55858] hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
