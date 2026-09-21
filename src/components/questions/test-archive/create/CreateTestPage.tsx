"use client";

import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BasicTestInformationSection from "./BasicTestInformationSection";
import PassageIntegrationSection from "./PassageIntegrationSection";
import PreviewTestStructureSection from "./PreviewTestStructureSection";
import QuestionLinkingSection from "./QuestionLinkingSection";
import QuestionOrderConfigurationSection from "./QuestionOrderConfigurationSection";
import TestAssignmentSection from "./TestAssignmentSection";

type TestCategory = "Semimatura" | "Matura" | "Entrance Exam";

type FormState = {
  testTitle: string;
  category: TestCategory;
  year: string;
  structureType: string;
  subject: string;
  faculty: string;
  department: string;
  testType: string;
  access: string;
  status: string;
  totalQuestions: string;
};

const initialState: FormState = {
  testTitle: "",
  category: "Matura",
  year: "2026",
  structureType: "Official",
  subject: "",
  faculty: "",
  department: "",
  testType: "Additional",
  access: "Premium",
  status: "Draft",
  totalQuestions: "100",
};

export default function CreateTestPage() {
  const [form, setForm] = useState<FormState>(initialState);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => {
      if (field === "category") {
        return {
          ...prev,
          category: value as TestCategory,
          subject: "",
          faculty: "",
          department: "",
        };
      }
      if (field === "faculty") {
        return { ...prev, faculty: value, department: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href="/questions/test-archive"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#dce7f2] bg-white text-[#7f95aa] hover:bg-[#f8fbff]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <h2 className="text-base font-semibold text-[#3f5f7a]">Create Test</h2>
            <p className="text-sm text-[#7e95ab]">Create / Test Archive</p>
          </div>
        </div>

        <span className="rounded-full border border-[#f0dfb9] bg-[#fff3da] px-2 py-0.5 text-[10px] font-medium text-[#c48a2e]">
          Draft
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#3f5f7a]">Create Test Structure</h3>
        <p className="text-xs text-[#90a3b6]">
          Define a test structure and link it to questions from the Question Bank
        </p>
      </div>

      <section className="rounded-lg border border-[#c8ddf2] bg-[#eaf4fd] p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-[#4a8fc7]" />
          <p className="text-xs font-semibold text-[#3a6e9e]">How Create Test Works</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <p className="rounded-md border border-[#d6e7f7] bg-[#f3f8fd] px-2.5 py-1.5 text-xs text-[#4a7eb8]">
            This screen creates test structures only — no question content is duplicated.
          </p>
          <p className="rounded-md border border-[#d6e7f7] bg-[#f3f8fd] px-2.5 py-1.5 text-xs text-[#4a7eb8]">
            Questions remain in the Question Bank and are never duplicated.
          </p>
          <p className="rounded-md border border-[#d6e7f7] bg-[#f3f8fd] px-2.5 py-1.5 text-xs text-[#4a7eb8]">
            To use in tests, all questions should be visible, with status Published.
          </p>
          <p className="rounded-md border border-[#d6e7f7] bg-[#f3f8fd] px-2.5 py-1.5 text-xs text-[#4a7eb8]">
            One question can appear in multiple tests across different categories.
          </p>
        </div>
      </section>

      <BasicTestInformationSection data={form} onChange={updateField} />

      <TestAssignmentSection
        category={form.category}
        subject={form.subject}
        faculty={form.faculty}
        department={form.department}
      />

      <QuestionLinkingSection />
      <QuestionOrderConfigurationSection />
      <PassageIntegrationSection />

      <PreviewTestStructureSection
        title={form.testTitle}
        category={form.category}
        year={form.year}
        access={form.access}
        status={form.status}
        totalQuestions={form.totalQuestions}
      />

      <section className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#dce7f2] bg-white p-3">
        <button
          type="button"
          className="rounded-md border border-[#dce7f2] bg-white px-3 py-2 text-xs font-medium text-[#5e768e] hover:bg-[#f8fbff]"
        >
          Cancel
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-[#dce7f2] bg-white px-3 py-2 text-xs font-medium text-[#5e768e] hover:bg-[#f8fbff]"
          >
            Duplicate from Existing
          </button>
          <button
            type="button"
            className="rounded-md border border-[#d6e5f4] bg-[#eaf2fb] px-3 py-2 text-xs font-medium text-[#4d93d9] hover:bg-[#dbeafa]"
          >
            Save Draft
          </button>
          <button
            type="button"
            className="rounded-md border border-[#dce7f2] bg-white px-3 py-2 text-xs font-medium text-[#5e768e] hover:bg-[#f8fbff]"
          >
            Preview
          </button>
          <button
            type="button"
            className="rounded-md bg-[#2f86d8] px-3 py-2 text-xs font-medium text-white hover:bg-[#2a78c6]"
          >
            Publish Test
          </button>
        </div>
      </section>
    </div>
  );
}
