"use client";

import Pagination from "@/components/users/Pagination";
import { cn } from "@/lib/utils";
import {
  useGetQuestionsQuery,
  useLazyGetSingleQuestionQuery,
  type QuestionListItem,
  type SingleQuestionResponse,
} from "@/store/apis";
import { Copy, Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const STATUS_TABS = [
  { label: "All", value: "All" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Hidden", value: "hidden" },
  { label: "Archived", value: "archived" },
];

function statusBadgeClass(status: string) {
  if (status === "published") return "border-[#d0ecd9] bg-[#e9f8ef] text-[#3ea666]";
  if (status === "draft") return "border-[#f0dfb9] bg-[#fff3da] text-[#c48a2e]";
  if (status === "hidden") return "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";
  return "border-[#f4d7d7] bg-[#fdeeee] text-[#db6f6f]";
}

function accessBadgeClass(access: string) {
  return access === "premium"
    ? "border-[#e4ddf4] bg-[#f1edfb] text-[#8468c4]"
    : "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
}

function categoryBadgeClass(examType: string) {
  if (examType === "matura") return "border-[#d6e5f4] bg-[#eaf2fb] text-[#4d93d9]";
  if (examType === "semimatura") return "border-[#dce4f6] bg-[#edf0fb] text-[#748ccc]";
  if (examType === "provime") return "border-[#d5ece5] bg-[#e9f5f1] text-[#3b9b81]";
  return "border-[#dee8f2] bg-[#f2f6fb] text-[#6d839a]";
}

function Label(value: string | null) {
  return value ?? "—";
}

function generateYearOptions() {
  const years: string[] = [""];
  for (let year = 2024; year >= 2000; year--) {
    years.push(String(year));
  }
  return years;
}

function FilterSelect({
  value,
  onChange,
  options,
  label,
  placeholderValue,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
  placeholderValue?: string;
}) {
  return (
    <label className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-2.5 py-1.5 text-xs text-[#587189]">
      <span className="whitespace-nowrap">{label}:</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 bg-transparent text-xs font-medium text-[#3f5f7a] outline-none"
      >
        <option value="">{placeholderValue ?? "Any"}</option>
        {options
          .filter((opt) => opt !== "")
          .map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
    </label>
  );
}

function SingleQuestionModal({
  open,
  sl,
  question,
  onClose,
}: {
  open: boolean;
  sl: number;
  question: SingleQuestionResponse | null;
  onClose: () => void;
}) {
  if (!open || !question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/30 p-4 capitalize">
      <div className="w-full max-w-3xl rounded-2xl border border-[#dce7f2] bg-white">
        <div className="flex items-start justify-between border-b border-[#e6edf5] px-5 py-4">
          <div>
            <h3 className="text-xl font-semibold text-[#2f3f52]">Question Details</h3>
            <p className="text-xs text-[#8ea1b4]">
              SL No. {sl} | Question ID: {question?.questionId}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#8ea1b5] hover:bg-[#f4f8fc]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4 text-sm">
          <div>
            <p className="mb-1 text-xs text-[#8ea1b4]">Question Text</p>
            <p className="font-medium text-[#4f6d87]">{Label(question.questionText)}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-[#8ea1b4]">Exam Type</p>
              <p className="font-medium text-[#4f6d87]">{Label(question.examType)}</p>
            </div>
            <div>
              <p className="text-xs text-[#8ea1b4]">Year</p>
              <p className="font-medium text-[#4f6d87]">{Label(question.year.toString())}</p>
            </div>
            <div>
              <p className="text-xs text-[#8ea1b4]">Subject</p>
              <p className="font-medium text-[#4f6d87]">{Label(question.subjectName)}</p>
            </div>
            <div>
              <p className="text-xs text-[#8ea1b4]">Faculty</p>
              <p className="font-medium text-[#4f6d87]">{Label(question.facultyName)}</p>
            </div>
            <div>
              <p className="text-xs text-[#8ea1b4]">Access</p>
              <p className="font-medium text-[#4f6d87]">{Label(question.access)}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-[#8ea1b4]">Options</p>
            <div className="grid gap-2 md:grid-cols-2">
              {question.options.map((option, index) => (
                <div
                  key={`${option.text}-${index}`}
                  className={cn(
                    "rounded-lg border px-3 py-2",
                    index === question.correctOptionIndex
                      ? "border-[#d0ecd9] bg-[#e9f8ef]"
                      : "border-[#dce7f2] bg-[#f8fbff]"
                  )}
                >
                  <p className="text-xs font-medium text-[#4f6d87]">
                    {index + 1}. {option.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-[#8ea1b4]">Explanation</p>
            <p className="text-[#4f6d87]">{question.explanation}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div>
              <p className="text-xs text-[#8ea1b4]">Attempts</p>
              <p className="font-medium text-[#4f6d87]">{question.stats.totalAttempts}</p>
            </div>
            <div>
              <p className="text-xs text-[#8ea1b4]">Correct</p>
              <p className="font-medium text-[#4f6d87]">{question.stats.correctCount}</p>
            </div>
            <div>
              <p className="text-xs text-[#8ea1b4]">Wrong</p>
              <p className="font-medium text-[#4f6d87]">{question.stats.wrongCount}</p>
            </div>
            <div>
              <p className="text-xs text-[#8ea1b4]">Correct %</p>
              <p className="font-medium text-[#4f6d87]">{question.stats.correctPercentage}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuestionBankPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [examTypeFilter, setExamTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [yearFilter, setYearFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("");
  const [accessFilter, setAccessFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState<{
    id: string | null;
    sl: number;
  } | null>(null);

  const resetFilterState = () => {
    setExamTypeFilter("");
    setYearFilter("");
    setSubjectFilter("");
    setFacultyFilter("");
    setAccessFilter("");
    setDifficultyFilter("");
    setActiveTab("All");
    setPage(1);
  };

  const { data, isLoading, isFetching, isError, error } = useGetQuestionsQuery({
    page,
    limit: rowsPerPage,
    examType: examTypeFilter || undefined,
    searchTerm: search.trim() || undefined,
    year: yearFilter ? Number(yearFilter) : undefined,
    subjectName: subjectFilter || undefined,
    facultyName: facultyFilter || undefined,
    access: accessFilter || undefined,
    difficultyLevel: difficultyFilter || undefined,
    status: activeTab === "All" ? undefined : activeTab,
  });

  const [loadQuestion, { data: singleQuestionResponse, isFetching: isQuestionFetching }] =
    useLazyGetSingleQuestionQuery();

  useEffect(() => {
    if (!selectedQuestion?.id) return;
    loadQuestion(selectedQuestion?.id);
  }, [loadQuestion, selectedQuestion?.id]);

  useEffect(() => {
    if (!isError) return;
    const message =
      (error as { data?: { message?: string }; error?: string } | undefined)?.data?.message ??
      (error as { data?: { message?: string }; error?: string } | undefined)?.error ??
      "Unable to load questions.";
    toast.error(message);
  }, [error, isError]);

  const questionList = useMemo(() => data?.data.questions ?? [], [data]);
  const totalPages = data?.data?.meta.totalPages ?? 1;
  const safePage = Math.min(page, totalPages);

  const rows = questionList;

  return (
    <div className="space-y-3">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[#3f5f7a]">Question Bank</h2>
          <p className="text-sm text-[#7e95ab]">Manage all questions in one centralized database</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/questions/question-bank/add"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2f86d8] px-3 text-xs font-medium text-white hover:bg-[#2a78c6]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Question
          </Link>
        </div>
      </section>

      <section className="rounded-lg border border-[#dce7f2] bg-white p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="relative block min-w-60 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#9ab0c3]" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search questions by ID or text..."
              className="h-9 w-full rounded-md border border-[#dce7f2] bg-[#f8fbff] pr-3 pl-8 text-sm text-[#3f5f7a] outline-none placeholder:text-[#9ab0c3]"
            />
          </label>

          <FilterSelect
            value={examTypeFilter}
            onChange={(value) => {
              setExamTypeFilter(value);
              setPage(1);
            }}
            options={["", "semi_matura", "matura", "provime"]}
            label="Exam Type"
            placeholderValue="All"
          />

          <FilterSelect
            value={yearFilter}
            onChange={(value) => {
              setYearFilter(value);
              setPage(1);
            }}
            options={generateYearOptions()}
            label="Year"
            placeholderValue="All"
          />

          <FilterSelect
            value={subjectFilter}
            onChange={(value) => {
              setSubjectFilter(value);
              setPage(1);
            }}
            options={[
              "",
              "Mathematics",
              "Physics",
              "Chemistry",
              "Biology",
              "History",
              "Geography",
              "Albanian",
              "English",
            ]}
            label="Subject"
            placeholderValue="All"
          />

          <FilterSelect
            value={facultyFilter}
            onChange={(value) => {
              setFacultyFilter(value);
              setPage(1);
            }}
            options={[
              "",
              "Faculty of Engineering",
              "Faculty of Natural Sciences",
              "Faculty of Medicine",
              "Faculty of Economics",
              "Faculty of Law",
              "Faculty of Social Sciences",
            ]}
            label="Faculty"
            placeholderValue="All"
          />

          <FilterSelect
            value={accessFilter}
            onChange={(value) => {
              setAccessFilter(value);
              setPage(1);
            }}
            options={["", "free", "premium"]}
            label="Access"
            placeholderValue="All"
          />

          <FilterSelect
            value={difficultyFilter}
            onChange={(value) => {
              setDifficultyFilter(value);
              setPage(1);
            }}
            options={["", "easy", "medium", "hard"]}
            label="Difficulty"
            placeholderValue="All"
          />

          <button
            type="button"
            onClick={resetFilterState}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs font-medium text-[#587189] hover:bg-[#f0f5fa]"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => {
            const isActive = tab.value === activeTab;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setActiveTab(tab.value);
                  setPage(1);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                  isActive
                    ? "bg-[#edf4fb] text-[#2f86d8]"
                    : "bg-[#f3f7fb] text-[#7e95ab] hover:text-[#3f5f7a]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-[#dce7f2] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-300 text-left">
            <thead className="bg-[#f3f7fb] text-[11px] font-medium tracking-wide text-[#6f859b] uppercase">
              <tr>
                <th className="px-4 py-2.5">SL</th>
                <th className="px-4 py-2.5">Exam Type</th>
                <th className="px-4 py-2.5">Year</th>
                <th className="px-4 py-2.5">Subject</th>
                <th className="px-4 py-2.5">Faculty</th>
                {/* <th className="px-4 py-2.5">Difficulty</th> */}
                <th className="px-4 py-2.5">Access</th>
                <th className="px-4 py-2.5">Created At</th>
                <th className="px-4 py-2.5">Passage Code</th>
                <th className="max-w-50 px-4 py-2.5">Question Text</th>
                <th className="px-4 py-2.5">Correct</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Actions</th>
              </tr>
            </thead>

            <tbody>
              {(isLoading || isFetching) && rows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-5 py-10 text-center text-sm text-[#90a3b6]">
                    Loading questions...
                  </td>
                </tr>
              ) : null}

              {rows.map((row: QuestionListItem, index) => (
                <tr
                  key={row._id}
                  className="border-b border-[#ecf2f8] text-xs text-[#5e768e] capitalize last:border-b-0 hover:bg-[#f8fbff]"
                >
                  <td className="px-4 py-2.5 font-semibold text-[#2f86d8]">
                    {(page - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "rounded-sm border px-2 py-0.5 text-[11px]",
                        categoryBadgeClass(row.examType)
                      )}
                    >
                      {row.examType}
                    </span>
                  </td>

                  <td className="px-4 py-2.5">{Label(row.year.toString())}</td>
                  <td className="px-4 py-2.5">{Label(row.subjectName)}</td>
                  <td className="px-4 py-2.5">{Label(row.facultyName)}</td>
                  {/* <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "rounded-sm border px-2 py-0.5 text-[11px]",
                        difficultyBadgeClass(row.difficultyLevel)
                      )}
                    >
                      {row.difficultyLevel}
                    </span>
                  </td> */}
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "rounded-sm border px-2 py-0.5 text-[11px]",
                        accessBadgeClass(row.access)
                      )}
                    >
                      {row.access}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">{new Date(row.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-[#90a3b6]">{Label(row.passageCode)}</td>
                  <td className="max-w-50 truncate px-4 py-2.5">{Label(row.questionText)}</td>
                  <td className="px-4 py-2.5 font-semibold text-[#3ea666]">
                    {row.correctOptionIndex + 1}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                        statusBadgeClass(row.status)
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-0.5 text-[#7f95aa]">
                      <button
                        type="button"
                        aria-label="View question"
                        onClick={() =>
                          setSelectedQuestion({
                            id: row._id,
                            sl: (page - 1) * rowsPerPage + index + 1,
                          })
                        }
                        className="rounded p-1 hover:bg-[#f3f7fb] hover:text-[#2f86d8]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href="/questions/question-bank/add"
                        aria-label="Edit question"
                        className="rounded p-1 hover:bg-[#f3f7fb] hover:text-[#2f86d8]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        aria-label="Duplicate question"
                        className="rounded p-1 hover:bg-[#f3f7fb] hover:text-[#2f86d8]"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete question"
                        className="rounded p-1 hover:bg-[#fdeeee] hover:text-[#db6f6f]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && !isLoading && !isFetching && (
                <tr>
                  <td colSpan={14} className="px-5 py-10 text-center text-sm text-[#90a3b6]">
                    No questions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          totalItems={data?.data.meta.total ?? 0}
          page={safePage}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setPage(1);
          }}
        />
      </section>

      <SingleQuestionModal
        open={!!selectedQuestion?.id}
        sl={selectedQuestion?.sl ?? 0}
        question={singleQuestionResponse?.data ?? null}
        onClose={() => setSelectedQuestion(null)}
      />

      {isQuestionFetching ? null : null}
    </div>
  );
}
