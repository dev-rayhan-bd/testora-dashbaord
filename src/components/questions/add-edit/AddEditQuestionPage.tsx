"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import AnswerOptionsSection from "./AnswerOptionsSection";
import AuditHistoryCard from "./AuditHistoryCard";
import ClassificationSection, { type ClassificationData } from "./ClassificationSection";
import ContextFieldsCard from "./ContextFieldsCard";
import QuestionContentSection from "./QuestionContentSection";
import SolutionVideoSection from "./SolutionVideoSection";
import StatusCard from "./StatusCard";

// ─── Form state ───────────────────────────────────────────────────────────────

type FormState = ClassificationData & {
  questionText: string;
  options: [string, string, string, string];
  correctOption: number;
  youtubeLink: string;
  status: string;
};

const initialForm: FormState = {
  category: "",
  year: "",
  faculty: "",
  department: "",
  subject: "",
  coreSubject: "",
  electiveSubject: "",
  testType: "",
  access: "",
  questionOrder: "1",
  passageId: "",
  questionText: "",
  options: ["", "", "", ""],
  correctOption: 0,
  youtubeLink: "",
  status: "Draft",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddEditQuestionPage() {
  const [form, setForm] = useState<FormState>(initialForm);

  const handleClassChange = useCallback((field: keyof ClassificationData, value: string) => {
    setForm((prev) => {
      // Reset dependent fields when category changes
      if (field === "category") {
        return {
          ...prev,
          category: value,
          faculty: "",
          department: "",
          subject: "",
          coreSubject: "",
          electiveSubject: "",
        };
      }
      // Reset department when faculty changes
      if (field === "faculty") {
        return { ...prev, faculty: value, department: "", subject: "" };
      }
      if (field === "department") {
        return { ...prev, department: value, subject: "" };
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleOptionChange = useCallback((index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.options] as [string, string, string, string];
      next[index] = value;
      return { ...prev, options: next };
    });
  }, []);

  const classificationData: ClassificationData = {
    category: form.category,
    year: form.year,
    faculty: form.faculty,
    department: form.department,
    subject: form.subject,
    coreSubject: form.coreSubject,
    electiveSubject: form.electiveSubject,
    testType: form.testType,
    access: form.access,
    questionOrder: form.questionOrder,
    passageId: form.passageId,
  };

  return (
    <div className="space-y-3">
      {/* Page header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#3f5f7a]">Add / Edit Question</h2>
          <p className="text-sm text-[#7e95ab]">
            Create or modify a question in the centralized Question Bank
          </p>
        </div>
        <Link
          href="/questions/question-bank"
          aria-label="Close and return to Question Bank"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dce7f2] bg-white text-[#7f95aa] hover:bg-[#f8fbff] hover:text-[#3f5f7a]"
        >
          <X className="h-4 w-4" />
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-3 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
        {/* ── Left: form ── */}
        <div className="space-y-3">
          <ClassificationSection data={classificationData} onChange={handleClassChange} />

          <QuestionContentSection
            questionText={form.questionText}
            onTextChange={(v) => setForm((prev) => ({ ...prev, questionText: v }))}
          />

          <AnswerOptionsSection
            options={form.options}
            correctOption={form.correctOption}
            onOptionChange={handleOptionChange}
            onCorrectChange={(index) => setForm((prev) => ({ ...prev, correctOption: index }))}
          />

          <SolutionVideoSection
            youtubeLink={form.youtubeLink}
            onChange={(v) => setForm((prev) => ({ ...prev, youtubeLink: v }))}
          />
        </div>

        {/* ── Right: side panels ── */}
        <div className="space-y-3">
          <StatusCard
            status={form.status}
            onStatusChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
            onSave={() => {
              /* TODO: wire to API */
            }}
            onCancel={() => {
              setForm(initialForm);
            }}
          />

          <AuditHistoryCard />

          <ContextFieldsCard />
        </div>
      </div>
    </div>
  );
}
