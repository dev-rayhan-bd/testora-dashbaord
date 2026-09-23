"use client";

import Pagination from "@/components/users/Pagination";
import { cn } from "@/lib/utils";
import {
  useDeleteQuestionMutation,
  useGetMetaFiltersQuery,
  useGetQuestionsQuery,
  useLazyGetSingleQuestionQuery,
  useUpdateQuestionStatusMutation,
  useRestoreQuestionMutation,
  usePermanentDeleteQuestionMutation,
  useBulkArchiveQuestionsMutation,
  useBulkRestoreQuestionsMutation,
  useBulkPermanentDeleteQuestionsMutation,
  type QuestionListItem,
  type SingleQuestionResponse,
} from "@/store/apis";
import {
  BookOpen,
  CheckCircle,
  Edit2,
  Eye,
  FileQuestion,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AddEditQuestionModal from "./AddEditQuestionModal";
import { DeleteQuestionModal, QuestionStatusModal } from "./QuestionActionModals";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";

const STATUS_TABS = [
  { label: "All", value: "All" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Hidden", value: "hidden" },
  { label: "Archived", value: "archived" },
];

function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === "published") return "border-[#c8ebd4] bg-[#edf8f2] text-[#16a34a]";
  if (s === "draft") return "border-[#fedac2] bg-[#fff3ec] text-[#ea580c]";
  if (s === "hidden") return "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";
  return "border-[#fcccd8] bg-[#fef0f4] text-[#e11d48]";
}

function accessBadgeClass(access: string) {
  return access === "premium"
    ? "border-[#fde68a] bg-[#fef3c7] text-[#b45309]"
    : "border-[#d1fae5] bg-[#ecfdf5] text-[#047857]";
}

function categoryBadgeClass(examType: string) {
  const t = examType.toLowerCase();
  if (t === "matura") return "border-[#d6e5f4] bg-[#eaf2fb] text-[#2563eb]";
  if (t === "semi_matura" || t === "semimatura") return "border-[#dce4f6] bg-[#edf0fb] text-[#6366f1]";
  if (t === "provime" || t.includes("entrance")) return "border-[#d5ece5] bg-[#e9f5f1] text-[#059669]";
  return "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SingleQuestionModal({
  open,
  question,
  onClose,
}: {
  open: boolean;
  question: SingleQuestionResponse | null;
  onClose: () => void;
}) {
  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-6 py-4">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase",
                categoryBadgeClass(question.examType)
              )}
            >
              {question.examType}
            </span>
            <span className="text-xs font-semibold text-[#8299af]">Year {question.year}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#8ea1b5] transition-colors hover:bg-[#f4f8fc] hover:text-[#3f5f7a]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {/* Question text */}
          <div>
            <p className="text-xs font-bold text-[#869cb0] uppercase">Question Prompt</p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-[#2f4256]">
              {question.questionText}
            </p>
          </div>

          {/* Diagram image if present */}
          {question.questionImageUrl && (
            <div className="overflow-hidden rounded-xl border border-[#dce7f2] bg-slate-50 p-2">
              <Image
                src={question.questionImageUrl}
                alt="Question Diagram"
                width={400}
                height={200}
                className="mx-auto max-h-56 object-contain"
              />
            </div>
          )}

          {/* Options */}
          <div>
            <p className="mb-2 text-xs font-bold text-[#869cb0] uppercase">Answer Options</p>
            <div className="space-y-1.5">
              {question.options.map((opt, idx) => {
                const isCorrect = question.correctOptionIndex === idx;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2 text-xs",
                      isCorrect
                        ? "border-[#8bd2a4] bg-[#edf8f2] font-semibold text-[#15803d]"
                        : "border-[#e3edf7] bg-[#f8fbff] text-[#4f6d87]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                        isCorrect ? "bg-[#15803d] text-white" : "bg-slate-200 text-slate-700"
                      )}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {isCorrect && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#15803d]">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Correct Answer
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="rounded-xl border border-[#cfe1f5] bg-[#edf6fe] p-3.5">
              <p className="text-[11px] font-bold text-[#2368af] uppercase">Solution Explanation</p>
              <p className="mt-1 text-xs text-[#35618b] leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          {question.stats && (
            <div className="grid grid-cols-4 gap-2 rounded-xl border border-[#dce7f2] bg-[#f8fbff] p-3 text-center">
              <div>
                <p className="text-[10px] text-[#869cb0] uppercase font-bold">Attempts</p>
                <p className="text-sm font-bold text-[#2f4256]">{question.stats.totalAttempts}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#869cb0] uppercase font-bold">Correct</p>
                <p className="text-sm font-bold text-emerald-600">{question.stats.correctCount}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#869cb0] uppercase font-bold">Wrong</p>
                <p className="text-sm font-bold text-rose-600">{question.stats.wrongCount}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#869cb0] uppercase font-bold">Accuracy</p>
                <p className="text-sm font-bold text-blue-600">
                  {question.stats.correctPercentage}%
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-[#e6edf5] px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QuestionBankPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [examTypeFilter, setExamTypeFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [facultyFilter, setFacultyFilter] = useState("All");
  const [accessFilter, setAccessFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Debounce search by 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSelectedIds([]);
  }, [page, statusTab, examTypeFilter, yearFilter, subjectFilter, facultyFilter, accessFilter, difficultyFilter, debouncedSearch]);

  // Meta filters query
  const { data: metaData } = useGetMetaFiltersQuery();
  const meta = metaData?.data;

  // Questions query
  const queryParams = useMemo(() => {
    const p: {
      page: number;
      limit: number;
      searchTerm?: string;
      status?: string;
      examType?: string;
      year?: string;
      subjectName?: string;
      facultyName?: string;
      access?: string;
      difficultyLevel?: string;
    } = { page, limit };

    if (debouncedSearch.trim()) p.searchTerm = debouncedSearch.trim();
    if (statusTab !== "All") p.status = statusTab;
    if (examTypeFilter !== "All") p.examType = examTypeFilter;
    if (yearFilter !== "All") p.year = yearFilter;
    if (subjectFilter !== "All") p.subjectName = subjectFilter;
    if (facultyFilter !== "All") p.facultyName = facultyFilter;
    if (accessFilter !== "All") p.access = accessFilter;
    if (difficultyFilter !== "All") p.difficultyLevel = difficultyFilter;

    return p;
  }, [
    page,
    limit,
    debouncedSearch,
    statusTab,
    examTypeFilter,
    yearFilter,
    subjectFilter,
    facultyFilter,
    accessFilter,
    difficultyFilter,
  ]);

  const { data, isLoading, isFetching } = useGetQuestionsQuery(queryParams);

  // Mutations
  const [triggerGetSingleQuestion] = useLazyGetSingleQuestionQuery();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateQuestionStatusMutation();
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();
  const [restoreQuestion] = useRestoreQuestionMutation();
  const [permanentDeleteQuestion] = usePermanentDeleteQuestionMutation();
  const [bulkArchiveQuestions, { isLoading: isBulkArchiving }] = useBulkArchiveQuestionsMutation();
  const [bulkRestoreQuestions, { isLoading: isBulkRestoring }] = useBulkRestoreQuestionsMutation();
  const [bulkPermanentDeleteQuestions, { isLoading: isBulkDeleting }] = useBulkPermanentDeleteQuestionsMutation();
  
  const isBulkLoading = isBulkArchiving || isBulkRestoring || isBulkDeleting;

  // Modals state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionListItem | null>(null);
  const [statusTargetQuestion, setStatusTargetQuestion] = useState<QuestionListItem | null>(null);
  const [deleteTargetQuestion, setDeleteTargetQuestion] = useState<QuestionListItem | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<SingleQuestionResponse | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [deleteConfirmParams, setDeleteConfirmParams] = useState<{ type: "single" | "bulk", id?: string } | null>(null);

  const questions = data?.data ?? [];
  const totalQuestions = data?.meta?.total ?? 0;

  const toggleSelectAll = () => {
    if (selectedIds.length === questions.length && questions.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map((q) => q._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenViewModal = async (questionId: string) => {
    try {
      const res = await triggerGetSingleQuestion(questionId).unwrap();
      setViewingQuestion(res.data);
    } catch {
      toast.error("Failed to load question details");
    }
  };

  const handleBulkArchive = async () => {
    if (!selectedIds.length) return;
    try {
      await bulkArchiveQuestions({ questionIds: selectedIds }).unwrap();
      toast.success(`${selectedIds.length} questions archived`);
      setSelectedIds([]);
    } catch {
      toast.error("Failed to archive questions");
    }
  };

  const handleBulkRestore = async () => {
    if (!selectedIds.length) return;
    try {
      await bulkRestoreQuestions({ questionIds: selectedIds, targetStatus: "published" }).unwrap();
      toast.success(`${selectedIds.length} questions restored to published state`);
      setSelectedIds([]);
    } catch {
      toast.error("Failed to restore questions");
    }
  };

  const handleBulkPermanentDelete = async () => {
    if (!selectedIds.length) return;
    setDeleteConfirmParams({ type: "bulk" });
  };
  
  const executeBulkPermanentDelete = async () => {
    if (!selectedIds.length) return;
    try {
      await bulkPermanentDeleteQuestions({ questionIds: selectedIds }).unwrap();
      toast.success(`${selectedIds.length} questions permanently deleted`);
      setSelectedIds([]);
      setDeleteConfirmParams(null);
    } catch {
      toast.error("Failed to permanently delete questions");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreQuestion(id).unwrap();
      toast.success("Question restored successfully");
    } catch {
      toast.error("Failed to restore question");
    }
  };

  const handlePermanentDelete = (id: string) => {
    setDeleteConfirmParams({ type: "single", id });
  };
  
  const executePermanentDelete = async (id: string) => {
    try {
      await permanentDeleteQuestion(id).unwrap();
      toast.success("Question permanently deleted");
      setDeleteConfirmParams(null);
    } catch {
      toast.error("Failed to permanently delete question");
    }
  };

  const handleConfirmStatusChange = async (
    newStatus: "published" | "draft" | "hidden" | "archived"
  ) => {
    if (!statusTargetQuestion) return;
    try {
      await updateStatus({
        questionId: statusTargetQuestion._id,
        status: newStatus,
      }).unwrap();
      toast.success(`Question status updated to ${newStatus}`);
      setStatusTargetQuestion(null);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to update status";
      toast.error(msg);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetQuestion) return;
    try {
      await deleteQuestion(deleteTargetQuestion._id).unwrap();
      toast.success("Question deleted successfully");
      setDeleteTargetQuestion(null);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to delete question";
      toast.error(msg);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusTab("All");
    setExamTypeFilter("All");
    setYearFilter("All");
    setSubjectFilter("All");
    setFacultyFilter("All");
    setAccessFilter("All");
    setDifficultyFilter("All");
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch.length > 0 ||
    statusTab !== "All" ||
    examTypeFilter !== "All" ||
    yearFilter !== "All" ||
    subjectFilter !== "All" ||
    facultyFilter !== "All" ||
    accessFilter !== "All" ||
    difficultyFilter !== "All";

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#2f4256]">Question Bank</h2>
          <p className="text-xs text-[#7e95ab]">
            Centralized questions repository with multi-criteria filtering and instant authoring
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingQuestion(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#1d4ed8] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>
      </section>

      {/* Status Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#dce7f2] bg-white p-1.5 shadow-xs">
        {STATUS_TABS.map((tab) => {
          const isActive = statusTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusTab(tab.value);
                setPage(1);
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                isActive
                  ? "bg-[#edf4fe] text-[#2563eb]"
                  : "text-[#627a92] hover:bg-[#f8fbff] hover:text-[#2f4256]"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Dynamic Filter Bar */}
      <section className="rounded-xl border border-[#dce7f2] bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          {/* Search Box */}
          <div className="relative min-w-64 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search question text, passage code, subject, faculty..."
              className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] pr-8 pl-9 text-xs text-[#3f5f7a] outline-none transition-colors placeholder:text-[#9ab0c3] focus:border-[#7fb3e8] focus:bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-[#9ab0c3] hover:text-[#3f5f7a]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Select Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Exam Type */}
            <label className="inline-flex items-center gap-1 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
              <span className="text-[#889fb4] font-medium">Exam:</span>
              <select
                value={examTypeFilter}
                onChange={(e) => {
                  setExamTypeFilter(e.target.value);
                  setSubjectFilter("All");
                  setFacultyFilter("All");
                  setPage(1);
                }}
                className="cursor-pointer bg-transparent text-xs font-semibold text-[#3f5f7a] outline-none"
              >
                <option value="All">All Exams</option>
                <option value="matura">Matura</option>
                <option value="semi_matura">Semimatura</option>
                <option value="provime">Entrance Exam</option>
              </select>
            </label>

            {/* Year */}
            <label className="inline-flex items-center gap-1 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
              <span className="text-[#889fb4] font-medium">Year:</span>
              <select
                value={yearFilter}
                onChange={(e) => {
                  setYearFilter(e.target.value);
                  setPage(1);
                }}
                className="cursor-pointer bg-transparent text-xs font-semibold text-[#3f5f7a] outline-none"
              >
                <option value="All">All Years</option>
                {(meta?.years ?? [2027, 2026, 2025, 2024, 2023, 2022]).map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </label>

            {/* Subject (for matura/semi_matura) */}
            {examTypeFilter !== "provime" && (
              <label className="inline-flex items-center gap-1 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
                <span className="text-[#889fb4] font-medium">Subject:</span>
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    setPage(1);
                  }}
                  className="cursor-pointer bg-transparent text-xs font-semibold text-[#3f5f7a] outline-none"
                >
                  <option value="All">All Subjects</option>
                  {(meta?.subjects ?? [])
                    .filter((s) => examTypeFilter === "All" || s.examType === examTypeFilter)
                    .map((s) => (
                      <option key={s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </label>
            )}

            {/* Faculty (for provime) */}
            {examTypeFilter === "provime" && (
              <label className="inline-flex items-center gap-1 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
                <span className="text-[#889fb4] font-medium">Faculty:</span>
                <select
                  value={facultyFilter}
                  onChange={(e) => {
                    setFacultyFilter(e.target.value);
                    setPage(1);
                  }}
                  className="cursor-pointer bg-transparent text-xs font-semibold text-[#3f5f7a] outline-none"
                >
                  <option value="All">All Faculties</option>
                  {(meta?.faculties ?? []).map((f) => (
                    <option key={f._id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {/* Access */}
            <label className="inline-flex items-center gap-1 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
              <span className="text-[#889fb4] font-medium">Access:</span>
              <select
                value={accessFilter}
                onChange={(e) => {
                  setAccessFilter(e.target.value);
                  setPage(1);
                }}
                className="cursor-pointer bg-transparent text-xs font-semibold text-[#3f5f7a] outline-none"
              >
                <option value="All">All</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </label>

            {/* Difficulty */}
            <label className="inline-flex items-center gap-1 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
              <span className="text-[#889fb4] font-medium">Difficulty:</span>
              <select
                value={difficultyFilter}
                onChange={(e) => {
                  setDifficultyFilter(e.target.value);
                  setPage(1);
                }}
                className="cursor-pointer bg-transparent text-xs font-semibold text-[#3f5f7a] outline-none"
              >
                <option value="All">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            {/* Reset button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-dashed border-[#cbdff2] bg-white px-2.5 text-xs font-medium text-[#5f7b96] transition-colors hover:bg-[#f3f8fd] hover:text-[#2563eb]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-semibold text-[#6d859c]">
          {totalQuestions} question{totalQuestions !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#b9d6f3] bg-[#edf6fd] p-3 shadow-sm transition-all">
          <p className="text-xs font-semibold text-[#1e6fbe]">
            {selectedIds.length} question(s) selected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-xs font-semibold text-[#587189] hover:bg-[#dcebf8] rounded-lg transition-colors"
            >
              Clear
            </button>
            {statusTab === "archived" ? (
              <>
                <button
                  disabled={isBulkLoading}
                  onClick={handleBulkRestore}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  Restore Selected
                </button>
                <button
                  disabled={isBulkLoading}
                  onClick={handleBulkPermanentDelete}
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
                >
                  Permanently Delete
                </button>
              </>
            ) : (
              <button
                disabled={isBulkLoading}
                onClick={handleBulkArchive}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700 disabled:opacity-50"
              >
                Archive Selected
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions Table */}
      <section className="overflow-hidden rounded-xl border border-[#dce7f2] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
              <tr>
                <th className="px-3.5 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === questions.length && questions.length > 0}
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-[#dce7f2] accent-[#2563eb] cursor-pointer"
                  />
                </th>
                <th className="px-3.5 py-3">SL</th>
                <th className="px-3.5 py-3">Exam Type</th>
                <th className="px-3.5 py-3">Year</th>
                <th className="px-3.5 py-3">Subject / Faculty</th>
                <th className="px-3.5 py-3">Access</th>
                <th className="px-3.5 py-3">Passage</th>
                <th className="px-3.5 py-3">Question Text</th>
                <th className="px-3.5 py-3">Correct Answer</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3">Created</th>
                <th className="px-3.5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading || isFetching ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={`skel-${idx}`} className="animate-pulse border-b border-[#ecf2f8]">
                    <td className="px-3.5 py-3.5"><div className="h-3.5 w-3.5 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-3 w-6 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-5 w-16 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-4 w-10 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-4 w-24 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-5 w-14 rounded-full bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-4 w-12 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-4 w-48 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-5 w-20 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-5 w-16 rounded-full bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-3 w-16 rounded bg-slate-200" /></td>
                    <td className="px-3.5 py-3.5"><div className="h-6 w-6 rounded bg-slate-200" /></td>
                  </tr>
                ))
              ) : questions.length > 0 ? (
                questions.map((q, idx) => {
                  const sl = (page - 1) * limit + idx + 1;
                  const correctText =
                    q.options?.[q.correctOptionIndex]?.text ||
                    q.correctAnswer ||
                    "Option " + String.fromCharCode(65 + (q.correctOptionIndex ?? 0));
                  const isLastRows = idx >= questions.length - 2;

                  return (
                    <tr
                      key={q._id}
                      className={cn("border-b border-[#ecf2f8] text-xs text-[#5e768e] transition-colors hover:bg-[#fcfdfe] last:border-b-0", selectedIds.includes(q._id) && "bg-[#f5f9fd]")}
                    >
                      {/* Checkbox */}
                      <td className="px-3.5 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(q._id)}
                          onChange={() => toggleSelectOne(q._id)}
                          className="h-3.5 w-3.5 rounded border-[#dce7f2] accent-[#2563eb] cursor-pointer"
                        />
                      </td>

                      {/* 1. SL */}
                      <td className="px-3.5 py-3 font-semibold text-[#8ca0b3]">{sl}</td>

                      {/* 2. EXAM TYPE */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span
                          className={cn(
                            "rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase",
                            categoryBadgeClass(q.examType)
                          )}
                        >
                          {q.examType}
                        </span>
                      </td>

                      {/* 3. YEAR */}
                      <td className="px-3.5 py-3 font-semibold text-[#405872]">{q.year}</td>

                      {/* 4. SUBJECT / FACULTY */}
                      <td className="px-3.5 py-3 whitespace-nowrap text-[#405872] font-medium">
                        {q.subjectName || 
                         (typeof q.subject === "string" ? meta?.subjects?.find(s => s._id === q.subject)?.name : q.subject?.name) || 
                         q.facultyName || 
                         (typeof q.faculty === "string" ? meta?.faculties?.find(f => f._id === q.faculty)?.name : q.faculty?.name) || 
                         "—"}
                      </td>

                      {/* 5. ACCESS */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span
                          className={cn(
                            "rounded-md border px-2 py-0.5 text-[10px] font-bold capitalize",
                            accessBadgeClass(q.access)
                          )}
                        >
                          {q.access}
                        </span>
                      </td>

                      {/* 6. PASSAGE CODE */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        {q.passageCode ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-[#dfd8f5] bg-[#f4f0fd] px-2 py-0.5 text-[10px] font-bold text-[#7c3aed]">
                            <BookOpen className="h-2.5 w-2.5" />
                            {q.passageCode}
                          </span>
                        ) : (
                          <span className="text-[#a4b5c6]">—</span>
                        )}
                      </td>

                      {/* 7. QUESTION TEXT */}
                      <td className="px-3.5 py-3 max-w-72">
                        <p className="line-clamp-2 font-medium text-[#2d4256] leading-snug">
                          {q.questionText}
                        </p>
                      </td>

                      {/* 8. CORRECT ANSWER */}
                      <td className="px-3.5 py-3">
                        <div className="max-w-44">
                          <span title={correctText} className="inline-block w-full truncate rounded-md border border-[#c8ebd4] bg-[#edf8f2] px-2 py-0.5 text-[11px] font-bold text-[#15803d]">
                            {correctText}
                          </span>
                        </div>
                      </td>

                      {/* 9. STATUS */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize",
                            statusBadgeClass(q.status)
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {q.status}
                        </span>
                      </td>

                      {/* 10. CREATED AT */}
                      <td className="px-3.5 py-3 whitespace-nowrap text-[#7f94a8]">
                        {formatDate(q.createdAt)}
                      </td>

                      {/* 11. ACTIONS */}
                      <td className="relative px-3.5 py-3">
                        <div className="relative inline-flex">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenActionMenuId(openActionMenuId === q._id ? null : q._id)
                            }
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[#7f95aa] transition-colors hover:bg-[#f8fbff] hover:text-[#2f4256]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {openActionMenuId === q._id && (
                            <div
                              className={cn(
                                "absolute right-0 z-50 w-44 rounded-xl border border-[#dce7f2] bg-white py-1.5 shadow-lg shadow-slate-200/50",
                                isLastRows ? "bottom-8" : "top-8"
                              )}
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  handleOpenViewModal(q._id);
                                  setOpenActionMenuId(null);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#4f6d87] transition-colors hover:bg-[#f8fbff]"
                              >
                                <Eye className="h-3.5 w-3.5 text-[#8fa2b5]" />
                                View Details
                              </button>
                              {q.status === "archived" ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleRestore(q._id);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-600 transition-colors hover:bg-[#ecfdf5]"
                                  >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Restore Question
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handlePermanentDelete(q._id);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-[#fff1f2]"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Permanent Delete
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingQuestion(q);
                                      setIsAddModalOpen(true);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#2563eb] transition-colors hover:bg-[#edf4fe]"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                    Edit Question
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setStatusTargetQuestion(q);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-[#d97706] transition-colors hover:bg-[#fffbeb]"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Change Status
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeleteTargetQuestion(q);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-[#fff1f2]"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Archive Question
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="px-5 py-14 text-center">
                    <div className="mx-auto flex flex-col items-center justify-center text-[#90a3b6]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0f4f9] text-[#7d93a8]">
                        <FileQuestion className="h-6 w-6" />
                      </div>
                      <p className="mt-3 text-sm font-bold text-[#4f6d87]">No questions found</p>
                      <p className="mt-1 text-xs text-[#90a3b6]">
                        Try adjusting search terms or filters to locate specific questions.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalItems={totalQuestions}
          page={page}
          rowsPerPage={limit}
          onPageChange={setPage}
          onRowsPerPageChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </section>

      {/* Modals */}
      <AddEditQuestionModal
        open={isAddModalOpen}
        questionToEdit={editingQuestion}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingQuestion(null);
        }}
      />

      <QuestionStatusModal
        open={!!statusTargetQuestion}
        question={statusTargetQuestion}
        isLoading={isUpdatingStatus}
        onClose={() => setStatusTargetQuestion(null)}
        onConfirm={handleConfirmStatusChange}
      />

      <DeleteQuestionModal
        open={!!deleteTargetQuestion}
        question={deleteTargetQuestion}
        isLoading={isDeleting}
        onClose={() => setDeleteTargetQuestion(null)}
        onConfirm={handleConfirmDelete}
      />

      <SingleQuestionModal
        open={!!viewingQuestion}
        question={viewingQuestion}
        onClose={() => setViewingQuestion(null)}
      />

      {/* Delete Confirmation Modal for Permanent Deletion */}
      <ConfirmDeleteModal
        open={!!deleteConfirmParams}
        title={deleteConfirmParams?.type === "bulk" ? "Permanently Delete Multiple Questions?" : "Permanently Delete Question?"}
        description={`Are you sure you want to permanently delete ${deleteConfirmParams?.type === "bulk" ? "these questions" : "this question"}? This action cannot be undone.`}
        isLoading={isBulkDeleting}
        onClose={() => setDeleteConfirmParams(null)}
        onConfirm={() => {
          if (deleteConfirmParams?.type === "bulk") {
            executeBulkPermanentDelete();
          } else if (deleteConfirmParams?.id) {
            executePermanentDelete(deleteConfirmParams.id);
          }
        }}
      />
    </div>
  );
}
