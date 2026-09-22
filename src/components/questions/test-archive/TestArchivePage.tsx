"use client";

import { cn } from "@/lib/utils";
import {
  useGetMetaFiltersQuery,
  useGetTestArchiveQuery,
  type TestArchiveItem,
} from "@/store/apis";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  Plus,
  RotateCw,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import DuplicateToolsSection from "./DuplicateToolsSection";
import TestArchiveTable from "./TestArchiveTable";
import {
  CopyYearModal,
  CreateEditTestModal,
  DeleteTestModal,
  DuplicateTestModal,
  ViewTestQuestionsModal,
} from "./TestModals";

export default function TestArchivePage() {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [examType, setExamType] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [testType, setTestType] = useState<string>("all");
  const [access, setAccess] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Search debounce (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestArchiveItem | null>(null);
  const [duplicatingTest, setDuplicatingTest] = useState<TestArchiveItem | null>(null);
  const [copyYearOpen, setCopyYearOpen] = useState(false);
  const [viewTestId, setViewTestId] = useState<string | null>(null);
  const [deletingTest, setDeletingTest] = useState<TestArchiveItem | null>(null);

  // Queries
  const { data: metaData } = useGetMetaFiltersQuery();
  const {
    data: archiveData,
    isLoading,
    isFetching,
    refetch,
  } = useGetTestArchiveQuery({
    page,
    limit,
    searchTerm: debouncedSearch || undefined,
    examType: examType !== "all" ? examType : undefined,
    year: year !== "all" ? Number(year) : undefined,
    testType: testType !== "all" ? testType : undefined,
    access: access !== "all" ? access : undefined,
    status: status !== "all" ? status : undefined,
  });

  const tests = archiveData?.data ?? [];
  const meta = archiveData?.meta ?? {
    total: tests.length,
    page: 1,
    limit: 10,
    totalPages: Math.ceil(tests.length / 10) || 1,
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setExamType("all");
    setYear("all");
    setTestType("all");
    setAccess("all");
    setStatus("all");
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch !== "" ||
    examType !== "all" ||
    year !== "all" ||
    testType !== "all" ||
    access !== "all" ||
    status !== "all";

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#273d52]">Test Archive</h2>
          <p className="text-xs text-[#6e859b]">
            Define test structures and exam sessions linked to Question Bank questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            title="Refresh list"
            disabled={isFetching}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-[#dce7f2] bg-white px-2.5 text-[#587189] shadow-xs hover:bg-[#f8fbff] disabled:opacity-50"
          >
            <RotateCw className={cn("h-4 w-4", isFetching && "animate-spin text-[#1e6fbe]")} />
          </button>
          <button
            type="button"
            onClick={() => setCopyYearOpen(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#b9d6f3] bg-[#edf6fd] px-3 text-xs font-semibold text-[#1e6fbe] transition-colors hover:bg-[#e1f0fb]"
          >
            <Layers className="h-3.5 w-3.5" />
            Copy Year Questions
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingTest(null);
              setCreateModalOpen(true);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#2563eb] px-3.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#1d4ed8]"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Test
          </button>
        </div>
      </section>

      {/* Info Banner */}
      <section className="rounded-xl border border-[#cbe0f5] bg-[#eef6fc] px-4 py-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[#2d73b3]" />
          <p className="text-xs font-semibold text-[#275783]">How Test Archive Works</p>
        </div>
        <p className="mt-1 text-xs text-[#406d96]">
          Tests act as containers for published questions. When you create or clone a test, students can access it in the quiz interface according to its exam type, year, and access level.
        </p>
      </section>

      {/* Search & Filter Bar */}
      <section className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tests by title, test code..."
              className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-9 text-xs text-[#2c445c] outline-none transition-colors focus:border-[#7cb2e8] focus:bg-white"
            />
          </label>

          {/* Exam Type */}
          <select
            value={examType}
            onChange={(e) => {
              setExamType(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-xs text-[#48637e] outline-none"
          >
            <option value="all">All Exam Types</option>
            <option value="matura">Matura</option>
            <option value="semi_matura">Semimatura</option>
            <option value="provime">Entrance Exam</option>
          </select>

          {/* Year */}
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-xs text-[#48637e] outline-none"
          >
            <option value="all">All Years</option>
            {(metaData?.data?.years ?? [2026, 2025, 2024, 2023, 2022, 2021]).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Test Type */}
          <select
            value={testType}
            onChange={(e) => {
              setTestType(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-xs text-[#48637e] outline-none"
          >
            <option value="all">All Test Types</option>
            <option value="official">Official</option>
            <option value="additional">Additional</option>
          </select>

          {/* Access */}
          <select
            value={access}
            onChange={(e) => {
              setAccess(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-xs text-[#48637e] outline-none"
          >
            <option value="all">All Access</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2.5 text-xs text-[#48637e] outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>
      </section>

      {/* Table */}
      <TestArchiveTable
        rows={tests}
        startIndex={(page - 1) * limit}
        isLoading={isLoading}
        onView={(t) => setViewTestId(t._id)}
        onEdit={(t) => {
          setEditingTest(t);
          setCreateModalOpen(true);
        }}
        onDuplicate={(t) => setDuplicatingTest(t)}
        onDelete={(t) => setDeletingTest(t)}
      />

      {/* Pagination Controls */}
      <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
        <p className="text-xs text-[#6e859b]">
          Showing <span className="font-semibold text-[#273d52]">{tests.length}</span> of{" "}
          <span className="font-semibold text-[#273d52]">{meta.total}</span> tests
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dce7f2] bg-white px-2.5 text-xs font-semibold text-[#48637e] shadow-xs hover:bg-[#f8fbff] disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>
          <span className="px-2 text-xs font-medium text-[#6e859b]">
            Page {meta.page} of {meta.totalPages || 1}
          </span>
          <button
            type="button"
            disabled={page >= (meta.totalPages || 1) || isLoading}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#dce7f2] bg-white px-2.5 text-xs font-semibold text-[#48637e] shadow-xs hover:bg-[#f8fbff] disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Duplicate tools helper cards */}
      <DuplicateToolsSection onTriggerCopyYear={() => setCopyYearOpen(true)} />

      {/* Modals */}
      <CreateEditTestModal
        open={createModalOpen}
        testToEdit={editingTest}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingTest(null);
        }}
      />

      <DuplicateTestModal
        open={!!duplicatingTest}
        test={duplicatingTest}
        onClose={() => setDuplicatingTest(null)}
      />

      <CopyYearModal
        open={copyYearOpen}
        tests={tests}
        onClose={() => setCopyYearOpen(false)}
      />

      <ViewTestQuestionsModal
        open={!!viewTestId}
        testId={viewTestId}
        onClose={() => setViewTestId(null)}
      />

      <DeleteTestModal
        open={!!deletingTest}
        test={deletingTest}
        onClose={() => setDeletingTest(null)}
      />
    </div>
  );
}
