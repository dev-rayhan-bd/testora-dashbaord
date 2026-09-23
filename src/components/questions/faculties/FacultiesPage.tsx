"use client";

import { useEffect, useMemo, useState } from "react";
import { Layers, Plus, RotateCw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetFacultiesQuery, type FacultyItem } from "@/store/apis";
import { AddEditFacultyModal } from "./AddEditFacultyModal";
import { DeleteFacultyModal } from "./DeleteFacultyModal";
import FacultiesTable from "./FacultiesTable";

export default function FacultiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [facultyToEdit, setFacultyToEdit] = useState<FacultyItem | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<FacultyItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: responseData,
    isLoading,
    isFetching,
    refetch,
  } = useGetFacultiesQuery({
    searchTerm: debouncedSearch || undefined,
  });

  const faculties: FacultyItem[] = useMemo(() => {
    const list = responseData?.data;
    return Array.isArray(list) ? list : [];
  }, [responseData]);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <section className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#273d52]">Faculties Management</h2>
          <p className="text-xs text-[#71889e]">
            Manage faculties and translations (used in Entrance Exams / Provime)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh faculties"
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
            Add Faculty
          </button>
        </div>
      </section>

      {/* KPI Badge */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-[#dce7f2] bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-medium text-[#71889e]">
            <Layers className="h-3.5 w-3.5 text-[#2563eb]" />
            Total Faculties
          </div>
          <p className="mt-1 text-xl font-bold text-[#273d52]">
            {isLoading ? "—" : faculties.length}
          </p>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="rounded-xl border border-[#dce7f2] bg-white p-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba3b9]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search faculties by name..."
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
        </div>
      </section>

      {/* Main Table */}
      <FacultiesTable
        faculties={faculties}
        isLoading={isLoading}
        onEdit={(s) => setFacultyToEdit(s)}
        onDelete={(s) => setFacultyToDelete(s)}
      />

      <AddEditFacultyModal
        open={addModalOpen || !!facultyToEdit}
        facultyToEdit={facultyToEdit}
        onClose={() => {
          setAddModalOpen(false);
          setFacultyToEdit(null);
        }}
      />

      <DeleteFacultyModal
        open={!!facultyToDelete}
        faculty={facultyToDelete}
        onClose={() => setFacultyToDelete(null)}
      />
    </div>
  );
}
