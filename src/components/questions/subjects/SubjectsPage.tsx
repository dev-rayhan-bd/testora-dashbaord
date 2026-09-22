"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Filter,
  GraduationCap,
  Layers,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetSubjectsQuery, type SubjectItem } from "@/store/apis";
import { AddEditSubjectModal } from "./AddEditSubjectModal";
import { DeleteSubjectModal } from "./DeleteSubjectModal";
import SubjectsTable from "./SubjectsTable";

const EXAM_TYPE_OPTIONS = [
  { label: "All Exams", value: "all" },
  { label: "Matura", value: "matura" },
  { label: "Semimatura", value: "semi_matura" },
  { label: "Entrance Exam (Provime)", value: "provime" },
];

export default function SubjectsPage() {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [examType, setExamType] = useState<string>("all");

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectItem | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<SubjectItem | null>(null);

  // 400ms debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // RTK Query hook
  const {
    data: responseData,
    isLoading,
    isFetching,
    refetch,
  } = useGetSubjectsQuery({
    examType: examType !== "all" ? examType : undefined,
    searchTerm: debouncedSearch || undefined,
  });

  // Normalize subjects array (handle envelope or raw array)
  const subjects: SubjectItem[] = useMemo(() => {
    const list = responseData?.data;
    return Array.isArray(list) ? list : [];
  }, [responseData]);

  // Compute stat metrics
  const stats = useMemo(() => {
    const total = subjects.length;
    let maturaCount = 0;
    let semiMaturaCount = 0;
    let provimeCount = 0;
    let electiveCount = 0;

    for (const s of subjects) {
      const type = s.examType?.toLowerCase() || "";
      if (type === "matura") maturaCount++;
      else if (type === "semi_matura" || type === "semimatura") semiMaturaCount++;
      else if (type === "provime") provimeCount++;

      if (s.isElective) electiveCount++;
    }

    return { total, maturaCount, semiMaturaCount, provimeCount, electiveCount };
  }, [subjects]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setExamType("all");
  };

  const hasActiveFilters = debouncedSearch !== "" || examType !== "all";

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#273d52]">Subjects Management</h2>
          <p className="text-xs text-[#71889e]">
            Manage academic subjects, translations, and elective rules across Matura, Semimatura, and Entrance Exams
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh subjects"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce7f2] bg-white text-[#587189] transition-colors hover:bg-[#f0f6fc] hover:text-[#2563eb] disabled:opacity-50"
          >
            <RotateCw className={cn("h-4 w-4", isFetching && "animate-spin text-[#2563eb]")} />
          </button>

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#1d4ed8] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>
      </section>

      {/* Summary KPI Badges */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71889e]">
            <Layers className="h-3.5 w-3.5 text-[#2563eb]" />
            Total Subjects
          </div>
          <p className="mt-1 text-xl font-bold text-[#273d52]">
            {isLoading ? "—" : stats.total}
          </p>
        </div>

        <div className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71889e]">
            <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
            Matura
          </div>
          <p className="mt-1 text-xl font-bold text-blue-700">
            {isLoading ? "—" : stats.maturaCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71889e]">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
            Semimatura
          </div>
          <p className="mt-1 text-xl font-bold text-emerald-700">
            {isLoading ? "—" : stats.semiMaturaCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71889e]">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            Entrance (Provime)
          </div>
          <p className="mt-1 text-xl font-bold text-purple-700">
            {isLoading ? "—" : stats.provimeCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71889e]">
            <Filter className="h-3.5 w-3.5 text-amber-600" />
            Electives
          </div>
          <p className="mt-1 text-xl font-bold text-amber-700">
            {isLoading ? "—" : stats.electiveCount}
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="rounded-xl border border-[#dce7f2] bg-white p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba3b9]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subjects by name or English/Albanian translations..."
              className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] pl-9 pr-8 text-xs text-[#273d52] placeholder:text-[#9bb0c4] outline-none transition-all focus:border-[#2563eb] focus:bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8ba3b9] hover:text-[#48637e]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Exam Type Pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {EXAM_TYPE_OPTIONS.map((opt) => {
              const active = examType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExamType(opt.value)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "border border-[#2563eb] bg-[#2563eb] text-white shadow-2xs"
                      : "border border-[#dce7f2] bg-[#f8fbff] text-[#48637e] hover:bg-[#eef5fc] hover:text-[#1d4ed8]"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Subjects Table */}
      <SubjectsTable
        subjects={subjects}
        isLoading={isLoading}
        onEdit={(s) => setSubjectToEdit(s)}
        onDelete={(s) => setSubjectToDelete(s)}
      />

      {/* Add / Edit Subject Modal */}
      <AddEditSubjectModal
        open={addModalOpen || !!subjectToEdit}
        subjectToEdit={subjectToEdit}
        onClose={() => {
          setAddModalOpen(false);
          setSubjectToEdit(null);
        }}
      />

      {/* Delete Subject Confirmation Modal */}
      <DeleteSubjectModal
        open={!!subjectToDelete}
        subject={subjectToDelete}
        onClose={() => setSubjectToDelete(null)}
      />
    </div>
  );
}
