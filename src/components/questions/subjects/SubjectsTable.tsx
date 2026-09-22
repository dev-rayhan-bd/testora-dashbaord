"use client";

import { Edit2, HelpCircle, Layers, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubjectItem } from "@/store/apis";

interface Props {
  subjects: SubjectItem[];
  isLoading: boolean;
  onEdit: (subject: SubjectItem) => void;
  onDelete: (subject: SubjectItem) => void;
}

export function examTypeBadgeClass(examType: string) {
  const t = examType?.toLowerCase() || "";
  if (t === "matura") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }
  if (t === "semi_matura" || t === "semimatura") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (t === "provime" || t.includes("entrance")) {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function formatExamTypeName(examType: string) {
  const t = examType?.toLowerCase() || "";
  if (t === "matura") return "Matura";
  if (t === "semi_matura" || t === "semimatura") return "Semimatura";
  if (t === "provime") return "Entrance (Provime)";
  return examType;
}

export default function SubjectsTable({
  subjects,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-[#e5eff8] bg-[#f5f9fd] text-[11px] font-semibold tracking-wider text-[#637d96] uppercase">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Subject Name</th>
                <th className="px-4 py-3.5">Exam Type</th>
                <th className="px-4 py-3.5">Requirement</th>
                <th className="px-4 py-3.5 text-center">Questions</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ecf2f8]">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="h-4 w-6 rounded bg-[#e8f0f8]" />
                  </td>
                  <td className="px-4 py-4 space-y-1.5">
                    <div className="h-4 w-36 rounded bg-[#e8f0f8]" />
                    <div className="h-3 w-48 rounded bg-[#e8f0f8]/60" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-20 rounded-md bg-[#e8f0f8]" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 w-20 rounded-md bg-[#e8f0f8]" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="mx-auto h-5 w-16 rounded-md bg-[#e8f0f8]" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-16 rounded bg-[#e8f0f8]" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="ml-auto h-7 w-16 rounded bg-[#e8f0f8]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#dce7f2] bg-white p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6e5f4] bg-[#edf4fb] text-[#2563eb]">
          <Layers className="h-6 w-6" />
        </div>
        <h4 className="mt-3.5 text-sm font-bold text-[#273d52]">No Subjects Found</h4>
        <p className="mt-1 max-w-sm text-xs text-[#71889e]">
          No academic subjects match your active search filters. Try changing or clearing your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="border-b border-[#e5eff8] bg-[#f5f9fd] text-[11px] font-semibold tracking-wider text-[#637d96] uppercase">
            <tr>
              <th className="px-4 py-3.5 w-12">#</th>
              <th className="px-4 py-3.5">Subject Name</th>
              <th className="px-4 py-3.5">Exam Type</th>
              <th className="px-4 py-3.5">Category / Requirement</th>
              <th className="px-4 py-3.5 text-center">Questions</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ecf2f8]">
            {subjects.map((subject, index) => {
              const eng = subject.nameInEnglish?.trim() || "";
              const alb = subject.nameInAlbanian?.trim() || "";
              const hasTranslations = eng || alb;
              const qCount = subject.questionCount ?? 0;
              const isElective = Boolean(subject.isElective);
              const isActive = subject.isActive !== false;

              return (
                <tr
                  key={subject._id}
                  className="transition-colors hover:bg-[#f9fcff]"
                >
                  {/* # Index */}
                  <td className="px-4 py-3.5 text-xs font-semibold text-[#8ba3b9]">
                    {index + 1}
                  </td>

                  {/* Subject Name & Translations */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#273d52]">
                        {subject.name}
                      </span>
                      <span className="text-xs text-[#71889e]">
                        {hasTranslations ? (
                          <>
                            English: <span className="text-[#48637e]">{eng || "—"}</span>
                            {" • "}
                            AL: <span className="text-[#48637e]">{alb || "—"}</span>
                          </>
                        ) : (
                          <span className="text-[#a4b8cc] italic">No translations provided</span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Exam Type Badge */}
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold",
                        examTypeBadgeClass(subject.examType)
                      )}
                    >
                      {formatExamTypeName(subject.examType)}
                    </span>
                  </td>

                  {/* Requirement (Mandatory / Elective) */}
                  <td className="px-4 py-3.5">
                    {isElective ? (
                      <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        Elective
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        Mandatory
                      </span>
                    )}
                  </td>

                  {/* Questions Count */}
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#d6e5f4] bg-[#edf4fb] px-2.5 py-0.5 text-xs font-bold text-[#2563eb]">
                      <HelpCircle className="h-3 w-3 text-[#2563eb]/70" />
                      {qCount} {qCount === 1 ? "Question" : "Questions"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          isActive ? "bg-emerald-500 ring-2 ring-emerald-100" : "bg-slate-400"
                        )}
                      />
                      <span className="text-xs font-semibold text-[#48637e]">
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit(subject)}
                        title="Edit Subject"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dce7f2] bg-white text-[#48637e] transition-colors hover:border-[#2563eb] hover:bg-[#edf4fb] hover:text-[#2563eb]"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(subject)}
                        title="Delete Subject"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#dce7f2] bg-white text-[#48637e] transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
