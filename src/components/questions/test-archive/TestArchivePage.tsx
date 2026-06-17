"use client";

import { archiveInfoBullets } from "@/lib/test-archive-data";
import { useGetTestArchiveQuery, type TestArchiveItem } from "@/store/apis";
import { Filter, Info, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import DuplicateToolsSection from "./DuplicateToolsSection";
import TestArchiveTable from "./TestArchiveTable";

function mapTest(row: TestArchiveItem) {
  return {
    id: row._id,
    title: row.title,
    category: row.examType === "provime" ? "Entrance Exam" : row.examType === "matura" ? "Matura" : "Semimatura",
    year: String(row.year),
    subjectCategory: row.subjectName ?? row.facultyName,
    type: row.testType === "official" ? "Official" : "Additional",
    access: row.access === "premium" ? "Premium" : "Free",
    questions: row.totalQuestions,
    status:
      row.status === "published" ? "Published" : row.status === "draft" ? "Draft" : "Hidden",
  } as const;
}

export default function TestArchivePage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useGetTestArchiveQuery({ testType: "official" });

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = (data?.data ?? []).map(mapTest);
    if (!query) return rows;
    return rows.filter(
      (row) =>
        row.id.toLowerCase().includes(query) ||
        row.title.toLowerCase().includes(query) ||
        row.category.toLowerCase().includes(query) ||
        row.subjectCategory.toLowerCase().includes(query)
    );
  }, [data, search]);

  return (
    <div className="space-y-3">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#3f5f7a]">Test Archive</h2>
          <p className="text-sm text-[#7e95ab]">
            Define test structure — tests link to questions from the Question Bank
          </p>
        </div>

        <Link
          href="/questions/test-archive/create"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2f86d8] px-3 text-xs font-medium text-white hover:bg-[#2a78c6]"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Test
        </Link>
      </section>

      <section className="rounded-lg border border-[#c8ddf2] bg-[#eaf4fd] px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#4a8fc7]" />
          <p className="text-xs font-semibold text-[#3a6e9e]">How Test Archive works</p>
        </div>
        <ul className="space-y-1">
          {archiveInfoBullets.map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-xs text-[#4a7eb8]">
              <span className="mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-[#dce7f2] bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block min-w-62.5 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests..."
              className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-8 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3]"
            />
          </label>

          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#587189]"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="h-52 animate-pulse rounded-lg border border-[#dce7f2] bg-white" />
      ) : null}

      {isError ? null : <TestArchiveTable rows={filteredRows} />}
      <DuplicateToolsSection />
    </div>
  );
}
