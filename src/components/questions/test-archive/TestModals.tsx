"use client";

import {
  useCopyYearQuestionsMutation,
  useCreateTestMutation,
  useDeleteTestMutation,
  useDuplicateTestMutation,
  useGetMetaFiltersQuery,
  useGetSingleTestQuery,
  useUpdateTestMutation,
  type TestArchiveItem,
} from "@/store/apis";
import {
  Copy,
  FileCheck2,
  Layers,
  Loader2,
  Trash2,
  X,
  CheckCircle,
  BookOpen,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CreateEditProps {
  open: boolean;
  testToEdit?: TestArchiveItem | null;
  onClose: () => void;
}

export function CreateEditTestModal({ open, testToEdit, onClose }: CreateEditProps) {
  if (!open) return null;

  return (
    <CreateEditTestDialog
      key={testToEdit?._id ?? "new"}
      testToEdit={testToEdit}
      onClose={onClose}
    />
  );
}

function CreateEditTestDialog({
  testToEdit,
  onClose,
}: {
  testToEdit?: TestArchiveItem | null;
  onClose: () => void;
}) {
  const isEditing = !!testToEdit;
  const { data: metaFilters } = useGetMetaFiltersQuery();
  const [createTest, { isLoading: isCreating }] = useCreateTestMutation();
  const [updateTest, { isLoading: isUpdating }] = useUpdateTestMutation();
  const isSubmitting = isCreating || isUpdating;

  const [title, setTitle] = useState(() => testToEdit?.title || "");
  const [testCode, setTestCode] = useState(
    () => testToEdit?.testCode || `TEST-${new Date().getFullYear()}-01`
  );
  const [examType, setExamType] = useState<string>(() => testToEdit?.examType || "matura");
  const [year, setYear] = useState<number>(() => testToEdit?.year || new Date().getFullYear());
  const [testType, setTestType] = useState<string>(() => testToEdit?.testType || "official");
  const [access, setAccess] = useState<string>(() => testToEdit?.access || "free");
  const [status, setStatus] = useState<string>(() => testToEdit?.status || "published");
  const [subject, setSubject] = useState<string>(() => {
    if (!testToEdit) return "";
    const subj = (testToEdit as unknown as { subject?: string | { _id?: string } })?.subject;
    return typeof subj === "object" ? subj?._id || "" : subj || "";
  });
  const [faculty, setFaculty] = useState<string>(() => {
    if (!testToEdit) return "";
    const fac = (testToEdit as unknown as { faculty?: string | { _id?: string } })?.faculty;
    return typeof fac === "object" ? fac?._id || "" : fac || "";
  });

  const subjects = (metaFilters?.data?.subjects ?? []).filter(
    (s) => s.examType === examType
  );
  const faculties = metaFilters?.data?.faculties ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !testCode.trim()) {
      toast.error("Please provide both title and test code");
      return;
    }

    try {
      if (isEditing && testToEdit) {
        await updateTest({
          testId: testToEdit._id,
          title: title.trim(),
          testCode: testCode.trim().toUpperCase(),
          examType,
          year,
          testType,
          access,
          status,
          subject: examType !== "provime" ? subject || undefined : undefined,
          faculty: examType === "provime" ? faculty || undefined : undefined,
        }).unwrap();
        toast.success("Test updated successfully");
      } else {
        await createTest({
          title: title.trim(),
          testCode: testCode.trim().toUpperCase(),
          examType,
          year,
          testType,
          access,
          status,
          subject: examType !== "provime" ? subject || undefined : undefined,
          faculty: examType === "provime" ? faculty || undefined : undefined,
        }).unwrap();
        toast.success("Test created successfully");
      }
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to save test. Please check required fields.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf4fe] text-[#2563eb]">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2f4256]">
                {isEditing ? "Edit Test" : "Create New Test"}
              </h3>
              <p className="text-xs text-[#7e95ab]">Configure test metadata and linked questions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-1 text-[#8ea1b5] transition-colors hover:bg-[#f4f8fc] hover:text-[#3f5f7a] disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
              Test Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Provimi i Maturës 2026 - Sesioni Qershor"
              className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                Test Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={testCode}
                onChange={(e) => setTestCode(e.target.value)}
                placeholder="e.g. MAT-2026-Q1"
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 font-mono text-xs text-[#3f5f7a] uppercase outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">
                Year <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={2000}
                max={new Date().getFullYear() + 2}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#3f5f7a] outline-none transition-colors focus:border-[#7fb3e8] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">Exam Type</label>
              <select
                value={examType}
                onChange={(e) => {
                  setExamType(e.target.value);
                  setSubject("");
                  setFaculty("");
                }}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2 text-xs text-[#3f5f7a] outline-none"
              >
                <option value="matura">Matura</option>
                <option value="semi_matura">Semimatura</option>
                <option value="provime">Entrance Exam</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">Test Type</label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2 text-xs text-[#3f5f7a] outline-none"
              >
                <option value="official">Official</option>
                <option value="additional">Additional</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">Access</label>
              <select
                value={access}
                onChange={(e) => setAccess(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2 text-xs text-[#3f5f7a] outline-none"
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-2 text-xs text-[#3f5f7a] outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>

          {examType === "provime" ? (
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">Faculty</label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#3f5f7a] outline-none"
              >
                <option value="">Select Faculty...</option>
                {faculties.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#3f5f7a] outline-none"
              >
                <option value="">Select Subject...</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194] transition-colors hover:bg-[#f5f9fd] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1d4ed8] active:scale-95 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving Test...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Test"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface DuplicateProps {
  open: boolean;
  test: TestArchiveItem | null;
  onClose: () => void;
}

export function DuplicateTestModal({ open, test, onClose }: DuplicateProps) {
  if (!open || !test) return null;

  return (
    <DuplicateTestDialog
      key={test._id}
      test={test}
      onClose={onClose}
    />
  );
}

function DuplicateTestDialog({
  test,
  onClose,
}: {
  test: TestArchiveItem;
  onClose: () => void;
}) {
  const [duplicateTest, { isLoading }] = useDuplicateTestMutation();
  const [newCode, setNewCode] = useState(() => `${test.testCode}-COPY`);
  const [newTitle, setNewTitle] = useState(() => `${test.title} (Clone)`);
  const [newYear, setNewYear] = useState(() => test.year);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await duplicateTest({
        testId: test._id,
        newTestCode: newCode.trim().toUpperCase(),
        newTitle: newTitle.trim(),
        newYear,
      }).unwrap();
      toast.success("Test cloned successfully with all linked questions preserved!");
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message || "Failed to clone test.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef7ff] text-[#2563eb]">
              <Copy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2f4256]">Duplicate Entire Test</h3>
              <p className="text-xs text-[#7e95ab]">Clones test metadata and retains question links</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-[#8ea1b5]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 p-5">
          <div className="rounded-xl border border-[#dce7f2] bg-[#f8fbff] p-3 text-xs text-[#4f6d87]">
            <p className="font-semibold text-[#2f4256]">Source: {test.title}</p>
            <p className="text-[#889cb0]">
              Code: {test.testCode} • Year: {test.year}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">New Test Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#3f5f7a] outline-none focus:border-[#7fb3e8] focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">New Code</label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 font-mono text-xs uppercase text-[#3f5f7a] outline-none focus:border-[#7fb3e8] focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">New Year</label>
              <input
                type="number"
                value={newYear}
                onChange={(e) => setNewYear(Number(e.target.value))}
                className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#3f5f7a] outline-none focus:border-[#7fb3e8] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] pt-3.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm Duplicate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface CopyYearProps {
  open: boolean;
  tests: TestArchiveItem[];
  onClose: () => void;
}

export function CopyYearModal({ open, tests, onClose }: CopyYearProps) {
  const [copyYearQuestions, { isLoading }] = useCopyYearQuestionsMutation();
  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId) {
      toast.error("Please select both source and target tests");
      return;
    }
    if (sourceId === targetId) {
      toast.error("Source and target test cannot be identical");
      return;
    }

    try {
      await copyYearQuestions({ sourceTestId: sourceId, targetTestId: targetId }).unwrap();
      toast.success("Questions copied successfully to the target test!");
      onClose();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to copy questions";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef7ff] text-[#2563eb]">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2f4256]">Copy Questions Tool</h3>
              <p className="text-xs text-[#7e95ab]">Migrate questions from previous years</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-[#8ea1b5]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 p-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">Source Test (Old Year)</label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#3f5f7a] outline-none"
            >
              <option value="">Select source test...</option>
              {tests.map((t) => (
                <option key={t._id} value={t._id}>
                  [{t.testCode}] {t.title} ({t.year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-[#4f6d87]">Target Test (New Year)</label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="h-9 w-full rounded-lg border border-[#dce7f2] bg-[#f8fbff] px-3 text-xs text-[#3f5f7a] outline-none"
            >
              <option value="">Select target test...</option>
              {tests.map((t) => (
                <option key={t._id} value={t._id}>
                  [{t.testCode}] {t.title} ({t.year})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] pt-3.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Copy Questions"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ViewTestProps {
  open: boolean;
  testId: string | null;
  onClose: () => void;
}

export function ViewTestQuestionsModal({ open, testId, onClose }: ViewTestProps) {
  const { data, isLoading } = useGetSingleTestQuery(testId || "", { skip: !testId || !open });
  if (!open || !testId) return null;

  const responseData = data?.data as any;
  const test = responseData?.test || responseData;
  const questions: any[] = responseData?.questions || test?.questions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#dce7f2] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e6edf5] px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-[#2f4256]">{test?.title || "Test Questions"}</h3>
            <p className="text-xs text-[#7e95ab]">
              Code: <strong className="font-mono text-[#2563eb]">{test?.testCode}</strong> • {questions.length} Questions Linked
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-[#8ea1b5]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {isLoading ? (
            <div className="py-10 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#2563eb]" />
              <p className="mt-2 text-xs text-[#7e95ab]">Loading test questions...</p>
            </div>
          ) : questions.length > 0 ? (
            questions.map((q, idx) => (
              <div
                key={q._id}
                className="rounded-xl border border-[#e3edf7] bg-[#f8fbff] p-4 text-xs shadow-xs"
              >
                <div className="flex flex-col gap-2 border-b border-[#e6edf5] pb-2 mb-3">
                  <div className="flex items-center justify-between text-[#859cb0]">
                    <span className="font-bold text-[#2f4256] text-sm">Question {idx + 1}</span>
                    <div className="flex gap-1.5">
                      <span className="rounded bg-[#edf4fe] px-1.5 py-0.5 border border-[#c6def8] text-[10px] font-bold uppercase text-[#2563eb]">{q.examType}</span>
                      <span className="rounded bg-white px-1.5 py-0.5 border text-[10px] font-bold text-[#4f6d87]">{q.year}</span>
                      <span className="rounded bg-white px-1.5 py-0.5 border text-[10px] font-bold capitalize text-[#4f6d87]">{q.difficultyLevel || "medium"}</span>
                    </div>
                  </div>
                  
                  {/* Additional Metadata Row */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Subject */}
                    {((q.subject as any)?.name || q.subjectName) && (
                      <span className="inline-flex items-center rounded-md border border-[#dfd8f5] bg-[#f4f0fd] px-1.5 py-0.5 text-[10px] font-bold text-[#7c3aed]">
                        {(q.subject as any)?.name || q.subjectName}
                      </span>
                    )}
                    
                    {/* Access */}
                    {q.access && (
                      <span className={cn(
                        "rounded-md border px-1.5 py-0.5 text-[10px] font-bold capitalize",
                        q.access === "premium" ? "border-amber-200 bg-amber-50 text-amber-600" : "border-emerald-200 bg-emerald-50 text-emerald-600"
                      )}>
                        {q.access}
                      </span>
                    )}

                    {/* Passage Code */}
                    {((q.passage as any)?.passageCode || q.passageCode) && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-[#dce7f2] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#4f6d87]">
                        <BookOpen className="h-2.5 w-2.5" />
                        {(q.passage as any)?.passageCode || q.passageCode}
                      </span>
                    )}
                  </div>
                </div>
                <p className="mb-3 text-xs font-medium text-[#3f5f7a]">{q.questionText}</p>
                
                {q.questionImageUrl && (
                  <div className="mb-3 overflow-hidden rounded-xl border border-[#dce7f2] bg-slate-50 p-2">
                    <Image
                      src={q.questionImageUrl}
                      alt="Question Image"
                      width={300}
                      height={150}
                      className="mx-auto max-h-40 object-contain"
                    />
                  </div>
                )}
                
                <div className="space-y-1.5">
                  {q.options?.map((opt: any, optIdx: number) => {
                    const isCorrect = q.correctOptionIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-2 text-[11px]",
                          isCorrect
                            ? "border-[#8bd2a4] bg-[#edf8f2] font-semibold text-[#15803d]"
                            : "border-[#e3edf7] bg-white text-[#4f6d87]"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                            isCorrect ? "bg-[#15803d] text-white" : "bg-slate-200 text-slate-700"
                          )}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                        {isCorrect && (
                          <span className="inline-flex items-center gap-1 font-bold text-[#15803d]">
                            <CheckCircle className="h-3 w-3" />
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="mt-3 rounded-lg border border-[#cfe1f5] bg-[#edf6fe] p-2.5">
                    <p className="text-[10px] font-bold text-[#2368af] uppercase">Explanation</p>
                    <p className="mt-1 text-[11px] text-[#35618b] leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-[#8ea1b5]">
              No questions have been linked to this test yet.
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-[#e6edf5] px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1d4ed8]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteTestProps {
  open: boolean;
  test: TestArchiveItem | null;
  onClose: () => void;
}

export function DeleteTestModal({ open, test, onClose }: DeleteTestProps) {
  const [deleteTest, { isLoading }] = useDeleteTestMutation();
  if (!open || !test) return null;

  const handleConfirm = async () => {
    try {
      await deleteTest(test._id).unwrap();
      toast.success("Test archived successfully");
      onClose();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to archive test";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d4056]/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#f5c6cb] bg-white shadow-2xl">
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Archive Test</h3>
              <p className="text-xs text-rose-600">This test will be moved to the archive.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-[#8ea1b5]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-4">
          <div className="rounded-xl border border-[#e8edf2] bg-[#f8fbff] p-3 text-xs text-[#4f6d87]">
            <p className="font-semibold text-[#2d4256]">{test.title}</p>
            <p className="text-[#869ab0] font-mono mt-1">Code: {test.testCode}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#e6edf5] px-5 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-[#6f8194]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm Archive"}
          </button>
        </div>
      </div>
    </div>
  );
}
