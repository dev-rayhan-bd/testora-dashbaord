"use client";

import { AlertTriangle, CheckCircle, EyeOff, FileText, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { QuestionListItem } from "@/store/apis";

interface StatusModalProps {
  open: boolean;
  question: QuestionListItem | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (status: "published" | "draft" | "hidden" | "archived") => void;
}

export function QuestionStatusModal({
  open,
  question,
  isLoading = false,
  onClose,
  onConfirm,
}: StatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<"published" | "draft" | "hidden" | "archived">(
    (question?.status as "published" | "draft" | "hidden" | "archived") || "published"
  );

  if (!open || !question) return null;

  const statuses: {
    value: "published" | "draft" | "hidden" | "archived";
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }[] = [
    {
      value: "published",
      label: "Published",
      desc: "Live and accessible to students in tests and practice.",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      value: "draft",
      label: "Draft",
      desc: "Under review or creation. Inaccessible to students.",
      icon: FileText,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      value: "hidden",
      label: "Hidden",
      desc: "Temporarily excluded from active tests and quiz generation.",
      icon: EyeOff,
      color: "text-slate-600 bg-slate-50 border-slate-200",
    },
    {
      value: "archived",
      label: "Archived",
      desc: "Retained for historical records only.",
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-[#2f4256]">Update Question Status</h3>
            <p className="text-xs text-[#7e95ab]">
              Change visibility and publication state
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-[#8ea1b5] transition-colors hover:bg-[#f4f8fc] hover:text-[#3f5f7a] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2.5 p-5">
          {statuses.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedStatus === s.value;
            return (
              <div
                key={s.value}
                onClick={() => setSelectedStatus(s.value)}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                  isSelected
                    ? "border-[#6da5e0] bg-[#eef6fd] ring-1 ring-[#6da5e0]/30 shadow-xs"
                    : "border-[#dce7f2] bg-white hover:border-[#cbdff2] hover:bg-[#fcfdfe]"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${s.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#344f6a]">{s.label}</p>
                  <p className="text-[11px] text-[#7e95ab]">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194] transition-colors hover:bg-[#f5f9fd] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(selectedStatus)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              "Confirm Status"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  open: boolean;
  question: QuestionListItem | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteQuestionModal({
  open,
  question,
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#f5c6cb] bg-white shadow-2xl">
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Delete Question</h3>
              <p className="text-xs text-rose-600">
                This action is destructive and cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-[#8ea1b5] transition-colors hover:bg-[#f4f8fc] hover:text-[#3f5f7a] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-4">
          <div className="rounded-xl border border-[#e8edf2] bg-[#f8fbff] p-3 text-xs text-[#4f6d87]">
            <p className="line-clamp-2 font-medium text-[#2d4256]">
              &ldquo;{question.questionText}&rdquo;
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-[#869ab0]">
              <span className="capitalize">{question.examType}</span>
              <span>•</span>
              <span>Year {question.year}</span>
              <span>•</span>
              <span>{question.subjectName || question.facultyName || "General"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194] transition-colors hover:bg-[#f5f9fd] disabled:opacity-50"
          >
            Keep Question
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-rose-700 active:scale-95 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
